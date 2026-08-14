import React from 'react';
import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';
import { CheckCircle, HourglassEmpty, Autorenew } from '@mui/icons-material';
import type { TaskStatus } from '../../../type';

interface TaskStatusChipProps {
  status: TaskStatus;
  onClick?: () => void;
  clickable?: boolean;
  size?: 'small' | 'medium';
}

export const TaskStatusChip: React.FC<TaskStatusChipProps> = ({
  status,
  onClick,
  clickable = true,
  size = 'small',
}) => {
  let label = 'รอดำเนินการ';
  let color: ChipProps['color'] = 'warning';
  let icon = <HourglassEmpty fontSize="small" />;

  switch (status) {
    case 'in_progress':
      label = 'กำลังทำ';
      color = 'info';
      icon = <Autorenew fontSize="small" className="animate-spin" />;
      break;
    case 'completed':
      label = 'ทำเสร็จแล้ว';
      color = 'success';
      icon = <CheckCircle fontSize="small" />;
      break;
    case 'pending':
    default:
      label = 'รอดำเนินการ';
      color = 'warning';
      icon = <HourglassEmpty fontSize="small" />;
      break;
  }

  return (
    <Chip
      icon={icon}
      label={label}
      color={color}
      size={size}
      variant={status === 'completed' ? 'filled' : 'outlined'}
      onClick={clickable ? onClick : undefined}
      sx={{ fontWeight: 600, cursor: clickable ? 'pointer' : 'default' }}
    />
  );
};
