import { Metadata } from 'next';
import SupportContent from '@/components/layouts/portalLayout/SupportContent';

export default function SupportPage() {
  return <SupportContent />;
}

export const metadata: Metadata = {
  title: 'Partner Support | 1Pooja',
  description: 'Track and manage your support tickets and complaints on 1Pooja Partner Portal.',
};
