import { Metadata } from 'next';
import AdminServiceCategoriesContent from '@/components/layouts/adminLayout/services/AdminServiceCategoriesContent';

export const metadata: Metadata = {
  title: 'Service Categories | Poojawala Admin',
  description: 'Manage service categories and configurations.',
};

export default function AdminServiceCategoriesPage() {
  return <AdminServiceCategoriesContent />;
}
