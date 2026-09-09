import { Metadata } from 'next';
import AdminDashboardContent from '@/components/layouts/adminLayout/dashboard/AdminDashboardContent';

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}

export const metadata: Metadata = {
  title: 'Admin Dashboard | Poojawala Control Centre',
  description: 'Overview of platform analytics, live bookings, revenue, and user growth for Poojawala administrators.',
};
