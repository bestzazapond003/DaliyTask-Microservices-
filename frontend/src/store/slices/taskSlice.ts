import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task, CreateTaskDto, UpdateTaskDto, DateRangeFilter } from '../../type';
import { taskService } from '../../service/taskService';
import { getPresetDateRange } from '../../lib/dateUtils';

interface TaskState {
  tasks: Task[];
  dateFilter: DateRangeFilter;
  selectedUserId: string; // 'all' or specific userId
  statusFilter: string;   // 'all', 'pending', 'in_progress', 'completed'
  loading: boolean;
  error: string | null;
}

const defaultRange = getPresetDateRange('today');

const initialState: TaskState = {
  tasks: [],
  dateFilter: {
    preset: 'today',
    startDate: defaultRange.startDate,
    endDate: defaultRange.endDate,
  },
  selectedUserId: 'all',
  statusFilter: 'all',
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('task/fetchTasks', async (_, { getState }) => {
  const state = getState() as { task: TaskState };
  return await taskService.getTasks(state.task.dateFilter, state.task.selectedUserId);
});

export const createTaskAsync = createAsyncThunk('task/createTask', async (dto: CreateTaskDto) => {
  return await taskService.createTask(dto);
});

export const updateTaskAsync = createAsyncThunk('task/updateTask', async (dto: UpdateTaskDto) => {
  return await taskService.updateTask(dto);
});

export const deleteTaskAsync = createAsyncThunk('task/deleteTask', async (id: string) => {
  return await taskService.deleteTask(id);
});

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setDateFilter: (state, action: PayloadAction<DateRangeFilter>) => {
      state.dateFilter = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    taskCreatedRealtime: (state, action: PayloadAction<Task>) => {
      const exists = state.tasks.some((t) => t.id === action.payload.id);
      if (!exists) {
        state.tasks.unshift(action.payload);
      }
    },
    taskUpdatedRealtime: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      } else {
        state.tasks.unshift(action.payload);
      }
    },
    taskDeletedRealtime: (state, action: PayloadAction<{ id: string }>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create Task
      .addCase(createTaskAsync.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      // Update Task
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setDateFilter, setSelectedUserId, setStatusFilter, taskCreatedRealtime, taskUpdatedRealtime, taskDeletedRealtime } = taskSlice.actions;
export default taskSlice.reducer;
