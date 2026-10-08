import { Metadata } from 'next';
import EditTempleForm from '@/components/layouts/adminLayout/temples/EditTempleForm';

export const metadata: Metadata = {
  title: 'Edit Temple | Poojawala Admin',
  description: 'Update temple details and location.',
};

export default async function EditTemplePage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  return <EditTempleForm id={resolvedParams.id} />;
}
