import { Metadata } from 'next';
import PurohitMyServicesContent from '@/components/layouts/portalLayout/services/PurohitMyServicesContent';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function PurohitMyServicesPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <PurohitMyServicesContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'My Services | 1Pooja Partner Portal',
  description: 'Manage and configure the pujas, rituals, and services you offer on 1Pooja.',
};
