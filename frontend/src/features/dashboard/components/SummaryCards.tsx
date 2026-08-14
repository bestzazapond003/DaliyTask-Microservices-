import React from 'react';
import { Grid, Paper, Typography, Box, LinearProgress } from '@mui/material';
import { PlaylistAddCheck, CheckCircleOutlined, HourglassTop, ErrorOutlined } from '@mui/icons-material';
import type { DashboardStats } from '../../../type';

interface SummaryCardsProps {
  stats: DashboardStats;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'งานทั้งหมด',
      value: stats.totalTasks,
      subtitle: 'รายการงานในช่วงเวลาที่เลือก',
      icon: <PlaylistAddCheck className="text-blue-500" fontSize="medium" />,
      badgeBg: 'bg-blue-500/10 text-blue-500',
      accentColor: 'from-blue-500 to-cyan-400',
    },
    {
      title: 'อัตราทำเสร็จ (Completion)',
      value: `${stats.completionRate}%`,
      subtitle: `${stats.completedTasks} จาก ${stats.totalTasks} งานทำเสร็จแล้ว`,
      icon: <CheckCircleOutlined className="text-emerald-500" fontSize="medium" />,
      badgeBg: 'bg-emerald-500/10 text-emerald-500',
      accentColor: 'from-emerald-500 to-teal-400',
      progress: stats.completionRate,
    },
    {
      title: 'กำลังดำเนินการ',
      value: stats.inProgressTasks + stats.pendingTasks,
      subtitle: `กำลังทำ ${stats.inProgressTasks} / รอดำเนินการ ${stats.pendingTasks}`,
      icon: <HourglassTop className="text-amber-500" fontSize="medium" />,
      badgeBg: 'bg-amber-500/10 text-amber-500',
      accentColor: 'from-amber-500 to-orange-400',
    },
    {
      title: 'เลยกำหนดส่ง (Overdue)',
      value: stats.overdueTasks,
      subtitle: 'งานที่เลยกำหนดแล้วยังทำไม่เสร็จ',
      icon: <ErrorOutlined className="text-rose-500" fontSize="medium" />,
      badgeBg: 'bg-rose-500/10 text-rose-500',
      accentColor: 'from-rose-500 to-red-400',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            elevation={0}
            className="hover-glow relative overflow-hidden p-5 rounded-2xl h-full flex flex-col justify-between"
          >
            {/* Top Accent Gradient Bar */}
            <Box className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor}`} />

            <Box className="flex justify-between items-start mb-3">
              <Box>
                <Typography variant="caption" color="text.secondary" className="font-bold uppercase tracking-wider text-[10px]">
                  {card.title}
                </Typography>
                <Typography variant="h4" className="font-bold my-1 tracking-tight">
                  {card.value}
                </Typography>
              </Box>
              <Box className={`p-2.5 rounded-xl ${card.badgeBg}`}>
                {card.icon}
              </Box>
            </Box>

            {card.progress !== undefined && (
              <Box className="my-2">
                <LinearProgress
                  variant="determinate"
                  value={card.progress}
                  color="success"
                  className="h-2 rounded-full"
                />
              </Box>
            )}

            <Typography variant="caption" color="text.secondary" className="text-xs">
              {card.subtitle}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
