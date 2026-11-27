'use client';

import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSnackbarStore } from '@/stores/snackbarStore';
import { COLORS } from '@/utils/enums';
import { FONTS } from '@/utils/fonts';

export default function GlobalSnackbar() {
  const { open, message, severity, hideSnackbar, key } = useSnackbarStore();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    hideSnackbar();
  };

  if (!open) return null;

  return (
    <Snackbar
      key={key}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      disableWindowBlurListener
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      sx={{
        top: { xs: '16px !important', sm: 'auto !important' },
        bottom: { xs: 'auto !important', sm: '24px !important' },
        left: { xs: '50% !important', sm: 'auto !important' },
        right: { xs: 'auto !important', sm: '24px !important' },
        transform: { xs: 'translateX(-50%) !important', sm: 'none !important' },
        width: { xs: 'calc(100vw - 32px)', sm: 'auto' },
        maxWidth: { xs: '440px', sm: '480px' },
        zIndex: 99999,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          color: COLORS.WHITE,
          borderRadius: { xs: '14px', sm: '12px' },
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.1, sm: 1.25 },
          fontWeight: 600,
          fontFamily: FONTS.OUTFIT,
          fontSize: { xs: '13.5px', sm: '14px' },
          lineHeight: 1.4,
          display: 'flex',
          alignItems: 'center',
          '& .MuiAlert-icon': {
            fontSize: '22px',
            mr: 1.25,
            my: 'auto',
          },
          '& .MuiAlert-message': {
            p: 0,
            flex: 1,
            wordBreak: 'break-word',
          },
          '& .MuiAlert-action': {
            ml: 1.25,
            p: 0,
            my: 'auto',
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
