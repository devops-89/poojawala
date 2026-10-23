import WebsiteBlogDetailsContent from "@/components/layouts/blogsLayout/WebsiteBlogDetailsContent";
import { getBlogByIdAPI } from "@/api/blogControllers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post | 1Pooja",
  description: "Read step-by-step Puja Vidhis, festival guides, and Vedic wisdom.",
};

export default function PublicBlogDetailsPage() {
  return <WebsiteBlogDetailsContent />;
}
