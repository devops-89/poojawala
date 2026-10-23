import ServicesLayout from "@/components/layouts/servicesLayout/ServicesLayout";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

export const metadata: Metadata = {
  title: 'Book Pandit & Purohit Online or Offline for All Pooja | 1Pooja',
  description:
    'Book experienced pandit & Purohit online or offline for Ganesh Pooja, Griha Pravesh, Havan and other Hindu rituals with 1Pooja.',
  keywords: [
    'griha pravesh pandit booking',
    'griha pravesh pooja booking',
    'pandit for griha pravesh pooja',
    'satyanarayan pooja pandit charges',
    'satyanarayan puja at home',
    'rudrabhishek pandit booking',
    'book online pandit for rudrabhishek',
    'maha mrityunjaya pooja booking',
    'online best pandit for maha mrityunjaya pooja',
    'kaal sarp dosh pooja',
    'online kaal sarp dosh nivaran pooja',
    'mangal dosh pooja booking',
    'online mangal dosh nivaran pooja',
    'Pandit for ganesh pooja',
    'Book best pandit for ganesh pooja',
    'book online pandit for ganesh pooja',
    'lakshmi pooja pandit booking',
    'diwali lakshmi pooja pandit',
    'book pandit for marriage',
    'book pandit vivah pooja',
    'pandit for hindu wedding',
    'durga pooja pandit booking',
    'navratri online pooja booking',
    'navratri pooja pandit booking charges',
    'kundali consultation online',
    'Lalitha Sahasranam Pooja booking',
    'vastu shanti pooja pandit',
    'book pandit for new office opening pooja',
    'book pandit for new vehicle pooja',
    'vehicle pooja pandit',
    'hanuman pooja pandit booking',
    'havan pandit booking',
    'pandit for new home puja',
  ],
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Book Pandit & Purohit Online or Offline for All Pooja | 1Pooja',
    description:
      'Book experienced pandit & Purohit online or offline for Ganesh Pooja, Griha Pravesh, Havan and other Hindu rituals with 1Pooja.',
    url: '/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Pandit & Purohit Online or Offline for All Pooja | 1Pooja',
    description:
      'Book experienced pandit & Purohit online or offline for Ganesh Pooja, Griha Pravesh, Havan and other Hindu rituals with 1Pooja.',
  },
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      }
    >
      <ServicesLayout />
    </Suspense>
  );
}
