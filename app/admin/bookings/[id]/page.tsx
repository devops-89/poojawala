import { Metadata } from 'next';
import AdminBookingDetailsContent from '@/components/layouts/adminLayout/bookings/AdminBookingDetailsContent';

export const metadata: Metadata = {
  title: 'Booking Details | Admin Portal',
  description: 'View booking details, assignments, and payment summary.',
};

export default function AdminBookingDetailsPage() {
  return <AdminBookingDetailsContent />;
}
