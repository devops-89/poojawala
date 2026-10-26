"use client";
import { COLORS } from "@/utils/enums";
import { formatServicePriceRange } from "@/utils/helpers";

import { getServiceByIdAPI } from "@/api/serviceControllers";
import WebsiteServiceAboutSection from "./WebsiteServiceAboutSection";
import WebsiteServiceDetailsHero from "./WebsiteServiceDetailsHero";
import WebsiteServicePlansSection from "./WebsiteServicePlansSection";
import WebsiteWhyPoojawalaSection from "./WebsiteWhyPoojawalaSection";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { Box, Button, CircularProgress, Container, Paper, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

export default function WebsiteServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchedIdentifierRef = useRef<string | null>(null);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const identifier = (params.slug || params.id) as string;

  useEffect(() => {
    // Scroll window immediately to top when navigating to service details
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (!identifier) return;

    // Prevent duplicate API calls for the same service identifier
    if (fetchedIdentifierRef.current === identifier) return;
    fetchedIdentifierRef.current = identifier;

    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await getServiceByIdAPI(identifier);
        if (res?.success || res?.data) {
          let rawData = res.data;
          if (rawData && rawData.data) {
            rawData = rawData.data;
          }
          if (rawData && rawData.data) {
            rawData = rawData.data;
          }
          setService(rawData);
          if (rawData?.id && typeof window !== "undefined") {
            if (rawData?.slug) {
              const s = String(rawData.slug).toLowerCase();
              localStorage.setItem(`slug_to_id_${s}`, String(rawData.id));
              sessionStorage.setItem(`slug_to_id_${s}`, String(rawData.id));
            }
          }
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        } else {
          showSnackbar(res?.message || "Failed to load service details", "error");
        }
      } catch (error) {
        console.error("Failed to fetch service details:", error);
        showSnackbar("Error fetching service details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [identifier]);

  useEffect(() => {
    if (!loading && service) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [loading, service]);

  const handleBookClick = () => {
    const el = document.getElementById("puja-plans-section");
    const hasPlans =
      service?.plans &&
      ((Array.isArray(service.plans) && service.plans.length > 0) ||
        service.plans.basic ||
        service.plans.standard);
    if (el && hasPlans) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (service?.id) {
      const targetUrl = `/customer/services/${service.id}`;
      if (typeof window !== "undefined") {
        sessionStorage.setItem("post_login_redirect", targetUrl);
        const token =
          sessionStorage.getItem("token") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("customercsrftoken");
        const user = sessionStorage.getItem("user");
        if (token || user) {
          router.push(targetUrl);
          return;
        }
      }
      router.push(`/sign-in?redirect=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push("/sign-in");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
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
              background: COLORS.PRIMARY,
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

  const priceDisplay = formatServicePriceRange(service);

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

  const durationText = (() => {
    const mins = Number(service?.durationMinutes);
    if (!isNaN(mins) && mins > 0) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      if (hours > 0 && remainingMins > 0) {
        return `${hours} hr ${remainingMins} mins`;
      }
      if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
      }
      return `${remainingMins} mins`;
    }
    if (service?.duration) {
      return String(service.duration);
    }
    return "";
  })();

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
