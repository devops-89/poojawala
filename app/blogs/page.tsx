import BlogsLayout from "@/components/layouts/blogsLayout/BlogsLayout";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: 'Pooja Vidhi, Pandit Booking & Muhurat Guide | 1Pooja Blogs',
  description:
    'Read expert guides on Hindu pooja vidhi, festival traditions, pandit booking, and auspicious muhurat timings for your rituals.',
  keywords: [
    'Pooja Guide',
    'Muhurat Guide',
    'Pandit Booking Guide',
    'Hindu festival pooja guide',
  ],
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Pooja Vidhi, Pandit Booking & Muhurat Guide | 1Pooja Blogs',
    description:
      'Read expert guides on Hindu pooja vidhi, festival traditions, pandit booking, and auspicious muhurat timings for your rituals.',
    url: '/blogs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pooja Vidhi, Pandit Booking & Muhurat Guide | 1Pooja Blogs',
    description:
      'Read expert guides on Hindu pooja vidhi, festival traditions, pandit booking, and auspicious muhurat timings for your rituals.',
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
