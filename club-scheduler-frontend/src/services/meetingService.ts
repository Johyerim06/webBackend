const API_BASE_URL = 'http://localhost:4000/api';

export interface Meeting {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  voting: boolean;
  creatorId: string;
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  userId?: string;
  name: string;
  email: string;
  availability: Availability[];
}

export interface Availability {
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

// 모든 모임 조회
export const getMeetings = async (): Promise<Meeting[]> => {
  const response = await fetch(`${API_BASE_URL}/meetings`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('모임 목록을 불러오는데 실패했습니다.');
  }
  
  return response.json();
};

// 특정 모임 조회 (ID로)
export const getMeeting = async (id: string): Promise<Meeting> => {
  const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('모임 정보를 불러오는데 실패했습니다.');
  }
  
  return response.json();
};

// 모임 생성
export const createMeeting = async (meetingData: {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  voting: boolean;
}): Promise<Meeting> => {
  const response = await fetch(`${API_BASE_URL}/meetings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(meetingData),
  });
  
  if (!response.ok) {
    throw new Error('모임 생성에 실패했습니다.');
  }
  
  return response.json();
};

// 모임 수정
export const updateMeeting = async (id: string, meetingData: {
  name?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  voting?: boolean;
}): Promise<Meeting> => {
  const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(meetingData),
  });
  
  if (!response.ok) {
    throw new Error('모임 수정에 실패했습니다.');
  }
  
  return response.json();
};

// 모임 삭제
export const deleteMeeting = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('모임 삭제에 실패했습니다.');
  }
};

// 참여자 가용시간 등록
export const addParticipant = async (meetingId: string, participantData: {
  name: string;
  email: string;
  availability: Availability[];
}): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/participants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(participantData),
  });
  
  if (!response.ok) {
    throw new Error('가용시간 등록에 실패했습니다.');
  }
};

// 참여자 목록 조회
export const getParticipants = async (meetingId: string): Promise<Participant[]> => {
  const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/participants`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('참여자 목록을 불러오는데 실패했습니다.');
  }
  
  return response.json();
};

// 가용시간 저장 (새로운 API)
export const saveAvailability = async (meetingId: string, availability: Availability[], personalEventId?: string): Promise<{personalEventId?: string}> => {
  const response = await fetch(`${API_BASE_URL}/availability/meeting/${meetingId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      availability,
      personalEventId
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '가용시간 저장에 실패했습니다.');
  }
  
  return response.json();
};

// 가용시간 조회
export const getAvailability = async (meetingId: string): Promise<{availability: Availability[]}> => {
  const response = await fetch(`${API_BASE_URL}/availability/meeting/${meetingId}`, {
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('가용시간 조회에 실패했습니다.');
  }
  
  return response.json();
};