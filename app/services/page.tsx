import ServicesLayout from "@/components/layouts/servicesLayout/ServicesLayout";
import { getServiceCategoriesAPI, getServiceCategoryByIdAPI } from "@/api/serviceControllers";
import { Metadata } from "next";
import { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

type ServicesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const DEFAULT_KEYWORDS = [
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
];

const OFFLINE_KEYWORDS = [
  'offline pooja services',
  'offline pandit booking',
  'book pandit at home',
  'pandit for pooja at home',
  'offline havan pandit booking',
  'griha pravesh puja at home',
  'satyanarayan puja offline pandit',
  'vastu shanti pooja at home',
  'marriage vivah pooja pandit',
  'local pandit booking for pooja',
  'verified purohit booking at home',
  'hindu rituals offline pandit',
];

const ONLINE_KEYWORDS = [
  'online pooja services',
  'online e-pooja booking',
  'live video pooja with pandit',
  'online pandit booking',
  'book online pandit for rudrabhishek',
  'online maha mrityunjaya pooja',
  'online kaal sarp dosh nivaran pooja',
  'online mangal dosh nivaran pooja',
  'online navratri pooja booking',
  'online kundali consultation',
  'interactive digital pooja by purohit',
  'e-pooja rituals online',
];

export async function generateMetadata({ searchParams }: ServicesPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const isOffline = resolvedParams?.isOffline === "true";
  const isOnline = resolvedParams?.isOnline === "true";

  let title = "Book Pandit & Purohit Online or Offline for All Pooja | 1Pooja";
  let description =
    "Book experienced pandit & Purohit online or offline for Ganesh Pooja, Griha Pravesh, Havan and other Hindu rituals with 1Pooja.";
  let canonical = "/services";
  let keywords = DEFAULT_KEYWORDS;

  const rawCategoryId = resolvedParams?.categoryId;
  const categoryId = Array.isArray(rawCategoryId) ? rawCategoryId[0] : rawCategoryId;
  const rawCategoryName = resolvedParams?.category;
  const categoryName = Array.isArray(rawCategoryName) ? rawCategoryName[0] : rawCategoryName;

  if (categoryId && categoryId !== "All" && categoryId !== "All Categories") {
    try {
      const catRes = await getServiceCategoryByIdAPI(categoryId);
      const catData = catRes?.data?.data || catRes?.data || catRes;
      if (catData) {
        if (catData.metaTitle && catData.metaTitle.trim()) {
          title = catData.metaTitle.trim();
        } else if (catData.name || catData.title) {
          title = `${catData.name || catData.title} Services | Book Verified Pandit | 1Pooja`;
        }
        if (catData.metaDescription && catData.metaDescription.trim()) {
          description = catData.metaDescription.trim();
        } else if (catData.description) {
          description = String(catData.description).replace(/<[^>]*>?/gm, "").slice(0, 160);
        }
        canonical = `/services?categoryId=${categoryId}`;
      }
    } catch (err) {}
  } else if (categoryName && categoryName !== "All" && categoryName !== "All Categories") {
    try {
      const catListRes = await getServiceCategoriesAPI(1, 10, categoryName);
      const list = catListRes?.data?.categories || catListRes?.categories || catListRes?.data || [];
      const match = Array.isArray(list)
        ? list.find(
            (c: any) =>
              (c.name || c.title || "").toLowerCase().trim() ===
              categoryName.toLowerCase().trim()
          )
        : null;
      if (match) {
        if (match.metaTitle && match.metaTitle.trim()) {
          title = match.metaTitle.trim();
        } else if (match.name || match.title) {
          title = `${match.name || match.title} Services | Book Verified Pandit | 1Pooja`;
        }
        if (match.metaDescription && match.metaDescription.trim()) {
          description = match.metaDescription.trim();
        } else if (match.description) {
          description = String(match.description).replace(/<[^>]*>?/gm, "").slice(0, 160);
        }
        canonical = `/services?category=${encodeURIComponent(categoryName)}`;
      }
    } catch (err) {}
  } else if (isOffline) {
    title = "Offline Pooja Services | Book Verified Pandit at Home | 1Pooja";
    description =
      "Discover and book verified Pandits and Purohits for offline pooja at home or temple. Authentic Vedic rituals tailored to your language and local traditions.";
    canonical = "/services?isOffline=true";
    keywords = OFFLINE_KEYWORDS;
  } else if (isOnline) {
    title = "Online Pooja Services | Book Live Digital E-Pooja | 1Pooja";
    description =
      "Experience authentic sacred rituals performed live via interactive digital video by experienced Purohits from anywhere with 1Pooja.";
    canonical = "/services?isOnline=true";
    keywords = ONLINE_KEYWORDS;
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

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
