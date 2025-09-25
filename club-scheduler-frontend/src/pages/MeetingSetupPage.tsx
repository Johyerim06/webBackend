import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';
import { createMeeting } from '../services/meetingService';

// DatePicker 스타일링
const DatePickerStyles = styled.div`
  .meeting-calendar {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: ${shadows.md};
    
    .react-datepicker__header {
      background-color: ${colors.background};
      border-bottom: 1px solid #e0e0e0;
    }
    
    .react-datepicker__day--selected {
      background-color: ${colors.primary};
      color: ${colors.background};
    }
    
    .react-datepicker__day--in-selecting-range {
      background-color: #e3f2fd;
      color: ${colors.textPrimary};
    }
    
    .react-datepicker__day--in-range {
      background-color: #e3f2fd;
      color: ${colors.textPrimary};
    }
    
    .react-datepicker__day--range-start,
    .react-datepicker__day--range-end {
      background-color: ${colors.primary};
      color: ${colors.background};
    }
    
    .react-datepicker__day--keyboard-selected {
      background-color: ${colors.primaryHover};
      color: ${colors.background};
    }
    
    .react-datepicker__day:hover {
      background-color: ${colors.backgroundSecondary};
    }
    
    /* 간단한 스타일링 - 다른 달의 날짜만 회색으로 표시 */
    .react-datepicker__day--outside-month {
      color: #ccc !important;
      opacity: 0.5 !important;
      
      &:hover {
        background-color: transparent !important;
        color: #ccc !important;
      }
    }
  }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${spacing.xl};
`;

const ContentCard = styled.div`
  background-color: ${colors.background};
  border-radius: 16px;
  padding: ${spacing['4xl']};
  box-shadow: ${shadows.xl};
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.textPrimary};
  text-align: center;
  margin-bottom: ${spacing['2xl']};
`;

const FormSection = styled.div`
  margin-bottom: ${spacing.xl};
`;

const Label = styled.label`
  display: block;
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: ${typography.fontSize.base};
  background-color: ${colors.background};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  &::placeholder {
    color: #999;
  }
`;


const CalendarContainer = styled.div`
  margin-top: ${spacing.md};
  display: flex;
  justify-content: center;
`;

const TimeSection = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.sm};
`;

const TimeInput = styled.select`
  flex: 1;
  padding: ${spacing.md};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: ${typography.fontSize.base};
  background-color: ${colors.background};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const PeriodSection = styled.div`
  display: flex;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const PeriodButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  min-width: 120px;
`;

const PeriodButton = styled.button<{ $isActive?: boolean }>`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: ${props => props.$isActive ? colors.primary : colors.background};
  color: ${props => props.$isActive ? colors.background : colors.textPrimary};
  font-size: ${typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$isActive ? colors.primaryHover : colors.backgroundSecondary};
  }
`;

const CalendarSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const DateDropdowns = styled.div`
  display: flex;
  gap: ${spacing.md};
`;

const DateDropdown = styled.div`
  flex: 1;
  padding: ${spacing.md};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: ${typography.fontSize.base};
  background-color: ${colors.background};
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  min-height: 48px;
`;

const VotingSection = styled.div`
  display: flex;
  gap: ${spacing.lg};
  margin-top: ${spacing.sm};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${typography.fontSize.base};
  color: ${colors.textPrimary};
  cursor: pointer;
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${colors.primary};
`;

