import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
  IconButton,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../validation/taskSchema';
import type { TaskFormData } from '../validation/taskSchema';
import type { Task } from '../../../type';
import { getTodayDate } from '../../../lib/dateUtils';

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task | null;
  loading?: boolean;
}

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      date: getTodayDate(),
      category: 'general',
      priority: 'medium',
      status: 'pending',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        date: initialData.date,
        category: initialData.category,
        priority: initialData.priority,
        status: initialData.status,
      });
    } else {
      reset({
        title: '',
        description: '',
        date: getTodayDate(),
        category: 'general',
        priority: 'medium',
        status: 'pending',
      });
    }
  }, [initialData, open, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center font-bold">
        <Typography variant="h6" className="font-bold">
          {initialData ? 'แก้ไขรายการงาน' : 'เพิ่มงานใหม่ประจำวัน'}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {/* Title */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="หัวข้องาน"
                  placeholder="เช่น จัดทำรายงานประจำสัปดาห์"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  autoFocus
                />
              )}
            />

            {/* Description */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="รายละเอียดเพิ่มเติม (ถ้ามี)"
                  placeholder="ระบุรายละเอียดงานหรือหมายเหตุ"
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />

            {/* Date */}
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="วันที่ต้องทำ"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              )}
            />

            {/* Category & Priority Row */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="หมวดหมู่งาน" fullWidth>
                    <MenuItem value="general">งานทั่วไป (General)</MenuItem>
                    <MenuItem value="urgent">งานด่วน (Urgent)</MenuItem>
                    <MenuItem value="meeting">ประชุม (Meeting)</MenuItem>
                    <MenuItem value="document">เอกสาร (Document)</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="ความสำคัญ" fullWidth>
                    <MenuItem value="low">ต่ำ (Low)</MenuItem>
                    <MenuItem value="medium">ปานกลาง (Medium)</MenuItem>
                    <MenuItem value="high">สูง (High)</MenuItem>
                  </TextField>
                )}
              />
            </Stack>

            {/* Status (If editing) */}
            {initialData && (
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="สถานะงาน" fullWidth>
                    <MenuItem value="pending">รอดำเนินการ (Pending)</MenuItem>
                    <MenuItem value="in_progress">กำลังทำ (In Progress)</MenuItem>
                    <MenuItem value="completed">ทำเสร็จแล้ว (Completed)</MenuItem>
                  </TextField>
                )}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={onClose} color="inherit">
            ยกเลิก
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {initialData ? 'บันทึกการแก้ไข' : 'เพิ่มงาน'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
