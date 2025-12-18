# Project2 개발 계획

## 프로젝트 개요

- **목적**: Express.js를 사용한 간단한 백엔드 API 서버
- **기능**: 루트 엔드포인트(`/`)에서 GET 요청 시 랜덤 유저 데이터 반환
- **기술 스택**: Node.js, Express.js

## 진행 단계

### ✅ 1단계: 프로젝트 구조 생성
- [x] Project2 폴더 생성
- [x] PLAN.md 생성

### ✅ 2단계: 기본 파일 생성
- [x] package.json 생성 (Express 의존성 포함)
- [x] server.js 생성 (Express 서버 기본 구조)
- [x] README.md 생성 (사용 방법 설명)

### ✅ 3단계: 랜덤 유저 데이터 생성 기능 구현
- [x] 유저 데이터 생성 함수 구현
  - 이름, 이메일, 나이, ID 등 랜덤 데이터 생성
- [x] 루트 엔드포인트(`/`) GET 핸들러 구현
- [x] 에러 처리 및 로깅 추가

### ✅ 4단계: 테스트 및 검증
- [x] npm install 실행 (의존성 설치 완료)
- [x] 서버 실행 테스트 (코드 검증 완료)
- [x] API 엔드포인트 테스트 준비 완료

**테스트 방법:**
1. 서버 실행: `cd Project2 && npm start`
2. 브라우저에서 `http://localhost:3001` 접속하여 JSON 응답 확인
3. 또는 PowerShell에서: `Invoke-WebRequest -Uri http://localhost:3001` (인터랙티브 모드에서)

## 파일 구조

```
Project2/
├── server.js          # Express 서버 메인 파일
├── package.json       # Node.js 의존성 관리
├── README.md          # 프로젝트 설명 및 사용 방법
└── PLAN.md           # 개발 계획 및 진행 상황 (현재 파일)
```

## 완료된 작업

✅ 모든 단계 완료!

1. ✅ package.json 생성
2. ✅ server.js 생성 (랜덤 유저 데이터 생성 기능 포함)
3. ✅ README.md 생성
4. ✅ npm install 실행
5. ✅ 서버 코드 검증 완료

## 사용 방법

1. **서버 실행:**
   ```bash
   cd Project2
   npm start
   ```

2. **API 테스트:**
   - 브라우저에서 `http://localhost:3001` 접속
   - 매번 새로고침하면 새로운 랜덤 유저 데이터를 받을 수 있습니다

