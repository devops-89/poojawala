'use client';

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbarStore } from '@/stores/snackbarStore';

export default function GlobalSnackbar() {
  const { open, message, severity, hideSnackbar } = useSnackbarStore();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          color: '#ffffff',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
