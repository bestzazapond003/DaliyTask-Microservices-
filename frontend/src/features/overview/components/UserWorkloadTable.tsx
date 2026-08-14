import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import type { UserWorkloadStats } from '../../../type';

interface UserWorkloadTableProps {
  data: UserWorkloadStats[];
  onSelectUser?: (userId: string) => void;
}

export const UserWorkloadTable: React.FC<UserWorkloadTableProps> = ({
  data,
  onSelectUser,
}) => {
  return (
    <TableContainer component={Paper} elevation={0} className="rounded-2xl overflow-hidden">
      <Table>
        <TableHead className="bg-blue-50/50 dark:bg-black/20">
          <TableRow>
            <TableCell className="font-bold text-xs">สมาชิกในทีม (Member)</TableCell>
            <TableCell align="center" className="font-bold text-xs">งานทั้งหมด</TableCell>
            <TableCell align="center" className="font-bold text-xs">เสร็จแล้ว</TableCell>
            <TableCell align="center" className="font-bold text-xs">กำลังทำ</TableCell>
            <TableCell align="center" className="font-bold text-xs">รอดำเนินการ</TableCell>
            <TableCell className="font-bold text-xs" sx={{ width: 200 }}>
              % ความสำเร็จ (Progress)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" className="py-8 text-gray-400 text-sm">
                ไม่มีข้อมูลสมาชิกทีมในช่วงเวลานี้
              </TableCell>
            </TableRow>
          ) : (
            data.map((user) => (
              <TableRow
                key={user.userId}
                hover
                className="cursor-pointer transition-colors"
                onClick={() => onSelectUser && onSelectUser(user.userId)}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, fontSize: 13, fontWeight: 'bold' }}>
                      {user.userName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" className="font-semibold text-xs">
                        {user.userName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Chip label={user.totalTasks} size="small" variant="outlined" sx={{ height: 22, fontSize: 11 }} />
                </TableCell>

                <TableCell align="center">
                  <Chip label={user.completedTasks} color="success" size="small" sx={{ height: 22, fontSize: 11 }} />
                </TableCell>

                <TableCell align="center">
                  <Chip label={user.inProgressTasks} color="info" size="small" sx={{ height: 22, fontSize: 11 }} />
                </TableCell>

                <TableCell align="center">
                  <Chip label={user.pendingTasks} color="warning" size="small" sx={{ height: 22, fontSize: 11 }} />
                </TableCell>

                <TableCell>
                  <Box className="flex items-center gap-2">
                    <Box className="w-full">
                      <LinearProgress
                        variant="determinate"
                        value={user.completionRate}
                        color={user.completionRate === 100 ? 'success' : 'primary'}
                        className="h-2 rounded-full"
                      />
                    </Box>
                    <Typography variant="caption" className="font-bold min-w-[32px] text-right text-xs">
                      {user.completionRate}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
