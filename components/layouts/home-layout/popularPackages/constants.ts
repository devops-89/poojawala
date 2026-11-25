import { isCustomerLoggedIn, normalizePoojaText, stripHtml } from "@/utils/helpers";

export interface PackageItem {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  unit: string;
  image: string;
  isOnline?: boolean;
  isOffline?: boolean;
}

export interface RawServiceItem {
  id?: string | number;
  slug?: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  iconDownloadurl?: string;
  iconUrl?: string;
  isActive?: boolean;
  isOnline?: boolean;
  isOffline?: boolean;
  [key: string]: unknown;
}

export const DEFAULT_PACKAGE_IMAGE = "/images/home/poojaPackages/satyanarayan.webp";

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    id: "annaprashan-puja",
    slug: "annaprashan-puja",
    title: "Annaprashan Pooja",
    description:
      "Celebrate your baby's first rice-feeding ceremony with authentic rituals. Book online Annaprashan Pooja with Vedic blessings.",
    duration: "2-3 hrs",
    price: "₹3,500 - ₹6,500",
    unit: "/ ceremony",
    image: DEFAULT_PACKAGE_IMAGE,
    isOnline: true,
    isOffline: true,
  },
  {
    id: "rudrabhishek-puja",
    slug: "online-rudrabhishek-puja",
    title: "Rudrabhishek Pooja",
    description:
      "Invoke Lord Shiva's supreme power for health, peace, and sin destruction. Book authentic Rudrabhishek Pooja featuring sacred rituals.",
    duration: "2-3 hrs",
    price: "₹4,800 - ₹33,800",
    unit: "/ ceremony",
    image: DEFAULT_PACKAGE_IMAGE,
    isOnline: true,
    isOffline: true,
  },
  {
    id: "bhoomi-puja",
    slug: "bhoomi-puja",
    title: "Bhoomi Pooja",
    description:
      "Invoke Mother Earth's divine blessings before construction or land development. Book authentic Bhoomi Pooja with Vedic rituals.",
    duration: "2-3 hrs",
    price: "₹5,100 - ₹11,000",
    unit: "/ ceremony",
    image: DEFAULT_PACKAGE_IMAGE,
    isOnline: false,
    isOffline: true,
  },
  {
    id: "durga-puja",
    slug: "durga-puja",
    title: "Durga Pooja & Chandi Havan",
    description:
      "Invoke Goddess Durga's fierce divine energy to defeat negativity and ward off evil. Book authentic Durga Pooja ceremony.",
    duration: "3-4 hrs",
    price: "₹4,800 - ₹12,500",
    unit: "/ ceremony",
    image: DEFAULT_PACKAGE_IMAGE,
    isOnline: true,
    isOffline: true,
  },
];

export const extractServiceItems = (response: any): RawServiceItem[] => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

export const formatDisplayPrice = (rawPrice: string): string => {
  if (!rawPrice) return "";
  return rawPrice.startsWith("₹") || rawPrice.startsWith("Price")
    ? rawPrice
    : `₹${rawPrice}`;
};

export const cachePackageLookup = (slugOrId: string | number, id: string | number) => {
  if (typeof window === "undefined" || !id) return;
  const key = `slug_to_id_${String(slugOrId).toLowerCase()}`;
  localStorage.setItem(key, String(id));
  sessionStorage.setItem(key, String(id));
};

export const getPackageTargetUrl = (pkg: PackageItem): string => {
  const targetSlug = pkg.slug || pkg.id;
  if (typeof window !== "undefined") {
    sessionStorage.setItem("home_restore_section", "popular-packages");
    if (pkg.id) {
      cachePackageLookup(targetSlug, pkg.id);
      localStorage.setItem("last_service_id", String(pkg.id));
      sessionStorage.setItem("last_service_id", String(pkg.id));
    }
  }
  return isCustomerLoggedIn()
    ? `/customer/services/${targetSlug}`
    : `/services/${targetSlug}`;
};

export const cleanPackageText = (value: string): string =>
  normalizePoojaText(stripHtml(value));
