import express from 'express';
import path from 'path';
import ejsMate from 'ejs-mate';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { demoAuth } from './middleware/auth.js';
import { authRouter } from './routes/auth.routes.js';
import { clubRouter } from './routes/club.routes.js';
import { eventRouter } from './routes/event.routes.js';
import { availabilityRouter } from './routes/availability.routes.js';
import { voteRouter } from './routes/vote.routes.js';
import { todoRouter } from './routes/todo.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// ejs-mate을 html 확장자에 매핑하고 view engine과 views 경로를 설정
app.engine('html', ejsMate);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cookieParser());
// 기본 레이아웃 변수 주입 (title 미지정 시 ReferenceError 방지)
app.use((req, res, next) => {
  if (typeof res.locals.title === 'undefined') res.locals.title = '동아리 일정';
  next();
});
app.use(demoAuth);

app.use('/auth', authRouter);
app.use('/club', clubRouter);
app.use('/events', eventRouter);
app.use('/availability', availabilityRouter);
app.use('/votes', voteRouter);
app.use('/todos', todoRouter);

app.get('/', (req,res)=> res.render('index'));

export default app;

