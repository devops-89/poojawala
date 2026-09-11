import { Metadata } from 'next';
import Features from "@/components/layouts/home-layout/Features";
import HeroSection from "@/components/layouts/home-layout/HeroSection";
import PopularPackages from "@/components/layouts/home-layout/PopularPackages";
import Testimonials from "@/components/layouts/home-layout/Testimonials";
import UpcomingFestivals from "@/components/layouts/home-layout/UpcomingFestivals";
import VerifiedPurohits from "@/components/layouts/home-layout/VerifiedPurohits";
import WhyPoojawala from "@/components/layouts/home-layout/WhyPoojawala";
import { Box } from '@mui/material';

export default function Home() {
  return (
    <Box component="main" sx={{ overflowX: 'hidden', width: '100%', position: 'relative' }}>
      <HeroSection />
      <Features />
      <PopularPackages />
      <VerifiedPurohits />
      <UpcomingFestivals />
      <Testimonials />
      <WhyPoojawala />
      {/* Search overlay placeholder (can be implemented later) */}
    </Box>
  );
}

export const metadata: Metadata = {
  title: 'Poojawala | Book Experienced Pandits & Purohits Online',
  description: 'Book verified and experienced Pandits for all Hindu pujas, homams, and rituals at your home. Quality pooja samagri and seamless online booking with Poojawala.',
};
