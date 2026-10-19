import { Metadata } from 'next';
import CustomerPaymentsContent from '@/components/layouts/customerLayout/payments/CustomerPaymentsContent';

export const metadata: Metadata = {
  title: 'My Payments | 1Pooja',
  description: 'Manage your payments.',
};

export default function CustomerPaymentsPage() {
  return <CustomerPaymentsContent />;
}
