export function demoAuth(req, res, next){
  // 쿠키 우선, 그다음 헤더. 기본값은 제거해 비로그인 상태를 명확히 구분
  const uid = req.cookies?.uid || req.header('x-user-id') || null;
  req.userId = uid || undefined;
  res.locals.userId = uid || undefined;
  next();
}
