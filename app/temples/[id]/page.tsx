import WebsiteTempleDetailsContent from "@/components/layouts/templesLayout/WebsiteTempleDetailsContent";
import { getTempleByIdAPI } from "@/api/templeControllers";
import { Metadata } from "next";

export default function PublicTempleDetailsPage() {
  return <WebsiteTempleDetailsContent />;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let slug = id;
  let templeTitle = "Temple Details | 1Pooja";
  let templeDesc =
    "Explore sacred temple details, history, legends, and book authenticated Vedic rituals and poojas on 1Pooja.";
  let imageUrl = "https://1pooja.com/images/logo.webp";

  try {
    const res = await getTempleByIdAPI(id);
    let data = res?.data;
    if (data && data.data) data = data.data;

    if (data) {
      if (data.slug) slug = data.slug;
      if (data.name) templeTitle = `${data.name} | 1Pooja`;
      if (data.description || data.about || data.history) {
        templeDesc = String(data.description || data.about || data.history)
          .replace(/<[^>]*>?/gm, '')
          .slice(0, 160);
      }
      if (data.coverImage || data.image || data.iconDownloadurl || data.iconUrl) {
        imageUrl = data.coverImage || data.image || data.iconDownloadurl || data.iconUrl;
      }
    }
  } catch (err) {
    // fallback to provided id
  }

  const canonicalUrl = `https://1pooja.com/temples/${slug}`;

  return {
    title: templeTitle,
    description: templeDesc,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: templeTitle,
      description: templeDesc,
      url: canonicalUrl,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: templeTitle,
      description: templeDesc,
      images: [imageUrl],
    },
  };
}
