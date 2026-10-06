import { Metadata } from 'next';
import AdminBlogsContent from '@/components/layouts/adminLayout/blogs/AdminBlogsContent';

export const metadata: Metadata = {
  title: 'Blogs Management | Admin Portal',
  description: 'Manage articles, blogs, and published content.',
};

export default function AdminBlogsPage() {
  return <AdminBlogsContent />;
}
