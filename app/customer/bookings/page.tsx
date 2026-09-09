import { Metadata } from 'next';
import CustomerDashboardContent from '@/components/layouts/customerLayout/dashboard/CustomerDashboardContent';

export default function CustomerDashboard() {
  return <CustomerDashboardContent />;
}

export const metadata: Metadata = {
  title: 'My Bookings | Poojawala',
  description: 'Manage your upcoming pujas and view past bookings on the Poojawala customer portal.',
};
