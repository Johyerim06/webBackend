import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';
import { getMeeting, addParticipant, saveAvailability, getAvailability } from '../services/meetingService';
import { Meeting, Availability } from '../services/meetingService';
import { useAuth } from '../contexts/AuthContext';

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

const DatePickerWrapper = styled.div`
  width: 100%;
  
  .react-datepicker-wrapper {
    width: 100%;
  }
  
  .react-datepicker__input-container {
    width: 100%;
  }
  
  .react-datepicker__input-container input {
    width: 100%;
    padding: ${spacing.lg};
    border: 1px solid ${colors.border};
    border-radius: 12px;
    font-size: ${typography.fontSize.base};
    font-family: ${typography.fontFamily.primary};
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const TimeGridContainer = styled.div`
  margin: ${spacing.lg} 0;
`;

const ToggleButton = styled.button`
  background-color: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${spacing.md};

  &:hover {
    background-color: ${colors.primary};
    color: white;
  }
`;

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: 60px repeat(7, 1fr);
  gap: 1px;
  background-color: ${colors.border};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
`;

const TimeSlotCell = styled.div<{ $isHeader?: boolean; $isSelected?: boolean }>`
  background-color: ${props => 
    props.$isHeader 
      ? colors.backgroundSecondary 
      : props.$isSelected 
        ? colors.primary 
        : 'white'
  };
  color: ${props => 
    props.$isHeader 
      ? colors.textPrimary 
      : props.$isSelected 
        ? 'white' 
        : colors.textPrimary
  };
  padding: ${spacing.sm};
  font-size: ${typography.fontSize.sm};
  text-align: center;
  cursor: ${props => props.$isHeader ? 'default' : 'pointer'};
  transition: all 0.1s ease;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${props => props.$isHeader ? typography.fontWeight.medium : typography.fontWeight.normal};

  &:hover {
    background-color: ${props => 
      props.$isHeader 
        ? colors.backgroundSecondary 
        : props.$isSelected 
          ? colors.primaryDark 
          : colors.backgroundSecondary
    };
  }
`;

