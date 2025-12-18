/**
 * Project2 - Express.js 랜덤 유저 데이터 API 서버
 * Google JavaScript Style Guide 준수
 */

const express = require('express');

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 3001;

// JSON 파싱 미들웨어
app.use(express.json());

/**
 * 랜덤 이름 생성 함수
 * @return {string} 랜덤 이름
 */
function generateRandomName() {
  const firstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
  const lastNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '준서', '건우',
    '서연', '서윤', '지우', '서현', '민서', '하은', '예은', '윤서', '채원', '지원'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName}${lastName}`;
}

/**
 * 랜덤 이메일 생성 함수
 * @param {string} name - 이름
 * @return {string} 랜덤 이메일
 */
function generateRandomEmail(name) {
  const domains = ['gmail.com', 'naver.com', 'daum.net', 'yahoo.com', 'outlook.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 10000);
  return `${name.toLowerCase()}${randomNum}@${domain}`;
}

/**
 * 랜덤 유저 데이터 생성 함수
 * @return {Object} 유저 데이터 객체
 */
function generateRandomUser() {
  try {
    const name = generateRandomName();
    const email = generateRandomEmail(name);
    const age = Math.floor(Math.random() * (60 - 18 + 1)) + 18; // 18-60세
    const id = Math.floor(Math.random() * 1000000) + 1;
    const createdAt = new Date().toISOString();

    console.log(`랜덤 유저 데이터 생성: ${name} (${email})`);

    return {
      id: id,
      name: name,
      email: email,
      age: age,
      createdAt: createdAt,
    };
  } catch (error) {
    console.error('유저 데이터 생성 중 오류 발생:', error);
    throw error;
  }
}

/**
 * 루트 엔드포인트 - 랜덤 유저 데이터 반환
 * GET /
 */
app.get('/', (req, res) => {
  try {
    console.log('루트 엔드포인트 GET 요청 받음');

    const userData = generateRandomUser();

    console.log('랜덤 유저 데이터 반환:', userData);

    res.status(200).json({
      success: true,
      data: userData,
      message: '랜덤 유저 데이터가 생성되었습니다.',
    });
  } catch (error) {
    console.error('루트 엔드포인트 처리 중 오류 발생:', error);
    res.status(500).json({
      success: false,
      error: '서버 오류가 발생했습니다.',
      message: error.message,
    });
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
  console.log(`API 엔드포인트: http://localhost:${PORT}/`);
  console.log('========================================');
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('========================================');
    console.error(`포트 ${PORT}가 이미 사용 중입니다.`);
    console.error('해결 방법:');
    console.error(`1. PowerShell에서 다음 명령 실행: Get-NetTCPConnection -LocalPort ${PORT} | Select-Object -ExpandProperty OwningProcess | Stop-Process -Force`);
    console.error(`2. 또는 다른 포트 사용: PORT=3002 node server.js`);
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

