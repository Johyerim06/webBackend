import 'dotenv/config';

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? '' : 'mongodb://localhost:27017/club_scheduler'),
  KAKAO: {
    REST_API_KEY: process.env.KAKAO_REST_API_KEY || '',
    REDIRECT_URI: process.env.KAKAO_REDIRECT_URI || (process.env.NODE_ENV === 'production' 
      ? `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.RENDER_EXTERNAL_URL || 'https://your-app-name.onrender.com'}/auth/kakao/callback`
      : 'http://localhost:4000/auth/kakao/callback'),
    ADMIN_KEY: process.env.KAKAO_ADMIN_KEY || '',
    CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET || ''
  }
};

// 필수 환경 변수 검증
if (process.env.NODE_ENV === 'production') {
  const requiredVars = ['MONGODB_URI'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('[CONFIG] Missing required environment variables:', missingVars);
    console.error('[CONFIG] Please set the following variables in Render dashboard:');
    missingVars.forEach(varName => {
      console.error(`[CONFIG] - ${varName}`);
    });
  }
}
