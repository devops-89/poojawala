import { Metadata } from 'next';
import HeroSection from "@/components/layouts/home-layout/HeroSection";
import Features from "@/components/layouts/home-layout/Features";
import PopularPackages from "@/components/layouts/home-layout/PopularPackages";
import LazyPoojaProcess from "@/components/layouts/home-layout/LazyPoojaProcess";
import LazyServiceCategories from "@/components/layouts/home-layout/LazyServiceCategories";
import LazyTemples from "@/components/layouts/home-layout/LazyTemples";
import LazyUpcomingFestivals from "@/components/layouts/home-layout/LazyUpcomingFestivals";
import LazyTestimonials from "@/components/layouts/home-layout/LazyTestimonials";
import LazyWhyPoojawala from "@/components/layouts/home-layout/LazyWhyPoojawala";
import WelcomeLocationModalTrigger from "@/components/widgets/WelcomeLocationModalTrigger";
import HomeScrollRestoration from "@/components/widgets/HomeScrollRestoration";

export default function Home() {
  return (
    <div className="overflow-x-hidden w-full relative">
      <HeroSection />
      <Features />
      <PopularPackages />
      <LazyPoojaProcess />
      <LazyServiceCategories />
      <LazyTemples />
      <LazyUpcomingFestivals />
      <LazyTestimonials />
      <LazyWhyPoojawala />
      <WelcomeLocationModalTrigger />
      <HomeScrollRestoration />
    </div>
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
