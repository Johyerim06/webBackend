# Vercel 배포 가이드

## 🚀 Vercel 배포 준비 완료!

현재 프로젝트를 Vercel에서도 배포할 수 있도록 설정을 완료했습니다.

## 📁 생성된 파일들

### 1. **vercel.json** - Vercel 설정 파일
- 서버리스 함수 설정
- 라우팅 설정
- 환경 변수 설정

### 2. **api/index.js** - Vercel 진입점
- 서버리스 함수 핸들러
- Express 앱 연결

### 3. **src/vercel-server.js** - Vercel용 서버
- 데이터베이스 지연 로딩
- 에러 처리 개선

## 🔧 Vercel 배포 방법

### **방법 1: Vercel CLI 사용**

1. **Vercel CLI 설치**
```bash
npm install -g vercel
```

2. **프로젝트 디렉토리에서 로그인**
```bash
vercel login
```

3. **배포**
```bash
vercel
```

4. **프로덕션 배포**
```bash
vercel --prod
```

### **방법 2: Vercel 웹 대시보드 사용**

1. **Vercel 대시보드 접속**: https://vercel.com
2. **New Project** 클릭
3. **GitHub 저장소 연결**
4. **프로젝트 설정**:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.` (루트)
   - **Install Command**: `npm install`

## 🌍 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 설정:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/club_scheduler
KAKAO_REST_API_KEY=your_kakao_rest_api_key
KAKAO_REDIRECT_URI=https://your-app-name.vercel.app/auth/kakao/callback
KAKAO_ADMIN_KEY=your_kakao_admin_key
KAKAO_CLIENT_SECRET=your_kakao_client_secret
```

## ⚠️ Vercel 제약사항

### **1. 실행 시간 제한**
- **무료 플랜**: 10초
- **Pro 플랜**: 60초

### **2. 메모리 제한**
- **무료 플랜**: 1024MB
- **Pro 플랜**: 3008MB

### **3. 파일 시스템**
- 읽기 전용 (일부 제한)
- 임시 파일만 쓰기 가능

### **4. 세션 관리**
- 서버리스 환경에서 복잡
- 쿠키 기반 인증은 작동하지만 제한적

## 🔄 Render vs Vercel 비교

| 기능 | Render | Vercel |
|------|--------|--------|
| **서버 타입** | 전통적 서버 | 서버리스 함수 |
| **실행 시간** | 무제한 | 10-60초 제한 |
| **메모리** | 512MB-8GB | 1GB-3GB |
| **데이터베이스** | 연결 유지 | 지연 로딩 |
| **세션 관리** | 완전 지원 | 제한적 |
| **비용** | 무료-월 $7 | 무료-월 $20 |

## 🎯 권장사항

### **Render 사용 권장**
- **풀스택 앱**: 현재 구조에 최적
- **세션 관리**: 쿠키 기반 인증
- **비용 효율**: 무료 플랜으로 충분

### **Vercel 사용 권장**
- **API만 필요**: 프론트엔드 별도
- **정적 사이트**: React/Vue 등 SPA
- **서버리스**: 요청 시에만 실행

## 🚀 배포 후 확인사항

1. **헬스체크**: `https://your-app-name.vercel.app/auth/health`
2. **로그 확인**: Vercel 대시보드에서 함수 로그 확인
3. **데이터베이스**: 연결 상태 확인
4. **기능 테스트**: 주요 API 엔드포인트 테스트

## 📝 문제 해결

### **1. 타임아웃 에러**
- 복잡한 작업을 여러 함수로 분할
- 데이터베이스 쿼리 최적화

### **2. 메모리 부족**
- 불필요한 데이터 로딩 방지
- 이미지 최적화

### **3. 세션 문제**
- JWT 토큰 사용 고려
- 클라이언트 사이드 상태 관리

이제 Vercel에서도 배포할 수 있습니다! 🎉
