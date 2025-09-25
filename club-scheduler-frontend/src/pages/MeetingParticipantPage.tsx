import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';
import { getMeeting, addParticipant } from '../services/meetingService';
import { Meeting, Availability, TimeSlot } from '../services/meetingService';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing.xl};
`;

const ContentCard = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: ${spacing.xxl};
  box-shadow: ${shadows.large};
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize.xxl};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
  text-align: center;
`;

const Description = styled.div`
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.base};
  line-height: 1.6;
  margin-bottom: ${spacing.xl};
  text-align: center;
  
  p {
    margin-bottom: ${spacing.xs};
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const CalendarSection = styled.div`
  background-color: ${colors.backgroundSecondary};
  border-radius: 12px;
  padding: ${spacing.lg};
`;

const CalendarTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.md};
`;

const CalendarContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: ${spacing.md};
  box-shadow: ${shadows.sm};
`;

const TimeSection = styled.div`
  background-color: ${colors.backgroundSecondary};
  border-radius: 12px;
  padding: ${spacing.lg};
`;

const TimeLabel = styled.label`
  display: block;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
`;

const TimeInput = styled.input`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: ${typography.fontSize.base};
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const TimeButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-top: ${spacing.sm};
`;

const TimeButton = styled.button<{ $active?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${props => props.$active ? colors.primary : '#e0e0e0'};
  border-radius: 6px;
  background-color: ${props => props.$active ? colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : colors.textPrimary};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary};
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScheduleSection = styled.div`
  background-color: ${colors.backgroundSecondary};
  border-radius: 12px;
  padding: ${spacing.lg};
  flex: 1;
`;

const ScheduleTitle = styled.h3`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.md};
`;

const ScheduleGrid = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: ${spacing.md};
  box-shadow: ${shadows.sm};
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textSecondary};
  font-size: ${typography.fontSize.base};
`;

const CompleteButton = styled.button`
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
  margin-top: ${spacing.lg};
  
  &:hover {
    background-color: ${colors.primaryHover};
    transform: translateY(-2px);
  }
`;

const MeetingParticipantPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const meetingId = searchParams.get('id') || '';
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [timePeriod, setTimePeriod] = useState<'AM' | 'PM'>('AM');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMeeting = async () => {
      if (!meetingId) {
        alert('모임 ID가 없습니다.');
        navigate('/');
        return;
      }
      
      try {
        const meetingData = await getMeeting(meetingId);
        setMeeting(meetingData);
      } catch (error) {
        console.error('모임 정보 로드 오류:', error);
        alert('모임 정보를 불러오는데 실패했습니다.');
        navigate('/');
      }
    };
    
    loadMeeting();
  }, [meetingId, navigate]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const handleTimePeriodChange = (period: 'AM' | 'PM') => {
    setTimePeriod(period);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDates(prev => {
      const dateStr = date.toISOString().split('T')[0];
      const isSelected = prev.some(d => d.toISOString().split('T')[0] === dateStr);
      
      if (isSelected) {
        return prev.filter(d => d.toISOString().split('T')[0] !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleComplete = async () => {
    if (!participantName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!participantEmail.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (selectedDates.length === 0) {
      alert('가용 날짜를 선택해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 가용시간 데이터 구성
      const availability: Availability[] = selectedDates.map(date => ({
        date: date.toISOString().split('T')[0],
        timeSlots: [{
          startTime: selectedTime,
          endTime: selectedTime // 실제로는 종료 시간도 설정해야 함
        }]
      }));
      
      // API를 통해 참여자 등록
      await addParticipant(meetingId, {
        name: participantName,
        email: participantEmail,
        availability
      });
      
      // 완료 페이지로 이동
      navigate('/meeting/participant-complete', { 
        state: { 
          meetingId,
          participantName
        } 
      });
    } catch (error) {
      console.error('가용시간 등록 오류:', error);
      alert('가용시간 등록에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ContentCard>
        <Title>{meeting?.name || '모임'} 가용 시간을 설정해주세요</Title>
        
        <Description>
          <p>선택된 기간의 가용 시간을 선택해주세요</p>
          <p>해당하는 날짜 및 시간에 마우스를 꾹 누르고 드래그하면 선택할 수 있어요.</p>
        </Description>
        
        <MainContent>
          <LeftPanel>
            <CalendarSection>
              <CalendarTitle>참여자 정보</CalendarTitle>
              <div style={{ marginBottom: spacing.md }}>
                <TimeLabel>이름</TimeLabel>
                <TimeInput
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>
              <div style={{ marginBottom: spacing.md }}>
                <TimeLabel>이메일</TimeLabel>
                <TimeInput
                  type="email"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </CalendarSection>
            
            <CalendarSection>
              <CalendarTitle>날짜 선택</CalendarTitle>
              <CalendarContainer>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: '200px',
                  color: colors.textSecondary,
                  fontSize: typography.fontSize.base
                }}>
                  달력 컴포넌트
                </div>
              </CalendarContainer>
            </CalendarSection>
            
            <TimeSection>
              <TimeLabel>시간</TimeLabel>
              <TimeInput
                type="time"
                value={selectedTime}
                onChange={handleTimeChange}
              />
              <TimeButtons>
                <TimeButton 
                  $active={timePeriod === 'AM'} 
                  onClick={() => handleTimePeriodChange('AM')}
                >
                  AM
                </TimeButton>
                <TimeButton 
                  $active={timePeriod === 'PM'} 
                  onClick={() => handleTimePeriodChange('PM')}
                >
                  PM
                </TimeButton>
              </TimeButtons>
            </TimeSection>
          </LeftPanel>
          
          <RightPanel>
            <ScheduleSection>
              <ScheduleTitle>시간표</ScheduleTitle>
              <ScheduleGrid>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.textPrimary,
                    marginBottom: spacing.sm
                  }}>
                    PRIMARY TEXT
                  </div>
                  <div style={{ 
                    fontSize: typography.fontSize.base,
                    color: colors.textSecondary
                  }}>
                    Secondary text
                  </div>
                </div>
              </ScheduleGrid>
            </ScheduleSection>
            
            <CompleteButton onClick={handleComplete} disabled={isLoading}>
              {isLoading ? '등록 중...' : '입력 완료하기'}
            </CompleteButton>
          </RightPanel>
        </MainContent>
      </ContentCard>
    </PageContainer>
  );
};

export default MeetingParticipantPage;

