import { Metadata } from 'next';
import DashboardContent from '@/components/layouts/portalLayout/DashboardContent';

export default function PortalDashboard() {
  return <DashboardContent />;
}

export const metadata: Metadata = {
  title: 'Partner Dashboard | 1Pooja',
  description: 'Overview of your upcoming pujas, daily earnings, and quick actions in the 1Pooja Purohit Partner Portal.',
};
