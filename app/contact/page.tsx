import { Metadata } from 'next';
import ContactContent from '@/components/layouts/userPages/ContactContent';

export default function ContactPage() {
  return <ContactContent />;
}

export const metadata: Metadata = {
  title: 'Contact Us | 1Pooja Support',
  description: 'Get in touch with the 1Pooja team for booking inquiries, support, or partnership opportunities. We are here to help with your divine needs.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    url: '/contact',
  },
};
