# Project5 - APS Viewer Demo with Custom Extensions

Autodesk Platform Services (APS) Viewer를 사용한 3D 모델 뷰어 데모 애플리케이션입니다.
Custom Extension을 통해 Viewer에서 정보를 추출하고 패널, 차트, 그리드로 시각화합니다.

## 프로젝트 개요

- **목적**: APS Viewer SDK를 사용한 3D 모델 뷰어 구현
- **기술 스택**: Vite, APS Viewer SDK, Tailwind CSS, ES6 Modules
- **기능**: 3D 모델 목록 조회 및 Viewer에서 모델 표시

## 파일 구조

```
Project5/
├── index.html          # 메인 HTML 파일 (APS Viewer, Tailwind CSS, 네비게이션)
├── app.mjs            # Viewer 초기화 및 모델 로딩 로직
├── aps.http           # API 엔드포인트 정의 및 응답 예시
├── vite.config.js     # Vite 설정 (프록시 설정)
├── package.json       # 의존성 관리
├── extensions/        # Custom Extensions
│   ├── BasicExtension.js    # 기본 확장 기능
│   ├── PanelExtension.js    # 정보 패널 확장
│   ├── ChartsExtension.js   # 차트 시각화 확장
│   └── GridExtension.js     # 그리드 시각화 확장
└── README.md          # 프로젝트 설명 (현재 파일)
```

## 사용 방법

### 1. 의존성 설치

```bash
cd Project5
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 브라우저 접속

서버가 시작되면 브라우저에서 표시된 URL (일반적으로 `http://localhost:5173`)로 접속하세요.

### 4. 모델 선택 및 Extension 사용

1. 상단 네비게이션 바의 "Choose a model" 드롭다운에서 모델 선택
2. 선택한 모델이 Viewer에 로드되어 표시됩니다
3. 툴바에서 Custom Extension 버튼 클릭:
   - **Basic Extension**: 모델 기본 정보 표시
   - **Panel Extension**: 정보 패널 열기/닫기
   - **Charts Extension**: 차트로 데이터 시각화
   - **Grid Extension**: 그리드로 객체 정보 표시

## API 엔드포인트

### GET /api/token

Access Token을 가져옵니다.

**요청:**
```
GET https://aps-codepen.autodesk.io/api/token
```

**응답:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### GET /api/models

사용 가능한 모델 목록을 가져옵니다.

**요청:**
```
GET https://aps-codepen.autodesk.io/api/models
```

**응답:**
```json
[
  {
    "name": "Shoe",
    "urn": "dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLlNob2UuZ2VvbWV0cnk"
  },
  {
    "name": "Race Car",
    "urn": "dXJuOmFkc2sud2lwcHJvZDpmcy5maWxlOnZmLlJhY2VDYXIuZ2VvbWV0cnk"
  }
]
```

## 기능 설명

### 프론트엔드
- **네비게이션 바**: ACME 로고, 제목, 모델 선택 드롭다운, 검색, 로그인 버튼
- **APS Viewer**: 3D 모델을 표시하는 Viewer 컨테이너
- **모델 선택**: 드롭다운에서 모델 선택 시 자동으로 로드

### Custom Extensions
- **BasicExtension**: 모델의 기본 정보(총 객체 수 등)를 알림으로 표시
- **PanelExtension**: Viewer에서 추출한 정보를 패널에 표시
- **ChartsExtension**: 모델 데이터를 차트로 시각화 (Canvas 기반)
- **GridExtension**: 모델 객체 정보를 그리드 테이블로 표시 (클릭 시 객체 선택)

### 백엔드 (프록시)
- **Vite 프록시**: CORS 문제 해결을 위한 API 프록시 설정
- **자동 토큰 관리**: Access Token 자동 획득 및 관리

## 개발 가이드라인 준수

- Google JavaScript Style Guide 준수
- 한글 주석 및 문서화
- ES6 Modules 사용
- 간단한 코드 구현 (에러 체크 최소화)

## 빌드

프로덕션 빌드:

```bash
npm run build
```

빌드 결과 미리보기:

```bash
npm run preview
```

## 참고 자료

- [APS Viewer Documentation](https://aps.autodesk.com/developer/documentation)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

