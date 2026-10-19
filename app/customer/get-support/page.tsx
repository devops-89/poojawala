import { Metadata } from 'next';
import CustomerSupportContent from '@/components/layouts/customerLayout/support/CustomerSupportContent';

export default function CustomerSupportPage() {
  return <CustomerSupportContent />;
}

export const metadata: Metadata = {
  title: 'Get Support | 1Pooja',
  description: 'Raise tickets and get support for your 1Pooja bookings.',
};
