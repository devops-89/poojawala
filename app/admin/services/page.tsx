import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminServicesContent from '@/components/layouts/adminLayout/services/AdminServicesContent';

export const metadata: Metadata = {
  title: 'Service Management | 1Pooja Admin',
  description: 'Manage services, dynamic pricing, and regional configurations.',
};

export default function AdminServicesPage() {
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
      <AdminServicesContent />
    </Suspense>
  );
}

