import { Metadata } from 'next';
import { Suspense } from 'react';
import SignInContent from '@/components/layouts/userPages/SignInContent';

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Sign In | 1Pooja',
  description: 'Sign in to your 1Pooja account to manage your bookings, favorite purohits, and view upcoming rituals.',
  alternates: {
    canonical: '/sign-in',
  },
  openGraph: {
    url: '/sign-in',
  },
};
