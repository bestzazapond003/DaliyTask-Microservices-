import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  TaskAltOutlined,
  DashboardOutlined,
  GroupOutlined,
  SettingsOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import { useColorMode } from '../theme/ColorModeContext';
import { useAppDispatch, useAppSelector } from '../store/store';
import { logout } from '../store/slices/userSlice';

const roleColorMap = {
  admin: 'error' as const,
  manager: 'warning' as const,
  staff: 'default' as const,
};

export function Header() {
  const { mode, toggleColorMode } = useColorMode();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => state.user.currentUser);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { label: 'บันทึกงาน (Tasks)', path: '/task', icon: <TaskAltOutlined /> },
    { label: 'แดชบอร์ด (Analytics)', path: '/dashboard', icon: <DashboardOutlined /> },
    { label: 'ภาพรวมทีม (Team)', path: '/overview', icon: <GroupOutlined /> },
    { label: 'ตั้งค่า (Settings)', path: '/setting', icon: <SettingsOutlined /> },
  ];

  return (
    <Box className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo & Nav */}
        <Box className="flex items-center gap-6">
          <IconButton
            className="md:hidden"
            onClick={toggleDrawer(true)}
            size="small"
            edge="start"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Box
            onClick={() => navigate('/task')}
            className="cursor-pointer flex items-center gap-2 select-none"
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34 }}>
              <TaskAltOutlined fontSize="small" />
            </Avatar>
            <Typography variant="h6" component="div" className="font-extrabold tracking-tight text-lg">
              Daily<span className="text-blue-500">Task</span>
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {currentUser && (
            <Box className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    startIcon={item.icon}
                    variant={isActive ? 'contained' : 'text'}
                    color={isActive ? 'primary' : 'inherit'}
                    size="small"
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: isActive ? 700 : 500,
                      px: 2,
                      py: 0.8,
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Right: Theme Toggle & Profile */}
        <Box className="flex items-center gap-3">
          <Tooltip title={mode === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}>
            <IconButton onClick={toggleColorMode} size="small" color="inherit">
              {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
            </IconButton>
          </Tooltip>

          {currentUser ? (
            <>
              <Tooltip title="ข้อมูลโปรไฟล์">
                <IconButton onClick={handleOpenUserMenu} size="small" sx={{ p: 0.5 }}>
                  <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', color: '#021323', fontWeight: 'bold' }}>
                    {currentUser.name.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleCloseUserMenu}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{
                  paper: {
                    elevation: 4,
                    sx: { minWidth: 220, borderRadius: '16px', mt: 1, p: 1 },
                  }
                }}
              >
                <Box className="px-3 py-2">
                  <Typography variant="subtitle2" className="font-bold text-sm">
                    {currentUser.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" className="block text-xs">
                    {currentUser.email}
                  </Typography>
                  <Box className="mt-1.5 flex items-center gap-1.5">
                    <Chip
                      label={currentUser.role?.toUpperCase() || 'STAFF'}
                      color={roleColorMap[currentUser.role || 'staff']}
                      size="small"
                      sx={{ fontSize: 10, height: 20 }}
                    />
                    <Typography variant="caption" color="text.secondary" className="text-[11px]">
                      {currentUser.department}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 1 }} />
                <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/setting'); }}>
                  <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText primary="ตั้งค่า (Settings)" />
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon><LogoutOutlined fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText primary="ออกจากระบบ (Logout)" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/login')}
              sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
            >
              เข้าสู่ระบบ
            </Button>
          )}
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={toggleDrawer(false)}>
          <Box className="p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <TaskAltOutlined fontSize="small" />
            </Avatar>
            <Typography variant="h6" className="font-bold">
              DailyTask
            </Typography>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Header;
