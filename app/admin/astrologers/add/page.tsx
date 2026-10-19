import AddAstrologerForm from '@/components/layouts/adminLayout/astrologers/AddAstrologerForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboard Astrologer | Admin Portal',
  description: 'Add a new astrologer to the 1Pooja platform.',
};

export default function AddAstrologerPage() {
  return <AddAstrologerForm />;
}
