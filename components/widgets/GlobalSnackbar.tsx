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
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 'auto' },
        right: { xs: 16, sm: 24 },
        width: { xs: 'calc(100% - 32px)', sm: 'auto' },
        maxWidth: { xs: 'calc(100% - 32px)', sm: '420px' },
        zIndex: 9999,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.18)',
          px: 2,
          py: 1,
          fontWeight: 600,
          fontFamily: 'var(--font-inter), sans-serif',
          display: 'flex',
          alignItems: 'center',
          '& .MuiAlert-icon': {
            fontSize: '22px',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
