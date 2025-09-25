import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';
import { getSchedules, Schedule, TimeSlot } from '../services/scheduleService';
import { createPersonalEvent, getPersonalEvents, updatePersonalEvent, PersonalEvent } from '../services/personalEventService';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing.xl} ${spacing.lg};
`;

const ContentContainer = styled.div`
  max-width: 1200px;
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
  margin-bottom: ${spacing.lg};
`;

const Description = styled.p`
  font-size: ${typography.fontSize.base};
  color: ${colors.textSecondary};
  text-align: center;
  margin-bottom: ${spacing.xl};
  line-height: 1.6;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${spacing.xl};
  margin-bottom: ${spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;



const CalendarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  color: ${colors.textPrimary};
  margin-bottom: ${spacing.md};
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
    background-color: ${colors.background};
    color: ${colors.textPrimary};
    cursor: pointer;
    transition: border-color 0.2s ease;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }

    &::placeholder {
      color: ${colors.textLight};
    }
  }
`;

const TimeGridContainer = styled.div`
  margin: ${spacing.lg} 0;
`;

const ToggleButton = styled.button`
  padding: ${spacing.sm} ${spacing.md};
  background-color: ${colors.backgroundSecondary};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
  margin-bottom: ${spacing.md};

  &:hover {
    background-color: ${colors.primary};
    color: ${colors.background};
    border-color: ${colors.primary};
  }
`;


const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  gap: 1px;
  background-color: ${colors.border};
  border-radius: 8px;
  overflow: hidden;
  max-height: 600px;
  overflow-y: auto;
`;

const TimeSlotCell = styled.div<{ $isHeader?: boolean; $isSelected?: boolean; $isDragging?: boolean }>`
  padding: ${spacing.xs};
  background-color: ${props => {
    if (props.$isHeader) return colors.backgroundSecondary;
    if (props.$isSelected) return colors.primary;
    return colors.background;
  }};
  color: ${props => 
    props.$isHeader ? colors.textPrimary : 
    props.$isSelected ? colors.background : colors.textPrimary};
  font-size: ${typography.fontSize.xs};
  font-weight: ${props => props.$isHeader ? typography.fontWeight.medium : typography.fontWeight.normal};
  text-align: center;
  cursor: ${props => props.$isHeader ? 'default' : 'pointer'};
  transition: all 0.1s ease;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:hover {
    background-color: ${props => 
      props.$isHeader ? colors.backgroundSecondary : 
      props.$isSelected ? colors.primaryDark : colors.backgroundSecondary};
  }

  ${props => props.$isDragging && `
    background-color: ${colors.primary} !important;
    color: ${colors.background} !important;
  `}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.lg};
  justify-content: center;
  margin-top: ${spacing.xl};
`;

const PrimaryButton = styled.button`
  padding: ${spacing.lg} ${spacing.xl};
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;

  &:hover {
    background-color: ${colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  padding: ${spacing.lg} ${spacing.xl};
  background-color: ${colors.background};
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;

  &:hover {
    background-color: ${colors.primary};
    color: ${colors.background};
    transform: translateY(-2px);
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

  /* 주간 하이라이트 스타일 */
  .week-highlight {
    background-color: #E3F2FD !important;
    color: ${colors.textPrimary} !important;
  }

  .week-highlight:hover {
    background-color: #BBDEFB !important;
  }

  /* 선택된 날짜는 더 진한 색으로 */
  .week-highlight.react-datepicker__day--selected {
    background-color: ${colors.primary} !important;
    color: ${colors.background} !important;
  }
`;

const EventManagementPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{time: string, day: string, isSelected: boolean} | null>(null);
  const [showEarlyHours, setShowEarlyHours] = useState(false);
  const [existingSchedule, setExistingSchedule] = useState<Schedule | PersonalEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

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

  // 선택된 날짜가 포함된 주의 모든 날짜를 가져오는 함수
  const getWeekDatesForCalendar = (date: Date) => {
    const weekDates = getWeekDates(date);
    return weekDates.map(d => d.toDateString());
  };

  // 날짜가 저장된 시간표 범위에 포함되는지 확인
  const isDateInScheduleRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  // 기존 시간표 및 개인 일정 불러오기 함수
  const loadExistingSchedule = async () => {
    try {
      setLoading(true);
      
      // 먼저 개인 일정(PersonalEvent)을 확인
      const personalEvents = await getPersonalEvents();
      let scheduleToUse: Schedule | PersonalEvent | null = null;
      
      if (personalEvents && personalEvents.length > 0) {
        // 개인 일정이 있으면 가장 최근 것을 사용
        scheduleToUse = personalEvents[0];
        console.log('개인 일정 사용:', scheduleToUse);
      } else {
        // 개인 일정이 없으면 기본 시간표 사용
        const schedules = await getSchedules();
        if (schedules && schedules.length > 0) {
          scheduleToUse = schedules[0];
          console.log('기본 시간표 사용:', scheduleToUse);
        }
      }
      
      if (scheduleToUse) {
        setExistingSchedule(scheduleToUse);
        
        // 저장된 시간표의 날짜 범위 설정
        let datesToUse = scheduleToUse.selectedDates;
        
        // PersonalEvent인 경우, 원본 Schedule의 selectedDates 사용
        if (scheduleToUse && 'originalScheduleId' in scheduleToUse) {
          const personalEvent = scheduleToUse as PersonalEvent;
          if (personalEvent.originalScheduleId) {
            const schedules = await getSchedules();
            const originalSchedule = schedules.find(s => s.id === personalEvent.originalScheduleId);
            if (originalSchedule && originalSchedule.selectedDates) {
              datesToUse = originalSchedule.selectedDates;
              console.log('PersonalEvent - 원본 Schedule의 selectedDates 사용:', datesToUse);
            }
          }
        }
        
        if (datesToUse && datesToUse.length > 0) {
          console.log('사용할 selectedDates:', datesToUse);
          const dates = datesToUse.map((dateStr: string) => new Date(dateStr));
          const sortedDates = dates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
          setStartDate(sortedDates[0]);
          setEndDate(sortedDates[sortedDates.length - 1]);
          console.log('날짜 범위 업데이트:', {
            startDate: sortedDates[0].toISOString().split('T')[0],
            endDate: sortedDates[sortedDates.length - 1].toISOString().split('T')[0],
            totalDates: sortedDates.length,
            allDates: sortedDates.map(d => d.toISOString().split('T')[0])
          });
        }
        
        // 저장된 시간표의 시간 슬롯을 현재 선택된 슬롯으로 설정
        if (scheduleToUse.timeSlots && scheduleToUse.timeSlots.length > 0) {
          const slots = new Set<string>();
          scheduleToUse.timeSlots.forEach((slot: any) => {
            slots.add(`${slot.time}-${slot.day}`);
          });
          setSelectedSlots(slots);
          console.log('시간 슬롯 업데이트:', slots.size, '개 슬롯');
        }
      }
    } catch (error) {
      console.error('시간표 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 시간표 불러오기
  useEffect(() => {
    loadExistingSchedule();
  }, []);

  // selectedDate가 변경될 때마다 해당 주의 개인일정 데이터를 불러옴
  useEffect(() => {
    if (selectedDate) {
      loadWeekSchedule(selectedDate);
    }
  }, [selectedDate]);

  // 선택된 날짜의 주에 해당하는 개인일정 데이터를 불러오는 함수
  const loadWeekSchedule = async (date: Date) => {
    try {
      const personalEvents = await getPersonalEvents();
      if (!personalEvents || personalEvents.length === 0) {
        // 개인일정이 없으면 빈 상태로 설정
        setSelectedSlots(new Set());
        return;
      }

      const personalEvent = personalEvents[0];
      const weekDates = getWeekDates(date);
      
      // 해당 주의 날짜들 중에서 개인일정에 저장된 시간 슬롯만 필터링
      const weekTimeSlots = new Set<string>();
      
      if (personalEvent.timeSlots) {
        personalEvent.timeSlots.forEach(slot => {
          // 해당 요일이 이번 주에 포함되는지 확인
          const dayIndex = weekDays.indexOf(slot.day);
          if (dayIndex !== -1) {
            const weekDate = weekDates[dayIndex];
            // 해당 날짜가 개인일정의 selectedDates에 포함되는지 확인
            const isDateInPersonalEvent = personalEvent.selectedDates?.some(selectedDate => {
              const dateStr = new Date(selectedDate).toISOString().split('T')[0];
              const weekDateStr = weekDate.toISOString().split('T')[0];
              return dateStr === weekDateStr;
            });
            
            if (isDateInPersonalEvent) {
              weekTimeSlots.add(`${slot.time}-${slot.day}`);
            }
          }
        });
      }
      
      setSelectedSlots(weekTimeSlots);
      console.log('주간 일정 로드:', {
        selectedDate: date.toISOString().split('T')[0],
        weekDates: weekDates.map(d => d.toISOString().split('T')[0]),
        loadedSlots: Array.from(weekTimeSlots)
      });
    } catch (error) {
      console.error('주간 일정 로드 오류:', error);
    }
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

  const handleApplySchedule = async () => {
    try {
      // 최신 데이터를 직접 가져와서 사용
      const personalEvents = await getPersonalEvents();
      const schedules = await getSchedules();
      
      let scheduleToUse: Schedule | PersonalEvent | null = null;
      
      if (personalEvents && personalEvents.length > 0) {
        scheduleToUse = personalEvents[0];
        console.log('handleApplySchedule - 개인 일정 사용:', scheduleToUse);
      } else if (schedules && schedules.length > 0) {
        scheduleToUse = schedules[0];
        console.log('handleApplySchedule - 기본 시간표 사용:', scheduleToUse);
      }
      
      if (!scheduleToUse) {
        alert('적용할 시간표가 없습니다. 먼저 시간표를 설정해주세요.');
        return;
      }

      // Schedule의 selectedDates가 있는지 확인
      if (!scheduleToUse.selectedDates || scheduleToUse.selectedDates.length === 0) {
        alert('기본 시간표에 날짜 범위가 설정되지 않았습니다.');
        return;
      }

      // 기본 시간표(Schedule)의 시간 슬롯을 가져옴
      let baseTimeSlots: TimeSlot[] = [];
      
      // 현재 사용자의 활성 스케줄을 찾아서 시간 슬롯 사용
      const activeSchedule = schedules.find(s => s.isActive);
      if (activeSchedule) {
        baseTimeSlots = activeSchedule.timeSlots;
      } else {
        alert('활성화된 시간표를 찾을 수 없습니다.');
        return;
      }

      if (baseTimeSlots.length === 0) {
        alert('기본 시간표에 시간 슬롯이 없습니다.');
        return;
      }

      // 현재 사용자의 활성 스케줄의 selectedDates 사용
      let selectedDates: string[] = [];
      if (activeSchedule && activeSchedule.selectedDates) {
        selectedDates = activeSchedule.selectedDates;
      }
      
      console.log('시간표 적용 - Schedule의 selectedDates 사용:', {
        originalSelectedDates: selectedDates,
        totalDates: selectedDates.length,
        startDate: selectedDates[0],
        endDate: selectedDates[selectedDates.length - 1],
        baseTimeSlots: baseTimeSlots,
        scheduleToUse: scheduleToUse
      });

      // 사용자 이름으로 개인일정 이름 생성
      const personalEventName = user?.name ? `${user.name}의 일정` : '개인 일정';

      // 기존 PersonalEvent가 있는지 확인
      if (personalEvents && personalEvents.length > 0) {
        // 기존 PersonalEvent가 있으면 업데이트 (기본 시간표 패턴으로 덮어쓰기)
        const existingPersonalEvent = personalEvents[0];
        await updatePersonalEvent(existingPersonalEvent.id, {
          name: personalEventName,
          timeSlots: baseTimeSlots, // 기본 시간표의 시간 슬롯 사용
          selectedDates
        });
        console.log('개인 일정에 기본 시간표 패턴 적용 완료');
      } else {
        // 기존 PersonalEvent가 없으면 새로 생성
        await createPersonalEvent({
          name: personalEventName,
          timeSlots: baseTimeSlots, // 기본 시간표의 시간 슬롯 사용
          selectedDates,
          originalScheduleId: activeSchedule.id
        });
        console.log('새 개인 일정에 기본 시간표 패턴 적용 완료');
      }

      // 상태를 직접 업데이트하여 페이지 새로고침 없이 반영
      await loadExistingSchedule();
      
    } catch (error) {
      console.error('시간표 적용 오류:', error);
      alert('시간표 적용 중 오류가 발생했습니다.');
    }
  };

  const handleCompleteInput = async () => {
    if (!startDate || !endDate) {
      alert('시작 날짜와 종료 날짜를 선택해주세요.');
      return;
    }

    if (selectedSlots.size === 0) {
      alert('적용할 시간을 선택해주세요.');
      return;
    }

    try {
      // 선택된 시간 슬롯을 TimeSlot 형태로 변환
      const newTimeSlots = Array.from(selectedSlots).map(slotKey => {
        const [time, day] = slotKey.split('-');
        return { time, day };
      });

      // 선택된 날짜 범위 생성
      const newSelectedDates: string[] = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        newSelectedDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // 사용자 이름으로 개인일정 이름 생성
      const personalEventName = user?.name ? `${user.name}의 일정` : '개인 일정';

      // 기존 PersonalEvent가 있는지 확인
      const personalEvents = await getPersonalEvents();
      
      if (personalEvents && personalEvents.length > 0) {
        // 기존 PersonalEvent가 있으면 병합
        const existingPersonalEvent = personalEvents[0];
        const existingTimeSlots = existingPersonalEvent.timeSlots || [];
        const existingSelectedDates = existingPersonalEvent.selectedDates || [];
        
        // 기존 시간 슬롯에서 새로 선택된 날짜 범위에 해당하는 슬롯들을 제거
        const filteredExistingSlots = existingTimeSlots.filter(slot => {
          const dayIndex = weekDays.indexOf(slot.day);
          if (dayIndex !== -1 && selectedDate) {
            const weekDates = getWeekDates(selectedDate);
            const weekDate = weekDates[dayIndex];
            const weekDateStr = weekDate.toISOString().split('T')[0];
            return !newSelectedDates.includes(weekDateStr);
          }
          return true;
        });
        
        // 기존 슬롯 + 새로운 슬롯을 합치기
        const mergedTimeSlots = [...filteredExistingSlots, ...newTimeSlots];
        
        // 기존 날짜 + 새로운 날짜를 합치기 (중복 제거)
        const allSelectedDates = Array.from(new Set([...existingSelectedDates, ...newSelectedDates]));
        
        await updatePersonalEvent(existingPersonalEvent.id, {
          name: personalEventName,
          timeSlots: mergedTimeSlots,
          selectedDates: allSelectedDates
        });
        console.log('기존 개인 일정 병합 완료');
      } else {
        // 기존 PersonalEvent가 없으면 새로 생성
        await createPersonalEvent({
          name: personalEventName,
          timeSlots: newTimeSlots,
          selectedDates: newSelectedDates,
          originalScheduleId: existingSchedule?.id
        });
        console.log('새 개인 일정 생성 완료');
      }

      // 완료 페이지로 이동
      navigate('/schedule/modified-complete');
    } catch (error) {
      console.error('일정 저장 오류:', error);
      alert('일정 저장 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <DatePickerStyles>
          <ContentContainer>
            <Title>일정 관리</Title>
            <Description>시간표를 불러오는 중...</Description>
          </ContentContainer>
        </DatePickerStyles>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DatePickerStyles>
        <ContentContainer>
          <Title>세부 가용시간을 설정해주세요</Title>
          <Description>
            시간표에서 설정한 시간과 일정을 다른 날짜에 수정할 수 있습니다.<br />
            해당 날짜와 시간을 마우스로 길게 누르고 드래그하여 선택할 수 있습니다.
          </Description>

          <MainContent>
            <CalendarSection>
              <SectionTitle>날짜 선택</SectionTitle>
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
                  dayClassName={(date) => {
                    if (!selectedDate) return '';
                    const weekDates = getWeekDatesForCalendar(selectedDate);
                    return weekDates.includes(date.toDateString()) ? 'week-highlight' : '';
                  }}
                />
              </DatePickerWrapper>
            </CalendarSection>

            <TimeSection>
              <SectionTitle>시간 선택</SectionTitle>
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
                      {weekDays.map((day, dayIndex) => {
                        const slotKey = `${time}-${day}`;
                        const isSelected = selectedSlots.has(slotKey);
                        
                        // 선택된 날짜의 일주일 중에서 해당 요일의 날짜 확인
                        let shouldShowPattern = false;
                        if (selectedDate) {
                          const weekDates = getWeekDates(selectedDate);
                          const currentDate = weekDates[dayIndex];
                          shouldShowPattern = isDateInScheduleRange(currentDate);
                        }
                        
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
                      {weekDays.map((day, dayIndex) => {
                        const slotKey = `${time}-${day}`;
                        const isSelected = selectedSlots.has(slotKey);
                        
                        // 선택된 날짜의 일주일 중에서 해당 요일의 날짜 확인
                        let shouldShowPattern = false;
                        if (selectedDate) {
                          const weekDates = getWeekDates(selectedDate);
                          const currentDate = weekDates[dayIndex];
                          shouldShowPattern = isDateInScheduleRange(currentDate);
                        }
                        
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
          </MainContent>

          <ButtonContainer>
            <PrimaryButton onClick={handleApplySchedule}>
              시간표 적용하기
            </PrimaryButton>
            <SecondaryButton onClick={handleCompleteInput}>
              입력 완료하기
            </SecondaryButton>
          </ButtonContainer>
        </ContentContainer>
      </DatePickerStyles>
    </PageContainer>
  );
};

export default EventManagementPage;
