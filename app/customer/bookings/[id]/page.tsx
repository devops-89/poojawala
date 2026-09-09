import CustomerBookingDetailsContent from '@/components/layouts/customerLayout/bookings/CustomerBookingDetailsContent';

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <CustomerBookingDetailsContent bookingId={resolvedParams.id} />;
}
