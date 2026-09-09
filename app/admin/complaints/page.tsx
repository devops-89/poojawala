import { Metadata } from 'next';
import AdminComplaintsContent from '@/components/layouts/adminLayout/complaints/AdminComplaintsContent';

export const metadata: Metadata = {
  title: 'Complaints | Admin Portal',
  description: 'Manage and resolve customer and purohit complaints',
};

export default function AdminComplaintsPage() {
  return <AdminComplaintsContent />;
}
