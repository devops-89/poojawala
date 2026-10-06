import { Metadata } from 'next';
import AddBlogContent from '@/components/layouts/adminLayout/blogs/AddBlogContent';

export const metadata: Metadata = {
  title: 'Create Blog | Admin Portal',
  description: 'Create and publish a new blog article.',
};

export default function CreateBlogPage() {
  return <AddBlogContent />;
}
