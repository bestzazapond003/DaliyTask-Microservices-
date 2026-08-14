import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/store';
import { hideToast } from '../store/slices/uiSlice';

export const ToastNotification: React.FC = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((state) => state.ui.toast);

  const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(hideToast());
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleClose} severity={toast.severity} variant="filled" sx={{ width: '100%', fontWeight: 600 }}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
