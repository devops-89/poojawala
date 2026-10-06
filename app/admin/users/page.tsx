import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminUsersContent from '@/components/layouts/adminLayout/users/AdminUsersContent';

export const metadata: Metadata = {
  title: 'Customer Management | Poojawala Admin',
  description: 'Manage users, ban/block accounts, and handle complaints.',
};

export default function AdminUsersPage() {
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
      <AdminUsersContent />
    </Suspense>
  );
}
