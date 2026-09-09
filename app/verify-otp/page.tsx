import { Metadata } from 'next';
import VerifyOtpContent from '@/components/layouts/userPages/VerifyOtpContent';

export const metadata: Metadata = {
  title: 'Verify OTP | Poojawala',
  description: 'Verify your phone number to complete registration with Poojawala.',
};

export default function VerifyOtpPage() {
  return <VerifyOtpContent />;
}
