import { Metadata } from 'next';
import TermsAndConditionsContent from '@/components/layouts/userPages/TermsAndConditionsContent';

export const metadata: Metadata = {
  title: 'Terms & Conditions | 1Pooja',
  description: 'Read the terms and conditions governing the use of 1Pooja services, bookings, and Purohit consultations.',
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsContent />;
}
