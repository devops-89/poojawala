import { Metadata } from 'next';
import AdminAstrologersContent from '@/components/layouts/adminLayout/astrologers/AdminAstrologersContent';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export const metadata: Metadata = {
  title: 'Astrologers Management | Admin Portal',
  description: 'Manage and verify astrologers for 1Pooja.',
};

export default function AstrologersPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress sx={{ color: '#FF6200' }} />
        </Box>
      }
    >
      <AdminAstrologersContent />
    </Suspense>
  );
}
