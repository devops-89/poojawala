"use client";

import { getTempleByIdAPI } from "@/api/templeControllers";
import WebsiteWhyPoojawalaSection from "@/components/layouts/servicesLayout/WebsiteWhyPoojawalaSection";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { COLORS } from "@/utils/enums";
import { Box, Button, CircularProgress, Container, Paper, Typography } from "@mui/material";
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

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  useEffect(() => {
    // Reset window to top on temple details mount
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    const fetchTemple = async () => {
      const identifier = (params.slug || params.id) as string;
      if (!identifier) return;

      if (
        temple &&
        (temple.slug === identifier || String(temple.id) === String(identifier))
      ) {
        return;
      }

      setLoading(true);
      try {
        const res = await getTempleByIdAPI(identifier);
        if (res?.success) {
          const rawData = res.data?.data || res.data;
          setTemple(rawData);
          if (rawData?.id && typeof window !== "undefined") {
            localStorage.setItem("last_temple_id", String(rawData.id));
            sessionStorage.setItem("last_temple_id", String(rawData.id));
            if (rawData.slug) {
              const s = String(rawData.slug).toLowerCase();
              localStorage.setItem(`slug_to_id_${s}`, String(rawData.id));
              sessionStorage.setItem(`slug_to_id_${s}`, String(rawData.id));
              localStorage.setItem(`temple_slug_${s}`, String(rawData.id));
              sessionStorage.setItem(`temple_slug_${s}`, String(rawData.id));
              const currentPath = window.location.pathname;
              const targetPath = `/temples/${rawData.slug}`;
              if (currentPath !== targetPath) {
                window.history.replaceState(null, "", targetPath);
              }
            }
          }
          // Keep viewport at top after content loads
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
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
  }, [params.id, params.slug, showSnackbar, temple]);

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
      router.push(
        `/services?templeId=${temple?.id}&temple=${encodeURIComponent(
          temple?.name || ""
        )}`
      );
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
