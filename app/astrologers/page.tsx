import AstrologersLayout from "@/components/layouts/astrologersLayout/AstrologersLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Explore Experienced Astrologers in India | 1Pooja',
  description:
    'Explore experienced astrologers in India for horoscope reading, Kundali matching and Vedic astrology guidance. Discover experts on 1Pooja.',
  keywords: [
    'best astrologers online',
    'astrologer consultation online',
    'Vedic astrologers',
    'best astrologers in india',
    'online Kundali matching astrologers',
    'experienced Vedic astrologers',
  ],
  alternates: {
    canonical: '/astrologers',
  },
  openGraph: {
    title: 'Explore Experienced Astrologers in India | 1Pooja',
    description:
      'Explore experienced astrologers in India for horoscope reading, Kundali matching and Vedic astrology guidance. Discover experts on 1Pooja.',
    url: '/astrologers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Experienced Astrologers in India | 1Pooja',
    description:
      'Explore experienced astrologers in India for horoscope reading, Kundali matching and Vedic astrology guidance. Discover experts on 1Pooja.',
  },
};

export default function AstrologersPage() {
  return <AstrologersLayout />;
}
