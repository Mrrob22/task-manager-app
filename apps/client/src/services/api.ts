import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export async function getPresignedUrl(params: { filename: string; type: string }) {
  const { data } = await api.post('/upload/presign', params);
  return data as { uploadUrl: string; fileUrl: string; key: string };
}

export async function putToS3(uploadUrl: string, file: File) {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type || 'application/octet-stream' },
    body: file,
  });
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
}

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in_progress' | 'done';

export type TaskDTO = {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate?: string;
  assignee?: { id: string; name: string } | null;
  attachment?: { url: string; key: string; name: string; size: number; type: string } | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ReorderItem = { id: string; status: Status; order: number };
export type ReorderPayload = { items: ReorderItem[] };

export async function listTasks() {
  const { data } = await api.get<TaskDTO[]>('/tasks');
  return data;
}

export async function createTask(payload: Partial<TaskDTO>) {
  const { data } = await api.post<TaskDTO>('/tasks', payload);
  return data;
}

export async function reorderTasks(
  payload: ReorderPayload
): Promise<{ modified: number; matched: number }> {
  const { data } = await api.patch<{ modified: number; matched: number }>(
    "/tasks/reorder",
    payload
  );
  return data;
}

export async function patchTask(id: string, payload: Partial<TaskDTO>) {
  const { data } = await api.patch<TaskDTO>(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: string) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
}

export type UserDTO = {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export async function searchUsers(q = '') {
  const { data } = await api.get<UserDTO[]>('/users', { params: q ? { q } : {} });
  return data;
}

export async function createUser(payload: { name: string; email: string; avatarUrl?: string }) {
  const { data } = await api.post<UserDTO>('/users', payload);
  return data;
}
