import ForgotPasswordContent from '@/components/layouts/userPages/ForgotPasswordContent';
import { Metadata } from 'next';

export default function ForgotPasswordPage() {
  return <ForgotPasswordContent />;
}

export const metadata: Metadata = {
  title: 'Forgot Password | Poojawala',
  description: 'Reset your Poojawala account password.',
};
