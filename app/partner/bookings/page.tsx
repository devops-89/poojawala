import { Metadata } from 'next';
import BookingsContent from '@/components/layouts/portalLayout/BookingsContent';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function BookingsPage() {
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
      <BookingsContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Manage Bookings | 1Pooja Partner Portal',
  description: 'View and manage all your new, upcoming, and past pooja bookings on the 1Pooja platform.',
};
