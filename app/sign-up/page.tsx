import { Metadata } from 'next';
import { Suspense } from 'react';
import SignUpContent from '@/components/layouts/userPages/SignUpContent';

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Sign Up | Poojawala',
  description: 'Create a Poojawala account to easily book experienced Pandits, track your puja history, and experience hassle-free divine services.',
};
