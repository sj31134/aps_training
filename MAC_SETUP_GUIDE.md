# Mac 개발자를 위한 설정 가이드

이 문서는 Windows에서 작업한 프로젝트를 Mac에서 이어서 작업하기 위한 필수 정보를 제공합니다.

---

## 🔐 Git에 공유되지 않는 정보 (필수 설정)

### 1. 환경 변수 파일 (.env)

**위치**: 프로젝트 루트 (`APS/` 폴더)

`.env` 파일은 Git에 포함되지 않으므로 **반드시 수동으로 생성**해야 합니다.

```bash
# 프로젝트 루트에서 .env 파일 생성
cd APS
touch .env
```

**필수 내용**:
```env
# APS 인증 정보 (필수)
APS_CLIENT_ID=your_client_id_here
APS_CLIENT_SECRET=your_client_secret_here

# APS Base URL (기본값 사용 시 생략 가능)
APS_BASE_URL=https://developer.api.autodesk.com

# 포트 설정 (선택사항, 프로젝트별로 다를 수 있음)
PORT=8080
```

**참고**: `env.example` 파일을 참고하여 `.env` 파일을 생성할 수 있습니다.

---

## 📦 프로젝트별 설정 및 실행 방법

### Project1
- **포트**: 3000 (기본값)
- **실행**: `cd Project1 && npm start`
- **설명**: 간단한 Express 서버로 정적 파일 서빙

### Project2
- **포트**: 3000 (기본값)
- **실행**: `cd Project2 && npm start`
- **설명**: 랜덤 유저 데이터 생성 API

### Project3
- **포트**: 3000 (기본값)
- **실행**: `cd Project3 && npm start`
- **설명**: 크리스마스 메시지 생성 풀스택 앱

### Project4
- **포트**: Vite 기본 포트 (보통 5173)
- **실행**: `cd Project4 && npm run dev`
- **설명**: APS Viewer 기본 구현
- **의존성**: Vite 필요

### Project5
- **포트**: Vite 기본 포트 (보통 5173)
- **실행**: `cd Project5 && npm run dev`
- **설명**: APS Viewer + Custom Extensions (Basic, Panel, Charts, Grid)
- **의존성**: Vite 필요

### Project6
- **포트**: 3006 (기본값)
- **실행**: `cd Project6 && npm start`
- **설명**: ACC Hub Browser + APS Viewer + Custom Extensions
- **특징**: 
  - 2LO 인증 사용
  - `.env` 파일은 프로젝트 루트(`APS/`)에 있어야 함
  - Express 서버 기반

### aps-hubs-browser-nodejs
- **포트**: 8080 (기본값)
- **실행**: `cd aps-hubs-browser-nodejs && npm start`
- **설명**: 공식 APS 샘플 (2LO로 변경됨) + Custom Extensions
- **특징**:
  - 2LO 인증 사용
  - `.env` 파일은 프로젝트 폴더 내에 있어야 함
  - Express 서버 기반
- **주의**: Git submodule로 추가되었으므로, 초기 클론 시 별도 처리 필요

---

## 🚀 Mac에서 초기 설정

### 1. 저장소 클론

```bash
git clone <repository-url>
cd APS
```

### 2. aps-hubs-browser-nodejs 서브모듈 처리

`aps-hubs-browser-nodejs`는 Git submodule로 추가되었습니다. 다음 중 하나를 선택하세요:

**옵션 A: 서브모듈로 유지 (권장)**
```bash
git submodule update --init --recursive
cd aps-hubs-browser-nodejs
npm install
```

**옵션 B: 일반 폴더로 사용**
```bash
# 서브모듈 제거 후 일반 폴더로 복사
git rm --cached aps-hubs-browser-nodejs
rm -rf .git/modules/aps-hubs-browser-nodejs
# 필요시 원본 레포지토리에서 다시 클론
```

### 3. 환경 변수 파일 생성

```bash
# 프로젝트 루트에 .env 파일 생성
cp env.example .env
# 또는 직접 생성
touch .env
```

