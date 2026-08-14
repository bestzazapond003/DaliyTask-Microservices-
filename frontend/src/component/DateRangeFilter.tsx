import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Popover,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import { CalendarMonth, FilterAlt } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setDateFilter, fetchTasks } from '../store/slices/taskSlice';
import { getPresetDateRange, formatDateThai } from '../lib/dateUtils';
import type { DateRangePreset } from '../type';

export const DateRangeFilterComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const dateFilter = useAppSelector((state) => state.task.dateFilter);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [customStart, setCustomStart] = useState(dateFilter.startDate);
  const [customEnd, setCustomEnd] = useState(dateFilter.endDate);

  const handlePresetChange = (preset: DateRangePreset) => {
    if (preset === 'custom') return;
    const range = getPresetDateRange(preset);
    const newFilter = {
      preset,
      startDate: range.startDate,
      endDate: range.endDate,
    };
    dispatch(setDateFilter(newFilter));
    dispatch(fetchTasks());
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) return;
    const newFilter = {
      preset: 'custom' as DateRangePreset,
      startDate: customStart,
      endDate: customEnd,
    };
    dispatch(setDateFilter(newFilter));
    dispatch(fetchTasks());
    handleClosePopover();
  };

  const isPopoverOpen = Boolean(anchorEl);

  return (
    <Box className="flex flex-wrap items-center gap-3">
      {/* Preset Quick Buttons using MUI ButtonGroup */}
      <ButtonGroup variant="outlined" size="small">
        <Button
          variant={dateFilter.preset === 'today' ? 'contained' : 'outlined'}
          onClick={() => handlePresetChange('today')}
        >
          วันนี้
        </Button>
        <Button
          variant={dateFilter.preset === 'this_week' ? 'contained' : 'outlined'}
          onClick={() => handlePresetChange('this_week')}
        >
          สัปดาห์นี้
        </Button>
        <Button
          variant={dateFilter.preset === 'this_month' ? 'contained' : 'outlined'}
          onClick={() => handlePresetChange('this_month')}
        >
          เดือนนี้
        </Button>
      </ButtonGroup>

      {/* Custom Range Popover Trigger */}
      <Button
        size="small"
        variant={dateFilter.preset === 'custom' ? 'contained' : 'outlined'}
        color="secondary"
        startIcon={<CalendarMonth />}
        onClick={handleOpenPopover}
      >
        กำหนดช่วงเวลาเอง
      </Button>

      {/* Selected Date Range Badge Display */}
      <Chip
        icon={<FilterAlt />}
        label={
          dateFilter.startDate === dateFilter.endDate
            ? `วันที่: ${formatDateThai(dateFilter.startDate)}`
            : `${formatDateThai(dateFilter.startDate)} - ${formatDateThai(dateFilter.endDate)}`
        }
        color="primary"
        variant="outlined"
        size="small"
      />

      {/* Popover Custom Date Selector */}
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box className="p-4 w-72">
          <Typography variant="subtitle2" className="mb-3 font-semibold">
            เลือกช่วงวันที่ต้องการ
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="วันที่เริ่มต้น"
              type="date"
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <TextField
              label="วันที่สิ้นสุด"
              type="date"
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
            />
            <Box className="flex justify-end gap-2 mt-2">
              <Button size="small" onClick={handleClosePopover}>
                ยกเลิก
              </Button>
              <Button size="small" variant="contained" onClick={handleApplyCustom}>
                นำไปใช้
              </Button>
            </Box>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
};
