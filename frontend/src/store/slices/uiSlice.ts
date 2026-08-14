import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error';

interface UiState {
  toast: {
    open: boolean;
    message: string;
    severity: AlertSeverity;
  };
}

const initialState: UiState = {
  toast: {
    open: false,
    message: '',
    severity: 'success',
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; severity?: AlertSeverity }>
    ) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'success',
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
