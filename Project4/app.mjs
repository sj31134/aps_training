/**
 * Project4 - APS Viewer Demo Application
 * Concise ES6 code with no error checking
 */

const TOKEN_URL = '/api/token';
const MODELS_URL = '/api/models';

let viewer;
let accessToken;

const getToken = async () => {
  const response = await fetch(TOKEN_URL);
  const data = await response.json();
  accessToken = data.access_token;
  console.log('Token received:', accessToken);
  return accessToken;
};

const listModels = async () => {
  const response = await fetch(MODELS_URL);
  const models = await response.json();
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
        'Autodesk.Viewing.MarkupsGui'
      ]
    };
    viewer = new Autodesk.Viewing.GuiViewer3D(
      document.getElementById('viewer-container'),
      config
    );
    viewer.start();
    viewer.setTheme('light-theme');
    
    // 툴바 표시 설정
    viewer.setToolbarVisible(true);
    
    console.log('Viewer initialized with VisualClusters, MarkupsCore, and MarkupsGui extensions');
  });
};

const loadModel = (urn) => {
  console.log('Loading model:', urn);
  Autodesk.Viewing.Document.load(
    `urn:${urn}`,
    (doc) => {
      const viewables = doc.getRoot().getDefaultGeometry();
      viewer.loadDocumentNode(doc, viewables).then(() => {
        // 모델 로드 후 툴바 표시
        viewer.setToolbarVisible(true);
        viewer.show();
        console.log('Model loaded successfully, toolbar visible');
      });
    },
    (errorCode) => console.error('Model load error:', errorCode)
  );
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
  console.log('Initializing app...');
  await getToken();
  const models = await listModels();
  populateModelSelect(models);
  initViewer();

  document.getElementById('modelSelect').addEventListener('change', (e) => {
    if (e.target.value) loadModel(e.target.value);
  });
};

document.addEventListener('DOMContentLoaded', initApp);

