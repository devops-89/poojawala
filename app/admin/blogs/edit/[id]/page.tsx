import { Metadata } from 'next';
import EditBlogContent from '@/components/layouts/adminLayout/blogs/EditBlogContent';

export const metadata: Metadata = {
  title: 'Edit Blog | Admin Portal',
  description: 'Edit blog article details.',
};

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <EditBlogContent blogId={resolvedParams.id} />;
}
