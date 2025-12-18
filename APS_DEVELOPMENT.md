# Autodesk APS 개발 가이드

이 프로젝트는 Autodesk Platform Services (APS, 이전 Forge) 개발을 위한 저장소입니다.

## 프로젝트 개요

- **목적**: Autodesk APS API를 활용한 웹 애플리케이션 개발
- **플랫폼**: Windows와 Mac 모두 지원
- **협업**: Git을 통한 Windows-Mac 간 코드 동기화

## 초기 설정

### 1. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고, 실제 값으로 수정하세요:

```bash
cp .env.example .env
```

`.env` 파일에 다음 정보를 입력:
- `APS_CLIENT_ID`: Autodesk APS에서 발급받은 Client ID
- `APS_CLIENT_SECRET`: Autodesk APS에서 발급받은 Client Secret

### 2. Git 설정 (Windows)

Windows 환경에서 다음 설정을 적용하세요:

```bash
git config --local core.autocrlf true
git config --local pull.rebase false
git config --local core.filemode true
```

### 3. Git 설정 (Mac)

Mac 환경에서 다음 설정을 적용하세요:

```bash
git config --local core.autocrlf input
git config --local pull.rebase false
git config --local core.filemode true
```

## 개발 워크플로우

### Mac에서 개발할 때

1. **APS API 개발**
   ```bash
   git pull origin main
   # 코드 작성 및 테스트
   git add .
   git commit -m "커밋 메시지"
   git push origin main
   ```

2. **UI/UX 작업**
   - 웹 인터페이스 개발
   - 브라우저에서 테스트

### Windows에서 개발할 때

1. **코드 동기화**
   ```bash
   git pull origin main
   ```

2. **Revit 통합 테스트**
   - Revit 파일 업로드 테스트
   - APS API와 Revit 연동 테스트

3. **변경사항 커밋**
   ```bash
   git add .
   git commit -m "커밋 메시지"
   git push origin main
   ```

## 주의사항

### 1. 파일 경로 처리

Windows와 Mac의 경로 구분자가 다르므로, Node.js의 `path` 모듈을 사용하세요:

```javascript
const path = require('path');

// ❌ 잘못된 방법
const filePath = 'C:\\Users\\...';

// ✅ 올바른 방법
const filePath = path.join(__dirname, 'relative', 'path');
```

### 2. Revit 파일 관리

- `.rvt`, `.rfa` 파일은 용량이 크므로 Git에 커밋하지 않습니다
- `.gitignore`에 이미 포함되어 있습니다
- 대용량 파일은 별도 저장소나 클라우드 스토리지 사용 권장

### 3. 환경 변수 보안

- `.env` 파일은 절대 Git에 커밋하지 마세요
- `.env.example`만 커밋하여 팀원들이 참고할 수 있도록 합니다

## Autodesk APS 리소스

- [APS 공식 문서](https://aps.autodesk.com/)
- [APS 개발자 포털](https://aps.autodesk.com/developer/documentation)
- [APS API 레퍼런스](https://aps.autodesk.com/en/docs/data/v1/overview/)

## 문제 해결

### Git 충돌 발생 시

```bash
# 최신 코드 가져오기
git pull origin main

# 충돌 해결 후
git add .
git commit -m "충돌 해결"
git push origin main
```

### 줄바꿈 문자 문제

Windows에서 줄바꿈 문자 문제가 발생하면:

```bash
git config --local core.autocrlf true
git add --renormalize .
git commit -m "줄바꿈 문자 정규화"
```

## 협업 가이드

1. **작업 전**: 항상 `git pull`로 최신 코드 받기
2. **작업 후**: 변경사항을 명확한 커밋 메시지와 함께 푸시
3. **충돌 시**: 팀원과 소통하여 해결