const StartButton = styled.button`
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
  margin-top: ${spacing.xl};
  
  &:hover {
    background-color: ${colors.primaryHover};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const MeetingSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [meetingName, setMeetingName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [votingOption, setVotingOption] = useState('yes');
  const [isLoading, setIsLoading] = useState(false);

  // 시간 옵션 생성 (30분 단위)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // 간단한 DatePicker 스타일 적용
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* 다른 달의 날짜만 간단하게 처리 */
      .react-datepicker__day--outside-month {
        color: #ccc !important;
        opacity: 0.5 !important;
      }
      
      .react-datepicker__day--outside-month:hover {
        background-color: transparent !important;
        color: #ccc !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 기간 선택 핸들러
  const handleTodayClick = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  };

  const handleWeekClick = () => {
    const today = new Date();
    const weekLater = new Date(today);
    weekLater.setDate(today.getDate() + 6);
    setStartDate(today);
    setEndDate(weekLater);
  };

  // 달력 날짜 선택 핸들러
  const handleDateClick = (date: Date | [Date | null, Date | null] | null) => {
    if (!date) return;
    
    // 날짜 범위인 경우 (selectsRange=true일 때)
    if (Array.isArray(date)) {
      const [start, end] = date;
      if (start && end) {
        // 시작 날짜와 종료 날짜를 비교하여 순서 정렬
        if (start <= end) {
          setStartDate(start);
          setEndDate(end);
        } else {
          setStartDate(end);
          setEndDate(start);
        }
      } else if (start) {
        // 시작 날짜만 선택된 경우
        setStartDate(start);
        setEndDate(null);
      }
    }
    // 단일 날짜인 경우 (fallback)
    else if (date instanceof Date) {
      if (!startDate) {
        // 시작 날짜가 없으면 시작 날짜로 설정
        setStartDate(date);
      } else if (!endDate) {
        // 종료 날짜가 없으면 종료 날짜로 설정
        if (date >= startDate) {
          setEndDate(date);
        } else {
          // 선택한 날짜가 시작 날짜보다 이르면 시작 날짜로 설정하고 기존 시작 날짜를 종료 날짜로
          setEndDate(startDate);
          setStartDate(date);
        }
      } else {
        // 둘 다 있으면 새로운 시작 날짜로 설정
        setStartDate(date);
        setEndDate(null);
      }
    }
  };


  const handleStartMeeting = async () => {
    if (!meetingName.trim()) {
      alert('모임 이름을 입력해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      alert('시작 날짜와 종료 날짜를 선택해주세요.');
      return;
    }

    // 시간이 선택되지 않은 경우 확인 메시지 표시
    if (!startTime || !endTime) {
      const shouldSetDefaultTime = window.confirm(
        '시작 시간과 종료 시간을 설정하지 않으셨습니다.\n00:00~24:00으로 설정할까요?'
      );
      
      if (shouldSetDefaultTime) {
        // 기본 시간으로 설정
        setStartTime('00:00');
        setEndTime('24:00');
      } else {
        return; // 사용자가 취소한 경우 함수 종료
      }
    }

    setIsLoading(true);

    try {
      // API를 통해 모임 생성
      const meetingData = {
        name: meetingName,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        startTime: startTime || '00:00',
        endTime: endTime || '24:00',
        voting: votingOption === 'yes'
      };
      
      const createdMeeting = await createMeeting(meetingData);
      
      // 모임 참여 링크 생성
      const meetingLink = `/meeting/join?id=${createdMeeting.id}`;
      
      // 완료 페이지로 이동
      navigate('/meeting/complete', { 
        state: { 
          meetingLink: `${window.location.origin}${meetingLink}`,
          meetingData: createdMeeting
        } 
      });
    } catch (error) {
      console.error('모임 생성 오류:', error);
      alert('모임 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <DatePickerStyles>
        <ContentCard>
        <Title>모임을 설정해주세요</Title>
        
        <FormSection>
          <Label>모임 이름</Label>
          <Input
            type="text"
            placeholder="모임 이름을 입력해주세요"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
          />
        </FormSection>

        <FormSection>
          <Label>기간 선택</Label>
          <PeriodSection>
            <PeriodButtons>
              <PeriodButton onClick={handleTodayClick}>
                오늘
              </PeriodButton>
              <PeriodButton onClick={handleWeekClick}>
                일주일
              </PeriodButton>
              <PeriodButton $isActive={true}>
                직접 날짜 선택
              </PeriodButton>
            </PeriodButtons>
            
            <CalendarSection>
              <CalendarContainer>
                <DatePicker
                  selected={startDate}
                  onChange={handleDateClick}
                  inline
                  calendarClassName="meeting-calendar"
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange={true}
                  monthsShown={1}
                  shouldCloseOnSelect={false}
                  fixedHeight={true}
                  dateFormat="yyyy-MM-dd"
                />
              </CalendarContainer>
              
              <DateDropdowns>
                <DateDropdown>
                  {startDate ? startDate.toLocaleDateString('ko-KR') : '시작 날짜'}
                </DateDropdown>
                
                <DateDropdown>
                  {endDate ? endDate.toLocaleDateString('ko-KR') : '종료 날짜'}
                </DateDropdown>
              </DateDropdowns>
            </CalendarSection>
          </PeriodSection>
        </FormSection>

        <FormSection>
          <Label>시간 선택</Label>
          <TimeSection>
            <TimeInput
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            >
              <option value="">시작 시간</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </TimeInput>
            <TimeInput
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            >
              <option value="">종료 시간</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </TimeInput>
          </TimeSection>
        </FormSection>

        <FormSection>
          <Label>투표 진행 여부</Label>
          <VotingSection>
            <RadioOption>
              <RadioInput
                type="radio"
                name="voting"
                value="yes"
                checked={votingOption === 'yes'}
                onChange={(e) => setVotingOption(e.target.value)}
              />
              투표를 진행할게요.
            </RadioOption>
            <RadioOption>
              <RadioInput
                type="radio"
                name="voting"
                value="no"
                checked={votingOption === 'no'}
                onChange={(e) => setVotingOption(e.target.value)}
              />
              괜찮아요.
            </RadioOption>
          </VotingSection>
        </FormSection>

        <StartButton onClick={handleStartMeeting} disabled={isLoading}>
          {isLoading ? '생성 중...' : '모임 시작하기'}
        </StartButton>
        </ContentCard>
      </DatePickerStyles>
    </PageContainer>
  );
};

export default MeetingSetupPage;