`.env` 파일에 다음 내용 추가:
```env
APS_CLIENT_ID=your_actual_client_id
APS_CLIENT_SECRET=your_actual_client_secret
APS_BASE_URL=https://developer.api.autodesk.com
```

### 4. 프로젝트별 의존성 설치

```bash
# Project1
cd Project1 && npm install && cd ..

# Project2
cd Project2 && npm install && cd ..

# Project3
cd Project3 && npm install && cd ..

# Project4
cd Project4 && npm install && cd ..

# Project5
cd Project5 && npm install && cd ..

# Project6
cd Project6 && npm install && cd ..

# aps-hubs-browser-nodejs
cd aps-hubs-browser-nodejs && npm install && cd ..
```

### 5. 프로젝트 실행

각 프로젝트 폴더에서:
```bash
npm start
# 또는
npm run dev  # (Vite 사용 프로젝트)
```

---

## 🔧 Mac 특화 설정

### Node.js 버전

모든 프로젝트는 Node.js LTS 버전을 권장합니다:
```bash
# Node.js 버전 확인
node --version

# nvm 사용 시
nvm install --lts
nvm use --lts
```

### 포트 충돌 해결

Mac에서 포트가 이미 사용 중인 경우:
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000
lsof -i :3006
lsof -i :8080

# 프로세스 종료
kill -9 <PID>
```

### 환경 변수 경로

Mac에서 `.env` 파일 경로는 프로젝트별로 다를 수 있습니다:

- **Project6**: `APS/.env` (프로젝트 루트)
- **aps-hubs-browser-nodejs**: `aps-hubs-browser-nodejs/.env` (프로젝트 폴더 내)

---

## 📝 주요 변경 사항 요약

### aps-hubs-browser-nodejs
- ✅ 3LO → 2LO로 변경 완료
- ✅ Custom Extensions 통합 (Project5에서)
- ✅ 세션 미들웨어 제거
- ✅ Login/Logout 기능 제거

### Project6
- ✅ ACC Hub Browser 구현
- ✅ APS Viewer 통합
- ✅ Custom Extensions 통합 (Project5에서)
- ✅ 2LO 인증 사용

### Project5
- ✅ Custom Extensions 구현 (Basic, Panel, Charts, Grid)
- ✅ APS Viewer 기본 기능

---

## ⚠️ 주의사항

1. **.env 파일**: 절대 Git에 커밋하지 마세요. 민감한 정보가 포함되어 있습니다.
2. **포트 충돌**: 여러 프로젝트를 동시에 실행할 때 포트 충돌 주의
3. **의존성 버전**: `package-lock.json`이 있으므로 `npm install`로 정확한 버전 설치
4. **aps-hubs-browser-nodejs**: Git submodule이므로 별도 처리 필요

---

## 🐛 문제 해결

### "Cannot find module" 오류
```bash
# 해당 프로젝트 폴더에서 의존성 재설치
cd <project-folder>
rm -rf node_modules package-lock.json
npm install
```

### "Port already in use" 오류
```bash
# 포트 사용 중인 프로세스 확인 및 종료
lsof -i :<port>
kill -9 <PID>
```

### "APS_CLIENT_ID is not defined" 오류
- `.env` 파일이 프로젝트 루트에 있는지 확인
- `.env` 파일에 올바른 값이 설정되어 있는지 확인

---

## 📚 추가 참고 자료

- `env.example`: 환경 변수 예시 파일
- 각 프로젝트의 `README.md`: 프로젝트별 상세 설명
- `CODE_REVIEW.md` (Project6): 코드 리뷰 보고서

---

## ✅ 체크리스트

Mac에서 작업 시작 전 확인:

- [ ] Git 저장소 클론 완료
- [ ] `.env` 파일 생성 및 APS 인증 정보 설정
- [ ] 모든 프로젝트의 `npm install` 완료
- [ ] `aps-hubs-browser-nodejs` 서브모듈 처리 완료
- [ ] Node.js LTS 버전 설치 확인
- [ ] 각 프로젝트 실행 테스트

---

**작성일**: 2024년
**작성자**: Windows 개발 환경
**대상**: Mac 개발 환경

