import { Metadata } from 'next';
import AdminServiceCategoriesContent from '@/components/layouts/adminLayout/services/AdminServiceCategoriesContent';

export const metadata: Metadata = {
  title: 'Categories | 1Pooja Admin',
  description: 'Manage service and product categories.',
};

export default function AdminServiceCategoriesPage() {
  return <AdminServiceCategoriesContent />;
}
