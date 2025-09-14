# Render 배포 문제 해결 가이드

## 🚨 현재 문제: 서비스가 시작되지만 다음 단계로 넘어가지 않음

### 원인 분석
1. **데이터베이스 연결 실패**: MONGODB_URI가 설정되지 않았거나 연결 실패
2. **포트 바인딩 문제**: Render에서 요구하는 포트 설정 문제
3. **헬스체크 실패**: Render가 서비스 상태를 확인할 수 없음

## ✅ 해결된 사항

### 1. 서버 시작 로직 개선
- 데이터베이스 연결 실패해도 서버 시작
- 명시적인 포트 바인딩 (`0.0.0.0`)
- 상세한 로깅 추가

### 2. Render 설정 개선
- 헬스체크 경로 추가 (`/auth/health`)
- 환경 변수 설정 가이드

## 🔧 Render에서 해야 할 설정

### 1. 환경 변수 설정 (필수!)
Render 대시보드 → Environment Variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/club_scheduler
```

### 2. 서비스 설정 확인
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/auth/health`

## 🚀 다음 단계

1. **코드 푸시**: 수정된 코드를 GitHub에 푸시
2. **환경 변수 설정**: Render에서 MONGODB_URI 설정
3. **재배포**: Render에서 자동 재배포 실행
4. **로그 확인**: 서버 시작 로그 확인

## 📝 예상 로그 출력

정상적으로 시작되면 다음과 같은 로그가 출력됩니다:

```
[STARTUP] Starting application...
[CONFIG] NODE_ENV: production
[CONFIG] PORT: 10000
[CONFIG] MONGODB_URI: Set
[DB] Connecting to MongoDB...
[DB] Connected successfully
[WEB] Server running on port 10000
[WEB] Environment: production
[WEB] Server is ready to accept connections
```

## 🔍 문제가 계속되면

1. **로그 확인**: Render 대시보드에서 상세 로그 확인
2. **헬스체크**: `https://your-app-name.onrender.com/auth/health` 접속
3. **환경 변수**: MONGODB_URI가 올바르게 설정되었는지 확인
