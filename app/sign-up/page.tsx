import { Metadata } from 'next';
import SignUpContent from '@/components/layouts/userPages/SignUpContent';

export default function SignUpPage() {
  return <SignUpContent />;
}

export const metadata: Metadata = {
  title: 'Sign Up | Poojawala',
  description: 'Create a Poojawala account to easily book experienced Pandits, track your puja history, and experience hassle-free divine services.',
};
