import app from './app.js';
import { connectDB } from './db/connect.js';
import { config } from './config/env.js';

async function bootstrap(){
  try {
    console.log('[STARTUP] Starting application...');
    console.log('[CONFIG] NODE_ENV:', config.NODE_ENV);
    console.log('[CONFIG] PORT:', config.PORT);
    console.log('[CONFIG] MONGODB_URI:', config.MONGODB_URI ? 'Set' : 'Not set');
    
    // 데이터베이스 연결 시도 (실패해도 서버는 시작)
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('[WARNING] Database connection failed, but server will start anyway:', dbError.message);
      console.warn('[WARNING] Some features may not work without database connection');
    }
    
    const server = app.listen(config.PORT, '0.0.0.0', () => {
      console.log(`[WEB] Server running on port ${config.PORT}`);
      console.log(`[WEB] Environment: ${config.NODE_ENV}`);
      console.log(`[WEB] Server is ready to accept connections`);
    });

    // Graceful shutdown 처리
    process.on('SIGTERM', () => {
      console.log('[SHUTDOWN] SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('[SHUTDOWN] SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('[SHUTDOWN] Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('[ERROR] Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
