import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xl};
`;

const ContentContainer = styled.div`
  background-color: ${colors.background};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: ${spacing.xxl};
  box-shadow: ${shadows.large};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.xl};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  margin-top: ${spacing.xl};
`;

const PrimaryButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  border-radius: 12px;
  padding: ${spacing.lg} ${spacing.xl};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  background-color: ${colors.background};
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
  border-radius: 12px;
  padding: ${spacing.lg} ${spacing.xl};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primary};
    color: ${colors.background};
    transform: translateY(-2px);
  }
`;

const ScheduleModifiedCompletePage: React.FC = () => {
  const navigate = useNavigate();

  const handleCheckSchedule = () => {
    navigate('/event-management');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Title>일정 등록이 완료되었어요</Title>
        
        <ButtonContainer>
          <PrimaryButton onClick={handleCheckSchedule}>
            내 일정 확인하기
          </PrimaryButton>
          <SecondaryButton onClick={handleGoHome}>
            홈 화면으로 가기
          </SecondaryButton>
        </ButtonContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default ScheduleModifiedCompletePage;

