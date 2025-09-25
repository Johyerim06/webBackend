import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const SignupContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
`;

const SignupCard = styled.div`
  max-width: 400px;
  width: 100%;
  padding: ${spacing['2xl']};
  background: ${colors.background};
  border-radius: 16px;
  box-shadow: ${shadows.xl};
  border: 1px solid ${colors.border};
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: ${spacing['2xl']};
`;

const Title = styled.h1`
  color: ${colors.textPrimary};
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.korean};
  margin: 0 0 ${spacing.md} 0;
  line-height: ${typography.lineHeight.tight};
`;

const Description = styled.p`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.normal};
  line-height: ${typography.lineHeight.relaxed};
  margin: 0;
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin: ${spacing.md} 0;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${colors.primary};
`;

const CheckboxLabel = styled.label`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.normal};
  cursor: pointer;
  line-height: ${typography.lineHeight.normal};
`;

const SignupButton = styled.button`
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

const SuccessMessage = styled.div`
  color: ${colors.success};
  font-size: ${typography.fontSize.sm};
  text-align: center;
  padding: ${spacing.sm};
  background-color: #F0FDF4;
  border-radius: 8px;
  border: 1px solid #BBF7D0;
`;

const InfoMessage = styled.div`
  color: ${colors.primary};
  font-size: ${typography.fontSize.sm};
  text-align: center;
  padding: ${spacing.sm};
  background-color: #EFF6FF;
  border-radius: 8px;
  border: 1px solid #BFDBFE;
  margin-bottom: ${spacing.lg};
`;

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // 리다이렉트 경로 가져오기
  const redirectTo = location.state?.redirectTo || '/';
  const message = location.state?.message || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 전체 유효성 검사
    const nameError = validateField('name', formData.name);
    const emailError = validateField('email', formData.email);
    const passwordError = validateField('password', formData.password);

    setValidationErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });

    if (nameError || emailError || passwordError) {
      setError('입력 정보를 확인해주세요.');
      return;
    }

    if (!agreed) {
      setError('회원가입을 위한 정보제공에 동의해주세요.');
      return;
    }

    setLoading(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('회원가입이 완료되었습니다!');
      // 회원가입 성공 후 리다이렉트 경로로 이동
      setTimeout(() => {
        navigate(redirectTo);
      }, 1500); // 1.5초 후 이동
    } catch (err: any) {
      console.log('Signup error:', err.response?.data);
      setError(err.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 유효성 검사 함수
  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = '이름을 입력해주세요';
        } else if (value.trim().length < 2) {
          error = '이름은 최소 2자 이상이어야 합니다';
        } else if (value.trim().length > 20) {
          error = '이름은 최대 20자까지 입력 가능합니다';
        }
        break;
        
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
        } else if (value.length < 6) {
          error = '비밀번호는 최소 6자 이상이어야 합니다';
        } else if (value.length > 50) {
          error = '비밀번호는 최대 50자까지 입력 가능합니다';
        } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
          error = '비밀번호는 영문과 숫자를 포함해야 합니다';
        }
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setAgreed(checked);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      
      // 실시간 유효성 검사
      const error = validateField(name, value);
      setValidationErrors({
        ...validationErrors,
        [name]: error,
      });
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <TitleSection>
          <Title>회원가입</Title>
          <Description>
            회원가입을 하시고, 우리밋(Ur Meet) 서비스를 이용해보세요!
          </Description>
        </TitleSection>
        
        {message && <InfoMessage>{message}</InfoMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FieldContainer>
            <Input
              type="text"
              name="name"
              placeholder="이름 입력"
              value={formData.name}
              onChange={handleChange}
              $hasError={!!validationErrors.name}
              required
            />
            {validationErrors.name && <FieldError>{validationErrors.name}</FieldError>}
          </FieldContainer>
          
          <FieldContainer>
            <Input
              type="email"
              name="email"
              placeholder="이메일 주소 입력"
              value={formData.email}
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
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
              $hasError={!!validationErrors.password}
              required
            />
            {validationErrors.password && <FieldError>{validationErrors.password}</FieldError>}
          </FieldContainer>
          
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={handleChange}
            />
            <CheckboxLabel htmlFor="agreement">
              회원가입을 위한 정보제공에 동의합니다.
            </CheckboxLabel>
          </CheckboxContainer>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <SignupButton type="submit" disabled={loading}>
            {loading ? '회원가입 중...' : '회원가입하기'}
          </SignupButton>
        </Form>
      </SignupCard>
    </SignupContainer>
  );
};

export default SignupPage;
