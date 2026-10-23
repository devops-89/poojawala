import TemplesLayout from "@/components/layouts/templesLayout/TemplesLayout";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: 'Explore Famous Temples in India & Pooja Booking | 1Pooja',
  description:
    'Explore famous temples in India, discover temple details, and book pooja online or offline with 1Pooja for a convenient spiritual experience.',
  keywords: [
    'book pooja on temple',
    'temple pooja package',
    'temple pooja booking price',
    'book pandit for temple pooja',
    'online temple pooja booking',
  ],
  alternates: {
    canonical: '/temples',
  },
  openGraph: {
    title: 'Explore Famous Temples in India & Pooja Booking | 1Pooja',
    description:
      'Explore famous temples in India, discover temple details, and book pooja online or offline with 1Pooja for a convenient spiritual experience.',
    url: '/temples',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Famous Temples in India & Pooja Booking | 1Pooja',
    description:
      'Explore famous temples in India, discover temple details, and book pooja online or offline with 1Pooja for a convenient spiritual experience.',
  },
};

export default function TemplesPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      }
    >
      <TemplesLayout />
    </Suspense>
  );
}
