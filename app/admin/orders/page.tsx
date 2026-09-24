import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminOrdersContent from '@/components/layouts/adminLayout/orders/AdminOrdersContent';

export const metadata: Metadata = {
  title: 'Product Orders Management | Admin Portal',
  description: 'Manage all customer product orders, view order status and item breakdown.',
};

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
