"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Paper, Skeleton, Typography } from "@mui/material";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { useRouter } from "next/navigation";
import { getTempleByIdAPI, registerTempleSlugMapping } from "@/api/templeControllers";
import { getServicesAPI } from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import CustomerTempleHero from "./CustomerTempleHero";
import CustomerTempleAbout from "./CustomerTempleAbout";
import CustomerTempleServices from "./CustomerTempleServices";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

interface CustomerTempleDetailsContentProps {
  templeId: string | number;
}

export default function CustomerTempleDetailsContent({
  templeId,
}: CustomerTempleDetailsContentProps) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { showLoader, hideLoader } = useLoaderStore();

  const [temple, setTemple] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Scroll to top or handle anchor hash on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash !== "#temple-services-section") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  // Fetch temple details
  useEffect(() => {
    const fetchTemple = async () => {
      if (!templeId) return;
      if (
        temple &&
        (temple.slug === templeId || String(temple.id) === String(templeId))
      ) {
        return;
      }
      try {
        setLoading(true);
        showLoader("Loading temple details...");
        const res = await getTempleByIdAPI(templeId);
        if (res?.success || res?.data) {
          let rawData = res.data;
          while (rawData?.data && !rawData?.id) {
            rawData = rawData.data;
          }
          if (rawData?.id) {
            setTemple(rawData);
            if (rawData.slug) {
              registerTempleSlugMapping(rawData.slug, rawData.id);
            }
            if (typeof window !== "undefined" && rawData.slug) {
              const currentPath = window.location.pathname;
              const basePath = currentPath.startsWith("/customer/temple/")
                ? "/customer/temple"
                : "/customer/temples";
              const targetPath = `${basePath}/${rawData.slug}`;
              if (currentPath !== targetPath) {
                window.history.replaceState(null, "", targetPath);
              }
            }
          } else {
            showSnackbar(res?.message || "Temple not found", "error");
          }
        } else {
          showSnackbar(res?.message || "Failed to load temple details", "error");
        }
      } catch (error) {
        console.error("Failed to fetch temple details:", error);
        showSnackbar("Error fetching temple details", "error");
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchTemple();
  }, [templeId, showSnackbar, showLoader, hideLoader]);

  // Fetch associated services for this temple
  useEffect(() => {
    const fetchTempleServices = async () => {
      if (!temple?.id) return;
      try {
        setServicesLoading(true);

        if (Array.isArray(temple.services) && temple.services.length > 0) {
          setServices(temple.services.filter((s: any) => s && s.isActive !== false));
          setServicesLoading(false);
          return;
        }

        const res = await getServicesAPI(
          1,
          10,
          "",
          undefined,
          undefined,
          undefined,
          true,
          undefined,
          undefined,
          temple.id,
          undefined,
          true
        );

        let list: any[] = [];
        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.services)) list = res.services;

        setServices(list.filter((s: any) => s && s.isActive !== false));
      } catch (err) {
        console.error("Failed to load services for temple:", err);
      } finally {
        setServicesLoading(false);
      }
    };

    if (temple?.id) {
      fetchTempleServices();
    }
  }, [temple]);

  // Hash-based smooth scroll to temple poojas and ceremonies section
  useEffect(() => {
    if (!loading && typeof window !== "undefined" && window.location.hash === "#temple-services-section") {
      const timer = setTimeout(() => {
        const el = document.getElementById("temple-services-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, servicesLoading]);

  const handleBookClick = () => {
    const el = document.getElementById("temple-services-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/customer/services?templeId=${temple?.id}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 1.5, pb: { xs: 4, md: 5 } }}>
        {/* Breadcrumb Skeleton */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
          <Skeleton variant="text" width={220} height={24} />
          <Skeleton variant="rounded" width={120} height={32} sx={{ borderRadius: "20px" }} />
        </Box>

        {/* Hero Banner Skeleton */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            <Skeleton variant="rounded" width={180} height={28} sx={{ borderRadius: "20px", mb: 1.5 }} />
            <Skeleton variant="text" height={44} width="85%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={22} width="60%" sx={{ mb: 2 }} />
            <Skeleton variant="rounded" width={180} height={42} sx={{ borderRadius: "30px" }} />
          </Box>
          <Skeleton
            variant="rounded"
            sx={{
              width: { xs: "100%", md: 400 },
              height: { xs: 220, sm: 260, md: 280 },
              borderRadius: "18px",
            }}
          />
        </Box>

        {/* About Section Skeleton */}
        <Box sx={{ pt: 1 }}>
          <Skeleton variant="rounded" height={130} sx={{ borderRadius: "20px" }} />
        </Box>
      </Box>
    );
  }

  if (!temple) {
    return (
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          bgcolor: "#FAF7F4",
          borderRadius: "20px",
          border: "1.5px dashed #FFD4BC",
          maxWidth: 540,
          mx: "auto",
          my: 6,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: "#FFF0E6",
            border: "1px solid #FFD4BC",
            color: COLORS.PRIMARY,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <TempleHinduIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{ fontFamily: FONTS.OUTFIT, color: "#2C1810", mb: 1, fontWeight: 800, fontSize: "1.25rem" }}
        >
          Temple Details Not Found
        </Typography>
        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#7C6A60", mb: 3, fontSize: "14px", lineHeight: 1.6 }}>
          We could not find the details for this temple. It may have been removed or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/customer/temples")}
          sx={{
            background: COLORS.PRIMARY,
            color: "white",
            borderRadius: "30px",
            textTransform: "none",
            px: 3.5,
            py: 1,
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
            "&:hover": { background: COLORS.PRIMARY_DARK },
          }}
        >
          Back to Temples
        </Button>
      </Paper>
    );
  }

  const rawHeroImage =
    temple?.downloadUrl ||
    temple?.imageUrl ||
    temple?.deityPhotoDownloadUrl ||
    temple?.deityPhotoUrl ||
    temple?.bannerDownloadUrl ||
    temple?.bannerUrl ||
    "";
  const isLogo = !rawHeroImage || rawHeroImage.includes("1Poojalogo") || rawHeroImage.includes("logo");
  const heroImage = isLogo ? DEFAULT_BANNER : rawHeroImage;

  return (
    <Box sx={{ pb: { xs: 3.5, md: 4.5 } }}>
      {/* 1. Hero Section */}
      <CustomerTempleHero
        temple={temple}
        heroImage={heroImage}
        onBookClick={handleBookClick}
      />

      {/* 2. About Section */}
      <CustomerTempleAbout temple={temple} />

      {/* 3. Associated Poojas & Ceremonies Section */}
      <CustomerTempleServices
        temple={temple}
        services={services}
        servicesLoading={servicesLoading}
      />
    </Box>
  );
}
