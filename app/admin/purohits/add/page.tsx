import AddPurohitForm from '@/components/layouts/adminLayout/purohits/AddPurohitForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboard Purohit | Admin Portal',
  description: 'Add a new purohit to the Poojawala platform.',
};

export default function AddPurohitPage() {
  return <AddPurohitForm />;
}
