# Project2

Express.js를 사용한 간단한 백엔드 API 서버입니다.

## 프로젝트 개요

- **목적**: Express.js 학습을 위한 두 번째 프로젝트
- **기술 스택**: Node.js, Express.js
- **기능**: 루트 엔드포인트에서 GET 요청 시 랜덤 유저 데이터 반환

## 파일 구조

```
Project2/
├── server.js          # Express 서버 메인 파일
├── package.json       # Node.js 의존성 관리
├── README.md          # 프로젝트 설명 (현재 파일)
└── PLAN.md           # 개발 계획 및 진행 상황
```

## 사용 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 서버 시작

```bash
npm start
```

또는

```bash
node server.js
```

### 3. API 테스트

서버가 시작되면 다음 방법으로 테스트할 수 있습니다:

#### 브라우저에서 테스트
브라우저에서 `http://localhost:3001` 접속

#### PowerShell에서 테스트
```powershell
Invoke-WebRequest -Uri http://localhost:3001 -Method GET | Select-Object -ExpandProperty Content
```

#### curl로 테스트 (Git Bash 또는 WSL)
```bash
curl http://localhost:3001
```

## API 엔드포인트

### GET /

랜덤 유저 데이터를 반환합니다.

**요청 예시:**
```
GET http://localhost:3001/
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "id": 123456,
    "name": "김민준",
    "email": "김민준1234@gmail.com",
    "age": 28,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "랜덤 유저 데이터가 생성되었습니다."
}
```

## 기능 설명

- **랜덤 이름 생성**: 한국 이름 랜덤 생성
- **랜덤 이메일 생성**: 이름 기반 랜덤 이메일 생성
- **랜덤 나이 생성**: 18-60세 범위 내 랜덤 생성
- **랜덤 ID 생성**: 1-1000000 범위 내 랜덤 생성
- **에러 처리**: 예외 상황 처리 및 에러 응답
- **로깅**: 요청 및 데이터 생성 로그 출력

## 개발 가이드라인 준수

- Google JavaScript Style Guide 준수
- 한글 주석 및 문서화
- 디버깅 로그 (log, error, warning) 포함
- 쉬운 코드 구현

## 포트 변경

기본 포트는 3001입니다. 다른 포트를 사용하려면:

```bash
PORT=3002 node server.js
```

또는 PowerShell에서:

```powershell
$env:PORT=3002; node server.js
```

