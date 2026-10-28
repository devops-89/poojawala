import { Metadata } from 'next';
import WebsiteServiceDetailsContent from '@/components/layouts/servicesLayout/WebsiteServiceDetailsContent';
import { getServiceByIdAPI } from '@/api/serviceControllers';

export default function PublicServiceDetailsPage() {
  return <WebsiteServiceDetailsContent />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams?.slug;
  let slug = rawSlug;
  let serviceTitle = 'Service Details | 1Pooja';
  let serviceDesc = 'View Vedic service details and book verified purohits on 1Pooja.';
  let imageUrl = 'https://1pooja.com/images/logo.webp';

  try {
    const res = await getServiceByIdAPI(rawSlug);
    let data = res?.data;
    while (data?.data && !data?.id) {
      data = data.data;
    }

    if (data) {
      if (data.slug) slug = data.slug;
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
  } catch (err) {
    // fallback to provided id param
  }

  const canonicalUrl = `https://1pooja.com/services/${slug}`;

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
