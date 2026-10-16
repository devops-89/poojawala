import { Metadata } from 'next';
import PurohitServiceDetailsContent from '@/components/layouts/portalLayout/services/PurohitServiceDetailsContent';

export default function ServiceDetailsPage() {
  return <PurohitServiceDetailsContent />;
}

export const metadata: Metadata = {
  title: 'Service Details | Purohit Portal',
  description: 'View service details and add to your purohit profile.',
};
