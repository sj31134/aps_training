/** Project5 - consolidated APS Viewer app (from Project4) */
const TOKEN_URL = '/api/token';
const MODELS_URL = '/api/models';
let viewer;
let accessToken;

const getToken = async () => {
  const res = await fetch(TOKEN_URL);
  const data = await res.json();
  accessToken = data.access_token;
  console.log('Token received:', accessToken);
  return accessToken;
};

const listModels = async () => {
  const res = await fetch(MODELS_URL);
  const models = await res.json();
  console.log('Models received:', models);
  return models;
};

const initViewer = () => {
  const options = {
    env: 'AutodeskProduction',
    api: 'derivativeV2',
    getAccessToken: (onTokenReady) => {
      console.log('Viewer requesting token');
      onTokenReady(accessToken, 3600);
    }
  };

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
    console.log('Viewer initialized with all extensions including Custom Dashboard Extensions');
  });
};

const loadModel = (urn) => {
  console.log('Loading model:', urn);
  Autodesk.Viewing.Document.load(`urn:${urn}`, (doc) => {
    const viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then(() => {
      console.log('Model loaded successfully');
    });
  }, (err) => console.error('Model load error:', err));
};

const populateModelSelect = (models) => {
  const select = document.getElementById('modelSelect');
  select.innerHTML = '<option value="">Select a model...</option>';
  models.forEach((model) => {
    const option = document.createElement('option');
    option.value = model.urn;
    option.textContent = model.name;
    select.appendChild(option);
  });
};

const initApp = async () => {
  try {
    console.log('Initializing app...');
    await getToken();
    const models = await listModels();
    populateModelSelect(models);
    initViewer();
    
    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        if (e.target.value) loadModel(e.target.value);
      });
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    alert('앱 초기화 중 오류가 발생했습니다. 콘솔을 확인하세요.');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

