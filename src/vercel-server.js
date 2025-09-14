// Vercel용 서버 파일
import app from './app.js';
import { connectDB } from './db/connect.js';
import { config } from './config/env.js';

// Vercel에서는 서버리스 함수이므로 데이터베이스 연결을 지연 로딩
let dbConnected = false;

async function ensureDBConnection() {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('[VERCEL] Database connected');
    } catch (error) {
      console.warn('[VERCEL] Database connection failed:', error.message);
      // Vercel에서는 DB 연결 실패해도 함수는 실행
    }
  }
}

// Vercel 서버리스 함수 핸들러
export default async function handler(req, res) {
  try {
    // 데이터베이스 연결 확인
    await ensureDBConnection();
    
    // Express 앱으로 요청 처리
    return app(req, res);
  } catch (error) {
    console.error('[VERCEL] Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
