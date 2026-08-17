import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store/store';
import Header from './component/Header';
import ProtectedRoute from './component/ProtectedRoute';
import ToastNotification from './component/ToastNotification';
import TaskPage from './features/task/pages/TaskPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import OverviewPage from './features/overview/pages/OverviewPage';
import SettingPage from './features/setting/pages/SettingPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import { fetchCurrentUser } from './store/slices/userSlice';
import { taskCreatedRealtime, taskUpdatedRealtime, taskDeletedRealtime } from './store/slices/taskSlice';
import { showToast } from './store/slices/uiSlice';
import { socketService } from './service/socketService';
import type { Task } from './type';

function AppContent() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // ⚡ Global Socket.IO Real-Time Listeners
  useEffect(() => {
    socketService.init();

    // 1. Task Created Event
    const handleTaskCreated = (newTask: Task) => {
      dispatch(taskCreatedRealtime(newTask));
      if (newTask.userId !== currentUser?.id) {
        dispatch(
          showToast({
            message: `⚡ ${newTask.userName || 'เพื่อนร่วมทีม'} ได้สร้างงานใหม่: "${newTask.title}"`,
            severity: newTask.category === 'urgent' ? 'warning' : 'info',
          })
        );
      }
    };

    // 2. Task Updated Event (e.g. status change or edit)
    const handleTaskUpdated = (updatedTask: Task) => {
      dispatch(taskUpdatedRealtime(updatedTask));
      if (updatedTask.userId !== currentUser?.id) {
        const statusLabel =
          updatedTask.status === 'completed'
            ? 'เสร็จแล้ว 🎉'
            : updatedTask.status === 'in_progress'
            ? 'กำลังทำ 🔄'
            : 'รอดำเนินการ ⏳';

        dispatch(
          showToast({
            message: `📝 งาน "${updatedTask.title}" เปลี่ยนสถานะเป็น: ${statusLabel}`,
            severity: updatedTask.status === 'completed' ? 'success' : 'info',
          })
        );
      }
    };

    // 3. Task Deleted Event
    const handleTaskDeleted = (data: { id: string; userId?: string }) => {
      dispatch(taskDeletedRealtime({ id: data.id }));
    };

    // 4. Urgent Alert
    const handleUrgentAlert = (alert: { title: string; message: string }) => {
      dispatch(
        showToast({
          message: `🚨 แจ้งเตือนงานด่วน: ${alert.title}`,
          severity: 'error',
        })
      );
    };

    socketService.on('task:created', handleTaskCreated);
    socketService.on('task:updated', handleTaskUpdated);
    socketService.on('task:deleted', handleTaskDeleted);
    socketService.on('urgent_alert', handleUrgentAlert);

    return () => {
      socketService.off('task:created', handleTaskCreated);
      socketService.off('task:updated', handleTaskUpdated);
      socketService.off('task:deleted', handleTaskDeleted);
      socketService.off('urgent_alert', handleUrgentAlert);
    };
  }, [dispatch, currentUser]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/task" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/task"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <OverviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/setting"
          element={
            <ProtectedRoute>
              <SettingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastNotification />
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
