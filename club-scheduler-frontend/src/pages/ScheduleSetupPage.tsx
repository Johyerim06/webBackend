import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { colors, typography, spacing, shadows } from '../styles/design-tokens';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule, Schedule } from '../services/scheduleService';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.background};
  padding: ${spacing.xl} ${spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  width: 100%;
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

  &::placeholder {
    color: ${colors.textLight};
  }
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
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
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

const TimeSlot = styled.div<{ $isHeader?: boolean; $isSelected?: boolean; $isDragging?: boolean }>`
  padding: ${spacing.xs};
  background-color: ${props => 
    props.$isHeader ? colors.backgroundSecondary : 
    props.$isSelected ? colors.primary : colors.background};
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

const DateSection = styled.div`
  margin: ${spacing.xl} 0;
`;

const DateInputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const DateInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
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


const MainButton = styled.button`
  flex: 1;
  min-height: 56px;
  min-width: 200px;
  padding: ${spacing.lg} ${spacing.xl};
  background-color: ${colors.primary};
  color: ${colors.background};
  border: none;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${colors.primaryDark};
  }

  &:disabled {
    background-color: ${colors.textLight};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.lg};
  width: 100%;
  max-width: 500px;
  margin: ${spacing.xl} auto 0 auto;
  justify-content: center;
  align-items: stretch;
  padding: 0 ${spacing.xl};
`;

const DeleteButton = styled.button`
  flex: 1;
  min-height: 56px;
  min-width: 200px;
  padding: ${spacing.lg} ${spacing.xl};
  background-color: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #e9ecef;
    border-color: #dee2e6;
    color: #495057;
  }

  &:disabled {
    background-color: ${colors.textLight};
    cursor: not-allowed;
  }
