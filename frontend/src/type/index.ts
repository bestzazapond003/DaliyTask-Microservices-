export type TaskCategory = 'general' | 'urgent' | 'meeting' | 'document';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type UserRole = 'admin' | 'manager' | 'staff';

export interface Task {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  date: string;
  category: TaskCategory;
  priority: TaskPriority;
  status?: TaskStatus;
  userId?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  id: string;
}

export interface User {
  id: string;
  name: string;
  department: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  department: string;
  role: UserRole;
}

export type DateRangePreset = 'today' | 'this_week' | 'this_month' | 'custom';

export interface DateRangeFilter {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number; // Percentage 0-100
}

export interface UserWorkloadStats {
  userId: string;
  userName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionRate: number;
}
