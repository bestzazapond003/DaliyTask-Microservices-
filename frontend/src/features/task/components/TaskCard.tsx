import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Edit, Delete, CalendarToday, MoreVert, Warning } from '@mui/icons-material';
import type { Task, TaskPriority } from '../../../type';
import { TaskStatusChip } from './TaskStatusChip';
import { formatDateThai, isOverdue } from '../../../lib/dateUtils';
import { useAppSelector } from '../../../store/store';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (task: Task) => void;
  showUser?: boolean;
}

const priorityMap: Record<TaskPriority, { label: string; color: 'error' | 'warning' | 'default'; bg: string }> = {
  high: { label: 'ด่วนมาก', color: 'error', bg: 'bg-red-500' },
  medium: { label: 'ปานกลาง', color: 'warning', bg: 'bg-amber-500' },
  low: { label: 'ปกติ', color: 'default', bg: 'bg-blue-400' },
};

const categoryMap: Record<string, string> = {
  general: 'งานทั่วไป',
  urgent: 'งานด่วน',
  meeting: 'ประชุม',
  document: 'เอกสาร',
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  showUser = false,
}) => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const overdue = isOverdue(task.date, task.status);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  // RBAC Permission Check: Owner or Admin/Manager can edit/delete
  const isOwner = task.userId === currentUser?.id;
  const canManage = isOwner || currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <Card
      elevation={0}
      className={`relative overflow-hidden hover-glow transition-all duration-300 flex flex-col justify-between ${task.status === 'completed'
        ? 'opacity-85 bg-blue-50/20 dark:bg-black/20'
        : overdue
          ? 'bg-red-50/20 dark:bg-red-950/10'
          : ''
        }`}
      sx={{ minHeight: 200 }}
    >
      {/* Subtle Priority Accent Bar on Left */}
      <Box
        className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-full ${task.status === 'completed'
          ? 'bg-emerald-500'
          : overdue
            ? 'bg-rose-500 animate-pulse'
            : priorityMap[task.priority].bg
          }`}
      />

      <CardContent className="p-4 pl-5 pb-2">
        {/* Top Header Row: Category, Priority, Overdue Badge & Menu */}
        <Box className="flex justify-between items-start gap-2 mb-3">
          <Stack direction="row" spacing={1} className="flex-wrap gap-y-1 items-center">
            <Chip
              label={priorityMap[task.priority].label}
              color={priorityMap[task.priority].color}
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: 11 }}
            />
            <Chip
              label={categoryMap[task.category] || task.category}
              size="small"
              variant="filled"
              sx={{ height: 22, fontSize: 11, opacity: 0.8 }}
            />
            {overdue && (
              <Chip
                icon={<Warning sx={{ fontSize: '13px !important' }} />}
                label="เลยกำหนด"
                color="error"
                size="small"
                variant="filled"
                sx={{ height: 22, fontSize: 11 }}
              />
            )}
          </Stack>

          {/* Overflow Action Menu */}
          {canManage && (
            <IconButton size="small" onClick={handleOpenMenu} sx={{ p: 0.5 }}>
              <MoreVert fontSize="small" />
            </IconButton>
          )}

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { width: 140, p: 0.5 } } }}
          >
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                onEdit?.(task);
              }}
              className="rounded-lg text-xs"
            >
              <ListItemIcon>
                <Edit fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="แก้ไข" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                onDelete(task.id);
              }}
              className="rounded-lg text-xs text-red-600"
            >
              <ListItemIcon>
                <Delete fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary="ลบ" />
            </MenuItem>
          </Menu>
        </Box>

        {/* Task Title */}
        <Typography
          variant="h6"
          component="h2"
          className={`font-semibold text-base mb-1.5 leading-snug ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : ''
            }`}
        >
          {task.title}
        </Typography>

        {/* Task Description */}
        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            className="mb-3 text-xs line-clamp-2 leading-relaxed"
          >
            {task.description}
          </Typography>
        )}
      </CardContent>

      {/* Card Footer */}
      <Box className="px-4 pl-5 py-2.5 bg-gray-50/50 dark:bg-black/20 flex justify-between items-center text-xs">
        {/* Date & User Info */}
        <Box className="flex items-center gap-3">
          <Box className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <CalendarToday sx={{ fontSize: 13 }} />
            <Typography variant="caption" className="font-medium text-[11px]">
              {formatDateThai(task.date)}
            </Typography>
          </Box>

          {showUser && (
            <Box className="flex items-center gap-1.5">
              <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: 'primary.main' }}>
                {task.userName.charAt(0)}
              </Avatar>
              <Typography variant="caption" className="font-semibold text-[11px]">
                {task.userName}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Clickable Status Chip */}
        <Tooltip title={canManage ? 'คลิกเพื่อเปลี่ยนสถานะงาน' : 'เฉพาะเจ้าของงานหรือ Manager/Admin'}>
          <Box>
            <TaskStatusChip
              status={task.status}
              onClick={() => canManage && onToggleStatus(task)}
              clickable={canManage}
            />
          </Box>
        </Tooltip>
      </Box>
    </Card>
  );
};
