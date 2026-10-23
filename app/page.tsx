import { Metadata } from 'next';
import Features from "@/components/layouts/home-layout/Features";
import HeroSection from "@/components/layouts/home-layout/HeroSection";
import PopularPackages from "@/components/layouts/home-layout/PopularPackages";
import PoojaProcessSection from "@/components/layouts/home-layout/PoojaProcessSection";
import ServiceCategoriesSection from "@/components/layouts/home-layout/ServiceCategoriesSection";
import TemplesSection from "@/components/layouts/home-layout/TemplesSection";
import Testimonials from "@/components/layouts/home-layout/Testimonials";
import UpcomingFestivals from "@/components/layouts/home-layout/UpcomingFestivals";
import WhyPoojawala from "@/components/layouts/home-layout/WhyPoojawala";
import WelcomeLocationModal from "@/components/widgets/WelcomeLocationModal";
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box component="main" sx={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
      <HeroSection />
      <Features />
      <PopularPackages />
      <PoojaProcessSection />
      <ServiceCategoriesSection />
      <TemplesSection />
      <UpcomingFestivals />
      <Testimonials />
      <WhyPoojawala />
      <WelcomeLocationModal />
    </Box>
  );
}

export const metadata: Metadata = {
  title: 'Book Experienced Pandits & Purohits online or offline | 1Pooja',
  description:
    'Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience.',
  keywords: [
    'satyanarayan pooja booking',
    'satyanarayan katha pandit',
    'satyanarayan pooja for new home',
    'satyanarayan katha online booking',
    'new office opening pooja',
    'new vehicle pooja booking',
    'pandit booking online',
    'pitru dosh pooja booking',
    'book rudrabhishek pooja',
    'rudrabhishek pooja at home',
    'ganesh pooja booking',
    'vishwakarma pooja booking',
    'shani shanti pooja booking',
    'vastu dosh nivaran pooja',
    'vastu dosh pooja booking',
    'vastu shanti pooja booking',
    'havan pooja booking',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Book Experienced Pandits & Purohits online or offline | 1Pooja',
    description:
      'Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience.',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Experienced Pandits & Purohits online or offline | 1Pooja',
    description:
      'Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience.',
  },
};
