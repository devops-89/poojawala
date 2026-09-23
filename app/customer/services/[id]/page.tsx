import { Metadata } from 'next';
import CustomerServiceDetailsContent from '@/components/layouts/customerLayout/services/CustomerServiceDetailsContent';

export default function ServiceDetailsPage() {
  return <CustomerServiceDetailsContent />;
}

export const metadata: Metadata = {
  title: 'Service Details | Poojawala',
  description: 'View service details and book verified purohits on Poojawala.',
};
