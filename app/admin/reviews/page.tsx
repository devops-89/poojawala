import { Metadata } from 'next';
import AdminReviewsContent from '@/components/layouts/adminLayout/reviews/AdminReviewsContent';

export const metadata: Metadata = {
  title: 'Reviews & Ratings | Admin Portal',
  description: 'Monitor customer feedback and ratings for Purohits',
};

export default function AdminReviewsPage() {
  return <AdminReviewsContent />;
}
