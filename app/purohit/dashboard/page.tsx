import { Metadata } from 'next';
import DashboardContent from '@/components/layouts/portalLayout/DashboardContent';

export default function PortalDashboard() {
  return <DashboardContent />;
}

export const metadata: Metadata = {
  title: 'Partner Dashboard | Poojawala',
  description: 'Overview of your upcoming pujas, daily earnings, and quick actions in the Poojawala Purohit Partner Portal.',
};
