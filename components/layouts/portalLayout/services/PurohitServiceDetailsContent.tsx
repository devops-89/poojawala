"use client";
import { COLORS } from "@/utils/enums";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  getPurohitServicesAPI,
  getServiceByIdAPI,
} from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { getPurohitPayoutRange } from "@/utils/payoutHelper";

import ServiceDetailsBreadcrumbs from "@/components/layouts/customerLayout/services/serviceDetails/ServiceDetailsBreadcrumbs";
import ServiceDetailsFaqSection from "@/components/layouts/customerLayout/services/serviceDetails/ServiceDetailsFaqSection";
import ServiceDetailsHeroSection from "@/components/layouts/customerLayout/services/serviceDetails/ServiceDetailsHeroSection";
import ServiceDetailsInfoGrid from "@/components/layouts/customerLayout/services/serviceDetails/ServiceDetailsInfoGrid";

import PurohitServiceDetailsAddForm from "./PurohitServiceDetailsAddForm";
import PurohitServicePlansSection from "./PurohitServicePlansSection";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

export default function PurohitServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchServiceData = async () => {
    if (!params.id) return;
    setLoading(true);
    try {
      const [res, myRes] = await Promise.all([
        getServiceByIdAPI(params.id as string),
        getPurohitServicesAPI(1, 100),
      ]);

      if (res.success) {
        let rawData = res.data;
        while (
          rawData &&
          rawData.data &&
          typeof rawData.data === "object" &&
          !rawData.id
        ) {
          rawData = rawData.data;
        }
        setService(rawData);

        // Check if already added
        const myServiceIds =
          myRes?.data?.data?.map((ps: any) => ps.serviceId) ||
          myRes?.data?.map((ps: any) => ps.serviceId) ||
          [];
        setIsAlreadyAdded(myServiceIds.includes(Number(params.id)));
      } else {
        showSnackbar(res.message || "Failed to load service details", "error");
      }
    } catch (error: any) {
      console.error("Failed to fetch service details:", error);
      showSnackbar("Error fetching service details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceData();
  }, [params.id, showSnackbar]);

  const handleScrollToAddForm = () => {
    const el = document.getElementById("purohit-add-form-section");
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
          onClick={() => router.push("/purohit/services")}
          sx={{
            background: COLORS.PRIMARY,
            color: "white",
            borderRadius: "30px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Back to Available Services
        </Button>
      </Paper>
    );
  }

  const priceDisplay = getPurohitPayoutRange(service);

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

  const formattedCities = citiesList
    .map((c: any) => (typeof c === "string" ? c : c?.name || ""))
    .filter(Boolean)
    .join(", ");

  const formattedLanguages =
    languagesList
      .map((l: any) => (typeof l === "string" ? l : l?.name || ""))
      .filter(Boolean)
      .join(" · ") || "";

  const durationText = service.durationMinutes
    ? service.durationMinutes >= 60
      ? `${Math.floor(service.durationMinutes / 60)} hour${
          service.durationMinutes >= 120 ? "s" : ""
        }`
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

  const purohitFaqItems = [
    {
      id: "panel1",
      question: "How do I set my prices for online and offline ceremonies?",
      answer:
        "You can specify custom online and offline prices within the recommended minimum and maximum price range for this service. Offline prices should cover your travel and ritual preparation costs.",
    },
    {
      id: "panel2",
      question: "Which customers can see and book this service?",
      answer:
        "Customers located within your registered default service area city will be able to see your profile and send booking requests for this ceremony.",
    },
    {
      id: "panel4",
      question: "Can I update or pause this service later?",
      answer:
        "Yes! You can manage, update prices, or toggle active/inactive status for any service anytime from your 'My Services' dashboard.",
    },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* 1. Top Breadcrumbs */}
      <ServiceDetailsBreadcrumbs
        serviceName={service.name || service.title}
        servicesHref="/purohit/services"
        servicesLabel="Available Services"
      />

      {/* 2. Hero Section (Reused) */}
      <ServiceDetailsHeroSection
        service={service}
        durationText={durationText}
        formattedCities={formattedCities}
        formattedLanguages={formattedLanguages}
        priceDisplay={priceDisplay}
        priceLabel="PUROHIT PAYOUT"
        heroImage={heroImage}
        onOpenBooking={handleScrollToAddForm}
        ctaText={
          isAlreadyAdded ? "Already Added to Profile" : "Add to My Services"
        }
        isAlreadyAdded={isAlreadyAdded}
      />

      {/* 3. Service Plans & Purohit Carry Items Section */}
      <PurohitServicePlansSection service={service} />

      {/* 4. Service Details & Service Areas Section (Reused, Venue displays Customer Location) */}
      <ServiceDetailsInfoGrid
        service={service}
        durationText={durationText}
        priceDisplay={priceDisplay}
        languagesList={languagesList}
        displayCities={displayCities}
        getFormattedFestivalDate={getFormattedFestivalDate}
      />

      <ServiceDetailsFaqSection
        serviceName={service.name || service.title}
        faqItems={purohitFaqItems}
      />

      <PurohitServiceDetailsAddForm
        service={service}
        isAlreadyAdded={isAlreadyAdded}
        onAddedSuccess={() => {
          setIsAlreadyAdded(true);
          fetchServiceData();
        }}
      />
    </Box>
  );
}
