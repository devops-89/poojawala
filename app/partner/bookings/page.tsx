import { Metadata } from 'next';
import BookingsContent from '@/components/layouts/portalLayout/BookingsContent';

export default function BookingsPage() {
  return <BookingsContent />;
}

export const metadata: Metadata = {
  title: 'Manage Bookings | 1Pooja Partner Portal',
  description: 'View and manage all your new, upcoming, and past puja bookings on the 1Pooja platform.',
};
