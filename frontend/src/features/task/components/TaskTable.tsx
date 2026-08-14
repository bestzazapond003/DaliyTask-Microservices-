import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, MoreVert, CalendarToday, Warning } from '@mui/icons-material';
import type { Task, TaskPriority } from '../../../type';
import { TaskStatusChip } from './TaskStatusChip';
import { formatDateThai, isOverdue } from '../../../lib/dateUtils';
import { useAppSelector } from '../../../store/store';
import { useColorMode } from '../../../theme/ColorModeContext';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
  showUser?: boolean;
}

const priorityMap: Record<TaskPriority, { label: string; color: 'error' | 'warning' | 'default' }> = {
  high: { label: 'ด่วนมาก', color: 'error' },
  medium: { label: 'ปานกลาง', color: 'warning' },
  low: { label: 'ปกติ', color: 'default' },
};

const categoryMap: Record<string, string> = {
  general: 'งานทั่วไป',
  urgent: 'งานด่วน',
  meeting: 'ประชุม',
  document: 'เอกสาร',
};

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { mode } = useColorMode();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>, task: Task) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedTask(task);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedTask(null);
  };

  const columns: GridColDef<Task>[] = [
    {
      field: 'date',
      headerName: 'วันที่ต้องทำ',
      width: 150,
      sortable: true,
      renderCell: (params: GridRenderCellParams<Task>) => (
        <Box className="flex items-center gap-2 h-full">
          <Box className="w-7 h-7 rounded-lg bg-blue-600/10 dark:bg-blue-400/20 flex items-center justify-center text-blue-700 dark:text-blue-400">
            <CalendarToday sx={{ fontSize: 14 }} />
          </Box>
          <Typography variant="body2" className="font-bold text-xs text-slate-900 dark:text-slate-100 whitespace-nowrap">
            {formatDateThai(params.row.date)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'title',
      headerName: 'หัวข้องาน & รายละเอียด',
      flex: 1,
      minWidth: 280,
      renderCell: (params: GridRenderCellParams<Task>) => {
        const overdue = isOverdue(params.row.date, params.row.status);
        return (
          <Box className="flex flex-col justify-center h-full py-1.5 pr-2">
            <Box className="flex items-center gap-2">
              <Typography
                variant="body2"
                className={`font-bold text-xs tracking-tight ${
                  params.row.status === 'completed'
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {params.row.title}
              </Typography>
              {overdue && (
                <Chip
                  icon={<Warning sx={{ fontSize: '11px !important' }} />}
                  label="เลยกำหนด"
                  color="error"
                  size="small"
                  sx={{ height: 18, fontSize: 9, fontWeight: 700 }}
                />
              )}
            </Box>
            {params.row.description && (
              <Typography variant="caption" className="block text-[11px] line-clamp-1 mt-0.5 text-slate-600 dark:text-slate-400">
                {params.row.description}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: 'category',
      headerName: 'หมวดหมู่',
      width: 120,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<Task>) => (
        <Box className="flex items-center justify-center h-full">
          <Chip
            label={categoryMap[params.row.category] || params.row.category}
            size="small"
            variant="filled"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 700,
              bgcolor: mode === 'dark' ? 'rgba(110, 172, 218, 0.2)' : '#E0F2FE',
              color: mode === 'dark' ? '#90CAF9' : '#0369A1',
            }}
          />
        </Box>
      ),
    },
    {
      field: 'priority',
      headerName: 'ความสำคัญ',
      width: 110,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<Task>) => (
        <Box className="flex items-center justify-center h-full">
          <Chip
            label={priorityMap[params.row.priority].label}
            color={priorityMap[params.row.priority].color}
            size="small"
            variant="outlined"
            sx={{ height: 22, fontSize: 11, fontWeight: 700 }}
          />
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'สถานะงาน',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<Task>) => {
        const isOwner = params.row.userId === currentUser?.id;
        const canManage = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'manager';
        return (
          <Box className="flex items-center justify-center h-full">
            <Tooltip title={canManage ? 'คลิกเพื่อเปลี่ยนสถานะงาน' : 'เฉพาะเจ้าของงานหรือ Manager/Admin'}>
              <Box>
                <TaskStatusChip
                  status={params.row.status}
                  onClick={() => canManage && onToggleStatus(params.row)}
                  clickable={canManage}
                />
              </Box>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'จัดการ',
      width: 70,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      renderCell: (params: GridRenderCellParams<Task>) => {
        const isOwner = params.row.userId === currentUser?.id;
        const canManage = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'manager';
        if (!canManage) return <Typography variant="caption" color="text.secondary">-</Typography>;
        return (
          <Box className="flex items-center justify-center h-full">
            <IconButton
              size="small"
              onClick={(e) => handleOpenMenu(e, params.row)}
              sx={{
                p: 0.8,
                color: mode === 'dark' ? '#CBD5E1' : '#334155',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper elevation={0} className="w-full rounded-2xl overflow-hidden glass-panel border border-slate-300/80 dark:border-slate-800/80">
      <DataGrid
        rows={tasks}
        columns={columns}
        rowHeight={60}
        hideFooter
        disableRowSelectionOnClick
        sx={{
          border: 'none',
          backgroundColor: 'transparent',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: mode === 'dark' ? '#081726' : '#F1F5F9',
            borderBottom: mode === 'dark' ? '1px solid rgba(110, 172, 218, 0.15)' : '1px solid rgba(15, 23, 42, 0.12)',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 800,
            fontSize: '0.75rem',
            color: mode === 'dark' ? '#CBD5E1' : '#1E293B',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: mode === 'dark' ? '1px solid rgba(110, 172, 218, 0.08)' : '1px solid rgba(15, 23, 42, 0.08)',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row': {
            transition: 'background-color 0.2s ease',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: mode === 'dark' ? 'rgba(110, 172, 218, 0.06)' : 'rgba(30, 58, 138, 0.04)',
          },
        }}
      />

      {/* Overflow Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 140, p: 0.5, borderRadius: 3 } } }}
      >
        <MenuItem
          onClick={() => {
            if (selectedTask) onEdit(selectedTask);
            handleCloseMenu();
          }}
          className="rounded-xl text-xs font-medium"
        >
          <ListItemIcon>
            <Edit fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="แก้ไข" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedTask) onDelete(selectedTask.id);
            handleCloseMenu();
          }}
          className="rounded-xl text-xs font-medium text-red-600"
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="ลบ" />
        </MenuItem>
      </Menu>
    </Paper>
  );
};
