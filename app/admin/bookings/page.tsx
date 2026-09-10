import { Metadata } from 'next';
import AdminBookingsContent from '@/components/layouts/adminLayout/bookings/AdminBookingsContent';

export const metadata: Metadata = {
  title: 'Bookings Management | Admin Portal',
  description: 'Manage all service bookings, view details, and handle assignments.',
};

import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    }>
      <AdminBookingsContent />
    </Suspense>
  );
}
