import { Metadata } from 'next';
import PortalProfileDetailsContent from '@/components/layouts/portalLayout/PortalProfileDetailsContent';

export default function ProfileDetailsPage() {
  return <PortalProfileDetailsContent />;
}

export const metadata: Metadata = {
  title: 'Profile Details | Poojawala Partner Portal',
  description: 'View your live public profile as seen by devotees looking to book your services on Poojawala.',
};
