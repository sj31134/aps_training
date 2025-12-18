/**
 * Project1 - Express 서버
 * Google JavaScript Style Guide 준수
 */

const fs = require('fs');
const path = require('path');

// #region agent log
const logPath = path.join(__dirname, '..', '..', '.cursor', 'debug.log');
const writeLog = (data) => {
  try {
    const logEntry = JSON.stringify({...data, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1'}) + '\n';
    fs.appendFileSync(logPath, logEntry, 'utf8');
  } catch (e) {}
};
writeLog({location: 'server/server.js:12', message: '서버 시작 - Express 모듈 로드 시도', data: {hypothesisId: 'A'}});
// #endregion

const express = require('express');

// #region agent log
writeLog({location: 'server/server.js:19', message: 'Express 모듈 로드 완료', data: {expressLoaded: typeof express !== 'undefined', hypothesisId: 'A'}});
// #endregion

// Express 앱 생성
const app = express();

// #region agent log
writeLog({location: 'server/server.js:24', message: 'PORT 환경 변수 확인', data: {envPort: process.env.PORT, defaultPort: 3000, hypothesisId: 'E'}});
// #endregion

const PORT = process.env.PORT || 3000;

// #region agent log
writeLog({location: 'server/server.js:28', message: '__dirname 경로 확인', data: {__dirname: __dirname, hypothesisId: 'B'}});
// #endregion

// 정적 파일 서빙 설정 (public 폴더)
const publicPath = path.join(__dirname, '..', 'public');

// #region agent log
const publicPathExists = fs.existsSync(publicPath);
writeLog({location: 'server/server.js:34', message: 'public 폴더 경로 확인', data: {publicPath: publicPath, exists: publicPathExists, hypothesisId: 'D'}});
// #endregion

app.use(express.static(publicPath));

console.log(`정적 파일 경로: ${publicPath}`);

/**
 * 루트 경로 - index.html 서빙
 */
app.get('/', (req, res) => {
  try {
    console.log('루트 경로 요청 받음');
    res.sendFile(path.join(publicPath, 'index.html'));
    console.log('index.html 파일 전송 완료');
  } catch (error) {
    console.error('루트 경로 처리 중 오류 발생:', error);
    res.status(500).send('서버 오류가 발생했습니다.');
  }
});

/**
 * 서버 시작
 */
// #region agent log
writeLog({location: 'server/server.js:50', message: '서버 listen 시도 전', data: {port: PORT, hypothesisId: 'C'}});
// #endregion

app.listen(PORT, () => {
  // #region agent log
  writeLog({location: 'server/server.js:53', message: '서버 listen 성공', data: {port: PORT, hypothesisId: 'C'}});
  // #endregion
  console.log('========================================');
  console.log(`서버가 시작되었습니다.`);
  console.log(`포트: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log('========================================');
}).on('error', (err) => {
  // #region agent log
  writeLog({location: 'server/server.js:61', message: '서버 listen 에러', data: {error: err.message, code: err.code, port: PORT, hypothesisId: 'C'}});
  // #endregion
  if (err.code === 'EADDRINUSE') {
    console.error('========================================');
    console.error(`포트 ${PORT}가 이미 사용 중입니다.`);
    console.error('해결 방법:');
    console.error(`1. PowerShell에서 다음 명령 실행: Get-NetTCPConnection -LocalPort ${PORT} | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force`);
    console.error(`2. 또는 다른 포트 사용: PORT=3001 node server/server.js`);
    console.error('========================================');
  } else {
    console.error('서버 시작 실패:', err);
  }
  process.exit(1);
});

/**
 * 에러 핸들러
 */
app.use((err, req, res, next) => {
  // #region agent log
  writeLog({location: 'server/server.js:70', message: '에러 핸들러 호출', data: {error: err.message, stack: err.stack}});
  // #endregion
  console.error('서버 에러 발생:', err);
  res.status(500).send('서버 내부 오류가 발생했습니다.');
});

// #region agent log
process.on('uncaughtException', (err) => {
  writeLog({location: 'server/server.js:77', message: '처리되지 않은 예외', data: {error: err.message, stack: err.stack}});
  console.error('처리되지 않은 예외:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  writeLog({location: 'server/server.js:82', message: '처리되지 않은 Promise 거부', data: {reason: reason}});
  console.error('처리되지 않은 Promise 거부:', reason);
});
// #endregion

