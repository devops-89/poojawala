import { Metadata } from 'next';
import { Suspense } from 'react';
import ServicesPage from '@/components/layouts/customerLayout/services';

export default function CustomerServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPage />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Services | Poojawala',
  description: 'Explore and book pujas and services on Poojawala.',
};
