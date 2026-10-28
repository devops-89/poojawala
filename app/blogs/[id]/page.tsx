import WebsiteBlogDetailsContent from "@/components/layouts/blogsLayout/WebsiteBlogDetailsContent";
import { getBlogByIdAPI } from "@/api/blogControllers";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let blogTitle = "Blog Post | 1Pooja";
  let blogDesc = "Read step-by-step Puja Vidhis, festival guides, and Vedic wisdom.";
  let imageUrl = "https://1pooja.com/images/logo.webp";

  try {
    const res = await getBlogByIdAPI(id);
    const data = res?.data?.data || res?.data || res?.blog || res;
    if (data) {
      if (data.metaTitle && data.metaTitle.trim()) {
        blogTitle = data.metaTitle.trim();
      } else if (data.title) {
        blogTitle = `${data.title} | 1Pooja`;
      }
      if (data.metaDescription && data.metaDescription.trim()) {
        blogDesc = data.metaDescription.trim();
      } else if (data.excerpt || data.content) {
        blogDesc = String(data.excerpt || data.content)
          .replace(/<[^>]*>?/gm, "")
          .slice(0, 160);
      }
      if (data.downloadUrl || data.coverImage || data.imageUrl) {
        imageUrl = data.downloadUrl || data.coverImage || data.imageUrl;
      }
    }
  } catch (err) {}

  return {
    title: blogTitle,
    description: blogDesc,
    openGraph: {
      title: blogTitle,
      description: blogDesc,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: blogTitle,
      description: blogDesc,
      images: [imageUrl],
    },
  };
}

export default function PublicBlogDetailsPage() {
  return <WebsiteBlogDetailsContent />;
}
