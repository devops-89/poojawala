import AddAstrologerForm from '@/components/layouts/adminLayout/astrologers/AddAstrologerForm';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export const metadata: Metadata = {
  title: 'Onboard Astrologer | Admin Portal',
  description: 'Add a new astrologer to the 1Pooja platform.',
};

export default function AddAstrologerPage() {
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
      <AddAstrologerForm />
    </Suspense>
  );
}

