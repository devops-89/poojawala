import { Metadata } from 'next';
import AdminPurohitsContent from '@/components/layouts/adminLayout/purohits/AdminPurohitsContent';

export const metadata: Metadata = {
  title: 'Purohits Management | Admin Portal',
  description: 'Manage and onboard purohits for Poojawala.',
};

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function PurohitsPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    }>
      <AdminPurohitsContent />
    </Suspense>
  );
}
