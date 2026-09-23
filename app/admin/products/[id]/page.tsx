import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminProductDetailsContent from '@/components/layouts/adminLayout/products/AdminProductDetailsContent';

export const metadata: Metadata = {
  title: 'Product Details | Admin Portal',
  description: 'View sacred product details and configurations.',
};

export default function AdminProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <AdminProductDetailsContent />
    </Suspense>
  );
}
