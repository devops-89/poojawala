import { Metadata } from 'next';
import AdminServiceDetailsContent from '@/components/layouts/adminLayout/services/AdminServiceDetailsContent';

export const metadata: Metadata = {
  title: 'Service Details | Admin Portal',
  description: 'View details, pricing, and specifications for a service.',
};

export default function ServiceDetailsPage() {
  return <AdminServiceDetailsContent />;
}
