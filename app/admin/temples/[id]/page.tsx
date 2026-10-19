import { Metadata } from 'next';
import AdminTempleDetailsContent from '@/components/layouts/adminLayout/temples/AdminTempleDetailsContent';

export const metadata: Metadata = {
  title: 'Temple Details | 1Pooja Admin',
  description: 'View temple details and information.',
};

export default function AdminTempleDetailsPage() {
  return <AdminTempleDetailsContent />;
}
