import { Metadata } from 'next';
import AddTempleForm from '@/components/layouts/adminLayout/temples/AddTempleForm';

export const metadata: Metadata = {
  title: 'Add Temple | Poojawala Admin',
  description: 'Create a new temple listing.',
};

export default function AddTemplePage() {
  return <AddTempleForm />;
}
