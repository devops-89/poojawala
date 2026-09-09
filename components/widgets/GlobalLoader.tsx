'use client';

import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useLoaderStore } from '@/stores/loaderStore';

export default function GlobalLoader() {
  const { isLoading, message } = useLoaderStore();

  return (
    <Backdrop
      sx={{ 
        color: '#1A1A1A', 
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: '#FFFFFF'
      }}
      open={isLoading}
    >
      <CircularProgress size={60} sx={{ color: '#FF6200' }} thickness={4} />
      {message && (
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: '"DM Sans", sans-serif', 
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: '#1A1A1A'
          }}
        >
          {message}
        </Typography>
      )}
    </Backdrop>
  );
}
