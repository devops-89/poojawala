import { Metadata } from 'next';
import ContactContent from '@/components/layouts/userPages/ContactContent';

export default function ContactPage() {
  return <ContactContent />;
}

export const metadata: Metadata = {
  title: 'Contact Us For Online or Offline Pooja Booking | 1Pooja',
  description:
    'Contact 1Pooja for online or offline pooja booking enquiries, service charges, and expert assistance with your pooja booking needs.',
  keywords: [
    'Contact 1Pooja',
    'Pooja booking enquiry',
    'contact for pooja booking',
    'Pooja service charges',
    'Online pooja booking',
  ],
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us For Online or Offline Pooja Booking | 1Pooja',
    description:
      'Contact 1Pooja for online or offline pooja booking enquiries, service charges, and expert assistance with your pooja booking needs.',
    url: '/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us For Online or Offline Pooja Booking | 1Pooja',
    description:
      'Contact 1Pooja for online or offline pooja booking enquiries, service charges, and expert assistance with your pooja booking needs.',
  },
};
