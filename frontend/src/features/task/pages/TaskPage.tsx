import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  TextField,
  InputAdornment,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Add,
  AssignmentTurnedIn,
  Search,
  CheckCircleOutlined,
  HourglassTop,
  PlaylistAddCheck,
  ErrorOutlined,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import {
  fetchTasks,
  createTaskAsync,
  updateTaskAsync,
  deleteTaskAsync,
  setStatusFilter,
} from '../../../store/slices/taskSlice';
import { showToast } from '../../../store/slices/uiSlice';
import type { Task } from '../../../type';
import { TaskCard } from '../components/TaskCard';
import { TaskTable } from '../components/TaskTable';
import { TaskFormDialog } from '../components/TaskFormDialog';
import type { TaskFormData } from '../validation/taskSchema';
import { DateRangeFilterComponent } from '../../../component/DateRangeFilter';
import { isOverdue } from '../../../lib/dateUtils';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ViewList, ViewModule } from '@mui/icons-material';

const ITEMS_PER_PAGE = 6;

export const TaskPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.task.tasks);
  const loading = useAppSelector((state) => state.task.loading);
  const error = useAppSelector((state) => state.task.error);
  const statusFilter = useAppSelector((state) => state.task.statusFilter);
  const currentUser = useAppSelector((state) => state.user.currentUser);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch, currentUser]);

  const handleOpenAddDialog = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = async (data: TaskFormData) => {
    if (editingTask) {
      await dispatch(
        updateTaskAsync({
          id: editingTask.id,
          ...data,
        })
      );
      dispatch(showToast({ message: 'อัปเดตรายการงานเรียบร้อยแล้ว ✅', severity: 'success' }));
    } else {
      await dispatch(
        createTaskAsync({
          ...data,
          userId: currentUser?.id || '',
        })
      );
      dispatch(showToast({ message: 'เพิ่มรายการงานใหม่เรียบร้อยแล้ว 📝', severity: 'success' }));
    }
    dispatch(fetchTasks());
  };

  const handleToggleStatus = async (task: Task) => {
    const nextStatusMap: Record<string, 'pending' | 'in_progress' | 'completed'> = {
      pending: 'in_progress',
      in_progress: 'completed',
      completed: 'pending',
    };
    const nextStatus = nextStatusMap[task.status];
    await dispatch(
      updateTaskAsync({
        id: task.id,
        status: nextStatus,
      })
    );
    const statusMsg =
      nextStatus === 'completed'
        ? 'เปลี่ยนสถานะเป็น: ทำเสร็จแล้ว 🎉'
        : nextStatus === 'in_progress'
        ? 'เปลี่ยนสถานะเป็น: กำลังทำ 🔄'
        : 'เปลี่ยนสถานะเป็น: รอดำเนินการ ⏳';
    dispatch(showToast({ message: statusMsg, severity: 'info' }));
    dispatch(fetchTasks());
  };

  const handleDeleteConfirm = async () => {
    if (deletingId) {
      await dispatch(deleteTaskAsync(deletingId));
      setDeletingId(null);
      dispatch(showToast({ message: 'ลบรายการงานเรียบร้อยแล้ว 🗑️', severity: 'warning' }));
      dispatch(fetchTasks());
    }
  };

  // Filter tasks for current user
  const userTasks = currentUser ? tasks.filter((t) => t.userId === currentUser.id) : tasks;

  // Apply Status & Search query filters
  const filteredTasks = userTasks.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const counts = {
    all: userTasks.length,
    pending: userTasks.filter((t) => t.status === 'pending').length,
    in_progress: userTasks.filter((t) => t.status === 'in_progress').length,
    completed: userTasks.filter((t) => t.status === 'completed').length,
    overdue: userTasks.filter((t) => isOverdue(t.date, t.status)).length,
  };

  return (
    <Container maxWidth="lg" className="py-8 relative pb-20">
      {/* Top Header Row */}
      <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Box>
          <Typography variant="h5" component="h1" className="font-bold flex items-center gap-2.5">
            <PlaylistAddCheck className="text-blue-500" fontSize="large" />
            บันทึกงานประจำวัน
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-0.5">
            จัดการและจดบันทึกภาระงานของคุณ {currentUser ? `(${currentUser.name})` : ''}
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
          size="medium"
          className="shadow-md font-bold rounded-xl px-5 py-2.5"
        >
          เพิ่มงานใหม่
        </Button>
      </Box>

      {/* Mini Summary Cards Strip */}
      <Grid container spacing={2} className="mb-6">
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} className="p-3.5 flex items-center gap-3">
            <Box className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold">
              {counts.all}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" className="block text-[11px] font-semibold">
                งานทั้งหมด
              </Typography>
              <Typography variant="subtitle2" className="font-bold">
                {counts.all} รายการ
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} className="p-3.5 flex items-center gap-3">
            <Box className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
              <HourglassTop fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" className="block text-[11px] font-semibold">
                รอดำเนินการ / กำลังทำ
              </Typography>
              <Typography variant="subtitle2" className="font-bold">
                {counts.pending + counts.in_progress} รายการ
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} className="p-3.5 flex items-center gap-3">
            <Box className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold">
              <CheckCircleOutlined fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" className="block text-[11px] font-semibold">
                ทำเสร็จแล้ว
              </Typography>
              <Typography variant="subtitle2" className="font-bold text-emerald-600 dark:text-emerald-400">
                {counts.completed} รายการ
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} className="p-3.5 flex items-center gap-3">
            <Box className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold">
              <ErrorOutlined fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" className="block text-[11px] font-semibold">
                เลยกำหนดส่ง
              </Typography>
              <Typography variant="subtitle2" className="font-bold text-rose-600 dark:text-rose-400">
                {counts.overdue} รายการ
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Date Range Filter Bar, Search Box & View Switcher */}
      <Paper elevation={0} className="p-4 mb-6 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <DateRangeFilterComponent />

        <Box className="flex items-center gap-3">
          {/* Search Field */}
          <TextField
            size="small"
            placeholder="ค้นหาหัวข้อหรือรายละเอียด..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 220 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* View Switcher Toggle */}
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            aria-label="view mode"
          >
            <Tooltip title="มุมมองตาราง (Data Table View)">
              <ToggleButton value="table" aria-label="table view">
                <ViewList fontSize="small" />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="มุมมองการ์ด (Grid Card View)">
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModule fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Box>
      </Paper>

      {/* Status Filter Tabs */}
      <Box className="mb-6">
        <Tabs
          value={statusFilter}
          onChange={(_, newValue) => {
            dispatch(setStatusFilter(newValue));
            setPage(1);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 44,
            '& .MuiTabs-indicator': { height: 3, borderRadius: 3 },
          }}
        >
          <Tab label={`ทั้งหมด (${counts.all})`} value="all" sx={{ fontWeight: 600, minHeight: 44 }} />
          <Tab label={`รอดำเนินการ (${counts.pending})`} value="pending" sx={{ fontWeight: 600, minHeight: 44 }} />
          <Tab label={`กำลังทำ (${counts.in_progress})`} value="in_progress" sx={{ fontWeight: 600, minHeight: 44 }} />
          <Tab label={`เสร็จแล้ว (${counts.completed})`} value="completed" sx={{ fontWeight: 600, minHeight: 44 }} />
        </Tabs>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" className="mb-6 rounded-xl">
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <Box className="flex justify-center p-16">
          <CircularProgress />
        </Box>
      ) : filteredTasks.length === 0 ? (
        /* Empty State */
        <Paper elevation={0} className="p-12 text-center border-dashed border border-blue-200/50 dark:border-blue-900/30 rounded-2xl my-4">
          <AssignmentTurnedIn className="text-blue-300 dark:text-blue-700 text-6xl mb-3 opacity-80" />
          <Typography variant="h6" className="font-semibold mb-1">
            {searchQuery ? 'ไม่พบรายการงานที่ตรงกับคำค้นหา' : 'ยังไม่มีรายการงานในช่วงเวลานี้'}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-5 max-w-sm mx-auto text-xs">
            {searchQuery ? 'ลองเปลี่ยนคำค้นหาหรือล้างคำค้นหาเพื่อดูงานทั้งหมด' : 'เริ่มต้นจดบันทึกสิ่งที่ต้องทำสำหรับวันนี้ได้ทันที'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
            className="rounded-xl px-5 py-2.5 font-semibold"
          >
            เพิ่มงานแรกของคุณ
          </Button>
        </Paper>
      ) : (
        /* Task List/Grid & Pagination */
        <>
          {viewMode === 'table' ? (
            <TaskTable
              tasks={paginatedTasks}
              onEdit={handleOpenEditDialog}
              onDelete={(id) => setDeletingId(id)}
              onToggleStatus={handleToggleStatus}
            />
          ) : (
            <Grid container spacing={3}>
              {paginatedTasks.map((task) => (
                <Grid key={task.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <TaskCard
                    task={task}
                    onEdit={handleOpenEditDialog}
                    onDelete={(id) => setDeletingId(id)}
                    onToggleStatus={handleToggleStatus}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Box className="flex justify-center mt-10">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
                shape="rounded"
                size="medium"
              />
            </Box>
          )}
        </>
      )}

      {/* Mobile Floating Action Button (FAB) */}
      <Tooltip title="เพิ่มงานใหม่">
        <Fab
          color="primary"
          aria-label="add task"
          onClick={handleOpenAddDialog}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', md: 'none' },
            boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      {/* Form Dialog for Add/Edit */}
      <TaskFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSaveTask}
        initialData={editingTask}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deletingId)} onClose={() => setDeletingId(null)}>
        <DialogTitle className="font-bold">ยืนยันการลบรายการงาน</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            คุณต้องการลบรายการงานนี้ใช่หรือไม่? เมื่อลบแล้วจะไม่สามารถกู้คืนได้
          </Typography>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => setDeletingId(null)} color="inherit">
            ยกเลิก
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" className="rounded-xl font-bold">
            ยืนยันลบ
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskPage;
