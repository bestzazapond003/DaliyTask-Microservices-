import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import { SettingsOutlined, PersonOutlined, DarkMode, LightMode, InfoOutlined } from '@mui/icons-material';
import { useAppSelector } from '../../../store/store';
import { useColorMode } from '../../../theme/ColorModeContext';

const roleColorMap = {
  admin: 'error' as const,
  manager: 'warning' as const,
  staff: 'default' as const,
};

export const SettingPage: React.FC = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Container maxWidth="md" className="py-8">
      <Box className="mb-6">
        <Typography variant="h5" component="h1" className="font-bold flex items-center gap-2.5 mb-1">
          <SettingsOutlined className="text-blue-500" fontSize="large" />
          ตั้งค่าการใช้งาน (Settings)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          จัดการข้อมูลผู้ใช้และการแสดงผลของระบบ
        </Typography>
      </Box>

      <Stack spacing={4}>
        {/* User Profile Card */}
        {currentUser && (
          <Paper elevation={0} className="p-6 rounded-2xl relative overflow-hidden">
            <Box className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2 text-base">
              <PersonOutlined color="primary" /> ข้อมูลผู้ใช้งานปัจจุบัน
            </Typography>
            <Divider className="mb-5" />
            <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 28, fontWeight: 'bold' }}>
                {currentUser.name.charAt(0)}
              </Avatar>
              <Box className="space-y-1">
                <Box className="flex items-center gap-2">
                  <Typography variant="h6" className="font-bold text-lg">
                    {currentUser.name}
                  </Typography>
                  <Chip
                    label={currentUser.role?.toUpperCase() || 'STAFF'}
                    color={roleColorMap[currentUser.role || 'staff']}
                    size="small"
                    sx={{ fontWeight: 'bold', fontSize: 10 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  📧 {currentUser.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🏢 แผนก: {currentUser.department}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Theme Settings Card */}
        <Paper elevation={0} className="p-6 rounded-2xl">
          <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2 text-base">
            {mode === 'dark' ? <DarkMode color="primary" /> : <LightMode color="primary" />} การแสดงผลธีม (Theme Appearance)
          </Typography>
          <Divider className="mb-4" />
          <Box className="flex items-center justify-between">
            <Box>
              <Typography variant="subtitle1" className="font-semibold">
                {mode === 'dark' ? 'โหมดกลางคืน (Dark Mode)' : 'โหมดสว่าง (Light Mode)'}
              </Typography>
              <Typography variant="body2" color="text.secondary" className="text-xs">
                สลับโหมดสีหน้าจอเพื่อความสบายตาในการทำงาน
              </Typography>
            </Box>
            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleColorMode} color="primary" />}
              label=""
            />
          </Box>
        </Paper>

        {/* System Info Card */}
        <Paper elevation={0} className="p-6 rounded-2xl">
          <Typography variant="h6" className="font-bold mb-4 flex items-center gap-2 text-base">
            <InfoOutlined color="primary" /> ข้อมูลระบบ (System Info)
          </Typography>
          <Divider className="mb-4" />
          <Box className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Box>
              <Typography variant="caption" color="text.secondary">Application</Typography>
              <Typography variant="body2" className="font-bold">DailyTask System</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Version</Typography>
              <Typography variant="body2" className="font-bold">2.0.0 (Microservices)</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Architecture</Typography>
              <Typography variant="body2" className="font-bold">NestJS + Redis + MSSQL</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">UI Framework</Typography>
              <Typography variant="body2" className="font-bold">React 19 + MUI v9</Typography>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default SettingPage;
