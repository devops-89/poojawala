import { Metadata } from 'next';
import AdminPurohitsContent from '@/components/layouts/adminLayout/purohits/AdminPurohitsContent';

export const metadata: Metadata = {
  title: 'Purohits Management | Admin Portal',
  description: 'Manage and onboard purohits for Poojawala.',
};

export default function PurohitsPage() {
  return <AdminPurohitsContent />;
}
