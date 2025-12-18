/**
 * Express 서버
 * ACC Hub Browser 백엔드 서버
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apsRoutes from '../routes/aps.js';
import { log } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3006;

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// API 라우트
app.use('/api/aps', apsRoutes);

// 루트 경로
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(publicPath, 'index.html'));
  } catch (error) {
    log.error('루트 경로 처리 중 오류 발생:', error);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});

// 서버 시작
app.listen(PORT, () => {
  log.info(`서버가 시작되었습니다. 포트: ${PORT}`);
  log.info(`브라우저에서 http://localhost:${PORT} 접속하세요.`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log.error(`오류: 포트 ${PORT}가 이미 사용 중입니다. 다른 포트를 사용하거나 해당 프로세스를 종료하세요.`);
  } else {
    log.error('서버 시작 실패:', err);
  }
});

