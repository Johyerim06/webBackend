import { Router } from 'express';
import { getAuthUrl, exchangeToken, getMe } from '../services/kakao.service.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
export const authRouter = Router();

// 추후 카카오 OAuth 콜백/토큰 발급 라우트 추가 예정
authRouter.get('/health', (_,res)=> res.json({ ok: true }));

// 데모 로그인 폼
authRouter.get('/login', (req,res)=>{
  res.render('index', { title: '로그인', loginDemo: true });
});

// 데모 로그인(쿠키 세팅)
authRouter.post('/login', (req,res)=>{
  const uid = (req.body?.uid || '').trim();
  const valid = /^[0-9a-fA-F]{24}$/.test(uid);
  const finalUid = valid ? uid : '000000000000000000000001';
  res.cookie('uid', finalUid, { httpOnly: true });
  res.redirect('back');
});

// 로그아웃(쿠키 삭제)
authRouter.post('/logout', (req,res)=>{
  res.clearCookie('uid');
  res.redirect('back');
});

// 로컬: 로그인/회원가입/비번찾기 화면
authRouter.get('/signin', (req,res)=>{
  res.render('auth_signin', { title: '로그인' });
});
authRouter.get('/signup', (req,res)=>{
  res.render('auth_signup', { title: '회원가입' });
});
authRouter.get('/forgot', (req,res)=>{
  res.render('auth_forgot', { title: '비밀번호 찾기' });
});

// 작성하신 views/login.html을 직접 미리보기
authRouter.get('/preview/login', (req,res)=>{
  res.render('login', { title: '로그인(미리보기)' });
});

// 로컬: 회원가입
authRouter.post('/signup', async (req,res)=>{
  const { email, password, name } = req.body || {};
  if(!email || !password) return res.status(400).send('email and password required');
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash, name: name || email.split('@')[0] });
  res.cookie('uid', String(user._id), { httpOnly: true });
  res.redirect('/');
});

// 로컬: 로그인
authRouter.post('/signin', async (req,res)=>{
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if(!user) return res.status(401).send('invalid credentials');
  const ok = await bcrypt.compare(password || '', user.passwordHash || '');
  if(!ok) return res.status(401).send('invalid credentials');
  res.cookie('uid', String(user._id), { httpOnly: true });
  res.redirect('/');
});

// 로컬: 비밀번호 초기화(데모. 실제로는 토큰 이메일 발송 필요)
authRouter.post('/forgot', async (req,res)=>{
  const { email } = req.body || {};
  if(!email) return res.status(400).send('email required');
  const user = await User.findOne({ email });
  if(!user) return res.status(200).send('ok');
  const hash = await bcrypt.hash('changeme123', 10);
  user.passwordHash = hash;
  await user.save();
  res.send('temporary password set: changeme123');
});

// Kakao OAuth 시작
authRouter.get('/kakao', (req,res)=>{
  const url = getAuthUrl('todo');
  res.redirect(url);
});

// Kakao OAuth 콜백
authRouter.get('/kakao/callback', async (req,res)=>{
  try{
    const { code, error } = req.query;
    
    // 에러 처리
    if (error) {
      console.error('[KAKAO] OAuth error:', error);
      return res.status(400).send(`카카오 로그인 에러: ${error}`);
    }
    
    if(!code) {
      console.error('[KAKAO] No authorization code received');
      return res.status(400).send('인증 코드가 없습니다');
    }
    
    console.log('[KAKAO] Authorization code received:', code);
    
    const token = await exchangeToken(code);
    console.log('[KAKAO] Token exchange successful');
    
    const me = await getMe(token.access_token);
    console.log('[KAKAO] User info retrieved:', me.id);
    
    const kakaoId = String(me.id);
    const user = await User.findOneAndUpdate(
      { kakaoId },
      {
        kakaoId,
        name: me.properties?.nickname || '카카오유저',
        profileImage: me.properties?.profile_image || ''
      },
      { upsert: true, new: true }
    );
    
    console.log('[KAKAO] User created/updated:', user._id);
    res.cookie('uid', String(user._id), { httpOnly: true });
    res.redirect('/');
  }catch(err){
    console.error('[KAKAO] callback error:', err?.response?.data || err?.message || err);
    res.status(500).send(`카카오 로그인 실패: ${err?.message || '알 수 없는 오류'}`);
  }
});