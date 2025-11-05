export type Status = 'todo' | 'progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface Attachment {
  url?: string;
  key?: string;
  name?: string;
  size?: number;
  type?: string;
}

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
  email?: string;
}

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  status: Status;
  assignee?: Assignee;
  attachment?: Attachment;
  createdAt?: string;
  updatedAt?: string;
}
