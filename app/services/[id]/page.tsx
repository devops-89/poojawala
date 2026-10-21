import { Metadata } from 'next';
import WebsiteServiceDetailsContent from '@/components/layouts/servicesLayout/WebsiteServiceDetailsContent';

export default function PublicServiceDetailsPage() {
  return <WebsiteServiceDetailsContent />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: 'Service Details | 1Pooja',
    description: 'View Vedic service details and book verified purohits on 1Pooja.',
    alternates: {
      canonical: `/services/${id}`,
    },
    openGraph: {
      url: `/services/${id}`,
    },
  };
}
