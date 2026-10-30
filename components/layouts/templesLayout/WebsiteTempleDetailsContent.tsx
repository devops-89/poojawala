"use client";

import { getTempleByIdAPI, registerTempleSlugMapping } from "@/api/templeControllers";
import WebsiteWhyPoojawalaSection from "@/components/layouts/servicesLayout/WebsiteWhyPoojawalaSection";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { COLORS } from "@/utils/enums";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import WebsiteTempleAboutSection from "./WebsiteTempleAboutSection";
import WebsiteTempleDetailsHero from "./WebsiteTempleDetailsHero";
import WebsiteTempleServicesSection from "./WebsiteTempleServicesSection";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

export default function WebsiteTempleDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [temple, setTemple] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { showLoader, hideLoader } = useLoaderStore();

  const identifier = (params.slug || params.id) as string;

  useEffect(() => {
    // Reset window to top on temple details mount
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (!identifier) return;

    const fetchTemple = async () => {
      setLoading(true);
      setErrorMessage(null);
      showLoader("Loading temple details...");
      try {
        const res = await getTempleByIdAPI(identifier);
        let rawData = res?.data;
        while (rawData?.data && !rawData?.id) {
          rawData = rawData.data;
        }

        if (rawData?.id) {
          setTemple(rawData);
          setErrorMessage(null);
          if (rawData.slug) {
            registerTempleSlugMapping(rawData.slug, rawData.id);
            if (/^\d+$/.test(String(identifier))) {
              router.replace(`/temples/${rawData.slug}`);
            }
          }
          // Keep viewport at top after content loads
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        } else {
          setTemple(null);
          const msg = res?.message || "Failed to load temple details";
          setErrorMessage(msg);
          showSnackbar(msg, "error");
        }
      } catch (error: any) {
        console.error("Failed to fetch temple details:", error);
        setTemple(null);
        const msg = error?.response?.data?.message || "Error fetching temple details";
        setErrorMessage(msg);
        showSnackbar(msg, "error");
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchTemple();

    return () => {
      hideLoader();
    };
  }, [identifier, showLoader, hideLoader]);

  useEffect(() => {
    if (!loading && temple) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [loading, temple]);

  const handleBookClick = () => {
    const el = document.getElementById("temple-services-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/services?templeId=${temple?.id}`);
    }
  };

  // While loading, GlobalLoader handles overlay
  if (loading || (!temple && !errorMessage)) {
    return <Box sx={{ minHeight: "75vh", bgcolor: "#FFFDF9" }} />;
  }

  if (!temple) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            bgcolor: "#FAF4EE",
            borderRadius: "16px",
            border: "1px dashed #FF6200",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <Typography variant="h6" sx={{ color: "#2C1810", mb: 2 }}>
            Temple details not found.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/temples")}
            sx={{
              background: COLORS.PRIMARY,
              color: "white",
              borderRadius: "30px",
              textTransform: "none",
            }}
          >
            Back to Temples
          </Button>
        </Paper>
      </Container>
    );
  }

  const heroImage =
    temple.downloadUrl ||
    temple.imageUrl ||
    temple.deityPhotoDownloadUrl ||
    temple.deityPhotoUrl ||
    temple.image ||
    DEFAULT_BANNER;

  return (
    <Box sx={{ bgcolor: "#FFFDF9", minHeight: "100vh", pb: 8, pt: 2 }}>
      <Container maxWidth="lg">
        {/* Dedicated Website Temple Hero Section */}
        <WebsiteTempleDetailsHero
          temple={temple}
          heroImage={heroImage}
          onBookClick={handleBookClick}
        />

        {/* Dynamic About & Significance Section */}
        <WebsiteTempleAboutSection temple={temple} />

        {/* Dynamic Associated Poojas / Services Section */}
        <WebsiteTempleServicesSection temple={temple} />

        {/* Why Poojawala Trust Section */}
        <WebsiteWhyPoojawalaSection />
      </Container>
    </Box>
  );
}
