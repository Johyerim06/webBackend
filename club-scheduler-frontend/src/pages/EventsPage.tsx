import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing.xl} ${spacing.lg};
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: ${colors.background};
  border-radius: 16px;
  padding: ${spacing.xl};
  box-shadow: ${shadows.large};
`;

const Title = styled.h1`
  font-size: ${typography.fontSize.xxl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const Section = styled.div`
  margin-bottom: ${spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.lg};
`;

const EventCard = styled.div`
  background-color: ${colors.backgroundSecondary};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: ${spacing.lg};
  margin-bottom: ${spacing.md};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.primary};
    box-shadow: ${shadows.md};
  }
`;

const EventTitle = styled.h3`
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin: 0 0 ${spacing.sm} 0;
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
  margin-bottom: ${spacing.md};
`;

const EventDetail = styled.span`
  font-size: ${typography.fontSize.sm};
  color: ${colors.textSecondary};
`;

const EventActions = styled.div`
  display: flex;
  gap: ${spacing.sm};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${spacing.sm} ${spacing.md};
  border: none;
  border-radius: 8px;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.$variant === 'primary' ? `
    background-color: ${colors.primary};
    color: ${colors.background};
    
    &:hover {
      background-color: ${colors.primaryHover};
    }
  ` : `
    background-color: ${colors.background};
    color: ${colors.textPrimary};
    border: 1px solid ${colors.border};
    
    &:hover {
      background-color: ${colors.backgroundSecondary};
    }
  `}
`;

const CreateButton = styled.button`
  width: 100%;
  padding: ${spacing.lg};
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${spacing.xl};

  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing.xxl} ${spacing.lg};
  color: ${colors.textSecondary};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.md};
`;

const EmptyStateText = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.textSecondary};
  margin-bottom: ${spacing.lg};
`;

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 이벤트 데이터 로드
    const loadEvents = async () => {
      try {
        setLoading(true);
        // 임시 데이터
        const mockEvents = [
          {
            id: '1',
            title: '팀 미팅',
            date: '2025-09-25',
            time: '14:00',
            location: '회의실 A',
            description: '주간 팀 미팅'
          },
          {
            id: '2',
            title: '프로젝트 리뷰',
            date: '2025-09-26',
            time: '10:00',
            location: '온라인',
            description: '프로젝트 진행 상황 리뷰'
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error('이벤트 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleCreateEvent = () => {
    // TODO: 새 이벤트 생성 페이지로 이동
    console.log('새 이벤트 생성');
  };

  const handleEditEvent = (eventId: string) => {
    // TODO: 이벤트 수정 페이지로 이동
    console.log('이벤트 수정:', eventId);
  };

  const handleDeleteEvent = (eventId: string) => {
    // TODO: 이벤트 삭제
    console.log('이벤트 삭제:', eventId);
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Title>일정 관리</Title>
        
        <CreateButton onClick={handleCreateEvent}>
          새 일정 만들기
        </CreateButton>

        <Section>
          <SectionTitle>내 일정</SectionTitle>
          
          {loading ? (
            <EmptyState>
              <EmptyStateText>일정을 불러오는 중...</EmptyStateText>
            </EmptyState>
          ) : events.length === 0 ? (
            <EmptyState>
              <EmptyStateTitle>아직 등록된 일정이 없습니다</EmptyStateTitle>
              <EmptyStateText>
                "새 일정 만들기" 버튼을 클릭하여 첫 번째 일정을 만들어보세요.
              </EmptyStateText>
            </EmptyState>
          ) : (
            events.map(event => (
              <EventCard key={event.id}>
                <EventTitle>{event.title}</EventTitle>
                <EventDetails>
                  <EventDetail>📅 날짜: {event.date}</EventDetail>
                  <EventDetail>🕐 시간: {event.time}</EventDetail>
                  <EventDetail>📍 장소: {event.location}</EventDetail>
                  <EventDetail>📝 설명: {event.description}</EventDetail>
                </EventDetails>
                <EventActions>
                  <ActionButton 
                    $variant="primary" 
                    onClick={() => handleEditEvent(event.id)}
                  >
                    수정
                  </ActionButton>
                  <ActionButton 
                    $variant="secondary" 
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    삭제
                  </ActionButton>
                </EventActions>
              </EventCard>
            ))
          )}
        </Section>
      </ContentContainer>
    </PageContainer>
  );
};

export default EventsPage;
