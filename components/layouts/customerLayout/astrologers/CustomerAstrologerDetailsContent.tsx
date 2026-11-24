"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import TranslateIcon from "@mui/icons-material/Translate";
import VerifiedIcon from "@mui/icons-material/Verified";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NextLink from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getAstrologerByIdAPI } from "@/api/userControllers";
import { customerCreateAstrologyBookingAPI } from "@/api/bookingControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useSocketStore } from "@/stores/socketStore";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const parseList = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val
      .map((item) => (typeof item === "string" ? item.trim() : String(item)))
      .filter(Boolean);
  }
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed.map((s) => String(s).trim()).filter(Boolean);
      }
    } catch {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [val.trim()];
  }
  return [];
};

const getTodayStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CustomerAstrologerDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const [astrologer, setAstrologer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  // Booking Form State - only scheduledAt
  const todayStr = useMemo(() => getTodayStr(), []);
  const [scheduledDate, setScheduledDate] = useState<string>(todayStr);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>("");

  useEffect(() => {
    const fetchAstrologer = async () => {
      if (!params.id) return;
      try {
        setLoading(true);
        const res = await getAstrologerByIdAPI(params.id as string);
        if (res.success) {
          const userObj = res.data?.data || res.data?.user || res.data;
          setAstrologer(userObj);
        } else {
          showSnackbar(res.message || "Failed to load astrologer details", "error");
        }
      } catch (err) {
        console.error("Error fetching astrologer by ID:", err);
        showSnackbar("Error fetching astrologer details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAstrologer();
  }, [params.id, showSnackbar]);

  const profile = astrologer?.astrologerProfile || astrologer?.profile || {};

  const fullName =
    `${astrologer?.firstName || ""} ${astrologer?.lastName || ""}`.trim() ||
    astrologer?.username ||
    "Vedic Astrologer";

  const specializations = parseList(
    profile?.specializations || profile?.specialization
  );
  const languages = parseList(profile?.languages || profile?.language);
  const qualifications = parseList(
    profile?.qualification || profile?.qualifications
  );
  const primaryQualification = qualifications[0] || "";
  const specification = profile?.specification || "";
  const bio = profile?.bio || astrologer?.bio || "";

  const expYears = profile?.experienceYears ?? profile?.experience;
  const experience = expYears ? `${expYears}+ Years Experience` : "Experienced";

  const rawPrice =
    profile?.astrologyPrice ??
    astrologer?.astrologyPrice ??
    profile?.ratePerMinute ??
    astrologer?.ratePerMinute;
  const astrologyPriceDisplay =
    rawPrice != null && rawPrice !== ""
      ? `₹${Number(rawPrice).toFixed(2)}`
      : "₹0.00";

  const rawCommission = profile?.commissionPrice;
  const commissionPrice =
    rawCommission != null && rawCommission !== ""
      ? `₹${Number(rawCommission).toFixed(2)}`
      : "₹50.00";

  const city = profile?.city || astrologer?.city || "";
  const state = profile?.state || astrologer?.state || "";
  const locationText = [city, state].filter(Boolean).join(", ");

  const numRating = Number(astrologer?.avgRating || profile?.avgRating || 0);
  const hasRating = !isNaN(numRating) && numRating > 0;
  const rating = hasRating ? numRating.toFixed(1) : null;

  const rawImage =
    astrologer?.profileImage ||
    astrologer?.image ||
    profile?.profileImage ||
    profile?.avatar ||
    "";
  const isLogo = !rawImage || rawImage.includes("1Poojalogo") || rawImage.includes("logo");
  const imageSrc = isLogo ? "" : rawImage;

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase())
      .join("") || "A";

  // Calculate available time slots (9:00 AM to 10:00 PM)
  const availableSlots = useMemo(() => {
    const slots: { value: string; label: string }[] = [];
    const now = new Date();
    const isToday = scheduledDate === todayStr;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // From 09:00 (9 AM) to 22:00 (10 PM) in 30-min intervals
    for (let h = 9; h <= 22; h++) {
      for (const m of [0, 30]) {
        if (h === 22 && m === 30) continue; // 22:00 is the last slot

        // Disable past slots and enforce minimum 2 hours in advance if scheduled date is today
        if (isToday) {
          const slotTotalMinutes = h * 60 + m;
          const currentTotalMinutes = currentHour * 60 + currentMinute;
          if (slotTotalMinutes < currentTotalMinutes + 120) {
            continue;
          }
        }

        const timeVal = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const period = h >= 12 ? "PM" : "AM";
        const label = `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;

        slots.push({ value: timeVal, label });
      }
    }
    return slots;
  }, [scheduledDate, todayStr]);

  // Auto-select first available time slot if current selected is invalid
  useEffect(() => {
    if (availableSlots.length > 0) {
      const isValid = availableSlots.some((s) => s.value === scheduledTime);
      if (!isValid) {
        setScheduledTime(availableSlots[0].value);
      }
    } else {
      setScheduledTime("");
    }
  }, [availableSlots, scheduledTime]);


  const handleInitiateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!astrologer?.id) {
      showSnackbar("Astrologer information missing", "error");
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      showSnackbar("Please select consultation date and time slot", "warning");
      return;
    }

    const [year, month, day] = scheduledDate.split("-").map(Number);
    const [hour, minute] = scheduledTime.split(":").map(Number);
    const scheduledDateTime = new Date(year, month - 1, day, hour, minute, 0);

    if (scheduledDateTime.getTime() <= Date.now()) {
      showSnackbar("Please choose a future date and time", "warning");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        astrologerId: Number(astrologer.id),
        scheduledAt: scheduledDateTime.toISOString(),
      };

      const res = await customerCreateAstrologyBookingAPI(payload);

      const resData = res?.data?.data || res?.data;
      const paymentUrl =
        resData?.paymentUrl ||
        resData?.payment?.paymentUrl ||
        res?.paymentUrl ||
        res?.data?.paymentUrl;

      if (paymentUrl && typeof paymentUrl === "string") {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("customer_bookings_type", "ASTROLOGY");
          sessionStorage.setItem("booking_payment_pending", "true");
        }
        showSnackbar("Booking created! Redirecting to payment...", "success");
        window.location.href = paymentUrl;
        return;
      }

      // Add real-time customer notification & emit socket event
      try {
        const socketStore = useSocketStore.getState();
        socketStore.addNotification("New Astrology Consultation Scheduled");
        socketStore.incrementUnread();
        socketStore.triggerRefresh();

        const socket = socketStore.socket;
        if (socket && socket.connected) {
          const payload = {
            bookingId: resData?.id,
            astrologerId: Number(astrologer.id),
            scheduledAt: scheduledDateTime.toISOString(),
            message: "New Astrology Consultation Scheduled",
          };
          socket.emit("New Astrology Consultation Scheduled", payload);
          socket.emit("new_astrology_consultation_scheduled", payload);
          socket.emit("astrology_consultation_scheduled", payload);
          socket.emit("new_astrology_booking", payload);
          socket.emit("astrology_booking_created", payload);
        }
      } catch (e) {
        console.warn("Socket notification notice:", e);
      }

      showSnackbar(
        res?.message || "Consultation booked successfully!",
        "success"
      );
      if (typeof window !== "undefined") {
        sessionStorage.setItem("customer_bookings_type", "ASTROLOGY");
      }
      router.push("/customer/bookings");
    } catch (err: any) {
      console.error("Booking error:", err);
      showSnackbar(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to book consultation",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", pb: 6 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="rectangular" width={140} height={36} sx={{ borderRadius: "10px" }} />
        </Box>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: "24px",
            border: "1.5px solid #EFE6D5",
            bgcolor: "#ffffff",
            mb: 4,
          }}
        >
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 4, md: 3 }} sx={{ display: "flex", justifyContent: "center" }}>
              <Skeleton variant="rectangular" sx={{ width: { xs: 140, sm: 170 }, height: { xs: 140, sm: 170 }, borderRadius: "24px" }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 8, md: 9 }}>
              <Skeleton variant="text" height={36} width="60%" />
              <Skeleton variant="text" height={22} width="40%" />
              <Box sx={{ display: "flex", gap: 1, my: 1.5 }}>
                <Skeleton variant="rectangular" width={90} height={26} sx={{ borderRadius: "8px" }} />
                <Skeleton variant="rectangular" width={90} height={26} sx={{ borderRadius: "8px" }} />
              </Box>
              <Skeleton variant="text" height={20} width="90%" />
              <Skeleton variant="text" height={20} width="80%" />
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            borderRadius: "24px",
            border: "1.5px solid #EFE6D5",
            bgcolor: "#ffffff",
          }}
        >
          <Skeleton variant="text" height={30} width="40%" />
          <Skeleton variant="text" height={20} width="65%" sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={54} sx={{ borderRadius: "14px" }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={54} sx={{ borderRadius: "14px" }} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  }

  if (!astrologer) {
    return (
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          bgcolor: "#FAF4EE",
          borderRadius: "20px",
          border: "1px dashed #fed7aa",
          maxWidth: 600,
          mx: "auto",
          my: 6,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#2C1810", mb: 2 }}
        >
          Astrologer profile not found.
        </Typography>
        <Button
          variant="contained"
          component={NextLink}
          href="/customer/astrologers"
          startIcon={<ArrowBackIcon />}
          sx={{
            background: COLORS.PRIMARY,
            color: "white",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          Back to Astrologers
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", pb: { xs: 6, sm: 10 } }}>
      {/* Back Button */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Button
          variant="text"
          component={NextLink}
          href="/customer/astrologers"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#64748b",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            fontSize: "14px",
            textTransform: "none",
            borderRadius: "10px",
            px: 1.5,
            py: 0.6,
            "&:hover": { color: COLORS.PRIMARY, bgcolor: "#fff7ed" },
          }}
        >
          Back to Astrologers
        </Button>
      </Box>

      {/* Top: Astrologer Profile Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, sm: 3.5, md: 4 },
          borderRadius: "24px",
          border: "1.5px solid #EFE6D5",
          bgcolor: "#ffffff",
          mb: { xs: 2.5, sm: 4 },
          boxShadow: "0 4px 20px -4px rgba(44, 24, 16, 0.05)",
        }}
      >
        <Grid container spacing={{ xs: 2.5, sm: 4 }} sx={{ alignItems: "flex-start" }}>
          {/* Avatar / Photo */}
          <Grid
            size={{ xs: 12, sm: 4, md: 3 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: { xs: 130, sm: 165 },
                height: { xs: 130, sm: 165 },
                borderRadius: { xs: "20px", sm: "24px" },
                overflow: "hidden",
                bgcolor: "#FAF7F4",
                border: "2px solid #FFD4BC",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px -4px rgba(255, 98, 0, 0.15)",
              }}
            >
              {imageSrc && !imgError ? (
                <Box
                  component="img"
                  src={imageSrc}
                  alt={fullName}
                  onError={() => setImgError(true)}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #FFF0E6 0%, #FFE2D1 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: { xs: "2.2rem", sm: "3.2rem" },
                    fontWeight: 800,
                    fontFamily: FONTS.OUTFIT,
                    color: COLORS.PRIMARY,
                    userSelect: "none",
                  }}
                >
                  {initials}
                </Box>
              )}

              {/* Rating badge - only shown if > 0 */}
              {hasRating && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(6px)",
                    borderRadius: "10px",
                    px: 1.2,
                    py: 0.3,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.4,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  }}
                >
                  <StarIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
                  <Typography sx={{ fontSize: "13px", fontWeight: 800, fontFamily: FONTS.OUTFIT }}>
                    {rating}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Details */}
          <Grid size={{ xs: 12, sm: 8, md: 9 }}>
            {/* Name + Verified */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
                mb: 0.5,
                justifyContent: { xs: "center", sm: "flex-start" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: { xs: "1.45rem", sm: "1.9rem" },
                }}
              >
                {fullName}
              </Typography>
              <Tooltip title="Verified Vedic Astrologer">
                <VerifiedIcon sx={{ fontSize: 22, color: "#0284c7" }} />
              </Tooltip>
            </Box>

            {/* Specification Subtitle */}
            {specification && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  mb: 1.5,
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: "0.95rem", color: COLORS.PRIMARY }}>
                  {specification}
                </Typography>
              </Box>
            )}

            {/* Meta Tags: Experience, Qualification, Location */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                flexWrap: "wrap",
                mb: 2,
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Chip
                icon={<SchoolIcon sx={{ fontSize: "15px !important", color: "#c2410c" }} />}
                label={experience}
                size="small"
                sx={{
                  bgcolor: "#ffedd5",
                  color: "#c2410c",
                  fontWeight: 700,
                  fontSize: "12px",
                  height: 26,
                  borderRadius: "8px",
                }}
              />

              {primaryQualification && (
                <Chip
                  icon={<SchoolIcon sx={{ fontSize: "15px !important", color: "#475569" }} />}
                  label={primaryQualification}
                  size="small"
                  sx={{
                    bgcolor: "#f1f5f9",
                    color: "#334155",
                    fontWeight: 600,
                    fontSize: "12px",
                    height: 26,
                    borderRadius: "8px",
                  }}
                />
              )}

              {locationText && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                    {locationText}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Bio */}
            {bio && (
              <Box sx={{ mb: 2, textAlign: { xs: "center", sm: "left" } }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: "13px", color: "#2C1810", mb: 0.5 }}>
                  About Astrologer
                </Typography>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "13.5px", lineHeight: 1.65 }}>
                  {bio}
                </Typography>
              </Box>
            )}

            {/* Specializations */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  mb: 0.8,
                  textTransform: "uppercase",
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Specializations & Expertise
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, justifyContent: { xs: "center", sm: "flex-start" } }}>
                {specializations.length > 0 ? (
                  specializations.map((spec, i) => (
                    <Chip
                      key={i}
                      label={spec}
                      size="small"
                      sx={{
                        bgcolor: "#fff7ed",
                        color: "#c2410c",
                        fontWeight: 600,
                        fontSize: "12px",
                        height: 26,
                        borderRadius: "8px",
                      }}
                    />
                  ))
                ) : (
                  <Chip label="Vedic Astrology" size="small" sx={{ bgcolor: "#fff7ed", color: "#c2410c", borderRadius: "8px" }} />
                )}
              </Box>
            </Box>

            {/* Languages */}
            {languages.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, justifyContent: { xs: "center", sm: "flex-start" } }}>
                <TranslateIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontSize: "13px", color: "#475569", fontWeight: 500 }}>
                  Languages Spoken: <strong>{languages.join(", ")}</strong>
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Bottom: Consultation Booking Form */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.25, sm: 3.5, md: 4 },
          borderRadius: "24px",
          border: "1.5px solid #FFD4BC",
          bgcolor: "#ffffff",
          boxShadow: "0 6px 24px -4px rgba(255, 98, 0, 0.08)",
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <EventAvailableIcon sx={{ color: COLORS.PRIMARY, fontSize: 26 }} />
            <Typography
              variant="h5"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#2C1810",
                fontSize: { xs: "1.2rem", sm: "1.45rem" },
              }}
            >
              Book Astrology Consultation
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: { xs: "13px", sm: "14px" } }}>
            Select your preferred consultation date and time slot (09:00 AM – 10:00 PM).
          </Typography>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "#EFE6D5" }} />

        <Box component="form" onSubmit={handleInitiateBooking} sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 2.5 } }}>
          {/* Scheduled Date and Time Fields */}
          <Grid container spacing={{ xs: 2, sm: 2.5 }}>
            {/* Consultation Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  label="Consultation Date"
                  format="DD/MM/YYYY"
                  value={scheduledDate ? moment(scheduledDate, "YYYY-MM-DD") : null}
                  minDate={todayStr ? moment(todayStr, "YYYY-MM-DD") : moment().startOf("day")}
                  maxDate={moment().add(3, "months").endOf("day")}
                  open={openCalendar}
                  onOpen={() => setOpenCalendar(true)}
                  onClose={() => setOpenCalendar(false)}
                  onChange={(newValue) => {
                    if (newValue && newValue.isValid()) {
                      setScheduledDate(newValue.format("YYYY-MM-DD"));
                    } else {
                      setScheduledDate("");
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      onClick: () => setOpenCalendar(true),
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "14px",
                          fontFamily: FONTS.OUTFIT,
                          bgcolor: "#FAFAFA",
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                          "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Consultation Time Slot */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel shrink sx={{ fontFamily: FONTS.OUTFIT }}>Consultation Time Slot</InputLabel>
                <Select
                  value={scheduledTime}
                  label="Consultation Time Slot"
                  notched
                  displayEmpty
                  onChange={(e) => setScheduledTime(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccessTimeIcon sx={{ color: COLORS.PRIMARY, fontSize: 20, ml: 0.5 }} />
                    </InputAdornment>
                  }
                  MenuProps={{
                    disableScrollLock: true,
                    autoFocus: false,
                    slotProps: {
                      paper: {
                        sx: {
                          maxHeight: 250,
                          mt: 1,
                          borderRadius: "14px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        },
                      },
                    },
                  }}
                  sx={{
                    borderRadius: "14px",
                    fontFamily: FONTS.OUTFIT,
                    bgcolor: "#FAFAFA",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&:hover fieldset": { borderColor: COLORS.PRIMARY },
                    "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                  }}
                >
                  {availableSlots.length === 0 ? (
                    <MenuItem value="" disabled>
                      No slots available for today (minimum 2 hours advance notice required)
                    </MenuItem>
                  ) : (
                    availableSlots.map((slot) => (
                      <MenuItem key={slot.value} value={slot.value} sx={{ fontFamily: FONTS.OUTFIT }}>
                        {slot.label}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Compact Advance Booking Note */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.8,
              px: 1.5,
              py: 0.7,
              borderRadius: "8px",
              bgcolor: "#fff7ed",
              border: "1px solid #fed7aa",
              width: "fit-content",
            }}
          >
            <InfoOutlinedIcon sx={{ color: "#ea580c", fontSize: 16, flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12px",
                color: "#9a3412",
                fontWeight: 500,
              }}
            >
              <strong>Note:</strong> Please book at least <strong>2 hours</strong> in advance.
            </Typography>
          </Box>

          {availableSlots.length === 0 && (
            <Typography sx={{ color: "#d97706", fontSize: "0.88rem", fontFamily: FONTS.OUTFIT }}>
              No slots available for today (consultations require at least 2 hours advance booking). Please select tomorrow or another future date.
            </Typography>
          )}

          {/* Action Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              p: { xs: 2, sm: 2.25 },
              bgcolor: "#FFF8F2",
              borderRadius: "18px",
              border: "1.5px solid #FFD4BC",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 1 }}>
              <Box>
                <Typography sx={{ fontSize: "10.5px", fontWeight: 700, color: "#8A7A70", letterSpacing: "0.5px", textTransform: "uppercase", fontFamily: FONTS.OUTFIT }}>
                  ASTROLOGY FEE
                </Typography>
                <Typography sx={{ fontSize: { xs: "20px", sm: "22px" }, fontWeight: 800, color: COLORS.PRIMARY, fontFamily: FONTS.OUTFIT, lineHeight: 1.2 }}>
                  {astrologyPriceDisplay}
                </Typography>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              disabled={submitting || availableSlots.length === 0 || !scheduledTime}
              startIcon={
                submitting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PaymentIcon />
                )
              }
              sx={{
                background: COLORS.PRIMARY,
                color: "white",
                px: { xs: 3, sm: 4.5 },
                py: { xs: 1.2, sm: 1.3 },
                borderRadius: "30px",
                fontWeight: 700,
                fontSize: "14.5px",
                fontFamily: FONTS.OUTFIT,
                textTransform: "none",
                width: { xs: "100%", sm: "auto" },
                boxShadow: "0 6px 20px rgba(255, 98, 0, 0.28)",
                "&:hover": {
                  background: COLORS.PRIMARY_DARK,
                  boxShadow: "0 8px 24px rgba(255, 98, 0, 0.35)",
                },
              }}
            >
              {submitting ? "Processing..." : `Proceed to Payment`}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
