import ResetPasswordContent from '@/components/layouts/userPages/ResetPasswordContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Reset Password | Poojawala',
  description: 'Reset your Poojawala account password.',
};
