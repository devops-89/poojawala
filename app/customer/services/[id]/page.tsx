import { Metadata } from 'next';
import CustomerServiceDetailsContent from '@/components/layouts/customerLayout/services/CustomerServiceDetailsContent';
import { getServiceByIdAPI } from '@/api/serviceControllers';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawId = resolvedParams?.id;
  let serviceTitle = 'Service Details | 1Pooja';
  let serviceDesc = 'View service details and book verified purohits on 1Pooja.';
  let imageUrl = 'https://1pooja.com/images/logo.webp';
  let canonicalSlug = rawId;

  try {
    const res = await getServiceByIdAPI(rawId);
    let data = res?.data;
    while (data?.data && !data?.id) {
      data = data.data;
    }

    if (data) {
      if (data.slug) canonicalSlug = data.slug;
      if (data.metaTitle && data.metaTitle.trim()) {
        serviceTitle = data.metaTitle.trim();
      } else if (data.name) {
        serviceTitle = `${data.name} | 1Pooja`;
      }
      if (data.metaDescription && data.metaDescription.trim()) {
        serviceDesc = data.metaDescription.trim();
      } else if (data.description || data.shortDescription) {
        serviceDesc = String(data.shortDescription || data.description)
          .replace(/<[^>]*>?/gm, '')
          .slice(0, 160);
      }
      if (data.iconDownloadurl || data.iconUrl || data.downloadUrl || data.imageUrl) {
        imageUrl = data.iconDownloadurl || data.iconUrl || data.downloadUrl || data.imageUrl;
      }
    }
  } catch (err) {}

  const canonicalUrl = `https://1pooja.com/services/${canonicalSlug}`;

  return {
    title: serviceTitle,
    description: serviceDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: serviceTitle,
      description: serviceDesc,
      url: canonicalUrl,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: serviceTitle,
      description: serviceDesc,
      images: [imageUrl],
    },
  };
}

export default function ServiceDetailsPage() {
  return <CustomerServiceDetailsContent />;
}
