import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Task } from '../../../type';
import { formatDateThai } from '../../../lib/dateUtils';

interface TrendBarChartProps {
  tasks: Task[];
}

export const TrendBarChart: React.FC<TrendBarChartProps> = ({ tasks }) => {
  const dateMap: Record<string, { date: string; completed: number; inProgress: number; pending: number }> = {};

  tasks.forEach((t) => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = {
        date: formatDateThai(t.date),
        completed: 0,
        inProgress: 0,
        pending: 0,
      };
    }

    if (t.status === 'completed') dateMap[t.date].completed += 1;
    else if (t.status === 'in_progress') dateMap[t.date].inProgress += 1;
    else dateMap[t.date].pending += 1;
  });

  const chartData = Object.values(dateMap);

  return (
    <Paper elevation={0} className="p-6 rounded-2xl h-full flex flex-col justify-between">
      <Box>
        <Typography variant="h6" className="font-bold mb-1">
          แนวโน้มการทำเสร็จย้อนหลัง
        </Typography>
        <Typography variant="body2" color="text.secondary" className="text-xs">
          เปรียบเทียบสถิติผลงานประจำวันแยกตามสถานะ
        </Typography>
      </Box>

      {chartData.length === 0 ? (
        <Box className="h-64 flex items-center justify-center text-gray-400 text-sm">
          ไม่มีข้อมูลงานในช่วงเวลานี้
        </Box>
      ) : (
        <Box className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(3, 40, 78, 0.85)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(110, 172, 218, 0.2)',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
              <Bar dataKey="completed" name="เสร็จแล้ว" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="inProgress" name="กำลังทำ" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pending" name="รอดำเนินการ" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};
