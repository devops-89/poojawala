import { Metadata } from 'next';
import { Suspense } from 'react';
import AdminBookingSettlementsContent from '@/components/layouts/adminLayout/finance/AdminBookingSettlementsContent';

export const metadata: Metadata = {
  title: 'Booking Settlements | Admin Portal',
  description: 'View completed bookings and process technician payouts.',
};

export default function BookingSettlementsPage() {
  return (
    <Suspense fallback={null}>
      <AdminBookingSettlementsContent />
    </Suspense>
  );
}
