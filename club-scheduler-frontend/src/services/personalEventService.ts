import api from './api';

export interface TimeSlot {
  time: string;
  day: string;
}

export interface PersonalEvent {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
  selectedDates: string[];
  originalScheduleId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePersonalEventData {
  name: string;
  timeSlots: TimeSlot[];
  selectedDates: string[];
  originalScheduleId?: string;
}

export interface UpdatePersonalEventData {
  name?: string;
  timeSlots?: TimeSlot[];
  selectedDates?: string[];
}

// 사용자의 모든 개인 일정 조회
export const getPersonalEvents = async (): Promise<PersonalEvent[]> => {
  try {
    const timestamp = new Date().getTime();
    const response = await api.get(`/personal-events?_t=${timestamp}`);
    return response.data.personalEvents;
  } catch (error) {
    console.error('개인 일정 조회 오류:', error);
    throw error;
  }
};

// 특정 개인 일정 조회
export const getPersonalEvent = async (id: string): Promise<PersonalEvent> => {
  try {
    const response = await api.get(`/personal-events/${id}`);
    return response.data.personalEvent;
  } catch (error) {
    console.error('개인 일정 조회 오류:', error);
    throw error;
  }
};

// 개인 일정 생성
export const createPersonalEvent = async (data: CreatePersonalEventData): Promise<PersonalEvent> => {
  try {
    const response = await api.post('/personal-events', data);
    return response.data.personalEvent;
  } catch (error) {
    console.error('개인 일정 생성 오류:', error);
    throw error;
  }
};

// 개인 일정 수정
export const updatePersonalEvent = async (id: string, data: UpdatePersonalEventData): Promise<PersonalEvent> => {
  try {
    const response = await api.put(`/personal-events/${id}`, data);
    return response.data.personalEvent;
  } catch (error) {
    console.error('개인 일정 수정 오류:', error);
    throw error;
  }
};

// 개인 일정 삭제
export const deletePersonalEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/personal-events/${id}`);
  } catch (error) {
    console.error('개인 일정 삭제 오류:', error);
    throw error;
  }
};
