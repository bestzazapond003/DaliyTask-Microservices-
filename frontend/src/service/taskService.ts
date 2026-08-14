import type { Task, CreateTaskDto, UpdateTaskDto, DateRangeFilter } from '../type';
import { apiClient } from './api';

export const taskService = {
  getTasks: async (filter?: DateRangeFilter, userId?: string): Promise<Task[]> => {
    const params: any = {};
    if (filter?.startDate) params.startDate = filter.startDate;
    if (filter?.endDate) params.endDate = filter.endDate;
    if (userId && userId !== 'all') params.userId = userId;

    const response = await apiClient.get<Task[], Task[]>('/tasks', { params });
    return response || [];
  },

  getTaskById: async (id: string): Promise<Task> => {
    return await apiClient.get<Task, Task>(`/tasks/${id}`);
  },

  createTask: async (dto: CreateTaskDto): Promise<Task> => {
    return await apiClient.post<Task, Task>('/tasks', dto);
  },

  updateTask: async (dto: UpdateTaskDto): Promise<Task> => {
    return await apiClient.put<Task, Task>(`/tasks/${dto.id}`, dto);
  },

  updateStatus: async (id: string, status: string): Promise<Task> => {
    return await apiClient.patch<Task, Task>(`/tasks/${id}/status`, { status });
  },

  deleteTask: async (id: string): Promise<string> => {
    await apiClient.delete(`/tasks/${id}`);
    return id;
  },
};
