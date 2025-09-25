import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing.xl} ${spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  max-width: 600px;
  width: 100%;
  background-color: ${colors.background};
  border-radius: 16px;
  padding: ${spacing.xxl};
  box-shadow: ${shadows.large};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize.xxl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.lg};
`;

const Description = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.textSecondary};
  margin-bottom: ${spacing.xxl};
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
  align-items: center;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg} ${spacing.xl};
  background-color: ${colors.primary};
  color: ${colors.background};
  text-decoration: none;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  transition: all 0.2s ease;
  min-width: 280px;

  &:hover {
    background-color: ${colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg} ${spacing.xl};
  background-color: ${colors.background};
  color: ${colors.primary};
  text-decoration: none;
  border: 2px solid ${colors.primary};
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  transition: all 0.2s ease;
  min-width: 280px;

  &:hover {
    background-color: ${colors.primary};
    color: ${colors.background};
    transform: translateY(-2px);
  }
`;

const CheckIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${colors.success};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${spacing.xl};
  font-size: 40px;
  color: ${colors.background};
`;

const ScheduleCompletePage: React.FC = () => {
  return (
    <PageContainer>
      <ContentContainer>
        <CheckIcon>✓</CheckIcon>
        <Title>시간표 설정이 완료되었어요</Title>
        <Description>
          모임의 시간표가 성공적으로 설정되었습니다.<br />
          이제 멤버들과 함께 일정을 관리할 수 있습니다.
        </Description>
        
        <ButtonContainer>
          <PrimaryButton to="/schedule">
            내 시간표 확인하기
          </PrimaryButton>
          <SecondaryButton to="/">
            홈화면으로 이동하기
          </SecondaryButton>
        </ButtonContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default ScheduleCompletePage;
