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
      sx={{
        bottom: { xs: 20, sm: 24 },
        right: { xs: 16, sm: 24 },
        left: 'auto !important',
        transform: 'none !important',
        width: 'auto',
        maxWidth: 'calc(100vw - 32px)',
        zIndex: 9999,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: 'auto',
          maxWidth: '100%',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          px: 2.5,
          py: 1,
          fontWeight: 600,
          fontFamily: 'var(--font-inter), sans-serif',
          display: 'flex',
          alignItems: 'center',
          '& .MuiAlert-icon': {
            fontSize: '20px',
            mr: 1,
          },
          '& .MuiAlert-message': {
            p: 0,
          },
          '& .MuiAlert-action': {
            ml: 1.5,
            p: 0,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
