import { Metadata } from 'next';
import AddBookingForm from '@/components/layouts/adminLayout/bookings/AddBookingForm';

export const metadata: Metadata = {
  title: 'Add Booking | Admin Portal',
  description: 'Manually create a booking for a customer on 1Pooja.',
};

export default function AddBookingPage() {
  return <AddBookingForm />;
}
