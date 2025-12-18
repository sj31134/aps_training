/**
 * 공통 설정 파일
 * APS API 관련 공통 설정 및 엔드포인트 정의
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 상위 폴더의 .env 파일 로드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

dotenv.config({ path: path.join(projectRoot, '.env') });

// APS 기본 설정
export const APS_CONFIG = {
  BASE_URL: process.env.APS_BASE_URL || 'https://developer.api.autodesk.com',
  CLIENT_ID: process.env.APS_CLIENT_ID,
  CLIENT_SECRET: process.env.APS_CLIENT_SECRET,
};

// API 엔드포인트
export const APS_ENDPOINTS = {
  // 인증
  AUTH: `${APS_CONFIG.BASE_URL}/authentication/v2/token`,
  
  // Data Management API
  HUB: `${APS_CONFIG.BASE_URL}/project/v1/hubs`,
  PROJECT: `${APS_CONFIG.BASE_URL}/project/v1/hubs/{hubId}/projects`,
  // Top Folders: 공식 APS SDK는 getProjectTopFolders(hubId, projectId) 사용
  // 실제 엔드포인트: /project/v1/hubs/{hubId}/projects/{projectId}/folders (topFolders 없음)
  TOP_FOLDERS: `${APS_CONFIG.BASE_URL}/project/v1/hubs/{hubId}/projects/{projectId}/folders`,
  // 폴더 내용: /data/v1/projects/{projectId}/folders/{folderId}/contents 또는 relationships/contents
  // 두 가지 엔드포인트 모두 시도 가능하도록 설정
  FOLDER_CONTENTS: `${APS_CONFIG.BASE_URL}/data/v1/projects/{projectId}/folders/{folderId}/contents`,
  FOLDER_CONTENTS_REL: `${APS_CONFIG.BASE_URL}/data/v1/projects/{projectId}/folders/{folderId}/relationships/contents`,
  ITEM_VERSIONS: `${APS_CONFIG.BASE_URL}/data/v1/projects/{projectId}/items/{itemId}/versions`,
  VERSION_DETAILS: `${APS_CONFIG.BASE_URL}/data/v1/projects/{projectId}/versions/{versionId}`,
};

// 공통 헤더
export const getAuthHeaders = (accessToken) => {
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
};

// 로깅 헬퍼
export const log = {
  info: (message, ...args) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
};

