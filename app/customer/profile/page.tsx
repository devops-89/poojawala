import React from 'react';
import { Metadata } from 'next';
import CustomerProfileContent from '@/components/layouts/customerLayout/profile/CustomerProfileContent';

export const metadata: Metadata = {
  title: 'My Profile | Poojawala',
  description: 'View and manage your Poojawala customer profile',
};

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function CustomerProfilePage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    }>
      <CustomerProfileContent />
    </Suspense>
  );
}
