import ForgotPasswordContent from '@/components/layouts/userPages/ForgotPasswordContent';
import { Metadata } from 'next';

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Forgot Password | Poojawala',
  description: 'Reset your Poojawala account password.',
};
