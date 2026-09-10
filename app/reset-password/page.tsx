import ResetPasswordContent from '@/components/layouts/userPages/ResetPasswordContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Reset Password | Poojawala',
  description: 'Reset your Poojawala account password.',
};
