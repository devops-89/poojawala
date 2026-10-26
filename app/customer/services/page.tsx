import { Metadata } from 'next';
import { Suspense } from 'react';
import ServicesPage from '@/components/layouts/customerLayout/services';

type CustomerServicesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: CustomerServicesPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const isOffline = resolvedParams?.isOffline === 'true';
  const isOnline = resolvedParams?.isOnline === 'true';

  let title = 'Services | 1Pooja';
  let description = 'Explore and book pujas and services on 1Pooja.';

  if (isOffline) {
    title = 'Offline Services | Customer Portal | 1Pooja';
    description =
      'Discover and book verified in-person and offline pooja services with experienced pandits.';
  } else if (isOnline) {
    title = 'Online Services | Customer Portal | 1Pooja';
    description =
      'Experience authentic sacred rituals performed live via interactive digital video by experienced Purohits from anywhere.';
  }

  return {
    title,
    description,
  };
}

export default function CustomerServicesPage() {
  return (
    <Suspense fallback={null}>
      <ServicesPage />
    </Suspense>
  );
}