// react-datepicker 커스텀 스타일
const DatePickerStyles = styled.div`
  .custom-datepicker {
    width: 100%;
  }

  .react-datepicker {
    border: 1px solid ${colors.border};
    border-radius: 12px;
    box-shadow: ${shadows.large};
    font-family: ${typography.fontFamily.primary};
  }

  .react-datepicker__header {
    background-color: ${colors.background};
    border-bottom: 1px solid ${colors.border};
    border-radius: 12px 12px 0 0;
  }

  .react-datepicker__current-month {
    color: ${colors.textPrimary};
    font-weight: ${typography.fontWeight.medium};
  }

  .react-datepicker__day-name {
    color: ${colors.textLight};
    font-weight: ${typography.fontWeight.medium};
  }

  .react-datepicker__day {
    color: ${colors.textPrimary};
    
    &:hover {
      background-color: ${colors.backgroundSecondary};
    }
  }

  .react-datepicker__day--selected {
    background-color: ${colors.primary};
    color: ${colors.background};
    
    &:hover {
      background-color: ${colors.primaryDark};
    }
  }

  .react-datepicker__day--today {
    background-color: ${colors.backgroundSecondary};
    color: ${colors.textPrimary};
  }

  .react-datepicker__navigation {
    border: none;
    background: none;
    
    &:hover {
      background-color: ${colors.backgroundSecondary};
    }
  }

  .react-datepicker__navigation-icon::before {
    border-color: ${colors.textPrimary};
  }
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
  const { user } = useAuth();
  
  console.log('MeetingParticipantPage - URL search params:', searchParams.toString());
  console.log('MeetingParticipantPage - meetingId from URL:', meetingId);
  console.log('MeetingParticipantPage - meetingId type:', typeof meetingId);
  console.log('MeetingParticipantPage - meetingId length:', meetingId.length);
  
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{time: string, day: string, isSelected: boolean} | null>(null);
  const [showEarlyHours, setShowEarlyHours] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 일요일부터 시작하는 요일 순서
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];

  // 선택된 날짜로부터 일주일 계산 (일요일부터 시작)
  const getWeekDates = (date: Date) => {
    const dates = [];
    const dayOfWeek = date.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const startOfWeek = new Date(date);
    
    // 일요일부터 시작하도록 조정
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      dates.push(weekDate);
    }
    
    return dates;
  };

  // 00:00부터 24:00까지 30분 단위로 시간 슬롯 생성
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();
  const earlyTimeSlots = allTimeSlots.filter(time => {
    const [hour] = time.split(':').map(Number);
    return hour < 7;
  });
  const regularTimeSlots = allTimeSlots.filter(time => {
    const [hour] = time.split(':').map(Number);
    return hour >= 7;
  });

  useEffect(() => {
    const loadMeeting = async () => {
      if (!meetingId) {
        alert('모임 ID가 없습니다.');
        navigate('/');
        return;
      }
      
      // Meeting ID 형식 검증 (8자리 랜덤 문자열 또는 24자리 MongoDB ObjectId)
      const shortIdRegex = /^[a-z0-9]{8}$/; // 8자리 랜덤 ID
      const objectIdRegex = /^[0-9a-fA-F]{24}$/; // 24자리 MongoDB ObjectId
      
      if (!shortIdRegex.test(meetingId) && !objectIdRegex.test(meetingId)) {
        console.error('잘못된 모임 ID 형식:', meetingId);
        console.error('예상 형식: 8자리 랜덤 문자열 또는 24자리 16진수 문자열');
        console.error('실제 값:', JSON.stringify(meetingId));
        alert(`유효하지 않은 모임 링크입니다.\n모임 ID: ${meetingId}`);
        navigate('/');
        return;
      }
      
      console.log('모임 ID 검증 통과:', meetingId);
      
      try {
        const meetingData = await getMeeting(meetingId);
        setMeeting(meetingData);
        
        // 로그인된 사용자가 이미 참여자인지 확인
        if (user && meetingData.participants) {
          const isAlreadyParticipant = meetingData.participants.some(
            (participant: any) => participant.email === user.email
          );
          
          if (isAlreadyParticipant) {
            console.log('이미 참여자로 등록된 사용자입니다.');
            // 이미 참여자라면 기존 가용시간을 불러와서 표시할 수 있음
          }
        }
      } catch (error) {
        console.error('모임 정보 로드 오류:', error);
        alert('모임 정보를 불러오는데 실패했습니다.');
        navigate('/');
      }
    };
    
    loadMeeting();
  }, [meetingId, navigate, user]);

  // 기존 가용시간 불러오기
  const loadExistingAvailability = async () => {
    if (!user || !meetingId) return;
    
    try {
      const availabilityData = await getAvailability(meetingId);
      if (availabilityData && availabilityData.availability && availabilityData.availability.length > 0) {
        console.log('기존 가용시간 불러옴:', availabilityData);
        
        // 기존 가용시간을 selectedSlots으로 변환
        const slots = new Set<string>();
        
        availabilityData.availability.forEach((avail: Availability) => {
          const dateObj = new Date(avail.date);
          const dayOfWeek = dateObj.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
          const dayName = weekDays[dayOfWeek];
          
          avail.timeSlots.forEach(timeSlot => {
            const slotKey = `${timeSlot.startTime}-${dayName}`;
            slots.add(slotKey);
          });
        });
        
        setSelectedSlots(slots);
        
        // 첫 번째 날짜로 캘린더 설정
        if (availabilityData.availability.length > 0) {
          setSelectedDate(new Date(availabilityData.availability[0].date));
        }
      }
    } catch (error) {
      console.log('기존 가용시간 없음 또는 불러오기 실패:', error);
      // 오류가 발생해도 계속 진행 (처음 방문하는 경우)
    }
  };

  // 사용자 로그인 후 기존 가용시간 불러오기
  useEffect(() => {
    if (user && meetingId && meeting) {
      loadExistingAvailability();
    }
  }, [user, meetingId, meeting]);

  // 로그인되지 않은 사용자 처리
  useEffect(() => {
    if (!user) {
      console.log('로그인되지 않은 사용자, 로그인 페이지로 리다이렉트');
      navigate('/login', { 
        state: { 
          redirectTo: `/meeting/participant?id=${meetingId}`,
          message: '로그인 후 모임에 참여하세요.'
        } 
      });
    }
  }, [user, navigate, meetingId]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTimeSlotClick = (time: string, day: string) => {
    const slotKey = `${time}-${day}`;
    const newSelectedSlots = new Set(selectedSlots);
    
    if (newSelectedSlots.has(slotKey)) {
      newSelectedSlots.delete(slotKey);
    } else {
      newSelectedSlots.add(slotKey);
    }
    
    setSelectedSlots(newSelectedSlots);
  };

  const handleMouseDown = (time: string, day: string) => {
    const slotKey = `${time}-${day}`;
    const isSelected = selectedSlots.has(slotKey);
    
    setIsDragging(true);
    setDragStart({ time, day, isSelected });
  };

  const handleMouseEnter = (time: string, day: string) => {
    if (isDragging && dragStart) {
      const newSelectedSlots = new Set(selectedSlots);
      
      // 드래그 범위 내의 모든 슬롯을 시작점의 선택 상태에 따라 설정
      const startTimeIndex = allTimeSlots.indexOf(dragStart.time);
      const endTimeIndex = allTimeSlots.indexOf(time);
      const startDayIndex = weekDays.indexOf(dragStart.day);
      const endDayIndex = weekDays.indexOf(day);
      
      const minTimeIndex = Math.min(startTimeIndex, endTimeIndex);
      const maxTimeIndex = Math.max(startTimeIndex, endTimeIndex);
      const minDayIndex = Math.min(startDayIndex, endDayIndex);
      const maxDayIndex = Math.max(startDayIndex, endDayIndex);
      
      for (let timeIndex = minTimeIndex; timeIndex <= maxTimeIndex; timeIndex++) {
        for (let dayIndex = minDayIndex; dayIndex <= maxDayIndex; dayIndex++) {
          const slotKey = `${allTimeSlots[timeIndex]}-${weekDays[dayIndex]}`;
          
          if (dragStart.isSelected) {
            // 시작점이 선택되어 있었다면 선택 해제
            newSelectedSlots.delete(slotKey);
          } else {
            // 시작점이 선택되어 있지 않았다면 선택
            newSelectedSlots.add(slotKey);
          }
        }
      }
      
      setSelectedSlots(newSelectedSlots);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };


  const handleComplete = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (selectedSlots.size === 0) {
      alert('가용 시간을 선택해주세요.');
      return;
    }
    
    if (!selectedDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 선택된 시간 슬롯을 Availability 형태로 변환
      const weekDates = getWeekDates(selectedDate);
      const availability: Availability[] = [];
      
      // 각 요일별로 선택된 시간 슬롯을 그룹화
      weekDays.forEach((day, dayIndex) => {
        const daySlots = Array.from(selectedSlots)
          .filter(slotKey => slotKey.endsWith(`-${day}`))
          .map(slotKey => slotKey.split('-')[0])
          .sort();
        
        if (daySlots.length > 0) {
          const date = weekDates[dayIndex];
          const timeSlots = daySlots.map(time => ({
            startTime: time,
            endTime: time // 30분 단위이므로 endTime은 startTime과 동일
          }));
          
          availability.push({
            date: date.toISOString().split('T')[0],
            timeSlots
          });
        }
      });
      
      // 1. Availability 컬렉션에 저장 (eventId, userId, personalEventId 포함)
      try {
        await saveAvailability(meetingId, availability);
        console.log('Availability 컬렉션에 저장 완료');
      } catch (availabilityError) {
        console.error('Availability 저장 오류:', availabilityError);
        // 실패해도 계속 진행
      }
      
      // 2. Meeting의 participants에도 저장 (기존 로직 유지)
      const participantData = {
        name: user.name || user.username || '참여자',
        email: user.email || `user_${user.id}@temp.com`, // 빈 이메일 대신 임시 이메일 사용
        availability
      };
      
      console.log('참여자 데이터:', participantData);
      await addParticipant(meetingId, participantData);
      
      console.log('가용시간 저장 완료:', {
        meetingId,
        userId: user.id,
        availabilityCount: availability.length
      });
      
      // 완료 페이지로 이동
      navigate('/meeting/participant-complete', { 
        state: { 
          meetingId,
          eventsID: meetingId, // meetingId를 eventsID로도 사용
          participantName: user.name || user.username || '참여자'
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
      <DatePickerStyles>
        <ContentCard>
          <Title>{meeting?.name || '모임'} 가용 시간을 설정해주세요</Title>
          
          <Description>
            <p>선택된 기간의 가용 시간을 선택해주세요</p>
            <p>해당하는 날짜 및 시간에 마우스를 꾹 누르고 드래그하면 선택할 수 있어요.</p>
          </Description>
          
          <MainContent>
            <LeftPanel>
              <CalendarSection>
                <CalendarTitle>날짜 선택</CalendarTitle>
                <CalendarContainer>
                  <DatePickerWrapper>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date: Date | null) => handleDateChange(date)}
                      placeholderText="날짜를 선택하세요"
                      dateFormat="yyyy-MM-dd"
                      isClearable
                      showPopperArrow={false}
                      popperPlacement="bottom-start"
                      className="custom-datepicker"
                      inline
                    />
                  </DatePickerWrapper>
                </CalendarContainer>
              </CalendarSection>
            </LeftPanel>
            
            <RightPanel>
              <TimeSection>
                <CalendarTitle>시간 선택</CalendarTitle>
                <TimeGridContainer>
                  <ToggleButton onClick={() => setShowEarlyHours(!showEarlyHours)}>
                    {showEarlyHours ? '오전 7시 이전 숨기기' : '오전 7시 이전 표시하기'}
                  </ToggleButton>
                  
                  <TimeGrid
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <TimeSlotCell $isHeader>시간</TimeSlotCell>
                    {weekDays.map((day, dayIndex) => {
                      const weekDates = selectedDate ? getWeekDates(selectedDate) : [];
                      const currentDate = weekDates[dayIndex];
                      const dateStr = currentDate ? `${currentDate.getMonth() + 1}/${currentDate.getDate()}` : '';
                      
                      return (
                        <TimeSlotCell key={day} $isHeader>
                          <div style={{ lineHeight: '1.2' }}>
                            <div>{day.toUpperCase()}</div>
                            {dateStr && <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.7 }}>{dateStr}</div>}
                          </div>
                        </TimeSlotCell>
                      );
                    })}
                    
                    {/* 오전 7시 이전 시간 슬롯 (토글 가능) */}
                    {showEarlyHours && earlyTimeSlots.map(time => (
                      <React.Fragment key={time}>
                        <TimeSlotCell $isHeader>{time}</TimeSlotCell>
                        {weekDays.map((day) => {
                          const slotKey = `${time}-${day}`;
                          const isSelected = selectedSlots.has(slotKey);
                          
                          return (
                            <TimeSlotCell
                              key={slotKey}
                              $isSelected={isSelected}
                              onClick={() => handleTimeSlotClick(time, day)}
                              onMouseDown={() => handleMouseDown(time, day)}
                              onMouseEnter={() => handleMouseEnter(time, day)}
                            />
                          );
                        })}
                      </React.Fragment>
                    ))}
                    
                    {/* 오전 7시 이후 시간 슬롯 */}
                    {regularTimeSlots.map(time => (
                      <React.Fragment key={time}>
                        <TimeSlotCell $isHeader>{time}</TimeSlotCell>
                        {weekDays.map((day) => {
                          const slotKey = `${time}-${day}`;
                          const isSelected = selectedSlots.has(slotKey);
                          
                          return (
                            <TimeSlotCell
                              key={slotKey}
                              $isSelected={isSelected}
                              onClick={() => handleTimeSlotClick(time, day)}
                              onMouseDown={() => handleMouseDown(time, day)}
                              onMouseEnter={() => handleMouseEnter(time, day)}
                            />
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </TimeGrid>
                </TimeGridContainer>
              </TimeSection>
              
              <CompleteButton onClick={handleComplete} disabled={isLoading}>
                {isLoading ? '저장 중...' : '가용시간 저장하기'}
              </CompleteButton>
            </RightPanel>
          </MainContent>
        </ContentCard>
      </DatePickerStyles>
    </PageContainer>
  );
};

export default MeetingParticipantPage;

