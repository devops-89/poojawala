import WebsiteTempleDetailsContent from "@/components/layouts/templesLayout/WebsiteTempleDetailsContent";
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
  return {
    title: "Temple Details | 1Pooja",
    description:
      "Explore sacred temple details, history, legends, and book authenticated Vedic rituals and poojas on 1Pooja.",
    alternates: {
      canonical: `/temples/${id}`,
    },
    openGraph: {
      url: `/temples/${id}`,
    },
  };
}
