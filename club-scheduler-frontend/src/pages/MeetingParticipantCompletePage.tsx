import React, { useState, useEffect } from 'react';
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

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  flex-direction: column;
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

const HeatmapButton = styled.button`
  width: 100%;
  padding: ${spacing.lg};
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
  }
`;

const MeetingParticipantCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [eventsID, setEventsID] = useState<string | null>(null);

  useEffect(() => {
    // location.state에서 eventsID 또는 meetingId 가져오기
    if (location.state) {
      const stateEventsID = location.state.eventsID || location.state.meetingId;
      setEventsID(stateEventsID);
    }
    
    // URL 파라미터에서도 확인
    const urlParams = new URLSearchParams(window.location.search);
    const urlEventsID = urlParams.get('eventsID') || urlParams.get('meetingId');
    if (urlEventsID) {
      setEventsID(urlEventsID);
    }
  }, [location.state]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewHeatmap = () => {
    if (eventsID) {
      navigate(`/availability/heatmap?eventsID=${eventsID}`);
    } else {
      alert('가용시간 확인을 위한 데이터가 없습니다.');
    }
  };

  return (
    <PageContainer>
      <ContentCard>
        <Title>가용 시간 등록 완료!</Title>
        <Subtitle>
          가용 시간이 성공적으로 등록되었습니다.<br />
          모임 주최자가 최종 일정을 확정하면 알려드릴게요.
        </Subtitle>
        
        <ButtonContainer>
          <HeatmapButton onClick={handleViewHeatmap}>
            팀원들 가용시간 확인하기
          </HeatmapButton>
          <HomeButton onClick={handleGoHome}>
            홈화면으로 돌아가기
          </HomeButton>
        </ButtonContainer>
      </ContentCard>
    </PageContainer>
  );
};

export default MeetingParticipantCompletePage;

