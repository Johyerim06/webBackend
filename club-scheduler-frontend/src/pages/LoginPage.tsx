import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const LoginContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
`;

const LoginCard = styled.div`
  max-width: 400px;
  width: 100%;
  padding: ${spacing['2xl']};
  background: ${colors.background};
  border-radius: 16px;
  box-shadow: ${shadows.xl};
  border: 1px solid ${colors.border};
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
`;

const LogoMain = styled.h1`
  color: ${colors.textPrimary};
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.korean};
  margin: 0 0 ${spacing.xs} 0;
  line-height: ${typography.lineHeight.tight};
`;

const LogoSub = styled.span`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.normal};
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
  color: ${colors.textPrimary};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.semibold};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: ${spacing.lg};
  border: 1px solid ${props => props.$hasError ? colors.error : colors.border};
  border-radius: 12px;
  font-size: ${typography.fontSize.base};
  font-family: ${typography.fontFamily.primary};
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? colors.error : colors.primary};
  }
  
  &::placeholder {
    color: ${colors.textLight};
  }
`;

const FieldError = styled.div`
  color: ${colors.error};
  font-size: ${typography.fontSize.sm};
  margin-top: ${spacing.xs};
  padding-left: ${spacing.sm};
`;

const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoginButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  padding: ${spacing.lg};
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${colors.primaryHover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.error};
  font-size: ${typography.fontSize.sm};
  text-align: center;
  padding: ${spacing.sm};
  background-color: #FEF2F2;
  border-radius: 8px;
  border: 1px solid #FECACA;
`;

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 전체 유효성 검사
    const emailError = validateField('email', credentials.email);
    const passwordError = validateField('password', credentials.password);

    setValidationErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      setError('입력 정보를 확인해주세요.');
      setLoading(false);
      return;
    }

    try {
      await login(credentials);
      // 로그인 성공 시 홈페이지로 이동
      navigate('/');
    } catch (err: any) {
      console.log('Login error:', err.response?.data);
      setError(err.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 유효성 검사 함수
  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = '이메일을 입력해주세요';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = '올바른 이메일 형식을 입력해주세요';
        }
        break;
        
      case 'password':
        if (!value) {
          error = '비밀번호를 입력해주세요';
        }
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setCredentials({
      ...credentials,
      [name]: value,
    });
    
    // 실시간 유효성 검사
    const error = validateField(name, value);
    setValidationErrors({
      ...validationErrors,
      [name]: error,
    });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <LogoMain>우리밋</LogoMain>
          <LogoSub>ur meet</LogoSub>
        </LogoSection>
        
        <Title>로그인</Title>
        
        <Form onSubmit={handleSubmit}>
          <FieldContainer>
            <Input
              type="email"
              name="email"
              placeholder="이메일"
              value={credentials.email}
              onChange={handleChange}
              $hasError={!!validationErrors.email}
              required
            />
            {validationErrors.email && <FieldError>{validationErrors.email}</FieldError>}
          </FieldContainer>
          
          <FieldContainer>
            <Input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={credentials.password}
              onChange={handleChange}
              $hasError={!!validationErrors.password}
              required
            />
            {validationErrors.password && <FieldError>{validationErrors.password}</FieldError>}
          </FieldContainer>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <LoginButton type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </LoginButton>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;
