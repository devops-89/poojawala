import { Suspense } from 'react';
import { Metadata } from 'next';
import CustomerDashboardContent from '@/components/layouts/customerLayout/dashboard/CustomerDashboardContent';

export default function CustomerDashboard() {
  return (
    <Suspense fallback={null}>
      <CustomerDashboardContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'My Bookings | 1Pooja',
  description: 'Manage your upcoming pujas and view past bookings on the 1Pooja customer portal.',
};
