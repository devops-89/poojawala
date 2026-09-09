import { Metadata } from 'next';
import ServicesContent from '@/components/layouts/portalLayout/ServicesContent';

export default function ServicesPage() {
  return <ServicesContent />;
}

export const metadata: Metadata = {
  title: 'Service Management | Poojawala Partner Portal',
  description: 'Customize the rituals and pujas you offer, including durations and specific dakshina rates on the Poojawala platform.',
};
