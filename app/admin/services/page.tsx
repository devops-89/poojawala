import { Metadata } from 'next';
import AdminServicesContent from '@/components/layouts/adminLayout/services/AdminServicesContent';

export const metadata: Metadata = {
  title: 'Service Management | 1Pooja Admin',
  description: 'Manage services, dynamic pricing, and regional configurations.',
};

export default function AdminServicesPage() {
  return <AdminServicesContent />;
}
