/**
 * ACC Hub Browser 프론트엔드 로직
 * Project5의 Custom Extensions 통합
 */

const API_BASE = '/api/aps';

// 상태 관리
let currentState = {
  hub: null,
  project: null,
  selectedItem: null,
};

// Viewer 상태
let viewer = null;
let accessToken = null;
let isViewerInitialized = false;

/**
 * API 호출 헬퍼 (JSON:API 응답 구조 처리)
 */
const apiCall = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'API 호출 실패');
    }
    
    // JSON:API 응답 구조 처리
    // data.data: 메인 데이터 배열
    // data.included: 관련 데이터 (relationships 참조 해결용)
    return {
      data: data.data || [],
      included: data.included || [],
    };
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};

/**
 * 네비게이터 아이템 생성
 */
const createNavItem = (item, type, onClick) => {
  const div = document.createElement('div');
  div.className = 'nav-item';
  div.dataset.type = type;
  div.dataset.id = item.id;
  
  const icon = getIcon(type);
  const label = item.attributes?.name || item.attributes?.displayName || item.id;
  
  div.innerHTML = `
    <span class="nav-item-icon">${icon}</span>
    <span class="nav-item-label">${label}</span>
    <span class="nav-item-arrow">▶</span>
  `;
  
  div.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick(item, div);
  });
  
  return div;
};

/**
 * 타입별 아이콘 반환
 */
const getIcon = (type) => {
  const icons = {
    hub: '🏢',
    project: '📁',
    folder: '📂',
    file: '📄',
  };
  return icons[type] || '📄';
};

/**
 * Hub 목록 로드
 */
const loadHubs = async () => {
  try {
    const navigatorContent = document.getElementById('navigatorContent');
    navigatorContent.innerHTML = '<div class="loading">Hub 목록 로딩 중...</div>';
    
    const hubsResponse = await apiCall('/hubs');
    const hubs = hubsResponse.data;
    
    navigatorContent.innerHTML = '';
    
    if (hubs.length === 0) {
      navigatorContent.innerHTML = '<div class="empty-state">Hub가 없습니다.</div>';
      return;
    }
    
    hubs.forEach((hub) => {
      const item = createNavItem(hub, 'hub', async (hubData, element) => {
        element.classList.toggle('expanded');
        element.classList.add('active');
        
        // 하위 프로젝트 로드
        const children = element.querySelector('.nav-item-children');
        if (!children) {
          const childrenDiv = document.createElement('div');
          childrenDiv.className = 'nav-item-children';
          element.appendChild(childrenDiv);
          
          try {
            const projectsResponse = await apiCall(`/hubs/${hubData.id}/projects`);
            const projects = projectsResponse.data;
            projects.forEach((project) => {
              const projectItem = createNavItem(project, 'project', async (projectData, projectElement) => {
                projectElement.classList.toggle('expanded');
                projectElement.classList.add('active');
                
                // 하위 TopFolder 로드
                const projectChildren = projectElement.querySelector('.nav-item-children');
                if (!projectChildren) {
                  const projectChildrenDiv = document.createElement('div');
                  projectChildrenDiv.className = 'nav-item-children';
                  projectElement.appendChild(projectChildrenDiv);
                  
                  try {
                    const topFoldersResponse = await apiCall(
                      `/hubs/${hubData.id}/projects/${projectData.id}/top-folders`
                    );
                    const topFolders = topFoldersResponse.data;
                    
                    topFolders.forEach((folder) => {
                      const folderItem = createNavItem(folder, 'folder', (folderData, folderElement) => {
                        loadFolderContents(projectData.id, folderData.id, folderElement);
                      });
                      projectChildrenDiv.appendChild(folderItem);
                    });
                  } catch (error) {
                    console.error('TopFolder 로드 오류:', error);
                    projectChildrenDiv.innerHTML = '<div class="loading">오류 발생</div>';
                  }
                }
                
                // 프로젝트 선택 상태 업데이트
                currentState.project = projectData;
                document.getElementById('currentProject').textContent = 
                  projectData.attributes?.name || '프로젝트';
              });
              childrenDiv.appendChild(projectItem);
            });
          } catch (error) {
            console.error('Project 로드 오류:', error);
            childrenDiv.innerHTML = '<div class="loading">오류 발생</div>';
          }
        }
      });
      navigatorContent.appendChild(item);
    });
  } catch (error) {
    console.error('Hub 로드 오류:', error);
    document.getElementById('navigatorContent').innerHTML = 
      '<div class="empty-state">Hub 로드 실패: ' + error.message + '</div>';
  }
};

