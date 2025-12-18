/**
 * APS API 라우트
 * Data Management API 2LO 인증 및 API 호출
 */

import express from 'express';
import axios from 'axios';
import { APS_CONFIG, APS_ENDPOINTS, getAuthHeaders, log } from '../server/config.js';

const router = express.Router();

// 2LO 인증 토큰 캐시 (동시성 처리 개선)
let cachedToken = null;
let tokenExpiry = null;
let tokenPromise = null; // 진행 중인 토큰 요청 추적

/**
 * 2LO 인증 토큰 획득 (동시성 처리 개선)
 */
const getAccessToken = async () => {
  try {
    // 캐시된 토큰이 있고 아직 유효하면 반환
    if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
      log.info('Using cached access token');
      return cachedToken;
    }

    // 이미 진행 중인 토큰 요청이 있으면 기다림 (동시성 처리)
    if (tokenPromise) {
      log.info('Waiting for ongoing token request...');
      return await tokenPromise;
    }

    // 새로운 토큰 요청 시작
    tokenPromise = (async () => {
      try {
        log.info('Requesting new access token via 2LO');

        if (!APS_CONFIG.CLIENT_ID || !APS_CONFIG.CLIENT_SECRET) {
          throw new Error('APS_CLIENT_ID and APS_CLIENT_SECRET must be set in .env file');
        }

        const response = await axios.post(
          APS_ENDPOINTS.AUTH,
          new URLSearchParams({
            'client_id': APS_CONFIG.CLIENT_ID,
            'client_secret': APS_CONFIG.CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'scope': 'data:read data:write data:create data:search bucket:read bucket:create bucket:update bucket:delete code:all',
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        cachedToken = response.data.access_token;
        const expiresIn = response.data.expires_in || 3600;
        tokenExpiry = Date.now() + (expiresIn - 60) * 1000; // 60초 여유

        log.info('Access token obtained successfully');
        return cachedToken;
      } finally {
        // 요청 완료 후 promise 초기화
        tokenPromise = null;
      }
    })();

    return await tokenPromise;
  } catch (error) {
    tokenPromise = null; // 에러 발생 시 초기화
    log.error('Failed to get access token:', error.message);
    throw error;
  }
};

/**
 * Hub 목록 조회
 */
router.get('/hubs', async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(APS_ENDPOINTS.HUB, {
      headers: getAuthHeaders(token),
    });

    // JSON:API 응답 구조 처리
    const hubs = response.data.data || [];
    const included = response.data.included || [];

    log.info('Hubs retrieved:', hubs.length);
    res.json({
      success: true,
      data: hubs,
      included: included,
    });
  } catch (error) {
    log.error('Error fetching hubs:', error.message);
    if (error.response) {
      log.error('Response status:', error.response.status);
      log.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

/**
 * Project 목록 조회
 */
router.get('/hubs/:hubId/projects', async (req, res) => {
  try {
    const { hubId } = req.params;
    const token = await getAccessToken();
    const url = APS_ENDPOINTS.PROJECT.replace('{hubId}', hubId);

    const response = await axios.get(url, {
      headers: getAuthHeaders(token),
    });

    // JSON:API 응답 구조 처리
    const projects = response.data.data || [];
    const included = response.data.included || [];

    log.info(`Projects retrieved for hub ${hubId}:`, projects.length);
    res.json({
      success: true,
      data: projects,
      included: included,
    });
  } catch (error) {
    log.error('Error fetching projects:', error.message);
    if (error.response) {
      log.error('Response status:', error.response.status);
      log.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

/**
 * Top Folders 조회
 * APS Data Management API: /project/v1/hubs/{hubId}/projects/{projectId}/folders
 * 공식 APS SDK의 getProjectTopFolders(hubId, projectId)와 동일한 엔드포인트
 * 참고: https://github.com/autodesk-platform-services/aps-hubs-browser-nodejs
 */
router.get('/hubs/:hubId/projects/:projectId/top-folders', async (req, res) => {
  try {
    const { hubId, projectId } = req.params;
    const token = await getAccessToken();
    const url = APS_ENDPOINTS.TOP_FOLDERS
      .replace('{hubId}', hubId)
      .replace('{projectId}', projectId);

    log.info(`Fetching top folders from: ${url}`);
    log.info(`HubId: ${hubId}, ProjectId: ${projectId}`);

    const response = await axios.get(url, {
      headers: getAuthHeaders(token),
    });

    // JSON:API 응답 구조 처리
    const folders = response.data.data || [];
    const included = response.data.included || [];

    log.info(`Top folders retrieved for project ${projectId}:`, folders.length);
    res.json({
      success: true,
      data: folders,
      included: included, // 포함된 관련 데이터
    });
  } catch (error) {
    log.error('Error fetching top folders:', error.message);
    if (error.response) {
      log.error('Response status:', error.response.status);
      log.error('Response data:', JSON.stringify(error.response.data, null, 2));
      log.error('Request URL:', error.config?.url);
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

/**
 * 폴더 내용 조회
 * APS Data Management API: /data/v1/projects/{projectId}/folders/{folderId}/contents
 * 또는 /data/v1/projects/{projectId}/folders/{folderId}/relationships/contents
 * 두 가지 엔드포인트를 시도하여 호환성 확보
 */
router.get('/projects/:projectId/folders/:folderId/contents', async (req, res) => {
  try {
    const { projectId, folderId } = req.params;
    const token = await getAccessToken();
    
    // 먼저 기본 엔드포인트 시도
    let url = APS_ENDPOINTS.FOLDER_CONTENTS
      .replace('{projectId}', projectId)
      .replace('{folderId}', folderId);
    
    log.info(`Fetching folder contents from: ${url}`);
    log.info(`ProjectId: ${projectId}, FolderId: ${folderId}`);
    
    let response;
    try {
      response = await axios.get(url, {
        headers: getAuthHeaders(token),
      });
    } catch (firstError) {
      // 404 에러인 경우 relationships 엔드포인트 시도
      if (firstError.response?.status === 404) {
        log.warn('Primary endpoint failed, trying relationships endpoint...');
        url = APS_ENDPOINTS.FOLDER_CONTENTS_REL
          .replace('{projectId}', projectId)
          .replace('{folderId}', folderId);
        response = await axios.get(url, {
          headers: getAuthHeaders(token),
        });
      } else {
        throw firstError;
      }
    }

    // JSON:API 응답 구조 처리
    const contents = response.data.data || [];
    const included = response.data.included || [];

    log.info(`Folder contents retrieved for folder ${folderId}:`, contents.length);
    res.json({
      success: true,
      data: contents,
      included: included, // 포함된 관련 데이터
    });
  } catch (error) {
    log.error('Error fetching folder contents:', error.message);
    if (error.response) {
      log.error('Response status:', error.response.status);
      log.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

/**
 * 파일 버전 목록 조회
 */
router.get('/projects/:projectId/items/:itemId/versions', async (req, res) => {
  try {
    const { projectId, itemId } = req.params;
    const token = await getAccessToken();
    const url = APS_ENDPOINTS.ITEM_VERSIONS
      .replace('{projectId}', projectId)
      .replace('{itemId}', itemId);

    const response = await axios.get(url, {
      headers: getAuthHeaders(token),
    });

    // JSON:API 응답 구조 처리
    const versions = response.data.data || [];
    const included = response.data.included || [];

    log.info(`Versions retrieved for item ${itemId}:`, versions.length);
    res.json({
      success: true,
      data: versions,
      included: included,
    });
  } catch (error) {
    log.error('Error fetching versions:', error.message);
    if (error.response) {
      log.error('Response status:', error.response.status);
      log.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

/**
 * 버전 상세 정보 조회
 * derivatives 관계를 포함하여 URN 정보 획득
 */
router.get('/projects/:projectId/versions/:versionId', async (req, res) => {
  try {
    const { projectId, versionId } = req.params;
    const token = await getAccessToken();
    
    // derivatives 관계를 포함하도록 쿼리 파라미터 추가
    let url = APS_ENDPOINTS.VERSION_DETAILS
      .replace('{projectId}', projectId)
      .replace('{versionId}', versionId);
    
    // JSON:API include 파라미터로 derivatives 관계 포함
    url += '?include=derivatives';

    log.info(`Fetching version details from: ${url}`);

    const response = await axios.get(url, {
      headers: getAuthHeaders(token),
    });

    // JSON:API 응답 구조 처리
    const versionData = response.data.data || response.data;
    const included = response.data.included || [];

    log.info(`Version details retrieved for version ${versionId}`);
    log.info(`Included resources: ${included.length}`);
    
    res.json({
      success: true,
      data: versionData,
      included: included,
    });
  } catch (error) {
    log.error('Error fetching version details:', error.message);
    if (error.response) {
      log.error('Response status:', error.response.status);
      log.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.message,
      details: error.response?.data || null,
    });
  }
});

export default router;

