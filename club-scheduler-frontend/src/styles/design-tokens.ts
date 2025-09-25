// 피그마 디자인에서 추출한 디자인 토큰들

export const colors = {
  // Primary Colors
  primary: '#007AFF', // 파란색 (버튼, 로고)
  primaryHover: '#0056CC',
  primaryDark: '#0056CC',
  
  // Text Colors
  textPrimary: '#000000', // 검은색 (메인 텍스트)
  textSecondary: '#666666', // 회색 (서브 텍스트)
  textLight: '#999999', // 연한 회색
  
  // Background Colors
  background: '#FFFFFF', // 흰색 배경
  backgroundSecondary: '#F8F9FA', // 연한 회색 배경
  
  // Border Colors
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  
  // Status Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
};

export const typography = {
  // Font Families
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    korean: '"Noto Sans KR", "Malgun Gothic", sans-serif',
  },
  
  // Font Sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  
  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%',
};

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  large: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
