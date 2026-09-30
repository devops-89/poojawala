import { Metadata } from 'next';
import WebsiteServiceDetailsContent from '@/components/layouts/servicesLayout/WebsiteServiceDetailsContent';

export default function PublicServiceDetailsPage() {
  return <WebsiteServiceDetailsContent />;
}

export const metadata: Metadata = {
  title: 'Service Details | Poojawala',
  description: 'View Vedic service details and book verified purohits on Poojawala.',
};
