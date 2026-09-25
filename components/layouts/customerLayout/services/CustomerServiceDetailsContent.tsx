"use client";
import { getServiceByIdAPI } from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ServiceDetailsBookingForm from "./serviceDetails/ServiceDetailsBookingForm";
import ServiceDetailsBreadcrumbs from "./serviceDetails/ServiceDetailsBreadcrumbs";
import ServiceDetailsCtaBanner from "./serviceDetails/ServiceDetailsCtaBanner";
import ServiceDetailsFaqSection from "./serviceDetails/ServiceDetailsFaqSection";
import ServiceDetailsHeroSection from "./serviceDetails/ServiceDetailsHeroSection";
import ServiceDetailsIncludedSection from "./serviceDetails/ServiceDetailsIncludedSection";
import ServiceDetailsInfoGrid from "./serviceDetails/ServiceDetailsInfoGrid";
import ServiceDetailsPujaSamagri from "./serviceDetails/ServiceDetailsPujaSamagri";

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80";

export default function CustomerServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

  const handleScrollToBookingForm = () => {
    const el = document.getElementById("booking-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: "#C84B16" }} />
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
            background: "#C84B16",
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

  const priceDisplay =
    service?.minPrice && service?.maxPrice
      ? `₹${Number(service.minPrice).toLocaleString("en-IN")} - ₹${Number(service.maxPrice).toLocaleString("en-IN")}`
      : service?.minPrice
        ? `₹${Number(service.minPrice).toLocaleString("en-IN")}`
        : service?.price || service?.basePrice
          ? `₹${Number(service.price || service.basePrice).toLocaleString("en-IN")}`
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
  const benefitsList = parseJsonList(service.benefits);
  const languagesList = parseJsonList(service.languages);

  const formattedCities =
    citiesList.length > 0
      ? citiesList
          .map((c: any) => (typeof c === "string" ? c : c?.name || ""))
          .filter(Boolean)
          .join(", ")
      : "All Cities (Pan-India)";

  const formattedLanguages =
    languagesList.length > 0
      ? languagesList
          .map((l: any) => (typeof l === "string" ? l : l?.name || ""))
          .filter(Boolean)
          .join(" · ")
      : "";

  const durationText = service.durationMinutes
    ? service.durationMinutes >= 60
      ? `${Math.floor(service.durationMinutes / 60)} hour${service.durationMinutes >= 120 ? "s" : ""}`
      : `${service.durationMinutes} mins`
    : service.duration || "2 hours";

  const heroImage =
    service.bannerDownloadurl ||
    service.bannerUrl ||
    service.iconDownloadurl ||
    service.iconUrl ||
    DEFAULT_BANNER;

  const getFormattedFestivalDate = () => {
    if (!service?.isUpcomingFestival) return "";
    let startStr = "";
    let endStr = "";

    if (service?.festivalStartDate) {
      try {
        const dStart = new Date(service.festivalStartDate);
        startStr = dStart.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch (e) {
        startStr = "";
      }
    }

    if (service?.festivalEndDate) {
      try {
        const dEnd = new Date(service.festivalEndDate);
        endStr = dEnd.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch (e) {
        endStr = "";
      }
    }

    if (startStr && endStr) {
      if (startStr === endStr) {
        return startStr;
      }
      return `${startStr} – ${endStr}`;
    } else if (startStr) {
      return startStr;
    } else if (endStr) {
      return endStr;
    }
    return "";
  };

  const displayCities = citiesList;

  return (
    <Box sx={{ pb: 6 }}>
      {/* Top Breadcrumbs */}
      <ServiceDetailsBreadcrumbs serviceName={service.name || service.title} />

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

      {/* Service Details & Service Areas Section */}
      <ServiceDetailsInfoGrid
        service={service}
        durationText={durationText}
        priceDisplay={priceDisplay}
        languagesList={languagesList}
        displayCities={displayCities}
        getFormattedFestivalDate={getFormattedFestivalDate}
      />

      {/* FAQ / Before You Book Section */}
      <ServiceDetailsFaqSection serviceName={service.name || service.title} />

      {/* Dark Reserve/CTA Banner Section */}
      <ServiceDetailsCtaBanner
        service={service}
        durationText={durationText}
        priceDisplay={priceDisplay}
        citiesCount={displayCities.length}
        onOpenBooking={handleScrollToBookingForm}
      />

      {/* Inline Booking Form Section */}
      <ServiceDetailsBookingForm serviceId={Number(params.id)} />

      {/* Puja Samagri Add-on Section */}
      <ServiceDetailsPujaSamagri serviceName={service.name || service.title} />
    </Box>
  );
}
