import { Metadata } from 'next';
import SignInContent from '@/components/layouts/userPages/SignInContent';

export default function SignInPage() {
  return <SignInContent />;
}

export const metadata: Metadata = {
  title: 'Sign In | Poojawala',
  description: 'Sign in to your Poojawala account to manage your bookings, favorite purohits, and view upcoming rituals.',
};
