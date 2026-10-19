import { Metadata } from 'next';
import AstrologyBookingsContent from '@/components/layouts/portalLayout/AstrologyBookingsContent';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function AstrologyBookingsPage() {
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
      <AstrologyBookingsContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Astrology Bookings | Partner Portal | 1Pooja',
  description: 'Manage and conduct your live astrology and kundali consultations on 1Pooja.',
};
