import { Metadata } from 'next';
import AdminOrderDetailsContent from '@/components/layouts/adminLayout/orders/AdminOrderDetailsContent';

export const metadata: Metadata = {
  title: 'Order Details | Admin Portal',
  description: 'View sacred product order details, items breakdown, and payment summary.',
};

export default function AdminOrderDetailsPage() {
  return <AdminOrderDetailsContent />;
}
