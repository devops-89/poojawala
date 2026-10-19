import { Metadata } from 'next';
import { Suspense } from 'react';
import VerifyOtpContent from '@/components/layouts/userPages/VerifyOtpContent';

export const metadata: Metadata = {
  title: 'Verify OTP | 1Pooja',
  description: 'Verify your phone number to complete registration with 1Pooja.',
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  );
}
