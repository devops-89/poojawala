import AdminPurohitDetailsContent from '@/components/layouts/adminLayout/purohits/AdminPurohitDetailsContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Purohit Details | Admin Portal',
  description: 'View details, documents, and approval status for a purohit.',
};

export default function PurohitDetailsPage() {
  return <AdminPurohitDetailsContent />;
}
