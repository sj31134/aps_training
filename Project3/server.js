/**
 * Project3 - 풀스택 크리스마스 환영 메시지 앱
 * Google JavaScript Style Guide 준수
 */

const express = require('express');
const path = require('path');

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 3002;

// JSON 파싱 미들웨어
app.use(express.json());

// 정적 파일 서빙 설정 (public 폴더)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

console.log(`정적 파일 경로: ${publicPath}`);

/**
 * 랜덤 크리스마스 환영 메시지 생성 함수
 * @return {Object} 환영 메시지 객체
 */
function generateChristmasMessage() {
  try {
    const messages = [
      { text: '🎄 메리 크리스마스! 행복한 연말 되세요!', emoji: '🎄' },
      { text: '🎅 산타가 당신을 찾고 있어요! 즐거운 크리스마스!', emoji: '🎅' },
      { text: '❄️ 눈이 내리는 크리스마스, 따뜻한 하루 되세요!', emoji: '❄️' },
      { text: '🎁 크리스마스 선물처럼 특별한 하루 되세요!', emoji: '🎁' },
      { text: '🌟 별이 반짝이는 밤, 평화로운 크리스마스 되세요!', emoji: '🌟' },
      { text: '🦌 순록들이 달려오는 크리스마스, 기쁨이 가득하길!', emoji: '🦌' },
      { text: '🎄🎅 크리스마스의 기적이 당신에게도 찾아오길!', emoji: '🎄🎅' },
      { text: '❄️🎁 눈송이처럼 순수한 마음으로 크리스마스를!', emoji: '❄️🎁' },
      { text: '🌟✨ 별빛이 가득한 크리스마스 밤, 행복하세요!', emoji: '🌟✨' },
      { text: '🎄🎅🎁 크리스마스의 모든 축복이 함께하길!', emoji: '🎄🎅🎁' },
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const timestamp = new Date().toISOString();

    console.log(`크리스마스 메시지 생성: ${randomMessage.text}`);

    return {
      message: randomMessage.text,
      emoji: randomMessage.emoji,
      timestamp: timestamp,
    };
  } catch (error) {
    console.error('크리스마스 메시지 생성 중 오류 발생:', error);
    throw error;
  }
}

/**
 * API 엔드포인트 - 랜덤 크리스마스 환영 메시지 반환
 * GET /api/message
 */
app.get('/api/message', (req, res) => {
  try {
    console.log('API 엔드포인트 GET /api/message 요청 받음');

    const messageData = generateChristmasMessage();

    console.log('크리스마스 메시지 반환:', messageData);

    res.status(200).json({
      success: true,
      data: messageData,
    });
  } catch (error) {
    console.error('API 엔드포인트 처리 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.',
      message: error.message,
    });
  }
});

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
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`서버가 시작되었습니다.`);
  console.log(`포트: ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`API 엔드포인트: http://localhost:${PORT}/api/message`);
  console.log('========================================');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('========================================');
    console.error(`포트 ${PORT}가 이미 사용 중입니다.`);
    console.error('해결 방법:');
    console.error(`1. PowerShell에서 다음 명령 실행: Get-NetTCPConnection -LocalPort ${PORT} | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force`);
    console.error(`2. 또는 다른 포트 사용: PORT=3003 node server.js`);
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
  console.error('서버 에러 발생:', err);
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.',
    message: err.message,
  });
});

