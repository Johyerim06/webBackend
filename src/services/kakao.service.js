import axios from 'axios';
import { config } from '../config/env.js';

export function getAuthUrl(state = ''){
  const base = 'https://kauth.kakao.com/oauth/authorize';
  const params = new URLSearchParams({
    client_id: config.KAKAO.REST_API_KEY,
    redirect_uri: config.KAKAO.REDIRECT_URI,
    response_type: 'code',
    state
  });
  return `${base}?${params.toString()}`;
}

export async function exchangeToken(code){
  const url = 'https://kauth.kakao.com/oauth/token';
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.KAKAO.REST_API_KEY,
    redirect_uri: config.KAKAO.REDIRECT_URI,
    code
  });
  if (config.KAKAO.CLIENT_SECRET) body.append('client_secret', config.KAKAO.CLIENT_SECRET);
  const res = await axios.post(url, body.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return res.data; // { access_token, refresh_token, ... }
}

export async function getMe(accessToken){
  const url = 'https://kapi.kakao.com/v2/user/me';
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${accessToken}` }});
  return res.data; // { id, kakao_account, properties }
}

export async function sendToMe(accessToken, text){
  // 카카오 "나에게 보내기" (액세스 토큰 필요)
  // 실제 사용 전: 카카오 개발자 콘솔에서 권한/동의항목 설정 필수
  const url = 'https://kapi.kakao.com/v2/api/talk/memo/default/send';
  const body = {
    template_object: {
      object_type: 'text',
      text,
      link: { web_url: 'https://example.com', mobile_web_url: 'https://example.com' }
    }
  };
  const res = await axios.post(url, body, { headers: { Authorization: `Bearer ${accessToken}` }});
  return res.data;
}
