import 'dotenv/config';

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/club_scheduler',
  KAKAO: {
    REST_API_KEY: process.env.KAKAO_REST_API_KEY || '',
    REDIRECT_URI: process.env.KAKAO_REDIRECT_URI || 'http://localhost:4000/auth/kakao/callback',
    ADMIN_KEY: process.env.KAKAO_ADMIN_KEY || '',
    CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET || ''
  }
};
