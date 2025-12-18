# 개발 에이전트 가이드라인

이 문서는 Autodesk Platform Services (APS) 기반 개발 프로젝트를 위한 포괄적인 가이드라인입니다. 모든 개발자는 이 가이드라인을 준수해야 합니다.

## 1) Logical dependencies and constraints: Analyze the intended action against the following factors. Resolve conflicts in order of importance:

### 1.1) Policy-based rules, mandatory prerequisites, and constraints.

**프로젝트 기반 규칙:**
- 우리는 **오토데스크 플랫폼 서비스(APS)**를 기반으로 개발합니다. 모든 코드는 APS API와 호환되어야 합니다.
- **Node.js**로 개발하므로, HTML, CSS, JS 파일만 작성합니다. 서버 사이드 코드도 Node.js 기반으로 유지합니다.
- 현재 팀은 개발에 대해 아무것도 모르므로, **최대한 코드를 쉽게 작성**합니다. 복잡한 패턴이나 고급 기능은 피하고, 간단한 구현을 우선합니다.

**코딩 스타일 규칙:**
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)를 기반으로 코드 스타일을 만듭니다.
- 문서화와 대화는 **한글로만** 합니다.
- 각 기능에 대해 **log, error, warning 메시지**를 꼭 만들어 디버깅을 지원합니다.

**코드를 작성하기 전 필수 절차:**
- 코드를 작성하기 전에는 반드시 **뭘할지 이야기한 후 수락을 받고 시작**합니다.

### 1.2) Order of operations: Ensure taking an action does not prevent a subsequent necessary action.

**개발 순서:**
1. 기능 요구사항 정의 (한글로 명확히 설명)
2. 사용자 수락 받기
3. 코드 작성 (HTML, CSS, JS만)
4. 디버깅 로그 추가
5. Google 스타일 가이드 준수 확인
6. 테스트 및 검증

### 1.3) Other prerequisites (information and/or actions needed).

**필수 선행 작업:**
- APS API 인증 설정 (Client ID, Secret)
- Node.js 환경 구축
- 기본 프로젝트 구조 생성

### 1.4) Explicit user constraints or preferences.

**사용자 제약사항:**
- 한글 문서화 및 커뮤니케이션
- 쉬운 코드 구현
- 디버깅 로그 필수

## 2) Risk assessment: What are the consequences of taking the action? Will the new state cause any future issues?

**위험 평가:**
- 코드를 쉽게 작성하면 유지보수가 어려워질 수 있음 → 정기적인 코드 리뷰로 해결
- 한글만 사용하면 국제 협업이 어려움 → 필요시 영어 주석 추가 고려
- Google 스타일 가이드 준수가 미흡할 경우 코드 품질 저하 → 자동 린터 도입

## 3) Abductive reasoning and hypothesis exploration: At each step, identify the most logical and likely reason for any problem encountered.

**문제 해결 접근:**
- APS API 오류 시: 인증 문제, 네트워크 문제, API 버전 호환성 순으로 조사
- 코드 오류 시: 구문 오류, 로직 오류, 스타일 가이드 위반 순으로 검토

## 4) Outcome evaluation and adaptability: Does the previous observation require any changes to your plan?

**적응성:**
- 개발 중 새로운 요구사항 발견 시 계획 재조정
- 스타일 가이드가 프로젝트에 맞지 않으면 조정

## 5) Information availability: Incorporate all applicable and alternative sources of information, including:

### 5.1) Using available tools and their capabilities

**사용 도구:**
- Node.js 런타임
- 브라우저 개발자 도구
- APS API 문서

### 5.2) All policies, rules, checklists, and constraints

**정책 및 규칙:**
- Google JavaScript Style Guide 준수
- 한글 문서화 필수
- 디버깅 로그 포함

### 5.3) Previous observations and conversation history

**과거 경험:**
- Python 환경 설정 경험을 Node.js에 적용

### 5.4) Information only available by asking the user

**사용자 확인 필요 사항:**
- 특정 기능의 상세 요구사항
- 디자인 선호사항

## 6) Precision and Grounding: Ensure your reasoning is extremely precise and relevant to each exact ongoing situation.

**정밀성:**
- 각 코드 조각에 대해 Google 스타일 가이드 준수 여부 확인
- 로그 메시지는 구체적이고 유용하게 작성

## 7) Completeness: Ensure that all requirements, constraints, options, and preferences are exhaustively incorporated into your plan.

### 7.1) Resolve conflicts using the order of importance in #1.

**충돌 해결 우선순위:**
1. APS 기반 개발
2. Node.js/HTML/CSS/JS만 사용
3. 쉬운 코드 구현
4. Google 스타일 가이드
5. 한글 문서화
6. 디버깅 로그
7. 사전 수락 절차

### 7.2) Avoid premature conclusions: There may be multiple relevant options for a given situation.

**다양한 옵션 고려:**
- 여러 구현 방법 중 가장 쉬운 것 선택
- 여러 스타일 중 Google 가이드 우선

### 7.3) Review applicable sources of information from #5to confirm which are relevant to the current state.

**정보 검토:**
- APS API 문서에서 관련 기능 확인
- Google 스타일 가이드에서 코딩 규칙 확인

## 8) Persistence and patience: Do not give up unless all the reasoning above is exhausted.

**지속성:**
- 오류 발생 시 단계별로 문제 해결
- 최대 3회 재시도 후 사용자에게 보고

## 9) Inhibit your response: only take an action after all the above reasoning is completed. Once you've taken an action, you cannot take it back.

**행동 전 계획 완료:**
- 모든 추론 완료 후에만 코드 작성 시작

## 추가 개발 가이드라인

### 프로젝트 구조
```
project/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server/
│   └── server.js
├── package.json
└── README.md
```

### 버전 관리
- Node.js LTS 버전 사용
- npm 패키지 버전 고정

### 테스트
- 기본 기능 수동 테스트
- 브라우저 콘솔로 로그 확인

### 보안 고려사항
- APS API 키 안전하게 관리
- 클라이언트 사이드에 민감한 정보 노출 금지

### 협업 규칙
- 모든 코드 변경 전 사용자 수락 받기
- 변경사항에 대해 한글로 설명
- 디버깅 로그 포함하여 공유

### 놓친 부분 보충
- **에러 처리**: 모든 API 호출에 try-catch 추가
- **성능 최적화**: 큰 파일은 청크로 로드
- **반응형 디자인**: 모바일 지원 고려
- **접근성**: WCAG 가이드라인 준수
- **브라우저 호환성**: 최신 브라우저 우선 지원
- **코드 주석**: 복잡한 로직에 한글 주석 추가
- **환경별 설정**: 개발/프로덕션 환경 분리

이 가이드라인을 따라 Autodesk APS 기반 Node.js 애플리케이션을 개발합니다.
