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
  MenuItem,
  Stack,
  Alert,
} from '@mui/material';
import { PersonAddOutlined, AppRegistrationOutlined } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '../../../store/store';
import { registerUserAsync } from '../../../store/slices/userSlice';
import { fetchTasks } from '../../../store/slices/taskSlice';
import type { UserRole } from '../../../type';

const registerSchema = z.object({
  name: z.string().min(2, 'ชื่อ-นามสกุล ต้องมีอย่างน้อย 2 ตัวอักษร'),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  department: z.string().min(1, 'กรุณาระบุชื่อแผนก'),
  role: z.enum(['admin', 'manager', 'staff']),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      department: 'Software Engineering',
      role: 'staff',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError('');
      await dispatch(
        registerUserAsync({
          name: data.name,
          email: data.email,
          password: data.password,
          department: data.department,
          role: data.role as UserRole,
        })
      ).unwrap();

      dispatch(fetchTasks());
      navigate('/task');
    } catch (err: unknown) {
      setServerError(typeof err === 'string' ? err : 'เกิดข้อผิดพลาดในการลงทะเบียน');
    }
  };

  return (
    <Container maxWidth="sm" className="min-h-[85vh] flex items-center justify-center py-10">
      <Paper elevation={0} className="p-8 rounded-3xl w-full relative overflow-hidden">
        {/* Soft Decorative Gradient Circle */}
        <Box className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <Box className="flex flex-col items-center mb-6 text-center">
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'secondary.main',
              color: '#021323',
              width: 56,
              height: 56,
              boxShadow: '0 8px 24px rgba(226, 226, 182, 0.3)',
            }}
          >
            <PersonAddOutlined fontSize="large" />
          </Avatar>
          <Typography variant="h5" component="h1" className="font-bold mt-2">
            ลงทะเบียนสมาชิกใหม่ (Register)
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1 text-xs">
            สร้างบัญชีผู้ใช้ใหม่ในระบบ DailyTask พร้อมกำหนด Role สิทธิ์การใช้งาน
          </Typography>
        </Box>

        {serverError && (
          <Alert severity="error" className="mb-4 rounded-xl">
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            {/* Full Name */}
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อ-นามสกุล (Full Name)"
                  placeholder="เช่น สมศักดิ์ มั่นคง"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="อีเมล (Email Address)"
                  type="email"
                  placeholder="name@company.com"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="รหัสผ่าน (Password)"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            {/* Department */}
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="แผนก/ฝ่าย (Department)"
                  placeholder="เช่น Software Engineering / Marketing"
                  fullWidth
                  error={!!errors.department}
                  helperText={errors.department?.message}
                />
              )}
            />

            {/* Role Selection */}
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="สิทธิ์การใช้งาน (User Role)"
                  fullWidth
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  <MenuItem value="staff">
                    <Box>
                      <Typography variant="body2" className="font-semibold text-xs">Staff (สมาชิกทั่วไป)</Typography>
                      <Typography variant="caption" color="text.secondary" className="text-[10px]">บันทึกงานส่วนตัว ดูสถิติส่วนตัว</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="manager">
                    <Box>
                      <Typography variant="body2" className="font-semibold text-xs">Manager (ผู้จัดการ/หัวหน้างาน)</Typography>
                      <Typography variant="caption" color="text.secondary" className="text-[10px]">จัดการงานส่วนตัว + ดูภาพรวมภาระงานของทีม</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="admin">
                    <Box>
                      <Typography variant="body2" className="font-semibold text-xs">Admin (ผู้ดูแลระบบสูงสุด)</Typography>
                      <Typography variant="caption" color="text.secondary" className="text-[10px]">สิทธิ์เต็มในการจัดการ สลับผู้ใช้ และดูภาพรวมทั้งหมด</Typography>
                    </Box>
                  </MenuItem>
                </TextField>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              startIcon={<AppRegistrationOutlined />}
              disabled={isSubmitting}
              className="py-3 font-bold text-base rounded-xl shadow-md mt-2"
            >
              สมัครสมาชิก (Create Account)
            </Button>

            {/* Link back to Login */}
            <Box className="text-center mt-2">
              <Typography variant="body2" color="text.secondary" className="text-xs">
                มีบัญชีผู้ใช้อยู่แล้ว?{' '}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  เข้าสู่ระบบ (Sign In)
                </Link>
              </Typography>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
