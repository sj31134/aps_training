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
  return accessToken;
};

const listModels = async () => {
  const response = await fetch(MODELS_URL);
  return await response.json();
};

const initViewer = () => {
  viewer = new Autodesk.Viewing.GuiViewer3D(
    document.getElementById('viewer-container')
  );
  viewer.start();
  viewer.setTheme('light-theme');
};

const loadModel = (urn) => {
  const options = {
    env: 'AutodeskProduction',
    getAccessToken: (onTokenReady) => onTokenReady(accessToken, 3600),
  };

  Autodesk.Viewing.Document.load(urn, (doc) => {
    const viewables = doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables);
  }, null, options);
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
  initViewer();
  await getToken();
  const models = await listModels();
  populateModelSelect(models);

  document.getElementById('modelSelect').addEventListener('change', (e) => {
    if (e.target.value) loadModel(e.target.value);
  });
};

document.addEventListener('DOMContentLoaded', initApp);

