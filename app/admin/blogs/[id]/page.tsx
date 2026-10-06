import { Metadata } from "next";
import BlogDetailsContent from "@/components/layouts/adminLayout/blogs/BlogDetailsContent";

export const metadata: Metadata = {
  title: "Blog Details | Admin Portal",
  description: "View blog details and post content.",
};

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const resolvedParams = await params;
  return <BlogDetailsContent blogId={resolvedParams.id} />;
}
