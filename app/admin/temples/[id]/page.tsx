import { Metadata } from 'next';
import AdminTempleDetailsContent from '@/components/layouts/adminLayout/temples/AdminTempleDetailsContent';

export const metadata: Metadata = {
  title: 'Temple Details | Poojawala Admin',
  description: 'View temple details and information.',
};

export default function AdminTempleDetailsPage() {
  return <AdminTempleDetailsContent />;
}
