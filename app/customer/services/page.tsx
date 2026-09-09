import { Metadata } from 'next';
import CustomerServicesContent from '@/components/layouts/customerLayout/services/CustomerServicesContent';

export default function CustomerServicesPage() {
  return <CustomerServicesContent />;
}

export const metadata: Metadata = {
  title: 'Services | Poojawala',
  description: 'Explore and book pujas and services on Poojawala.',
};
