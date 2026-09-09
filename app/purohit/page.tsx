import { Metadata } from 'next';
import PortalLoginForm from '@/components/layouts/portalLayout/PortalLoginForm';

export default function PortalLogin() {
  return <PortalLoginForm />;
}

export const metadata: Metadata = {
  title: 'Purohit Partner Portal Login | Poojawala',
  description: 'Login to the Poojawala Partner Portal to manage your bookings, earnings, and availability as a verified Purohit.',
};
