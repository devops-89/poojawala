import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import PurohitServicesContent from '@/components/layouts/portalLayout/services/PurohitServicesContent';

export default function PurohitServicesPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <PurohitServicesContent />
    </Suspense>
  );
}
