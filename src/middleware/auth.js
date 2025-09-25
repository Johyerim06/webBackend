import { User } from '../models/User.js';

export function auth(req, res, next){
  // 쿠키에서 사용자 ID 가져오기
  const uid = req.cookies?.uid || req.header('x-user-id') || null;
  
  if (uid) {
    // 유효한 ObjectId 형식인지 확인
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(uid);
    if (isValidObjectId) {
      req.userId = uid;
      res.locals.userId = uid;
    } else {
      req.userId = undefined;
      res.locals.userId = undefined;
    }
  } else {
    req.userId = undefined;
    res.locals.userId = undefined;
  }
  
  next();
}

// 로그인이 필요한 라우트를 위한 미들웨어
export function requireAuth(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }
  next();
}

// 관리자 권한이 필요한 라우트를 위한 미들웨어
export async function requireAdmin(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: '로그인이 필요합니다' });
  }
  
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다' });
    }
    
    // 관리자 권한 확인 로직 (예: 특정 이메일 도메인 또는 role 필드)
    const isAdmin = user.email?.endsWith('@admin.com') || user.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ error: '관리자 권한이 필요합니다' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('[AUTH] Admin check error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
}
