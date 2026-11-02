import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AddServiceForm from '@/components/layouts/adminLayout/services/AddServiceForm';

export const metadata: Metadata = {
  title: 'Add New Service | 1Pooja Admin',
  description: 'Configure and create a new ritual or service.',
};

export default function AddServicePage() {
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
      <AddServiceForm />
    </Suspense>
  );
}
