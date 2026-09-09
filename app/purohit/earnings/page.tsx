import { Metadata } from 'next';
import EarningsContent from '@/components/layouts/portalLayout/EarningsContent';

export default function EarningsPage() {
  return <EarningsContent />;
}

export const metadata: Metadata = {
  title: 'Earnings & Payouts | Poojawala Partner Portal',
  description: 'Track your total earnings, view detailed payout history, and manage your financial transactions as a Poojawala Partner.',
};
