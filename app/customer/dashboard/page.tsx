import { Metadata } from 'next';
import CustomerDashboardOverview from '@/components/layouts/customerLayout/dashboard/CustomerDashboardOverview';

export default function CustomerDashboardPage() {
  return <CustomerDashboardOverview />;
}

export const metadata: Metadata = {
  title: 'Dashboard | 1Pooja',
  description: 'Your 1Pooja dashboard overview.',
};
