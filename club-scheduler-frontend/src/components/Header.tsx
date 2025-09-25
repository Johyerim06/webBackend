import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors, typography, spacing } from '../styles/design-tokens';

const HeaderContainer = styled.header`
  background-color: ${colors.background};
  padding: ${spacing.lg} ${spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LogoMain = styled.h1`
  color: ${colors.textPrimary};
  font-size: ${typography.fontSize['2xl']};
  font-weight: ${typography.fontWeight.bold};
  font-family: ${typography.fontFamily.korean};
  margin: 0;
  line-height: ${typography.lineHeight.tight};
`;

const LogoSub = styled.span`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.normal};
  margin-top: ${spacing.xs};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const SignInButton = styled(Link)`
  background: transparent;
  color: ${colors.primary};
  border: none;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: 8px;
  transition: background-color 0.2s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background-color: ${colors.backgroundSecondary};
  }
`;

const LoginButton = styled(Link)`
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: 8px;
  transition: background-color 0.2s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  margin-top: ${spacing.xs};
`;

const UserWelcomeButton = styled.button`
  background-color: ${colors.background};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.border};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  padding: ${spacing.sm} ${spacing.lg};
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  position: relative;

  &:hover {
    background-color: ${colors.backgroundSecondary};
    border-color: ${colors.primary};
  }
`;

const UserDropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${DropdownMenu} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: ${spacing.md} ${spacing.lg};
  color: ${colors.textPrimary};
  text-decoration: none;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.normal};
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${colors.backgroundSecondary};
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: ${spacing.md} ${spacing.lg};
  color: ${colors.textPrimary};
  background: none;
  border: none;
  text-align: left;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.normal};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.backgroundSecondary};
  }
`;

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <HeaderContainer>
      <LogoSection>
        <LogoMain>우리밋</LogoMain>
        <LogoSub>ur meet</LogoSub>
      </LogoSection>
      
      <UserSection>
        {user ? (
          <UserDropdownContainer>
            <UserWelcomeButton>
              {user.name || user.username || '사용자'}님, 안녕하세요 👋
            </UserWelcomeButton>
            <DropdownMenu>
              <DropdownItem to="/clubs">내 모임 보기</DropdownItem>
              <DropdownItem to="/schedule">시간표 관리하기</DropdownItem>
              <DropdownItem to="/event-management">일정 관리하기</DropdownItem>
              <DropdownButton onClick={handleLogout}>로그아웃</DropdownButton>
            </DropdownMenu>
          </UserDropdownContainer>
        ) : (
          <>
            <SignInButton to="/login">Sign in</SignInButton>
            <LoginButton to="/signup">회원가입</LoginButton>
          </>
        )}
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
