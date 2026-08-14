import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, RegisterUserDto } from '../../type';
import { userService, authService } from '../../service/userService';

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk('user/fetchCurrentUser', async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return await userService.getCurrentUser();
});

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  return await userService.getUsers();
});

export const loginUserAsync = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await authService.login(email, password);
    return response.user;
  }
);

export const registerUserAsync = createAsyncThunk(
  'user/registerUser',
  async (dto: RegisterUserDto) => {
    return await userService.register(dto);
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      if (action.payload) {
        localStorage.setItem('current_user_id', action.payload.id);
      } else {
        authService.logout();
      }
    },
    logout: (state) => {
      state.currentUser = null;
      authService.logout();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.currentUser = null;
        authService.logout();
      })
      // Fetch All Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })
      // Login
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      })
      // Register
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.currentUser = action.payload;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'การลงทะเบียนไม่สำเร็จ';
      });
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;
