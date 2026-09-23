import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AddProductForm from '@/components/layouts/adminLayout/products/AddProductForm';

export const metadata: Metadata = {
  title: 'Add Product | Admin Portal',
  description: 'Create a new sacred product listing.',
};

export default function AddProductPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <AddProductForm />
    </Suspense>
  );
}
