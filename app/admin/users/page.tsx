import { Metadata } from 'next';
import AdminUsersContent from '@/components/layouts/adminLayout/users/AdminUsersContent';

export const metadata: Metadata = {
  title: 'Customer Management | Poojawala Admin',
  description: 'Manage users, ban/block accounts, and handle complaints.',
};

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
