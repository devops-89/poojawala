"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { useRouter } from "next/navigation";
import { getTempleByIdAPI } from "@/api/templeControllers";
import { getServicesAPI } from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
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
      try {
        setLoading(true);
        const res = await getTempleByIdAPI(templeId);
        if (res?.success) {
          const rawData = res.data?.data || res.data;
          setTemple(rawData);
        } else {
          showSnackbar(res?.message || "Failed to load temple details", "error");
        }
      } catch (error) {
        console.error("Failed to fetch temple details:", error);
        showSnackbar("Error fetching temple details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemple();
  }, [templeId, showSnackbar]);

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
      <Box sx={{ display: "flex", justifyContent: "center", py: 14 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
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
          bgcolor: "#FAF4EE",
          borderRadius: "20px",
          border: "1.5px dashed #FF6200",
          maxWidth: 600,
          mx: "auto",
          my: 6,
        }}
      >
        <TempleHinduIcon sx={{ fontSize: 56, color: COLORS.PRIMARY, mb: 1.5 }} />
        <Typography
          variant="h6"
          sx={{ fontFamily: FONTS.PRIMARY, color: "#2C1810", mb: 1, fontWeight: 700 }}
        >
          Temple details not found
        </Typography>
        <Typography sx={{ fontFamily: FONTS.PRIMARY, color: "#64748b", mb: 3, fontSize: "14px" }}>
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
            fontFamily: FONTS.PRIMARY,
            "&:hover": { background: "#e65800" },
          }}
        >
          Back to Temples
        </Button>
      </Paper>
    );
  }

  const heroImage =
    temple?.downloadUrl ||
    temple?.imageUrl ||
    temple?.bannerDownloadUrl ||
    temple?.bannerUrl ||
    DEFAULT_BANNER;

  return (
    <Box sx={{ pb: 8 }}>
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
