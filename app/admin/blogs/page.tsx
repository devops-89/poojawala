import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AdminBlogsContent from '@/components/layouts/adminLayout/blogs/AdminBlogsContent';

export const metadata: Metadata = {
  title: 'Blogs Management | Admin Portal',
  description: 'Manage articles, blogs, and published content.',
};

export default function AdminBlogsPage() {
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
      <AdminBlogsContent />
    </Suspense>
  );
}
