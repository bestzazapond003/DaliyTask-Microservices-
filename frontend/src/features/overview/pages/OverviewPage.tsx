import { socketService, SocketRooms } from '../../../service/socketService';
import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import { GroupOutlined, TaskAlt, CheckCircle, HourglassEmpty } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { fetchTasks, setSelectedUserId, updateTaskAsync, deleteTaskAsync } from '../../../store/slices/taskSlice';
import { fetchUsers } from '../../../store/slices/userSlice';
import { showToast } from '../../../store/slices/uiSlice';
import { DateRangeFilterComponent } from '../../../component/DateRangeFilter';
import { UserWorkloadTable } from '../components/UserWorkloadTable';
import { TaskCard } from '../../task/components/TaskCard';
import type { Task, UserWorkloadStats } from '../../../type';

const roleColorMap = {
  admin: 'error' as const,
  manager: 'warning' as const,
  staff: 'default' as const,
};

export const OverviewPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.task.tasks);
  const users = useAppSelector((state) => state.user.users);
  const selectedUserId = useAppSelector((state) => state.task.selectedUserId);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchTasks());

    // ⚡ Join Team Overview Socket.IO Room for Real-Time Sync
    socketService.joinRoom(SocketRooms.TEAM_OVERVIEW);

    return () => {
      socketService.leaveRoom(SocketRooms.TEAM_OVERVIEW);
    };
  }, [dispatch, selectedUserId]);

  const handleUserFilterChange = (userId: string) => {
    dispatch(setSelectedUserId(userId));
    dispatch(fetchTasks());
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatusMap: Record<string, 'pending' | 'in_progress' | 'completed'> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    };
    await dispatch(
      updateTaskAsync({
        id: task.id,
        status: nextStatusMap[task.status],
      })
    );
    dispatch(showToast({ message: 'อัปเดตสถานะงานเรียบร้อยแล้ว ✅', severity: 'info' }));
    dispatch(fetchTasks());
  };

  const handleDeleteTask = async (id: string) => {
    await dispatch(deleteTaskAsync(id));
    dispatch(showToast({ message: 'ลบรายการงานเรียบร้อยแล้ว 🗑️', severity: 'success' }));
    dispatch(fetchTasks());
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;

  const workloadStats: UserWorkloadStats[] = users.map((user) => {
    const userTaskList = tasks.filter((t) => t.userId === user.id);
    const completed = userTaskList.filter((t) => t.status === 'completed').length;
    const inProgress = userTaskList.filter((t) => t.status === 'in_progress').length;
    const pending = userTaskList.filter((t) => t.status === 'pending').length;
    const total = userTaskList.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      userId: user.id,
      userName: user.name,
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      pendingTasks: pending,
      completionRate,
    };
  });

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Page Title */}
      <Box className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Box>
          <Typography variant="h5" component="h1" className="font-bold flex items-center gap-2.5 mb-1">
            <GroupOutlined className="text-blue-500" fontSize="large" />
            ภาพรวมงานของทีม (Team Overview)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            สรุปภาพรวมภาระงานและสถานะการทำงานของสมาชิกทุกคนในทีม
          </Typography>
        </Box>
      </Box>

      {/* Date & User Filter Controls */}
      <Paper elevation={0} className="p-4 mb-6">
        <Box className="flex flex-col md:flex-row items-center gap-4">
          <Box className="w-full md:flex-1">
            <DateRangeFilterComponent />
          </Box>
          <Box className="w-full md:w-80">
            <FormControl fullWidth size="small">
              <InputLabel>กรองตามสมาชิก (Filter Member)</InputLabel>
              <Select
                value={selectedUserId}
                label="กรองตามสมาชิก (Filter Member)"
                onChange={(e) => handleUserFilterChange(e.target.value)}
              >
                <MenuItem value="all">
                  <Typography variant="body2" className="font-bold">
                    👥 สมาชิกทุกคนในทีม (All Members)
                  </Typography>
                </MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    <Box className="flex items-center gap-2 w-full justify-between">
                      <Box className="flex items-center gap-2">
                        <Avatar sx={{ width: 22, height: 22, fontSize: 10, bgcolor: 'primary.main' }}>
                          {u.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{u.name}</Typography>
                      </Box>
                      <Chip
                        label={u.role?.toUpperCase() || 'STAFF'}
                        color={roleColorMap[u.role || 'staff']}
                        size="small"
                        sx={{ fontSize: 9, height: 18 }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      {/* Summary KPI Cards */}
      <Box className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Paper elevation={0} className="p-4 flex items-center gap-4 rounded-2xl border-l-4 border-emerald-500">
          <CheckCircle className="text-emerald-500 text-3xl" />
          <Box>
            <Typography variant="body2" color="text.secondary">งานที่เสร็จแล้ว</Typography>
            <Typography variant="h5" className="font-extrabold">{completedCount} งาน</Typography>
          </Box>
        </Paper>
        <Paper elevation={0} className="p-4 flex items-center gap-4 rounded-2xl border-l-4 border-amber-500">
          <HourglassEmpty className="text-amber-500 text-3xl" />
          <Box>
            <Typography variant="body2" color="text.secondary">กำลังดำเนินการ</Typography>
            <Typography variant="h5" className="font-extrabold">{inProgressCount} งาน</Typography>
          </Box>
        </Paper>
        <Paper elevation={0} className="p-4 flex items-center gap-4 rounded-2xl border-l-4 border-blue-500">
          <TaskAlt className="text-blue-500 text-3xl" />
          <Box>
            <Typography variant="body2" color="text.secondary">งานทั้งหมด</Typography>
            <Typography variant="h5" className="font-extrabold">{tasks.length} งาน</Typography>
          </Box>
        </Paper>
      </Box>

      {/* Workload Table */}
      <Box className="mb-8">
        <Typography variant="h6" className="font-bold mb-3">
          📊 ภาระงานรายบุคคล (Workload Summary)
        </Typography>
        <UserWorkloadTable
          data={workloadStats}
          onSelectUser={handleUserFilterChange}
        />
      </Box>

      {/* Task List Grid */}
      <Box>
        <Typography variant="h6" className="font-bold mb-4">
          📝 รายการงานของทีม ({tasks.length} รายการ)
        </Typography>
        {tasks.length === 0 ? (
          <Paper elevation={0} className="p-8 text-center rounded-2xl">
            <Typography variant="body1" color="text.secondary">
              ไม่พบรายการงานในช่วงเวลาหรือสมาชิกที่เลือก
            </Typography>
          </Paper>
        ) : (
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
                showUser={true}
              />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OverviewPage;
