import { Metadata } from 'next';
import AdminAstrologyBookingsContent from '@/components/layouts/adminLayout/bookings/AdminAstrologyBookingsContent';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export const metadata: Metadata = {
  title: 'Astrology Bookings | Admin Portal',
  description: 'Manage all astrology consultation bookings, view details, and handle statuses.',
};

export default function AdminAstrologyBookingsPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <AdminAstrologyBookingsContent />
    </Suspense>
  );
}
