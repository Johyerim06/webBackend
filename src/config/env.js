import 'dotenv/config';

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? '' : 'mongodb://localhost:27017/club_scheduler')
};

// 환경 변수 디버깅
console.log('[CONFIG] Environment Debug:');
console.log('[CONFIG] NODE_ENV:', process.env.NODE_ENV);
console.log('[CONFIG] VERCEL_URL:', process.env.VERCEL_URL);
console.log('[CONFIG] RENDER_EXTERNAL_URL:', process.env.RENDER_EXTERNAL_URL);

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