/**
 * 폴더 내용 로드
 */
const loadFolderContents = async (projectId, folderId, parentElement) => {
  parentElement.classList.toggle('expanded');
  parentElement.classList.add('active');
  
  const children = parentElement.querySelector('.nav-item-children');
  if (children && children.dataset.loaded === 'true') {
    return; // 이미 로드됨
  }
  
  if (!children) {
    const childrenDiv = document.createElement('div');
    childrenDiv.className = 'nav-item-children';
    parentElement.appendChild(childrenDiv);
    
    try {
      childrenDiv.innerHTML = '<div class="loading">로딩 중...</div>';
      const contentsResponse = await apiCall(`/projects/${projectId}/folders/${folderId}/contents`);
      const contents = contentsResponse.data;
      
      childrenDiv.innerHTML = '';
      childrenDiv.dataset.loaded = 'true';
      
      if (!contents || contents.length === 0) {
        childrenDiv.innerHTML = '<div class="empty-state">폴더가 비어있습니다.</div>';
        return;
      }
      
      contents.forEach((item) => {
        // APS API 응답 구조 확인: type이 'folders' 또는 'items'일 수 있음
        const itemType = item.type;
        const isFolder = itemType === 'folders' || itemType === 'folders:autodesk.bim360:Folder';
        const type = isFolder ? 'folder' : 'file';
        
        const itemElement = createNavItem(item, type, (itemData, element) => {
          if (isFolder) {
            loadFolderContents(projectId, itemData.id, element);
          } else {
            loadFileVersions(projectId, itemData.id, itemData);
          }
        });
        childrenDiv.appendChild(itemElement);
      });
    } catch (error) {
      console.error('폴더 내용 로드 오류:', error);
      console.error('Error details:', error.message);
      childrenDiv.innerHTML = `<div class="empty-state">오류 발생: ${error.message}</div>`;
    }
  }
};

/**
 * 파일 버전 목록 로드
 */
const loadFileVersions = async (projectId, itemId, itemData) => {
  try {
    // 선택 상태 업데이트
    document.querySelectorAll('.nav-item').forEach((el) => {
      el.classList.remove('active');
    });
    document.querySelector(`[data-id="${itemId}"]`)?.classList.add('active');
    
    currentState.selectedItem = itemData;
    
    const versionsContent = document.getElementById('versionsContent');
    const versionsTitle = document.getElementById('versionsTitle');
    
    versionsTitle.textContent = itemData.attributes?.displayName || itemData.attributes?.name || '파일';
    versionsContent.innerHTML = '<div class="loading">버전 목록 로딩 중...</div>';
    
    const versionsResponse = await apiCall(`/projects/${projectId}/items/${itemId}/versions`);
    const versions = versionsResponse.data;
    
    versionsContent.innerHTML = '';
    
    if (versions.length === 0) {
      versionsContent.innerHTML = '<div class="empty-state">버전이 없습니다.</div>';
      return;
    }
    
    versions.forEach((version) => {
      const versionItem = document.createElement('div');
      versionItem.className = 'version-item';
      versionItem.dataset.versionId = version.id;
      
      const date = new Date(version.attributes?.createTime || version.attributes?.lastModifiedTime);
      const dateStr = date.toLocaleString('ko-KR');
      
      versionItem.innerHTML = `
        <div class="version-item-header">
          <span class="version-number">버전 ${version.attributes?.versionNumber || 'N/A'}</span>
          <span class="version-date">${dateStr}</span>
        </div>
        <div class="version-info">
          ID: ${version.id}<br>
          타입: ${version.type}
        </div>
      `;
      
      versionItem.addEventListener('click', async () => {
        console.log('버전 선택:', version);
        await loadVersionInViewer(version, projectId);
      });
      
      versionsContent.appendChild(versionItem);
    });
  } catch (error) {
    console.error('버전 로드 오류:', error);
    document.getElementById('versionsContent').innerHTML = 
      '<div class="empty-state">버전 로드 실패: ' + error.message + '</div>';
  }
};

/**
 * Viewer 초기화
 */
