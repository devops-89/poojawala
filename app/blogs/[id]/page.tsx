import WebsiteBlogDetailsContent from "@/components/layouts/blogsLayout/WebsiteBlogDetailsContent";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Blog Post | 1Pooja",
    description: "Read step-by-step Puja Vidhis, festival guides, and Vedic wisdom.",
    alternates: {
      canonical: `/blogs/${id}`,
    },
    openGraph: {
      url: `/blogs/${id}`,
    },
  };
}

interface PublicBlogDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicBlogDetailsPage({ params }: PublicBlogDetailsPageProps) {
  const resolvedParams = await params;
  return <WebsiteBlogDetailsContent blogId={resolvedParams.id} />;
}
