"use client";

import { getAllServicesAPI } from "@/api/serviceControllers";
import { formatServicePriceRange, normalizePoojaText } from "@/utils/helpers";
import { useEffect, useState } from "react";
import {
  cachePackageLookup,
  cleanPackageText,
  DEFAULT_PACKAGE_IMAGE,
  DEFAULT_PACKAGES,
  extractServiceItems,
  PackageItem,
  RawServiceItem,
} from "./constants";

const mapServiceToPackage = (item: RawServiceItem): PackageItem => {
  if (item.id && item.slug) {
    cachePackageLookup(item.slug, item.id);
  }

  return {
    id: item.id || "",
    slug: item.slug || "",
    title: normalizePoojaText(item.name || ""),
    description: cleanPackageText(
      item.description ||
        item.shortDescription ||
        "Traditional Vedic pooja performed by an experienced Purohit.",
    ),
    duration: "",
    price: formatServicePriceRange(item),
    unit: "/ ceremony",
    image: item.iconDownloadurl || item.iconUrl || DEFAULT_PACKAGE_IMAGE,
    isOnline: item.isOnline,
    isOffline: item.isOffline,
  };
};

export const usePopularPackages = () => {
  const [packages, setPackages] = useState<PackageItem[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        const response = await getAllServicesAPI(
          1,
          4,
          "",
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          false,
          undefined,
          true,
        );

        const activeOnly = extractServiceItems(response).filter(
          (item) => item.isActive !== false,
        );

        if (!isMounted) return;

        if (activeOnly.length > 0) {
          setPackages(activeOnly.slice(0, 4).map(mapServiceToPackage));
        } else {
          setPackages([]);
        }
      } catch (error) {
        console.error("Failed to fetch popular packages:", error);
        if (isMounted) {
          setPackages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return { packages, loading };
};
