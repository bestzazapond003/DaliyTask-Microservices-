import React, { useEffect } from 'react';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';
import { DashboardOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { fetchTasks } from '../../../store/slices/taskSlice';
import { DateRangeFilterComponent } from '../../../component/DateRangeFilter';
import { SummaryCards } from '../components/SummaryCards';
import { StatusPieChart } from '../components/StatusPieChart';
import { TrendBarChart } from '../components/TrendBarChart';
import { isOverdue } from '../../../lib/dateUtils';
import type { DashboardStats } from '../../../type';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.task.tasks);
  const loading = useAppSelector((state) => state.task.loading);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, currentUser]);

  // Filter tasks for current user
  const userTasks = currentUser ? tasks.filter((t) => t.userId === currentUser.id) : tasks;

  const completed = userTasks.filter((t) => t.status === 'completed').length;
  const inProgress = userTasks.filter((t) => t.status === 'in_progress').length;
  const pending = userTasks.filter((t) => t.status === 'pending').length;
  const overdue = userTasks.filter((t) => isOverdue(t.date, t.status)).length;
  const total = userTasks.length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats: DashboardStats = {
    totalTasks: total,
    completedTasks: completed,
    inProgressTasks: inProgress,
    pendingTasks: pending,
    overdueTasks: overdue,
    completionRate: rate,
  };

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Header Title */}
      <Box className="mb-6">
        <Typography variant="h5" component="h1" className="font-bold flex items-center gap-2.5 mb-1">
          <DashboardOutlined className="text-blue-500" fontSize="large" />
          แดชบอร์ดส่วนตัว (Analytics)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          สรุปภาพรวมและสถิติการทำงานย้อนหลังของคุณ {currentUser ? `(${currentUser.name})` : ''}
        </Typography>
      </Box>

      {/* Date Filter Bar */}
      <Paper elevation={0} className="p-4 mb-6">
        <DateRangeFilterComponent />
      </Paper>

      {loading ? (
        <Box className="flex justify-center items-center py-20">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <SummaryCards stats={stats} />

          {/* Charts Row */}
          <Box className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4">
            <Box className="md:col-span-5">
              <StatusPieChart stats={stats} />
            </Box>
            <Box className="md:col-span-7">
              <TrendBarChart tasks={userTasks} />
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;
