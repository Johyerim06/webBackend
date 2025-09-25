import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
`;

const ContentCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: ${spacing.xxl};
  box-shadow: ${shadows.large};
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize.xxl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.lg};
  line-height: 1.3;
`;

const Description = styled.div`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.base};
  line-height: 1.6;
  margin-bottom: ${spacing.xl};
  
  p {
    margin-bottom: ${spacing.sm};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const PrimaryButton = styled.button`
  background-color: ${colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${colors.primaryDark};
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
  border-radius: 8px;
  padding: ${spacing.md} ${spacing.lg};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${colors.primary};
    color: white;
  }
`;

const MeetingJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('id') || '';

  const handleLoginAndLoad = () => {
    // 로그인 페이지로 이동 (기존 사용자)
    navigate('/login', { 
      state: { 
        redirectTo: `/meeting/participant?id=${meetingId}`,
        message: '로그인 후 모임에 참여하세요.'
      } 
    });
  };

  const handleStartFresh = () => {
    // 새로운 사용자로 모임 참여
    navigate(`/meeting/participant?id=${meetingId}`);
  };

  return (
    <PageContainer>
      <ContentCard>
        <Title>○○모임 일정을 정해 보세요</Title>
        
        <Description>
          <p>내 가용 시간을 등록하고 친구, 팀원들과 겹치는 시간을 볼 수 있어요.</p>
          <p>간단한 로그인 후 일정을 공유해보세요!</p>
        </Description>
        
        <ButtonContainer>
          <PrimaryButton onClick={handleLoginAndLoad}>
            로그인하고 저장된 내용으로 가용시간을 불러올래요.
          </PrimaryButton>
          
          <SecondaryButton onClick={handleStartFresh}>
            괜찮아요, 처음부터 다시 등록할게요
          </SecondaryButton>
        </ButtonContainer>
      </ContentCard>
    </PageContainer>
  );
};

export default MeetingJoinPage;
