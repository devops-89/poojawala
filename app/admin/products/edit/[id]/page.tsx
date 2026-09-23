import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import EditProductForm from '@/components/layouts/adminLayout/products/EditProductForm';

export const metadata: Metadata = {
  title: 'Edit Product | Admin Portal',
  description: 'Update product configurations, price, description, and details.',
};

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <EditProductForm />
    </Suspense>
  );
}
