import { Metadata } from 'next';
import CustomerDashboardOverview from '@/components/layouts/customerLayout/dashboard/CustomerDashboardOverview';

export default function CustomerDashboardPage() {
  return <CustomerDashboardOverview />;
}

export const metadata: Metadata = {
  title: 'Dashboard | Poojawala',
  description: 'Your Poojawala dashboard overview.',
};
