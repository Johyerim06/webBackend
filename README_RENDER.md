# Render 배포 가이드

## Render 배포 설정

### 1. 환경 변수 설정
Render 대시보드에서 다음 환경 변수들을 설정해주세요:

- `NODE_ENV`: `production`
- `MONGODB_URI`: MongoDB Atlas 연결 문자열
- `KAKAO_REST_API_KEY`: 카카오 REST API 키
- `KAKAO_REDIRECT_URI`: `https://your-app-name.onrender.com/auth/kakao/callback`
- `KAKAO_ADMIN_KEY`: 카카오 Admin 키
- `KAKAO_CLIENT_SECRET`: 카카오 클라이언트 시크릿

### 2. 배포 설정
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 20.x (권장)

### 3. 데이터베이스 설정
MongoDB Atlas를 사용하여 클라우드 데이터베이스를 설정하고 연결 문자열을 `MONGODB_URI`에 입력하세요.

### 4. 카카오 로그인 설정
카카오 개발자 콘솔에서 리다이렉트 URI를 Render URL로 변경해주세요.

## 배포 후 확인사항
1. 애플리케이션이 정상적으로 시작되는지 확인
2. 데이터베이스 연결 상태 확인
3. 카카오 로그인 기능 테스트
