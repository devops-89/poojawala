"use client";
import { COLORS } from "@/utils/enums";
import { formatServicePriceRange } from "@/utils/helpers";

import { getServiceByIdAPI } from "@/api/serviceControllers";
import WebsiteServiceAboutSection from "./WebsiteServiceAboutSection";
import WebsiteServiceDetailsHero from "./WebsiteServiceDetailsHero";
import WebsiteServicePlansSection from "./WebsiteServicePlansSection";
import WebsiteWhyPoojawalaSection from "./WebsiteWhyPoojawalaSection";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useLoaderStore } from "@/stores/loaderStore";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

export default function WebsiteServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { showLoader, hideLoader } = useLoaderStore();

  const identifier = (params.slug || params.id) as string;

  useEffect(() => {
    // Scroll window immediately to top when navigating to service details
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (!identifier) return;

    const fetchService = async () => {
      setLoading(true);
      setErrorMessage(null);
      showLoader("Loading service details...");
      try {
        const res = await getServiceByIdAPI(identifier);
        let rawData = res?.data;

        while (rawData?.data && !rawData?.id) {
          rawData = rawData.data;
        }

        if (rawData?.id) {
          setService(rawData);
          setErrorMessage(null);
          if (typeof document !== "undefined") {
            const seoTitle =
              (rawData.metaTitle && rawData.metaTitle.trim()) ||
              (rawData.name ? `${rawData.name} | 1Pooja` : "Service Details | 1Pooja");
            document.title = seoTitle;

            const seoDesc =
              (rawData.metaDescription && rawData.metaDescription.trim()) ||
              (rawData.description || rawData.shortDescription
                ? String(rawData.shortDescription || rawData.description)
                    .replace(/<[^>]*>?/gm, "")
                    .slice(0, 160)
                : "");
            if (seoDesc) {
              let metaDescTag = document.querySelector('meta[name="description"]');
              if (!metaDescTag) {
                metaDescTag = document.createElement("meta");
                metaDescTag.setAttribute("name", "description");
                document.head.appendChild(metaDescTag);
              }
              metaDescTag.setAttribute("content", seoDesc);
            }
          }
          if (typeof window !== "undefined") {
            if (rawData?.slug) {
              const s = String(rawData.slug).toLowerCase();
              localStorage.setItem(`slug_to_id_${s}`, String(rawData.id));
              sessionStorage.setItem(`slug_to_id_${s}`, String(rawData.id));
              localStorage.setItem(`service_slug_${s}`, String(rawData.id));
              sessionStorage.setItem(`service_slug_${s}`, String(rawData.id));
            }
          }

          // If accessed via numeric ID in URL, replace browser URL with clean slug
          if (rawData?.slug && /^\d+$/.test(String(identifier).trim())) {
            router.replace(`/services/${rawData.slug}`);
          }

          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        } else {
          setService(null);
          const msg = res?.message || "Service details not found";
          setErrorMessage(msg);
          showSnackbar(msg, "error");
        }
      } catch (error: any) {
        console.error("Failed to fetch service details:", error);
        setService(null);
        const msg = error?.response?.data?.message || "Error fetching service details";
        setErrorMessage(msg);
        showSnackbar(msg, "error");
      } finally {
        setLoading(false);
        hideLoader();
      }
    };

    fetchService();

    return () => {
      hideLoader();
    };
  }, [identifier, showLoader, hideLoader]);

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
      router.push(`/sign-up?redirect=${encodeURIComponent(targetUrl)}&from=booking`);
    } else {
      router.push("/sign-up?from=booking");
    }
  };

  // While loading, GlobalLoader handles the overlay
  if (loading || (!service && !errorMessage)) {
    return <Box sx={{ minHeight: "75vh", bgcolor: "#FFFDF9" }} />;
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
