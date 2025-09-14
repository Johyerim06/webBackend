import 'dotenv/config';

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? '' : 'mongodb://localhost:27017/club_scheduler'),
  KAKAO: {
    REST_API_KEY: process.env.KAKAO_REST_API_KEY || '',
    REDIRECT_URI: process.env.KAKAO_REDIRECT_URI || (() => {
      // Vercel 환경 감지
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/auth/kakao/callback`;
      }
      // Render 환경 감지
      if (process.env.RENDER_EXTERNAL_URL) {
        return `${process.env.RENDER_EXTERNAL_URL}/auth/kakao/callback`;
      }
      // 프로덕션 환경이지만 URL이 없는 경우
      if (process.env.NODE_ENV === 'production') {
        return 'https://web-backend-ten.vercel.app/auth/kakao/callback';
      }
      // 개발 환경
      return 'http://localhost:4000/auth/kakao/callback';
    })(),
    ADMIN_KEY: process.env.KAKAO_ADMIN_KEY || '',
    CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET || ''
  }
};

// 환경 변수 디버깅
console.log('[CONFIG] Environment Debug:');
console.log('[CONFIG] NODE_ENV:', process.env.NODE_ENV);
console.log('[CONFIG] VERCEL_URL:', process.env.VERCEL_URL);
console.log('[CONFIG] RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL);
console.log('[CONFIG] KAKAO_REDIRECT_URI:', process.env.KAKAO_REDIRECT_URI);
console.log('[CONFIG] Final REDIRECT_URI:', config.KAKAO.REDIRECT_URI);

// 필수 환경 변수 검증
if (process.env.NODE_ENV === 'production') {
  const requiredVars = ['MONGODB_URI'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('[CONFIG] Missing required environment variables:', missingVars);
    console.error('[CONFIG] Please set the following variables in dashboard:');
    missingVars.forEach(varName => {
      console.error(`[CONFIG] - ${varName}`);
    });
  }
}
