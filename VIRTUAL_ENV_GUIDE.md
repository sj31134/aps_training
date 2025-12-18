# 가상환경 사용 가이드

이 문서는 Mac과 Windows 환경에서 Python 가상환경을 사용하여 Autodesk APS 프로젝트를 개발하는 방법을 설명합니다.

## 가상환경을 사용하는 이유

### 1. 프로젝트 간 의존성 격리
- 다른 프로젝트와 패키지 버전 충돌 방지
- 프로젝트별로 독립적인 Python 환경 유지

### 2. 재현 가능한 환경
- `requirements.txt`로 동일한 패키지 버전 보장
- 팀원 간 동일한 개발 환경 구성

### 3. 시스템 Python 보호
- 시스템 Python을 오염시키지 않음
- 필요시 가상환경 삭제로 깔끔하게 정리 가능

## 가상환경은 Git에 포함하지 않습니다

### 기술적 호환성 문제

Windows와 Mac의 가상환경은 호환되지 않습니다:

```bash
# Mac 가상환경
aps/bin/python      # Unix 실행 파일
aps/bin/activate    # bash 스크립트

# Windows 가상환경
aps\Scripts\python.exe  # Windows 실행 파일
aps\Scripts\activate.bat # 배치 파일
```

- 실행 파일 형식이 다름 (Unix vs Windows)
- 스크립트 형식이 다름 (bash vs 배치)
- 경로 구분자가 다름 (`/` vs `\`)

### 용량 문제
- 가상환경 폴더는 수백 MB~수 GB까지 증가할 수 있음
- Git 저장소가 불필요하게 커짐

### 환경별 차이
- Python 버전이 다를 수 있음
- OS별 네이티브 라이브러리 필요
- 컴파일된 확장 모듈이 플랫폼별로 다름

## 올바른 방법: requirements.txt로 공유

### 핵심 원칙

가상환경은 각 환경에서 독립적으로 생성하고, `requirements.txt`로 동일한 패키지를 설치합니다.

```
[GitHub]
  └── requirements.txt  ← 이 파일만 공유
       ↓
[Windows]              [Mac]
  ├── aps/ (로컬 생성)    ├── aps/ (로컬 생성)
  └── pip install -r    └── pip install -r
       requirements.txt      requirements.txt
       (동일한 패키지)        (동일한 패키지)
```

## 초기 설정

### Mac 환경

```bash
# 1. 저장소 클론 (처음만)
git clone https://github.com/sj31134/aps_training.git
cd aps_training

# 2. 가상환경 생성 (처음만)
python3 -m venv aps

# 3. 가상환경 활성화
source aps/bin/activate

# 4. pip 업그레이드 (선택사항)
pip install --upgrade pip

# 5. 패키지 설치
pip install -r requirements.txt

# 이제 개발 시작!
```

### Windows 환경

```powershell
# 1. 저장소 클론 (처음만)
git clone https://github.com/sj31134/aps_training.git
cd aps_training

# 2. 가상환경 생성 (처음만)
python -m venv aps

# 3. 가상환경 활성화
aps\Scripts\activate

# 4. pip 업그레이드 (선택사항)
python -m pip install --upgrade pip

# 5. 패키지 설치
pip install -r requirements.txt

# 이제 개발 시작!
```

**참고**: Python이 설치되어 있지 않다면 [Python 공식 사이트](https://www.python.org/downloads/)에서 다운로드하세요.

## 일상적인 작업 흐름

### 작업 시작 시

```bash
# Mac
source aps/bin/activate

# Windows
aps\Scripts\activate
```

가상환경이 활성화되면 프롬프트에 `(aps)`가 표시됩니다:

```bash
# Mac
(aps) user@macbook aps_training %

# Windows
(aps) C:\Users\ADSK\Desktop\APS>
```

### 작업 종료 시

```bash
# 가상환경 비활성화
deactivate
```

## 패키지 관리

### 새 패키지 추가하기

```bash
# 1. 가상환경 활성화
source aps/bin/activate  # Mac
# 또는
aps\Scripts\activate     # Windows

# 2. 패키지 설치
pip install forge-sdk requests

# 3. requirements.txt 업데이트
pip freeze > requirements.txt

# 4. Git에 추가 (가상환경 폴더는 자동 제외됨)
git add requirements.txt
git commit -m "chore: forge-sdk, requests 추가"
git push origin master
```

### 패키지 업데이트하기

```bash
# 1. 가상환경 활성화
source aps/bin/activate  # Mac
# 또는
aps\Scripts\activate     # Windows

# 2. 패키지 업데이트
pip install --upgrade forge-sdk

# 3. requirements.txt 업데이트
pip freeze > requirements.txt

# 4. Git에 커밋
git add requirements.txt
git commit -m "chore: forge-sdk 업데이트"
git push origin master
```

### 패키지 제거하기

```bash
# 1. 가상환경 활성화
source aps/bin/activate  # Mac
# 또는
aps\Scripts\activate     # Windows

# 2. 패키지 제거
pip uninstall 패키지명

# 3. requirements.txt 업데이트
pip freeze > requirements.txt

# 4. Git에 커밋
git add requirements.txt
git commit -m "chore: 패키지명 제거"
git push origin master
```

## 다른 환경에서 받아서 사용하기

### Mac에서 Windows로 전환

```bash
# 1. 최신 코드 받기
git pull origin master

# 2. 가상환경 생성 (처음만)
python -m venv aps

# 3. 가상환경 활성화
aps\Scripts\activate

# 4. 동일한 패키지 설치
pip install -r requirements.txt

# 이제 Mac과 동일한 패키지 환경!
```

### Windows에서 Mac으로 전환

```bash
# 1. 최신 코드 받기
git pull origin master

# 2. 가상환경 생성 (처음만)
python3 -m venv aps

# 3. 가상환경 활성화
source aps/bin/activate

# 4. 동일한 패키지 설치
pip install -r requirements.txt

# 이제 Windows와 동일한 패키지 환경!
```

## 문제 해결

### 가상환경이 활성화되지 않음

**Mac:**
```bash
# 실행 권한 확인
chmod +x aps/bin/activate
source aps/bin/activate
```

**Windows:**
```powershell
# 실행 정책 확인 (필요시)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
aps\Scripts\activate
```

### 패키지 설치 오류

```bash
# pip 업그레이드
pip install --upgrade pip

# 캐시 클리어 후 재설치
pip cache purge
pip install -r requirements.txt --no-cache-dir
```

### 가상환경 재생성

```bash
# 1. 기존 가상환경 삭제
rm -rf aps  # Mac
# 또는
Remove-Item -Recurse -Force aps  # Windows

# 2. 새로 생성
python3 -m venv aps  # Mac
# 또는
python -m venv aps   # Windows

# 3. 패키지 재설치
source aps/bin/activate  # Mac
# 또는
aps\Scripts\activate     # Windows
pip install -r requirements.txt
```

### Python 버전 문제

```bash
# 특정 Python 버전으로 가상환경 생성
python3.11 -m venv aps  # Mac
# 또는
py -3.11 -m venv aps    # Windows
```

## .gitignore 확인

가상환경 폴더가 Git에 포함되지 않도록 `.gitignore`에 다음이 포함되어 있는지 확인하세요:

```
# Python 가상환경
aps/
venv/
env/
ENV/
.venv/
.ENV/
```

## 요약

### 하지 말아야 할 것
- ❌ 가상환경 폴더(`aps/`)를 Git에 커밋
- ❌ Windows 가상환경을 Mac에서 사용 (또는 그 반대)
- ❌ 시스템 Python에 직접 패키지 설치

### 해야 할 것
- ✅ 각 환경에서 독립적으로 가상환경 생성
- ✅ `requirements.txt`로 패키지 목록 공유
- ✅ 패키지 변경 시 `requirements.txt` 업데이트 후 Git에 커밋
- ✅ 작업 시작 시 가상환경 활성화
- ✅ 작업 종료 시 가상환경 비활성화

### 핵심 메시지

**가상환경은 각자 만들되, 패키지는 `requirements.txt`로 공유합니다.**

이렇게 하면 Windows와 Mac에서 동일한 패키지 환경을 유지하면서도, 각 환경에 맞는 가상환경을 사용할 수 있습니다.

