import BlogsLayout from "@/components/layouts/blogsLayout/BlogsLayout";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: "Blogs & Sacred Insights | 1Pooja",
  description: "Discover step-by-step Puja Vidhis, festival guides, mantra meanings, and sacred insights written by verified Pandits.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    url: "/blogs",
  },
};

export default function PublicBlogsPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      }
    >
      <BlogsLayout />
    </Suspense>
  );
}
