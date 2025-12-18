# ACC Hub Browser - Project6

ACC Hub Browser는 Autodesk Platform Services (APS) Data Management API를 사용하여 ACC Hub, Project, Folder, File을 탐색하고, 파일 버전을 확인하며, APS Viewer로 3D 모델을 시각화하는 웹 애플리케이션입니다.

**Project5의 Custom Extensions 기능이 통합되었습니다.**

## 기능

- **Hub 탐색**: ACC Hub 목록 조회
- **Project 탐색**: Hub 내 Project 목록 조회
- **Folder 탐색**: Project의 TopFolder부터 하위 폴더까지 탐색
- **File 탐색**: 폴더 내 파일 목록 조회
- **Version 조회**: 선택한 파일의 버전 목록 표시
- **APS Viewer**: 버전 선택 시 3D 모델 시각화
- **Custom Extensions**: Project5에서 구현한 4가지 Extension 통합
  - **Basic Extension**: 모델 정보 표시 (총 객체 수)
  - **Panel Extension**: 정보 패널 표시
  - **Charts Extension**: 차트로 데이터 시각화
  - **Grid Extension**: 그리드로 객체 정보 표시

## 프로젝트 구조

```
Project6/
├── public/                    # 프론트엔드 파일
│   ├── index.html            # 메인 UI (Tailwind CSS, APS Viewer)
│   ├── styles.css            # 스타일
│   ├── app.js                # 프론트엔드 로직 (Viewer 초기화 포함)
│   └── extensions/           # Custom Extensions (Project5에서 통합)
│       ├── BasicExtension.js
│       ├── PanelExtension.js
│       ├── ChartsExtension.js
│       └── GridExtension.js
├── server/                   # 백엔드 서버
│   ├── server.js            # Express 서버
│   └── config.js            # 공통 설정
├── routes/                  # API 라우트
│   └── aps.js               # APS API 라우트 (2LO 인증)
├── package.json
└── README.md
```

## 설치 및 실행

### 1. 의존성 설치

```bash
cd Project6
npm install
```

### 2. 환경 변수 설정

루트 폴더 (APS/)의 `.env` 파일에 다음 변수가 설정되어 있어야 합니다:

```env
APS_CLIENT_ID=your_client_id_here
APS_CLIENT_SECRET=your_client_secret_here
APS_BASE_URL=https://developer.api.autodesk.com
```

### 3. 서버 실행

```bash
npm start
```

서버가 시작되면 브라우저에서 `http://localhost:3006` 접속하세요.

## 사용 방법

1. **Hub 선택**: 좌측 네비게이터에서 Hub를 클릭하여 확장
2. **Project 선택**: Hub 아래의 Project를 클릭하여 확장
3. **Folder 탐색**: Project의 TopFolder부터 하위 폴더까지 클릭하여 탐색
4. **File 선택**: 파일을 클릭하면 우측에 버전 목록이 표시됩니다
5. **Version 선택**: 버전을 클릭하면 APS Viewer에 3D 모델이 로드됩니다
6. **Custom Extensions 사용**: Viewer 툴바에서 Extension 버튼 클릭
   - **Basic Extension**: 모델 정보 (총 객체 수) 표시
   - **Panel Extension**: 정보 패널 열기/닫기
   - **Charts Extension**: 차트 시각화 패널 열기/닫기
   - **Grid Extension**: 그리드 정보 패널 열기/닫기
7. **버전 목록으로 돌아가기**: Viewer 상단의 "버전 목록으로 돌아가기" 버튼 클릭

## API 엔드포인트

- `GET /api/aps/hubs` - Hub 목록 조회
- `GET /api/aps/hubs/:hubId/projects` - Project 목록 조회
- `GET /api/aps/hubs/:hubId/projects/:projectId/top-folders` - TopFolder 목록 조회
- `GET /api/aps/projects/:projectId/folders/:folderId/contents` - 폴더 내용 조회
- `GET /api/aps/projects/:projectId/items/:itemId/versions` - 파일 버전 목록 조회
- `GET /api/aps/projects/:projectId/versions/:versionId` - 버전 상세 정보 조회

## 기술 스택

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript (Vanilla), Tailwind CSS
- **API**: APS Data Management API (2LO)
- **인증**: Client Credentials (2-Legged OAuth)
- **Viewer**: APS Viewer SDK 7.x
- **Extensions**: Custom Extensions (Basic, Panel, Charts, Grid)

## 주요 특징

### Project5 기능 통합
- Project5에서 구현한 4가지 Custom Extensions 통합
- APS Viewer 초기화 및 모델 로드 기능
- Tailwind CSS를 사용한 모던한 UI

### 2LO 인증
- 사용자 로그인 없이 서버 간 통신
- 토큰 캐싱 및 동시성 처리
- 자동 토큰 갱신

### JSON:API 지원
- APS Data Management API의 JSON:API 스펙 준수
- `data` 및 `included` 배열 처리
- Relationships 데이터 활용

## 다음 단계 (개선 가능 사항)

- 에러 처리 개선
- 로딩 상태 개선
- 검색 기능 추가
- 모델 필터링 기능
- 북마크 기능

