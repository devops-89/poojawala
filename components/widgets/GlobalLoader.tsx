'use client';

import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useLoaderStore } from '@/stores/loaderStore';
import { COLORS } from '@/utils/enums';
import { FONTS } from '@/utils/fonts';

export default function GlobalLoader() {
  const { isLoading, message } = useLoaderStore();

  return (
    <Backdrop
      sx={{ 
        color: COLORS.DEEP_GREY, 
        zIndex: (theme) => theme.zIndex.drawer + 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: COLORS.WHITE
      }}
      open={isLoading}
    >
      <CircularProgress size={60} sx={{ color: COLORS.BRAND_ORANGE }} thickness={4} />
      {message && (
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: FONTS.PRIMARY, 
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: COLORS.DEEP_GREY
          }}
        >
          {message}
        </Typography>
      )}
    </Backdrop>
  );
}
