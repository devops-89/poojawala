import { Metadata } from 'next';
import AdminBookingsContent from '@/components/layouts/adminLayout/bookings/AdminBookingsContent';

export const metadata: Metadata = {
  title: 'Bookings Management | Admin Portal',
  description: 'Manage all service bookings, view details, and handle assignments.',
};

export default function AdminBookingsPage() {
  return <AdminBookingsContent />;
}
