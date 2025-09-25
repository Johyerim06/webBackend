import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xl};
`;

const ContentCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: ${spacing['4xl']};
  box-shadow: ${shadows.xl};
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.lg};
`;

const Subtitle = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.textSecondary};
  margin-bottom: ${spacing['2xl']};
  line-height: 1.6;
`;

const HomeButton = styled.button`
  width: 100%;
  padding: ${spacing.lg};
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${colors.primaryHover};
    transform: translateY(-2px);
  }
`;

const MeetingParticipantCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <ContentCard>
        <Title>가용 시간 등록 완료!</Title>
        <Subtitle>
          가용 시간이 성공적으로 등록되었습니다.<br />
          모임 주최자가 최종 일정을 확정하면 알려드릴게요.
        </Subtitle>
        
        <HomeButton onClick={handleGoHome}>
          홈화면으로 돌아가기
        </HomeButton>
      </ContentCard>
    </PageContainer>
  );
};

export default MeetingParticipantCompletePage;

