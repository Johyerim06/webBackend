import { Router } from 'express';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
export const authRouter = Router();

authRouter.get('/health', (_,res)=> res.json({ ok: true }));


// 로그아웃(쿠키 삭제)
authRouter.post('/logout', (req,res)=>{
  res.clearCookie('uid');
  
  // API 요청인 경우 JSON 응답, 일반 요청인 경우 리다이렉트
  if (req.headers['content-type']?.includes('application/json') || req.headers['accept']?.includes('application/json')) {
    res.json({ message: '로그아웃되었습니다' });
  } else {
    res.redirect('back');
  }
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


// 로컬: 회원가입
authRouter.post('/signup', async (req,res)=>{
  try {
    console.log('[AUTH] Signup request body:', req.body);
    const { email, password, name } = req.body || {};
    
    // 입력 검증
    if(!email || !password) {
      console.log('[AUTH] Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({ error: '이메일과 비밀번호는 필수입니다' });
    }
    
    if(password.length < 6) {
      console.log('[AUTH] Password too short:', password.length);
      return res.status(400).json({ error: '비밀번호는 최소 6자 이상이어야 합니다' });
    }
    
    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      console.log('[AUTH] Email already exists:', email);
      return res.status(400).json({ error: '이미 존재하는 이메일입니다' });
    }
    
    const hash = await bcrypt.hash(password, 12);
    console.log('[AUTH] Creating user with data:', { email, name: name || email.split('@')[0] });
    
    const user = await User.create({ 
      email, 
      passwordHash: hash, 
      name: name || email.split('@')[0] 
    });
    
    console.log('[AUTH] User created successfully:', { 
      id: user._id, 
      email: user.email, 
      name: user.name,
      database: user.db?.databaseName || 'unknown'
    });
    
    res.cookie('uid', String(user._id), { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // API 요청인 경우 JSON 응답, 일반 요청인 경우 리다이렉트
    if (req.headers['content-type']?.includes('application/json') || req.headers['accept']?.includes('application/json')) {
      res.json({ 
        user: {
          id: user._id,
          name: user.name,
          username: user.name, // 호환성을 위해
          email: user.email,
          role: 'member'
        },
        token: 'dummy-token' // 실제로는 JWT 토큰을 사용해야 함
      });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('[AUTH] Signup error:', error);
    console.error('[AUTH] Error details:', error.message);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다' });
  }
});

// 로컬: 로그인
authRouter.post('/signin', async (req,res)=>{
  try {
    console.log('[AUTH] Signin request body:', req.body);
    console.log('[AUTH] Signin headers:', req.headers);
    const { email, password } = req.body || {};
    
    if(!email || !password) {
      console.log('[AUTH] Missing fields:', { email: !!email, password: !!password });
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요' });
    }
    
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if(!isValidPassword) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
    }
    
    res.cookie('uid', String(user._id), { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // API 요청인 경우 JSON 응답, 일반 요청인 경우 리다이렉트
    if (req.headers['content-type']?.includes('application/json') || req.headers['accept']?.includes('application/json')) {
      res.json({ 
        user: {
          id: user._id,
          name: user.name,
          username: user.name, // 호환성을 위해
          email: user.email,
          role: 'member'
        },
        token: 'dummy-token' // 실제로는 JWT 토큰을 사용해야 함
      });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error('[AUTH] Signin error:', error);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다' });
  }
});

// 로컬: 비밀번호 초기화(데모. 실제로는 토큰 이메일 발송 필요)
authRouter.post('/forgot', async (req,res)=>{
  try {
    const { email } = req.body || {};
    if(!email) {
      return res.status(400).json({ error: '이메일을 입력해주세요' });
    }
    
    const user = await User.findOne({ email });
    if(!user) {
      // 보안상 사용자가 존재하지 않아도 성공 메시지 반환
      return res.status(200).json({ message: '비밀번호 재설정 링크가 이메일로 전송되었습니다' });
    }
    
    // 임시 비밀번호 생성 (실제로는 토큰 기반 재설정 링크를 이메일로 발송)
    const tempPassword = 'changeme123';
    const hash = await bcrypt.hash(tempPassword, 12);
    user.passwordHash = hash;
    await user.save();
    
    res.status(200).json({ 
      message: '임시 비밀번호가 설정되었습니다',
      tempPassword: tempPassword // 개발 환경에서만 표시
    });
  } catch (error) {
    console.error('[AUTH] Forgot password error:', error);
    res.status(500).json({ error: '비밀번호 재설정 중 오류가 발생했습니다' });
  }
});