`;

const ScheduleSetupPage: React.FC = () => {
  const [scheduleName, setScheduleName] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [existingSchedule, setExistingSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEarlyHours, setShowEarlyHours] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{time: string, day: string} | null>(null);
  const navigate = useNavigate();

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
  
  const weekDays = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];

  // 기존 시간표 불러오기
  useEffect(() => {
    const loadExistingSchedule = async () => {
      try {
        setLoading(true);
        const schedules = await getSchedules();
        
        if (schedules.length > 0) {
          // 가장 최근 시간표를 불러옴
          const latestSchedule = schedules[0];
          setExistingSchedule(latestSchedule);
          setScheduleName(latestSchedule.name);
          
          // 시간 슬롯 복원
          const restoredSlots = new Set<string>();
          latestSchedule.timeSlots.forEach(slot => {
            restoredSlots.add(`${slot.time}-${slot.day}`);
          });
          setSelectedSlots(restoredSlots);
          
          // 날짜 범위 복원
          if (latestSchedule.selectedDates.length > 0) {
            const sortedDates = latestSchedule.selectedDates.sort();
            setStartDate(new Date(sortedDates[0]));
            setEndDate(new Date(sortedDates[sortedDates.length - 1]));
          }
        }
      } catch (error) {
        console.error('시간표 불러오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingSchedule();
  }, []);

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
    setIsDragging(true);
    setDragStart({ time, day });
  };

  const handleMouseEnter = (time: string, day: string) => {
    if (isDragging && dragStart) {
      const newSelectedSlots = new Set(selectedSlots);
      
      // 드래그 범위 내의 모든 슬롯 선택
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
          newSelectedSlots.add(slotKey);
        }
      }
      
      setSelectedSlots(newSelectedSlots);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleStartSchedule = async () => {
    if (!scheduleName.trim()) {
      alert('시간표 이름을 입력해주세요.');
      return;
    }

    if (selectedSlots.size === 0) {
      alert('최소 하나의 시간 슬롯을 선택해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      alert('시작 날짜와 종료 날짜를 모두 선택해주세요.');
      return;
    }

    try {
      setSaving(true);
      
      // 선택된 날짜 범위 생성
      const selectedDates: string[] = [];
      const currentDate = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      console.log('ScheduleSetupPage 저장 - 날짜 범위:', {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        startDateState: startDate,
        endDateState: endDate
      });
      
      while (currentDate <= endDateObj) {
        selectedDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      console.log('ScheduleSetupPage 저장 - 생성된 selectedDates:', selectedDates);

      // 시간 슬롯을 백엔드 형식으로 변환
      const timeSlots = Array.from(selectedSlots).map(slot => {
        const [time, day] = slot.split('-');
        return { day, time };
      });

      if (existingSchedule) {
        // 기존 시간표 수정
        await updateSchedule(existingSchedule.id, {
          name: scheduleName,
          timeSlots: timeSlots,
          selectedDates: selectedDates
        });
      } else {
        // 새 시간표 생성
        await createSchedule({
          name: scheduleName,
          timeSlots: timeSlots,
          selectedDates: selectedDates
        });
      }
      
      // 완료 페이지로 이동
      navigate('/schedule/complete');
    } catch (error) {
      console.error('시간표 저장 오류:', error);
      alert('시간표 설정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!existingSchedule) return;
    
    const confirmDelete = window.confirm('정말로 이 시간표를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      setSaving(true);
      await deleteSchedule(existingSchedule.id);
      alert('시간표가 삭제되었습니다.');
      navigate('/schedule');
    } catch (error) {
      console.error('시간표 삭제 오류:', error);
      alert('시간표 삭제 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <DatePickerStyles>
        <ContentContainer>
          <Title>
            {existingSchedule ? '시간표를 수정해주세요' : '시간표를 설정해주세요'}
          </Title>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              기존 시간표를 불러오는 중...
            </div>
          )}
          
          {existingSchedule && !loading && (
            <div style={{ 
              background: colors.backgroundSecondary, 
              padding: spacing.lg, 
              borderRadius: '12px', 
              marginBottom: spacing.lg,
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: colors.textSecondary }}>
                기존 시간표 "{existingSchedule.name}"를 불러왔습니다. 수정하거나 새로운 시간표를 설정해주세요.
              </p>
            </div>
          )}
        
        <FormSection>
          <Label>시간표 이름</Label>
          <Input
            type="text"
            placeholder="시간표 이름을 입력해주세요"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
          />
        </FormSection>

        <TimeGridContainer>
          <Label>시간 선택</Label>
          <ToggleButton onClick={() => setShowEarlyHours(!showEarlyHours)}>
            {showEarlyHours ? '오전 7시 이전 숨기기' : '오전 7시 이전 표시하기'}
          </ToggleButton>
          
          <TimeGrid
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <TimeSlot $isHeader>시간</TimeSlot>
            {weekDays.map(day => (
              <TimeSlot key={day} $isHeader>{day.toUpperCase()}</TimeSlot>
            ))}
            
            {/* 오전 7시 이전 시간 슬롯 (토글 가능) */}
            {showEarlyHours && earlyTimeSlots.map(time => (
              <React.Fragment key={time}>
                <TimeSlot $isHeader>{time}</TimeSlot>
                {weekDays.map(day => {
                  const slotKey = `${time}-${day}`;
                  const isSelected = selectedSlots.has(slotKey);
                  
                  return (
                    <TimeSlot
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
                <TimeSlot $isHeader>{time}</TimeSlot>
                {weekDays.map(day => {
                  const slotKey = `${time}-${day}`;
                  const isSelected = selectedSlots.has(slotKey);
                  
                  return (
                    <TimeSlot
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

        <DateSection>
          <Label>반복 날짜 선택</Label>
          <DateInputContainer>
            <DateInputWrapper>
              <Label>시작 날짜</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  placeholderText="시작 날짜를 선택하세요"
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  showPopperArrow={false}
                  popperPlacement="bottom-end"
                  className="custom-datepicker"
                />
              </DatePickerWrapper>
            </DateInputWrapper>
            
            <DateInputWrapper>
              <Label>종료 날짜</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  placeholderText="종료 날짜를 선택하세요"
                  dateFormat="yyyy-MM-dd"
                  isClearable
                  showPopperArrow={false}
                  popperPlacement="bottom-end"
                  minDate={startDate || undefined}
                  className="custom-datepicker"
                />
              </DatePickerWrapper>
            </DateInputWrapper>
          </DateInputContainer>
        </DateSection>

        <ButtonContainer>
          <MainButton onClick={handleStartSchedule} disabled={saving || loading}>
            {saving ? '저장 중...' : existingSchedule ? '시간표 수정하기' : '시간표 시작하기'}
          </MainButton>
          {existingSchedule && (
            <DeleteButton onClick={handleDeleteSchedule} disabled={saving || loading}>
              시간표 삭제하기
            </DeleteButton>
          )}
        </ButtonContainer>
        </ContentContainer>
      </DatePickerStyles>
    </PageContainer>
  );
};

export default ScheduleSetupPage;
