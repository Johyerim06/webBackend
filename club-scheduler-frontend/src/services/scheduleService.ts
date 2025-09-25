import api from './api';

export interface TimeSlot {
  time: string;
  day: string;
}

export interface Schedule {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
  selectedDates: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateScheduleData {
  name: string;
  timeSlots: TimeSlot[];
  selectedDates: string[];
}

export interface UpdateScheduleData {
  name?: string;
  timeSlots?: TimeSlot[];
  selectedDates?: string[];
}

// 사용자의 모든 시간표 조회
export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    const timestamp = new Date().getTime();
    const response = await api.get(`/schedules?_t=${timestamp}`);
    return response.data.schedules;
  } catch (error) {
    console.error('시간표 조회 오류:', error);
    throw error;
  }
};

// 특정 시간표 조회
export const getSchedule = async (id: string): Promise<Schedule> => {
  try {
    const response = await api.get(`/schedules/${id}`);
    return response.data.schedule;
  } catch (error) {
    console.error('시간표 조회 오류:', error);
    throw error;
  }
};

// 시간표 생성
export const createSchedule = async (data: CreateScheduleData): Promise<Schedule> => {
  try {
    const response = await api.post('/schedules', data);
    return response.data.schedule;
  } catch (error) {
    console.error('시간표 생성 오류:', error);
    throw error;
  }
};

// 시간표 수정
export const updateSchedule = async (id: string, data: UpdateScheduleData): Promise<Schedule> => {
  try {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data.schedule;
  } catch (error) {
    console.error('시간표 수정 오류:', error);
    throw error;
  }
};

// 시간표 삭제
export const deleteSchedule = async (id: string): Promise<void> => {
  try {
    await api.delete(`/schedules/${id}`);
  } catch (error) {
    console.error('시간표 삭제 오류:', error);
    throw error;
  }
};

// 수정된 일정 저장 (새로운 일정으로 저장)
export const saveModifiedSchedule = async (data: CreateScheduleData): Promise<Schedule> => {
  try {
    const response = await api.post('/schedules/save-modified', data);
    return response.data.schedule;
  } catch (error) {
    console.error('수정된 일정 저장 오류:', error);
    throw error;
  }
};
