import { Metadata } from 'next';
import PortalRegisterContent from '@/components/layouts/portalLayout/PortalRegisterContent';

export default function RegisterPage() {
  return <PortalRegisterContent />;
}

export const metadata: Metadata = {
  title: 'Register as a Purohit | Poojawala',
  description: 'Join Poojawala as a verified Purohit partner. Register today to connect with devotees and manage your puja bookings online.',
};
