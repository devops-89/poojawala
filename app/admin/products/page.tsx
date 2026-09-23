import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminProductsContent from '@/components/layouts/adminLayout/products/AdminProductsContent';

export const metadata: Metadata = {
  title: 'Products Management | Admin Portal',
  description: 'Manage all sacred puja products, inventory, and listings.',
};

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
