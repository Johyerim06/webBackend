# Render 배포 문제 해결 가이드

## 🚨 현재 발생한 문제
- **에러**: `SIGTERM` 신호로 프로세스 종료
- **원인**: 환경 변수 누락 및 에러 처리 부족

## ✅ 해결된 사항

### 1. 서버 시작 코드 개선
- 에러 처리 추가
- Graceful shutdown 구현
- 상세한 로깅 추가

### 2. 데이터베이스 연결 개선
- 연결 실패 시 명확한 에러 메시지
- 연결 상태 모니터링

### 3. 환경 변수 검증
- 필수 환경 변수 체크
- 누락된 변수에 대한 안내

## 🔧 Render에서 해야 할 설정

### 1. 환경 변수 설정 (필수!)
Render 대시보드 → Environment Variables에서 다음을 설정:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/club_scheduler
```

### 2. MongoDB Atlas 설정
1. [MongoDB Atlas](https://cloud.mongodb.com)에서 계정 생성
2. 클러스터 생성
3. 데이터베이스 사용자 생성
4. 네트워크 액세스 설정 (0.0.0.0/0 허용)
5. 연결 문자열 복사하여 `MONGODB_URI`에 설정

### 3. 카카오 API 설정 (선택사항)
```
KAKAO_REST_API_KEY=your_kakao_rest_api_key
KAKAO_REDIRECT_URI=https://your-app-name.onrender.com/auth/kakao/callback
KAKAO_ADMIN_KEY=your_kakao_admin_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret
```

## 🚀 배포 후 확인사항

1. **로그 확인**: Render 대시보드에서 로그를 확인하여 정상 시작 여부 확인
2. **헬스체크**: `https://your-app-name.onrender.com/auth/health` 접속
3. **데이터베이스 연결**: 실제 API 호출 테스트

## 📝 추가 개선사항

- 더 상세한 에러 로깅
- Graceful shutdown 처리
- 환경 변수 검증
- 404/500 에러 처리

이제 다시 배포해보세요!
