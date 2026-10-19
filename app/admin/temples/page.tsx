import { Metadata } from 'next';
import AdminTemplesContent from '@/components/layouts/adminLayout/temples/AdminTemplesContent';

export const metadata: Metadata = {
  title: 'Temples Management | 1Pooja Admin',
  description: 'Manage temples, locations, and details.',
};

export default function AdminTemplesPage() {
  return <AdminTemplesContent />;
}
