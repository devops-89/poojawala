import { Metadata } from 'next';
import PurohitServiceDetailsContent from '@/components/layouts/portalLayout/services/PurohitServiceDetailsContent';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function ServiceDetailsPage() {
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
      <PurohitServiceDetailsContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Service Details | Purohit Portal',
  description: 'View service details and add to your purohit profile.',
};