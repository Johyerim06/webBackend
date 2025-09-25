import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { auth } from './middleware/auth.js';
import { authRouter } from './routes/auth.routes.js';
import { clubRouter } from './routes/club.routes.js';
import { eventRouter } from './routes/event.routes.js';
import { availabilityRouter } from './routes/availability.routes.js';
import { voteRouter } from './routes/vote.routes.js';
import { todoRouter } from './routes/todo.routes.js';
import { scheduleRouter } from './routes/schedule.routes.js';
import { personalEventRouter } from './routes/personalEvent.routes.js';

const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// API 미들웨어 설정
app.use(morgan('dev'));
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // form-urlencoded 파싱       
app.use(cookieParser());
app.use(auth);

// API 라우트 설정 (모든 라우트에 /api 접두사 추가)
app.use('/api/auth', authRouter);
app.use('/api/clubs', clubRouter);
app.use('/api/events', eventRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/votes', voteRouter);
app.use('/api/todos', todoRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/personal-events', personalEventRouter);

// API 서버 상태 확인 엔드포인트
app.get('/api/health', (req, res) => {      
  res.json({
    status: 'OK',
    message: 'API Server is running',
    timestamp: new Date().toISOString()
  });
});

// 루트 경로 - API 서버 상태 반환
app.get('/', (req, res) => {
  res.json({
    message: 'Club Scheduler API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      clubs: '/api/clubs',
      events: '/api/events',
      availability: '/api/availability',
      votes: '/api/votes',
      todos: '/api/todos',
      schedules: '/api/schedules',
      personalEvents: '/api/personal-events'
    }
  });
});

// 404 에러 처리
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// 전역 에러 처리
app.use((err, req, res, next) => {
  console.error('[ERROR] Unhandled error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

export default app;