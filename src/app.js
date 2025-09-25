import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { auth } from './middleware/auth.js';
import { authRouter } from './routes/auth.routes.js';
import { clubRouter } from './routes/club.routes.js';
import { eventRouter } from './routes/event.routes.js';
import { availabilityRouter } from './routes/availability.routes.js';
import { voteRouter } from './routes/vote.routes.js';
import { todoRouter } from './routes/todo.routes.js';
import { scheduleRouter } from './routes/schedule.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// ejs-mate??html ?�장?�에 매핑?�고 view engine�?views 경로�??�정
// API 서버이므로 템플릿 엔진 불필요

app.use(morgan('dev'));
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());
// 기본 ?�이?�웃 변??주입 (title 미�?????ReferenceError 방�?)
app.use((req, res, next) => {
  if (typeof res.locals.title === 'undefined') res.locals.title = '?�아�??�정';
  next();
});
app.use(auth);

// API 라우트
app.use('/api/auth', authRouter);
app.use('/api/club', clubRouter);
app.use('/api/events', eventRouter);
app.use('/api/meetings', eventRouter); // 모임 생성용 별칭
app.use('/api/availability', availabilityRouter);
app.use('/api/votes', voteRouter);
app.use('/api/todos', todoRouter);
app.use('/api/schedules', scheduleRouter);

// 웹 라우트 (기존 호환성)
app.use('/auth', authRouter);
app.use('/club', clubRouter);
app.use('/events', eventRouter);
app.use('/meetings', eventRouter); // 모임 생성용 별칭
app.use('/availability', availabilityRouter);
app.use('/votes', voteRouter);
app.use('/todos', todoRouter);
app.use('/schedules', scheduleRouter);

app.get('/', (req,res)=> res.json({ message: 'Club Scheduler API Server' }));

// 404 ?�러 처리
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ?�역 ?�러 처리
app.use((err, req, res, next) => {
  console.error('[ERROR] Unhandled error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

export default app;

