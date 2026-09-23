import { Metadata } from 'next';
import ServicesPage from '@/components/layouts/customerLayout/services';

export default function CustomerServicesPage() {
  return <ServicesPage />;
}

export const metadata: Metadata = {
  title: 'Services | Poojawala',
  description: 'Explore and book pujas and services on Poojawala.',
};