const initViewer = async () => {
  if (isViewerInitialized) {
    return viewer;
  }

  try {
    // 토큰 가져오기
    const tokenResponse = await fetch('/api/aps/token');
    if (!tokenResponse.ok) {
      throw new Error('토큰을 가져올 수 없습니다.');
    }
    const tokenData = await tokenResponse.json();
    accessToken = tokenData.access_token;

    const options = {
      env: 'AutodeskProduction',
      api: 'derivativeV2',
      getAccessToken: (onTokenReady) => {
        console.log('Viewer requesting token');
        onTokenReady(accessToken, 3600);
      }
    };

    return new Promise((resolve, reject) => {
      Autodesk.Viewing.Initializer(options, () => {
        const config = {
          extensions: [
            'Autodesk.VisualClusters',
            'Autodesk.Viewing.MarkupsCore',
            'Autodesk.Viewing.MarkupsGui',
            'BasicExtension',
            'PanelExtension',
            'ChartsExtension',
            'GridExtension'
          ]
        };
        viewer = new Autodesk.Viewing.GuiViewer3D(
          document.getElementById('viewer-container'),
          config
        );
        viewer.start();
        viewer.setTheme('light-theme');
        isViewerInitialized = true;
        console.log('Viewer initialized with all extensions including Custom Dashboard Extensions');
        resolve(viewer);
      });
    });
  } catch (error) {
    console.error('Viewer 초기화 오류:', error);
    throw error;
  }
};

/**
 * 버전을 Viewer에 로드
 */
const loadVersionInViewer = async (version, projectId) => {
  try {
    // Viewer 초기화 (아직 초기화되지 않은 경우)
    if (!isViewerInitialized) {
      await initViewer();
    }

    // 버전 상세 정보 가져오기
    const versionResponse = await apiCall(`/projects/${projectId}/versions/${version.id}`);
    const versionData = versionResponse.data;

    // URN 추출 (relationships에서 derivatives 참조)
    let urn = null;
    
    // 방법 1: relationships에서 직접 참조
    if (versionData.relationships?.derivatives?.data?.id) {
      urn = versionData.relationships.derivatives.data.id;
      console.log('URN found in relationships:', urn);
    }
    // 방법 2: included 배열에서 derivatives 찾기
    else {
      const included = versionResponse.included || [];
      const derivative = included.find(item => 
        item.type === 'derivatives' || 
        item.type === 'derivatives:autodesk.bim360:Derivative'
      );
      
      if (derivative) {
        // derivatives의 id가 URN일 수 있음
        urn = derivative.id || derivative.attributes?.urn || derivative.attributes?.id;
        console.log('URN found in included:', urn);
      }
    }
    
    // 방법 3: attributes에서 직접 찾기
    if (!urn && versionData.attributes) {
      urn = versionData.attributes.derivatives?.urn || 
            versionData.attributes.urn ||
            versionData.attributes.storageUrn;
      if (urn) {
        console.log('URN found in attributes:', urn);
      }
    }

    if (!urn) {
      console.error('Version data:', versionData);
      console.error('Included:', versionResponse.included);
      alert('버전의 URN을 찾을 수 없습니다. 콘솔을 확인하세요.');
      return;
    }

    console.log('Loading model with URN:', urn);

    // 모델 로드
    Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) => {
      const viewables = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, viewables).then(() => {
        console.log('Model loaded successfully');
        
        // Viewer 섹션 표시
        document.getElementById('versionsSection').classList.remove('active');
        document.getElementById('viewerSection').classList.add('active');
        document.getElementById('viewerTitle').textContent = 
          `APS Viewer - ${version.attributes?.versionNumber || 'N/A'}`;
      });
    }, (errorCode) => {
      console.error('Model load error:', errorCode);
      alert(`모델 로드 실패: ${errorCode}`);
    });

  } catch (error) {
    console.error('버전 로드 오류:', error);
    alert(`버전 로드 실패: ${error.message}`);
  }
};

/**
 * 버전 목록으로 돌아가기
 */
const backToVersions = () => {
  document.getElementById('viewerSection').classList.remove('active');
  document.getElementById('versionsSection').classList.add('active');
};

/**
 * 초기화
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('ACC Hub Browser 초기화 중...');
  loadHubs();
  
  // 버전 목록으로 돌아가기 버튼 이벤트
  document.getElementById('backToVersions').addEventListener('click', backToVersions);
});

