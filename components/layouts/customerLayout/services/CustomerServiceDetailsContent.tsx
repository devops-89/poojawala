"use client";
import { COLORS } from "@/utils/enums";
import { formatServicePriceRange } from "@/utils/helpers";
import { getServiceByIdAPI, registerServiceSlugMapping } from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ServiceDetailsBookingForm from "./serviceDetails/ServiceDetailsBookingForm";
import ServiceDetailsBreadcrumbs from "./serviceDetails/ServiceDetailsBreadcrumbs";
import ServiceDetailsFaqSection from "./serviceDetails/ServiceDetailsFaqSection";
import ServiceDetailsHeroSection from "./serviceDetails/ServiceDetailsHeroSection";
import ServiceDetailsIncludedSection from "./serviceDetails/ServiceDetailsIncludedSection";
import ServiceDetailsPujaSamagri from "./serviceDetails/ServiceDetailsPujaSamagri";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

export default function CustomerServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const loadedIdRef = useRef<string | number | null>(null);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const identifier = params.id as string;

  useEffect(() => {
    if (!identifier) return;
    if (loadedIdRef.current === identifier) return;
    loadedIdRef.current = identifier;

    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await getServiceByIdAPI(identifier);
        if (res?.success || res?.data) {
          let rawData = res.data;
          while (rawData?.data && !rawData?.id) {
            rawData = rawData.data;
          }
          if (rawData?.id) {
            setService(rawData);
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
            if (rawData?.slug) {
              registerServiceSlugMapping(rawData.slug, rawData.id);
              if (typeof window !== "undefined") {
                const currentPath = window.location.pathname;
                const targetPath = `/customer/services/${rawData.slug}`;
                if (currentPath !== targetPath) {
                  window.history.replaceState(null, "", targetPath);
                }
              }
            }
          } else {
            showSnackbar(res?.message || "Service not found", "error");
          }
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

  const handleScrollToBookingForm = () => {
    const el = document.getElementById("booking-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          bgcolor: "#FAF4EE",
          borderRadius: "16px",
          border: "1px dashed #C84B16",
          maxWidth: 600,
          mx: "auto",
          my: 4,
        }}
      >
        <Typography variant="h6" sx={{ color: "#2C1810", mb: 2 }}>
          Service details not found.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/customer/services")}
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
  const benefitsList = parseJsonList(service.benefits);
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
      ? service.durationMinutes % 60 === 0
        ? `${service.durationMinutes / 60} hour${service.durationMinutes >= 120 ? "s" : ""}`
        : `${Math.floor(service.durationMinutes / 60)} hr ${service.durationMinutes % 60} mins`
      : `${service.durationMinutes} mins`
    : service.duration || "2 hours";

  const heroImage =
    service.bannerDownloadurl ||
    service.bannerUrl ||
    service.iconDownloadurl ||
    service.iconUrl ||
    DEFAULT_BANNER;


  return (
    <Box sx={{ pb: 6 }}>
      {/* Top Breadcrumbs */}
      <ServiceDetailsBreadcrumbs
        serviceName={service.name || service.title}
        service={service}
      />

      {/* Hero Section */}
      <ServiceDetailsHeroSection
        service={service}
        durationText={durationText}
        formattedCities={formattedCities}
        formattedLanguages={formattedLanguages}
        priceDisplay={priceDisplay}
        heroImage={heroImage}
        onOpenBooking={handleScrollToBookingForm}
      />

      {/* What's Included Section */}
      <ServiceDetailsIncludedSection benefitsList={benefitsList} />

      {/* Inline Booking Form Section */}
      <ServiceDetailsBookingForm
        serviceId={Number(service.id)}
        service={service}
      />

      {/* Puja Samagri Add-on Section */}
      <ServiceDetailsPujaSamagri serviceName={service.name || service.title} />

      {/* FAQ / Before You Book Section (Moved to bottom) */}
      <ServiceDetailsFaqSection serviceName={service.name || service.title} />
    </Box>
  );
}
