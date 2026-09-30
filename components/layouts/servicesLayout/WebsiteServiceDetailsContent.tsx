"use client";

import { getServiceByIdAPI } from "@/api/serviceControllers";
import WebsiteServiceAboutSection from "./WebsiteServiceAboutSection";
import WebsiteServiceDetailsHero from "./WebsiteServiceDetailsHero";
import WebsiteServicePlansSection from "./WebsiteServicePlansSection";
import WebsiteWhyPoojawalaSection from "./WebsiteWhyPoojawalaSection";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { Box, Button, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80";

export default function WebsiteServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        if (!params.id) return;
        const res = await getServiceByIdAPI(params.id as string);
        if (res.success) {
          let rawData = res.data;
          if (rawData && rawData.data) {
            rawData = rawData.data;
          }
          if (rawData && rawData.data) {
            rawData = rawData.data;
          }
          setService(rawData);
        } else {
          showSnackbar(res.message || "Failed to load service details", "error");
        }
      } catch (error) {
        console.error("Failed to fetch service details:", error);
        showSnackbar("Error fetching service details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [params.id, showSnackbar]);

  const handleBookClick = () => {
    const el = document.getElementById("puja-plans-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/sign-in");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: "#FF6200" }} />
      </Box>
    );
  }

  if (!service) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
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
            Service details not found.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/services")}
            sx={{
              background: "#FF6200",
              color: "white",
              borderRadius: "30px",
              textTransform: "none",
            }}
          >
            Back to Services
          </Button>
        </Paper>
      </Container>
    );
  }

  let minP: number | null =
    service?.minPrice != null ? Number(service.minPrice) : null;
  let maxP: number | null =
    service?.maxPrice != null ? Number(service.maxPrice) : null;

  if (service?.plans && typeof service.plans === "object") {
    const prices: number[] = [];
    const planList = Array.isArray(service.plans)
      ? service.plans
      : Object.values(service.plans);
    planList.forEach((p: any) => {
      if (p && p.price != null && !isNaN(Number(p.price))) {
        prices.push(Number(p.price));
      }
    });
    if (prices.length > 0) {
      const calcMin = Math.min(...prices);
      const calcMax = Math.max(...prices);
      if (minP == null) minP = calcMin;
      if (maxP == null) maxP = calcMax;
    }
  }

  if (minP == null) {
    minP = service?.priceWithoutSamagri ?? service?.price ?? service?.basePrice ?? null;
  }
  if (maxP == null) {
    maxP = service?.priceWithSamagri ?? null;
  }

  const priceDisplay =
    minP != null && maxP != null && maxP > minP
      ? `₹${Number(minP).toLocaleString("en-IN")} – ₹${Number(maxP).toLocaleString("en-IN")}`
      : minP != null
        ? `₹${Number(minP).toLocaleString("en-IN")}`
        : "Price on request";

  const parseJsonList = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const citiesList = parseJsonList(service.cities);
  const languagesList = parseJsonList(service.languages);

  const formattedCities =
    citiesList.length > 0
      ? citiesList
          .map((c: any) => (typeof c === "string" ? c : c?.name || ""))
          .filter(Boolean)
          .join(", ")
      : "";

  const formattedLanguages =
    languagesList.length > 0
      ? languagesList
          .map((l: any) => (typeof l === "string" ? l : l?.name || ""))
          .filter(Boolean)
          .join(" · ")
      : "";

  const durationText = service.durationMinutes
    ? service.durationMinutes >= 60
      ? `${Math.floor(service.durationMinutes / 60)} HOURS`
      : `${service.durationMinutes} MINS`
    : service.duration
      ? String(service.duration).toUpperCase()
      : "2 HOURS";

  const heroImage =
    service.bannerDownloadurl ||
    service.bannerUrl ||
    service.iconDownloadurl ||
    service.iconUrl ||
    DEFAULT_BANNER;

  return (
    <Box sx={{ bgcolor: "#FFFDF9", minHeight: "100vh", pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        {/* Dedicated Website Service Hero Section */}
        <WebsiteServiceDetailsHero
          service={service}
          durationText={durationText}
          formattedCities={formattedCities}
          formattedLanguages={formattedLanguages}
          priceDisplay={priceDisplay}
          heroImage={heroImage}
          onBookClick={handleBookClick}
        />

        {/* Dynamic About & Benefits Section */}
        <WebsiteServiceAboutSection service={service} />

        {/* Dynamic Puja Packages Plans Section */}
        <Box id="puja-plans-section">
          <WebsiteServicePlansSection service={service} />
        </Box>

        {/* Why Poojawala Trust Section */}
        <WebsiteWhyPoojawalaSection />
      </Container>
    </Box>
  );
}
