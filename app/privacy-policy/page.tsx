import { Metadata } from 'next';
import PrivacyPolicyContent from '@/components/layouts/userPages/PrivacyPolicyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | 1Pooja',
  description: 'Learn how 1Pooja collects, protects, and handles your personal data and privacy when using our platform.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    url: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
