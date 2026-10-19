import WebsiteBlogDetailsContent from "@/components/layouts/blogsLayout/WebsiteBlogDetailsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post | 1Pooja",
  description: "Read step-by-step Puja Vidhis, festival guides, and Vedic wisdom.",
};

interface PublicBlogDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicBlogDetailsPage({ params }: PublicBlogDetailsPageProps) {
  const resolvedParams = await params;
  return <WebsiteBlogDetailsContent blogId={resolvedParams.id} />;
}
