import { Metadata } from 'next';
import { Suspense } from 'react';
import AdminReviewsContent from '@/components/layouts/adminLayout/reviews/AdminReviewsContent';

export const metadata: Metadata = {
  title: 'Reviews & Ratings | Admin Portal',
  description: 'Monitor customer feedback and ratings for Purohits and Astrologers',
};

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={null}>
      <AdminReviewsContent />
    </Suspense>
  );
}
