export enum TaskStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED'
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  ROUTINES = 'ROUTINES',
  CHAT = 'CHAT'
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface Task {
  id: string;
  projectId: string | null; // null if it's a general routine
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  isRoutine: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: Date;
  isAi: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}