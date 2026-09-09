'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { refreshTokenAPI } from '@/api/authControllers';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const res = await refreshTokenAPI();
          if (res.csrfToken) {
            sessionStorage.setItem('csrfToken', res.csrfToken);
          }
        } catch (error) {
          console.error('Failed to refresh token periodically', error);
        }
      }
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
