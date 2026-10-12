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
      setLoading(true);
      try {
        if (!params.id) return;
        const res = await getTempleByIdAPI(params.id as string);
        if (res?.success) {
          const rawData = res.data?.data || res.data;
          setTemple(rawData);
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
  }, [params.id, showSnackbar]);

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
