import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { DashboardStats } from '../../../type';

interface StatusPieChartProps {
  stats: DashboardStats;
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ stats }) => {
  const data = [
    { name: 'ทำเสร็จแล้ว', value: stats.completedTasks, color: '#10B981' },
    { name: 'กำลังทำ', value: stats.inProgressTasks, color: '#3B82F6' },
    { name: 'รอดำเนินการ', value: stats.pendingTasks, color: '#F59E0B' },
  ].filter((item) => item.value > 0);

  return (
    <Paper elevation={0} className="p-6 rounded-2xl h-full flex flex-col justify-between">
      <Box>
        <Typography variant="h6" className="font-bold mb-1">
          สัดส่วนสถานะงาน
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-xs">
          จำแนกสัดส่วนตามสถานะการดำเนินงานปัจจุบัน
        </Typography>
      </Box>

      {data.length === 0 ? (
        <Box className="h-64 flex items-center justify-center text-gray-400 text-sm">
          ไม่มีข้อมูลงานในช่วงเวลานี้
        </Box>
      ) : (
        <Box className="h-64 w-full relative">
          {/* Center Completion Rate Display */}
          <Box className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
            <Typography variant="h4" className="font-extrabold text-blue-600 dark:text-blue-400 leading-none">
              {stats.completionRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary" className="text-[10px] font-semibold uppercase mt-0.5">
              Completed
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(3, 40, 78, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(110, 172, 218, 0.2)',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
                formatter={(value: unknown) => [`${value ?? 0} รายการ`, 'จำนวน']}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};
