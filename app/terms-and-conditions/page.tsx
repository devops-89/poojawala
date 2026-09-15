import { Metadata } from 'next';
import TermsAndConditionsContent from '@/components/layouts/userPages/TermsAndConditionsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Poojawala',
  description: 'Read the terms and conditions governing the use of Poojawala services, bookings, and Purohit consultations.',
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsContent />;
}
