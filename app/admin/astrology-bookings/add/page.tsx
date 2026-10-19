import { Metadata } from 'next';
import AddAstrologyBookingForm from '@/components/layouts/adminLayout/bookings/AddAstrologyBookingForm';

export const metadata: Metadata = {
  title: 'Add Astrology Booking | Admin Portal',
  description: 'Manually schedule an astrology consultation for a customer on 1Pooja.',
};

export default function AddAstrologyBookingPage() {
  return <AddAstrologyBookingForm />;
}
