import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LockOutlined, LoginOutlined, PersonAddOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../store/store';
import { loginUserAsync, fetchUsers } from '../../../store/slices/userSlice';
import { fetchTasks } from '../../../store/slices/taskSlice';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.user.loading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }

    try {
      setError('');
      await dispatch(loginUserAsync({ email: email.trim(), password })).unwrap();
      await dispatch(fetchUsers());
      await dispatch(fetchTasks());
      navigate('/task');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : err.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <Container maxWidth="xs" className="min-h-[85vh] flex items-center justify-center py-10">
      <Paper elevation={0} className="p-8 rounded-3xl w-full relative overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
        <Box className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <Box className="flex flex-col items-center mb-6 text-center">
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
              boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)',
            }}
          >
            <LockOutlined fontSize="large" />
          </Avatar>
          <Typography variant="h5" component="h1" className="font-bold mt-2">
            เข้าสู่ระบบ (Sign In)
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1 text-xs">
            ระบบบันทึกงานประจำวัน DailyTask System
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4 rounded-xl">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            {/* Email Field */}
            <TextField
              label="อีเมล (Email)"
              type="email"
              placeholder="example@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              autoFocus
            />

            {/* Password Field */}
            <TextField
              label="รหัสผ่าน (Password)"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginOutlined />}
              className="py-3 font-bold text-base rounded-xl shadow-md"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ (Sign In)'}
            </Button>

            {/* Link to Register */}
            <Box className="text-center mt-2">
              <Typography variant="body2" color="text.secondary" className="text-xs">
                ยังไม่มีบัญชีผู้ใช้?{' '}
                <Link to="/register" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1 mt-1">
                  <PersonAddOutlined fontSize="small" /> ลงทะเบียนสมัครสมาชิก (Register)
                </Link>
              </Typography>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
