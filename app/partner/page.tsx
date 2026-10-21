import { Metadata } from 'next';
import PortalRegisterContent from '@/components/layouts/portalLayout/PortalRegisterContent';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function PortalRegisterPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#FF6200' }} />
      </Box>
    }>
      <PortalRegisterContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Register as a Partner | 1Pooja',
  description: 'Join 1Pooja as a verified partner (Purohit / Astrologer). Register today to connect with devotees and manage your bookings online.',
  alternates: {
    canonical: '/partner',
  },
  openGraph: {
    url: '/partner',
  },
};

