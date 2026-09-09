import { Metadata } from 'next';
import BookingsContent from '@/components/layouts/portalLayout/BookingsContent';

export default function BookingsPage() {
  return <BookingsContent />;
}

export const metadata: Metadata = {
  title: 'Manage Bookings | Poojawala Partner Portal',
  description: 'View and manage all your new, upcoming, and past puja bookings on the Poojawala platform.',
};
