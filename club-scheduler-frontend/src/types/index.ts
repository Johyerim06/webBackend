// 사용자 타입
export interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  role: 'admin' | 'member';
}

// 동아리 타입
export interface Club {
  id: string;
  name: string;
  description: string;
  members: User[];
  admin: User;
}

// 이벤트 타입
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  clubId: string;
  createdBy: string;
}

// 투표 타입
export interface Vote {
  id: string;
  eventId: string;
  userId: string;
  option: string;
  createdAt: string;
}

// 할일 타입
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  clubId: string;
  assignedTo: string;
  dueDate?: string;
}

// 가용성 타입
export interface Availability {
  id: string;
  eventId: string;
  userId: string;
  slots: string[];
  createdAt: string;
}
