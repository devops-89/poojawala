"use client";

import React, { useEffect, useState } from "react";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import {
  getPurohitServicesAPI,
  getServiceByIdAPI,
  registerServiceSlugMapping,
  addPurohitServiceAPI,
} from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { getPurohitPayoutRange } from "@/utils/payoutHelper";
import { extractServiceLanguages } from "@/utils/serviceDetailsUtils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SpaIcon from "@mui/icons-material/Spa";
import WifiIcon from "@mui/icons-material/Wifi";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from "@mui/icons-material/Help";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import PurohitServicePlansSection from "./PurohitServicePlansSection";

const DEFAULT_BANNER = "/images/home/poojaPackages/satyanarayan.webp";

export default function PurohitServiceDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [faqExpanded, setFaqExpanded] = useState<string | false>("panel1");

  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const userProfile = useUserStore((state) => state.profile);
  const { fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchServiceData = async () => {
    const identifier = (params.slug || params.id) as string;
    if (!identifier) return;
    setLoading(true);
    try {
      const [res, myRes] = await Promise.all([
        getServiceByIdAPI(identifier),
        getPurohitServicesAPI(1, 100),
      ]);

      let rawData = res?.data;
      while (
        rawData &&
        rawData.data &&
        typeof rawData.data === "object" &&
        !rawData.id
      ) {
        rawData = rawData.data;
      }

      if (rawData?.id) {
        setService(rawData);

        // Check if already added to purohit's active services
        const myServiceIds =
          myRes?.data?.data?.map((ps: any) => ps.serviceId) ||
          myRes?.data?.map((ps: any) => ps.serviceId) ||
          [];
        setIsAlreadyAdded(myServiceIds.includes(Number(rawData.id)));

        if (rawData.slug) {
          registerServiceSlugMapping(rawData.slug, rawData.id);
          if (/^\d+$/.test(String(identifier)) && typeof window !== "undefined") {
            const basePath = window.location.pathname.startsWith("/partner/my-services")
              ? "/partner/my-services"
              : "/partner/services";
            window.history.replaceState(null, "", `${basePath}/${rawData.slug}`);
          }
        }
      } else {
        showSnackbar(res?.message || "Failed to load service details", "error");
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
  }, [params.id, params.slug]);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(isAlreadyAdded ? "/partner/my-services" : "/partner/services");
    }
  };

  const userObj = userProfile?.data || userProfile;
  const p = userObj?.profile || userObj;
  const isOnlineAvailable = Boolean(p?.isOnlineAvailable ?? userObj?.isOnlineAvailable);
  const isOfflineAvailable = Boolean(p?.isOfflineAvailable ?? userObj?.isOfflineAvailable);

  const isServiceOnline = Boolean(service?.isOnline);
  const isServiceOffline = Boolean(service?.isOffline);

  let isModeRestricted = false;
  let modeRestrictionMessage = "";

  if (!isOnlineAvailable && !isOfflineAvailable) {
    isModeRestricted = true;
    modeRestrictionMessage =
      "Both Online and Offline service modes are disabled in your profile. Please enable at least one mode in Profile Settings to add ceremonies.";
  } else if (isServiceOnline && !isServiceOffline && !isOnlineAvailable) {
    isModeRestricted = true;
    modeRestrictionMessage =
      "This ceremony is Online Only, but Online Pooja is disabled in your profile.";
  } else if (isServiceOffline && !isServiceOnline && !isOfflineAvailable) {
    isModeRestricted = true;
    modeRestrictionMessage =
      "This ceremony is In-Person / Offline Only, but Offline Visit is disabled in your profile.";
  }

  const handleAddService = async () => {
    if (isModeRestricted) {
      showSnackbar(modeRestrictionMessage, "warning");
      return;
    }
    try {
      setSubmitting(true);
      const payload = [
        {
          serviceId: service.id,
        },
      ];

      const res = await addPurohitServiceAPI(payload);
      if (res.success) {
        showSnackbar("Service added to your profile successfully!", "success");
        setIsAlreadyAdded(true);
        fetchServiceData();
      } else {
        showSnackbar(res.message || "Failed to add service", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error adding service",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "55vh",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748B",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Loading service details...
        </Typography>
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
          bgcolor: "#FFFFFF",
          borderRadius: "18px",
          border: "1.5px dashed #CBD5E1",
          maxWidth: 550,
          mx: "auto",
          my: 6,
        }}
      >
        <SpaIcon sx={{ fontSize: 48, color: "#94A3B8", mb: 1.5 }} />
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1E293B",
            fontSize: "20px",
            mb: 1,
          }}
        >
          Service Not Found
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748B",
            fontSize: "14px",
            mb: 3,
          }}
        >
          The service details could not be loaded or the ritual does not exist.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/partner/services")}
          sx={{
            background: `${COLORS.PRIMARY} !important`,
            color: "#FFFFFF !important",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            px: 3,
            py: 1,
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
  const languagesList = extractServiceLanguages(service.languages);

  const formattedCities = citiesList
    .map((c: any) => (typeof c === "string" ? c : c?.name || ""))
    .filter(Boolean)
    .join(", ");

  const formattedLanguages =
    languagesList.length > 0 ? languagesList.join(", ") : "Hindi, Sanskrit";

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

  const partnerFaqItems = [
    {
      id: "panel1",
      question: "How does Purohit Payout work for this ceremony?",
      answer:
        "The estimated payout shown is your net take-home earnings after the platform commission. Basic Plan payout applies when the client arranges the essential samagri, while Standard Plan includes additional compensation for carrying complete pooja samagri.",
    },
    {
      id: "panel2",
      question: "Which clients can send booking requests for this ceremony?",
      answer:
        "Once added to your profile, customers located in your registered service area city can view your profile and book you. For online rituals, clients across India can book you.",
    },
    {
      id: "panel3",
      question: "What samagri should I carry vs what will the customer arrange?",
      answer:
        "Please refer to the 'Package Options & Items to Carry' section above. In the Basic Plan, you only carry your personal puja tools (Havan Kund, Aarti thali, Bell). In the Standard Plan, you carry the complete samagri kit.",
    },
    {
      id: "panel4",
      question: "Can I customize prices or remove this ceremony later?",
      answer:
        "Yes! From your 'My Services' screen, you can update your online and offline pricing, modify duration, or remove this ceremony from your offerings at any time.",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2.5, sm: 3, md: 3.5 },
        pb: { xs: 10, sm: 6 }, // Extra bottom padding on mobile for sticky action bar
      }}
    >
      {/* 1. Header with Breadcrumbs and Back Button */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        <AppBreadcrumbs
          items={[
            { label: "Dashboard", href: "/partner/dashboard" },
            {
              label: isAlreadyAdded ? "My Services" : "Available Services",
              href: isAlreadyAdded ? "/partner/my-services" : "/partner/services",
            },
            { label: service.name || service.title },
          ]}
          sx={{ mb: 0 }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1E293B",
                fontSize: { xs: "22px", sm: "28px", md: "32px" },
                lineHeight: 1.2,
              }}
            >
              {service.name || service.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#64748B",
                fontSize: { xs: "13px", sm: "14.5px" },
                mt: 0.5,
              }}
            >
              {service.category?.name || "Vedic Ritual"} • Partner Service Details & Guidelines
            </Typography>
          </Box>

          <Button
            onClick={handleBack}
            startIcon={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "rgba(255, 98, 0, 0.12)",
                  color: COLORS.PRIMARY,
                  transition: "all 0.25s ease",
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 14 }} />
              </Box>
            }
            sx={{
              color: "#1F1A17",
              bgcolor: "#FFFFFF",
              border: "1.5px solid rgba(255, 98, 0, 0.28)",
              borderRadius: "32px",
              pl: 1.2,
              pr: 2.2,
              py: 0.6,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              boxShadow:
                "0 4px 14px -2px rgba(255, 98, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.04)",
              flexShrink: 0,
              alignSelf: { xs: "flex-start", sm: "auto" },
              transition: "all 0.25s ease",
              "& .MuiButton-startIcon": { mr: 1 },
              "&:hover": {
                bgcolor: "#FFFFFF",
                borderColor: COLORS.PRIMARY,
                color: COLORS.PRIMARY,
                transform: "translateY(-1px)",
                boxShadow: "0 6px 18px -2px rgba(255, 98, 0, 0.25)",
                "& .MuiButton-startIcon > div": {
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  transform: "translateX(-2px)",
                },
              },
            }}
          >
            {isAlreadyAdded ? "Back to My Services" : "Back to Services"}
          </Button>
        </Box>
      </Box>

      {/* 3. Main Service Overview Hero Card (Partner App-Style) */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: { xs: "18px", sm: "22px" },
          p: { xs: 2.25, sm: 3, md: 3.5 },
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} sx={{ alignItems: "stretch" }}>
          {/* Left Column: Ritual Details & Quick Stat Grid (Mobile: Order 2, Desktop: Order 1) */}
          <Grid size={{ xs: 12, md: 7, lg: 7.5 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", gap: 2.5 }}>
              <Box>
                {/* Badges Row */}
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 1.5 }}>
                  {/* Status badge */}
                  {isAlreadyAdded ? (
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: "15px !important", color: "#16A34A !important" }} />}
                      label="Active in My Services"
                      size="small"
                      sx={{
                        bgcolor: "#F0FDF4",
                        color: "#16A34A",
                        border: "1px solid #BBF7D0",
                        fontWeight: 700,
                        fontSize: "11.5px",
                        height: "26px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<AddIcon sx={{ fontSize: "15px !important", color: "#2563EB !important" }} />}
                      label="Available to Add"
                      size="small"
                      sx={{
                        bgcolor: "#EFF6FF",
                        color: "#1D4ED8",
                        border: "1px solid #DBEAFE",
                        fontWeight: 700,
                        fontSize: "11.5px",
                        height: "26px",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  {/* Mode Badge */}
                  {service.isOnline && service.isOffline ? (
                    <Chip
                      icon={<StorefrontIcon sx={{ fontSize: "14px !important", color: "#7E22CE !important" }} />}
                      label="Online & Offline"
                      size="small"
                      sx={{
                        bgcolor: "#F3E8FF",
                        color: "#7E22CE",
                        border: "1px solid #E9D5FF",
                        fontWeight: 700,
                        fontSize: "11.5px",
                        height: "26px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : service.isOnline ? (
                    <Chip
                      icon={<WifiIcon sx={{ fontSize: "14px !important", color: "#1D4ED8 !important" }} />}
                      label="Online Service"
                      size="small"
                      sx={{
                        bgcolor: "#EFF6FF",
                        color: "#1D4ED8",
                        border: "1px solid #DBEAFE",
                        fontWeight: 700,
                        fontSize: "11.5px",
                        height: "26px",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<StorefrontIcon sx={{ fontSize: "14px !important", color: "#B45309 !important" }} />}
                      label="In-Person Only"
                      size="small"
                      sx={{
                        bgcolor: "#FEF3C7",
                        color: "#B45309",
                        border: "1px solid #FDE68A",
                        fontWeight: 700,
                        fontSize: "11.5px",
                        height: "26px",
                        borderRadius: "8px",
                      }}
                    />
                  )}

                  {service.isUpcomingFestival && (
                    <Chip
                      icon={<SparklesIcon sx={{ fontSize: "14px !important", color: "#D97706 !important" }} />}
                      label="Upcoming Festival"
                      size="small"
                      sx={{
                        bgcolor: "#FEF3C7",
                        color: "#B45309",
                        border: "1px solid #FCD34D",
                        fontWeight: 700,
                        fontSize: "11.5px",
                        height: "26px",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Box>

                {/* Ritual Description */}
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#475569",
                    fontSize: { xs: "13.5px", sm: "14.5px" },
                    lineHeight: 1.65,
                    mb: 2.5,
                  }}
                >
                  {service.description ||
                    service.desc ||
                    service.shortDescription ||
                    "Vedic pooja conducted with authentic Vedic vidhi and mantras. Clients can book this ceremony as per their auspicious muhurat."}
                </Typography>

                {/* 4-Tile Quick Ritual Metric Grid */}
                <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                  {/* Payout */}
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 16, color: "#16A34A" }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Est. Payout
                        </Typography>
                      </Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: { xs: "14px", sm: "16px" }, fontWeight: 800, color: "#16A34A" }}>
                        {priceDisplay}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Duration */}
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Duration
                        </Typography>
                      </Box>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: { xs: "14px", sm: "15px" }, fontWeight: 700, color: "#1E293B" }}>
                        {durationText}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Languages */}
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LanguageIcon sx={{ fontSize: 16, color: "#2563EB" }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Languages
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: { xs: "13px", sm: "14px" },
                          fontWeight: 700,
                          color: "#1E293B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formattedLanguages}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Service Area */}
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        height: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "#D97706" }} />
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Area
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: { xs: "13px", sm: "14px" },
                          fontWeight: 700,
                          color: "#1E293B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formattedCities || (service.isOnline ? "Online (All India)" : "Your City")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Primary Action Button */}
              <Box sx={{ pt: 1, borderTop: "1px solid #F1F5F9" }}>
                {isAlreadyAdded ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      disabled
                      startIcon={<CheckCircleIcon sx={{ color: "#16A34A !important" }} />}
                      sx={{
                        bgcolor: "#F0FDF4 !important",
                        color: "#16A34A !important",
                        border: "1.5px solid #BBF7D0",
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "14px",
                        fontFamily: FONTS.OUTFIT,
                        px: 3,
                        py: 1.1,
                        textTransform: "none",
                        boxShadow: "none",
                      }}
                    >
                      Active in Your Profile
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => router.push("/partner/my-services")}
                      sx={{
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: "14px",
                        fontFamily: FONTS.OUTFIT,
                        px: 2.5,
                        py: 1.1,
                        textTransform: "none",
                        borderColor: COLORS.PRIMARY,
                        color: COLORS.PRIMARY,
                        "&:hover": {
                          bgcolor: "rgba(255, 98, 0, 0.06)",
                          borderColor: COLORS.PRIMARY_DARK,
                        },
                      }}
                    >
                      Manage in My Services
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleAddService}
                      disabled={submitting}
                      startIcon={
                        submitting ? (
                          <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
                        ) : (
                          <AddIcon />
                        )
                      }
                      sx={{
                        borderRadius: "12px",
                        fontWeight: 700,
                        fontSize: { xs: "14px", sm: "15px" },
                        fontFamily: FONTS.OUTFIT,
                        px: { xs: 3, sm: 4 },
                        py: 1.25,
                        textTransform: "none",
                        bgcolor: `${COLORS.PRIMARY} !important`,
                        color: "#FFFFFF !important",
                        boxShadow: "0 4px 16px rgba(255, 98, 0, 0.3)",
                        alignSelf: { xs: "stretch", sm: "flex-start" },
                        "&:hover": {
                          bgcolor: `${COLORS.PRIMARY_DARK} !important`,
                          boxShadow: "0 6px 20px rgba(255, 98, 0, 0.4)",
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {submitting ? "Adding to Profile..." : "Add to My Services"}
                    </Button>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "12px",
                        color: "#64748B",
                      }}
                    >
                      Instant addition to your profile. Clients will be able to book you for this pooja.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Service Visual Media (Mobile: Order 1 so it appears at TOP) */}
          <Grid size={{ xs: 12, md: 5, lg: 4.5 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                minHeight: { xs: 180, sm: 220, md: 280 },
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid #E2E8F0",
                bgcolor: "#F8FAFC",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={heroImage}
                alt={service.name || "Service"}
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 180, sm: 220, md: 280 },
                  maxHeight: { xs: 220, sm: 260, md: 360 },
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e: any) => {
                  e.target.style.display = "none";
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 4. Service Packages & Items to Carry */}
      <PurohitServicePlansSection service={service} />

      {/* 5. Partner Guidelines & Frequently Asked Questions */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#FFFFFF",
          borderRadius: "18px",
          p: { xs: 2.5, sm: 3 },
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 18px rgba(0, 0, 0, 0.02)",
        }}
      >
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1E293B",
              fontSize: { xs: "18px", sm: "22px" },
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 5,
                height: 22,
                bgcolor: COLORS.PRIMARY,
                borderRadius: 3,
                display: "inline-block",
              }}
            />
            Partner Guidelines & FAQs
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: { xs: "13px", sm: "14px" },
              mt: 0.5,
              ml: 2,
            }}
          >
            Important information on payouts, bookings, and samagri requirements.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {partnerFaqItems.map((faq) => {
            const isExp = faqExpanded === faq.id;
            return (
              <Accordion
                key={faq.id}
                expanded={isExp}
                onChange={(e, expandedNow) => setFaqExpanded(expandedNow ? faq.id : false)}
                elevation={0}
                sx={{
                  bgcolor: "#FFFFFF",
                  border: isExp ? "1.5px solid rgba(255, 98, 0, 0.35)" : "1px solid #E2E8F0",
                  borderRadius: "14px !important",
                  "&:before": { display: "none" },
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: isExp
                    ? "0 4px 16px rgba(255, 98, 0, 0.06)"
                    : "0 2px 6px rgba(0, 0, 0, 0.02)",
                  "&:hover": {
                    borderColor: isExp ? "rgba(255, 98, 0, 0.45)" : "#CBD5E1",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: isExp ? "rgba(255, 98, 0, 0.12)" : "#F1F5F9",
                        color: isExp ? COLORS.PRIMARY : "#64748B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ExpandMoreIcon sx={{ fontSize: 18 }} />
                    </Box>
                  }
                  sx={{
                    py: 1.5,
                    px: { xs: 2, sm: 2.5 },
                    "& .MuiAccordionSummary-content": {
                      my: 0,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: { xs: "14.5px", sm: "15.5px" },
                      color: isExp ? "#1E293B" : "#334155",
                      lineHeight: 1.4,
                      pr: 1,
                    }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pt: 0, pb: 2.25 }}>
                  <Box
                    sx={{
                      pt: 1.5,
                      borderTop: "1px dashed #E2E8F0",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: { xs: "13.5px", sm: "14px" },
                        color: "#64748B",
                        lineHeight: 1.65,
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Paper>

      {/* 6. Mobile Sticky Bottom Action Bar (Only on narrow screens when NOT yet added) */}
      {!isAlreadyAdded && (
        <Box
          sx={{
            display: { xs: "block", sm: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "#FFFFFF",
            borderTop: "1px solid #E2E8F0",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
            p: 1.5,
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
            <Box>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                Est. Payout
              </Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "16px", fontWeight: 800, color: "#16A34A" }}>
                {priceDisplay}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={handleAddService}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
              sx={{
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                fontFamily: FONTS.OUTFIT,
                px: 2.5,
                py: 1,
                textTransform: "none",
                bgcolor: `${COLORS.PRIMARY} !important`,
                color: "#FFFFFF !important",
              }}
            >
              {submitting ? "Adding..." : "Add Service"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}