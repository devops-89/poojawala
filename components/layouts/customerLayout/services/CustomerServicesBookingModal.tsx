"use client";

import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { useUserStore } from "@/stores/userStore";
import { formatServicePriceRange } from "@/utils/helpers";
import { useEffect, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { extractServiceLanguages } from "@/utils/serviceDetailsUtils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface CustomerServicesBookingModalProps {
  open: boolean;
  onClose: () => void;
  bookingForm: {
    scheduledAt: string;
    specialInstructions: string;
    bookingMode: string;
    paymentOption: string;
    language: string;
    plan?: string;
  };
  setBookingForm: (form: any) => void;
  onSubmit: () => void;
  submitting: boolean;
  service?: any;
}

const normalizeCity = (cityName: string): string => {
  if (!cityName) return "";
  let s = cityName.toLowerCase().trim();
  s = s.replace(/\b(urban|rural|district)\b/gi, "").trim();
  if (s.replace(/\bcity\b/gi, "").trim()) {
    s = s.replace(/\bcity\b/gi, "").trim();
  }
  if (s === "bangalore" || s === "bengaluru") return "bengaluru";
  if (s === "gurgaon" || s === "gurugram") return "gurugram";
  if (s === "delhi" || s === "new delhi") return "delhi";
  if (s === "bombay" || s === "mumbai") return "mumbai";
  if (s === "calcutta" || s === "kolkata") return "kolkata";
  if (s === "madras" || s === "chennai") return "chennai";
  if (s === "prayagraj" || s === "allahabad") return "prayagraj";
  if (s === "varanasi" || s === "banaras" || s === "kashi") return "varanasi";
  if (s === "mysore" || s === "mysuru") return "mysuru";
  if (s === "mangalore" || s === "mangaluru") return "mangaluru";
  if (s === "belgaum" || s === "belagavi") return "belagavi";
  if (s === "hubli" || s === "hubballi") return "hubballi";
  if (s === "pondicherry" || s === "puducherry") return "puducherry";
  if (s === "cochin" || s === "kochi") return "kochi";
  if (s === "trivandrum" || s === "thiruvananthapuram") return "thiruvananthapuram";
  if (s === "baroda" || s === "vadodara") return "vadodara";
  return s.replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
};

const checkCityMatch = (addr: any, serviceCity: { name: string; state?: string }): boolean => {
  if (!serviceCity?.name) return false;
  const sNorm = normalizeCity(serviceCity.name);
  if (!sNorm) return false;

  if (addr?.city) {
    const aNorm = normalizeCity(addr.city);
    if (aNorm === sNorm) return true;
    if (aNorm.length >= 4 && sNorm.length >= 4) {
      if (aNorm.includes(sNorm) || sNorm.includes(aNorm)) return true;
    }
  }

  if (addr?.fullAddress && typeof addr.fullAddress === "string") {
    const fullLower = addr.fullAddress.toLowerCase();
    const rawLower = serviceCity.name.toLowerCase().trim();
    if (fullLower.includes(rawLower) || (sNorm.length >= 4 && fullLower.includes(sNorm))) {
      return true;
    }
  }

  return false;
};

export default function CustomerServicesBookingModal({
  open,
  onClose,
  bookingForm,
  setBookingForm,
  onSubmit,
  submitting,
  service,
}: CustomerServicesBookingModalProps) {
  const profile = useUserStore((state) => state.profile);

  const defaultAddr = useMemo(() => {
    const userObj = profile?.data || profile;
    const addresses = userObj?.addresses || profile?.addresses;
    if (Array.isArray(addresses) && addresses.length > 0) {
      return (
        addresses.find(
          (a: any) =>
            a.isDefault === true ||
            String(a.isDefault).toLowerCase() === "true" ||
            a.isdefault === true ||
            a.is_default === true
        ) || addresses[0]
      );
    }
    return null;
  }, [profile]);

  const serviceCities = useMemo(() => {
    const raw = service?.cities;
    if (!raw) return [];
    let list = raw;
    if (typeof raw === "string") {
      try {
        list = JSON.parse(raw);
      } catch {
        list = [];
      }
    }
    if (!Array.isArray(list)) return [];
    return list
      .map((c: any) => {
        if (typeof c === "string") return { name: c.trim(), state: "" };
        return {
          name: (c?.name || c?.city || c?.cityName || "").trim(),
          state: (c?.state || "").trim(),
        };
      })
      .filter((c) => Boolean(c.name));
  }, [service?.cities]);

  const isGlobal =
    service?.isGlobal === true ||
    !serviceCities ||
    serviceCities.length === 0;

  const availableLanguages = useMemo(() => {
    const list = extractServiceLanguages(service?.languages);
    if (list.length > 0) return list;
    return ["Hindi"];
  }, [service?.languages]);

  // Extract selected Date & Time from bookingForm.scheduledAt
  const selectedDate = useMemo(() => {
    if (!bookingForm.scheduledAt) return "";
    const m = moment(bookingForm.scheduledAt);
    return m.isValid() ? m.format("YYYY-MM-DD") : "";
  }, [bookingForm.scheduledAt]);

  const selectedTime = useMemo(() => {
    if (!bookingForm.scheduledAt) return "";
    const m = moment(bookingForm.scheduledAt);
    return m.isValid() ? m.format("HH:mm") : "";
  }, [bookingForm.scheduledAt]);

  // Generate 30-min time slots from 07:00 AM to 08:00 PM
  const timeSlots = useMemo(() => {
    const slots: { value: string; label: string; disabled: boolean }[] = [];
    const now = moment();
    const todayStr = now.format("YYYY-MM-DD");
    const isToday = selectedDate === todayStr;

    for (let h = 7; h <= 20; h++) {
      for (const m of [0, 30]) {
        if (h === 20 && m === 30) continue;
        const timeVal = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
        const period = h >= 12 ? "PM" : "AM";
        const label = `${String(displayHour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;

        const slotMoment = moment(`${selectedDate || todayStr} ${timeVal}`, "YYYY-MM-DD HH:mm");
        const isPastOrTooSoon = isToday && slotMoment.isBefore(now.clone().add(2, "hours"));

        slots.push({ value: timeVal, label, disabled: isPastOrTooSoon });
      }
    }
    return slots;
  }, [selectedDate]);

  useEffect(() => {
    if (open) {
      if (availableLanguages.length > 0) {
        if (!bookingForm.language || !availableLanguages.includes(bookingForm.language)) {
          const defaultLang = availableLanguages.includes("Hindi") ? "Hindi" : availableLanguages[0];
          setBookingForm((prev: any) => ({ ...prev, language: defaultLang }));
        }
      }
      if (!bookingForm.paymentOption) {
        setBookingForm((prev: any) => ({ ...prev, paymentOption: "TOKEN" }));
      }
      // If no scheduledAt set, preselect tomorrow at 10:00 AM
      if (!bookingForm.scheduledAt) {
        const defaultSlot = moment().add(1, "day").set({ hour: 10, minute: 0, second: 0 });
        setBookingForm((prev: any) => ({
          ...prev,
          scheduledAt: defaultSlot.toISOString(),
        }));
      }
    }
  }, [open, availableLanguages, bookingForm.language, bookingForm.paymentOption, bookingForm.scheduledAt, setBookingForm]);

  const handleDateChange = (newDateStr: string) => {
    const timeToUse = selectedTime || "10:00";
    if (newDateStr) {
      const combined = moment(`${newDateStr} ${timeToUse}`, "YYYY-MM-DD HH:mm");
      setBookingForm((prev: any) => ({
        ...prev,
        scheduledAt: combined.toISOString(),
      }));
    } else {
      setBookingForm((prev: any) => ({
        ...prev,
        scheduledAt: "",
      }));
    }
  };

  const handleTimeChange = (newTimeStr: string) => {
    const dateToUse = selectedDate || moment().add(1, "day").format("YYYY-MM-DD");
    if (newTimeStr) {
      const combined = moment(`${dateToUse} ${newTimeStr}`, "YYYY-MM-DD HH:mm");
      setBookingForm((prev: any) => ({
        ...prev,
        scheduledAt: combined.toISOString(),
      }));
    }
  };

  const serviceTitle =
    service?.title ||
    service?.name ||
    service?.serviceName ||
    "Pooja Service";

  const imageSrc =
    service?.bannerDownloadurl ||
    service?.bannerUrl ||
    service?.iconDownloadurl ||
    service?.iconUrl ||
    service?.image ||
    "/images/home/poojaPackages/satyanarayan.webp";

  const priceDisplay = formatServicePriceRange(service);

  return (
    <Modal open={open} onClose={onClose} disableEnforceFocus>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "92%", sm: 460 },
          maxWidth: "460px",
          bgcolor: "#FFFFFF",
          borderRadius: "20px",
          border: "1.5px solid #EFE6D5",
          boxShadow: "0 16px 40px rgba(44, 24, 16, 0.16)",
          p: { xs: 2, sm: 2.75 },
          maxHeight: "92vh",
          overflowY: "auto",
          outline: "none",
          "& .MuiOutlinedInput-root": {
            fontFamily: FONTS.OUTFIT,
            borderRadius: "12px",
            bgcolor: "#FFFFFF",
            "& fieldset": { borderColor: "#EFE6D5" },
            "&:hover fieldset": { borderColor: "#FFD4BC" },
            "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
          },
          "& .MuiInputLabel-root": {
            fontFamily: FONTS.OUTFIT,
            color: "#7C6A60",
          },
          "& .MuiInputLabel-root.Mui-focused": { color: COLORS.PRIMARY },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
            pb: 1.25,
            borderBottom: "1px dashed #EFE6D5",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#2C1810",
                fontSize: { xs: "1.05rem", sm: "1.15rem" },
                lineHeight: 1.2,
              }}
            >
              Book Service
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "11.5px",
                color: "#7C6A60",
                mt: 0.25,
              }}
            >
              Fill details to schedule your ceremony
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "#7C6A60",
              bgcolor: "#FAF7F4",
              border: "1px solid #EFE6D5",
              "&:hover": { bgcolor: "#FFF0E6", color: COLORS.PRIMARY },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Selected Service Preview Box */}
        {service && (
          <Box
            sx={{
              p: 1.25,
              mb: 1.5,
              borderRadius: "14px",
              bgcolor: "#FAF7F4",
              border: "1px solid #EFE6D5",
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                bgcolor: "#FFFFFF",
                border: "1px solid #EFE6D5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0.5,
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={imageSrc}
                alt={serviceTitle}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  fontSize: "13px",
                  color: "#2C1810",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {serviceTitle}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    fontSize: "12.5px",
                    color: COLORS.PRIMARY,
                  }}
                >
                  {priceDisplay}
                </Typography>
                <Chip
                  label={
                    service.isOnline && service.isOffline
                      ? "Online & Offline"
                      : service.isOnline
                        ? "Online"
                        : "Offline"
                  }
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "10px",
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    bgcolor: service.isOnline ? "#F0FDF4" : "#F0F9FF",
                    color: service.isOnline ? "#16A34A" : "#0284C7",
                    border: `1px solid ${service.isOnline ? "#BBF7D0" : "#BAE6FD"}`,
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        <Grid container spacing={1.5}>
          {/* Scheduled Date (MUI DatePicker) */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Scheduled Date *"
                format="DD/MM/YYYY"
                value={selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null}
                disablePast
                minDate={moment()}
                maxDate={moment().add(3, "months")}
                slots={{ toolbar: () => null }}
                closeOnSelect
                onChange={(newValue) => {
                  if (newValue && newValue.isValid()) {
                    handleDateChange(newValue.format("YYYY-MM-DD"));
                  } else {
                    handleDateChange("");
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        fontFamily: FONTS.OUTFIT,
                        borderRadius: "12px",
                        bgcolor: "#FFFFFF",
                        fontSize: "13px",
                        "& fieldset": { borderColor: "#EFE6D5" },
                        "&:hover fieldset": { borderColor: "#FFD4BC" },
                        "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                      },
                      "& .MuiInputLabel-root": {
                        fontFamily: FONTS.OUTFIT,
                        color: "#7C6A60",
                        fontSize: "13px",
                        fontWeight: 600,
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: COLORS.PRIMARY },
                    },
                  },
                  popper: {
                    sx: {
                      zIndex: 1400,
                      "& .MuiPaper-root": {
                        borderRadius: "16px",
                        border: "1px solid #EFE6D5",
                        boxShadow: "0 10px 28px rgba(44, 24, 16, 0.12)",
                        fontFamily: FONTS.OUTFIT,
                      },
                      "& .MuiPickersDay-root": {
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "13px",
                        "&.Mui-selected": {
                          bgcolor: `${COLORS.PRIMARY} !important`,
                          color: "#FFFFFF",
                        },
                        "&:hover": {
                          bgcolor: "#FFF0E6",
                        },
                      },
                      "& .MuiDayCalendar-weekDayLabel": {
                        fontFamily: FONTS.OUTFIT,
                        color: "#8A7A70",
                        fontWeight: 700,
                      },
                      "& .MuiPickersCalendarHeader-label": {
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        color: "#2C1810",
                      },
                    },
                  },
                  dialog: {
                    sx: {
                      zIndex: 1400,
                      "& .MuiPaper-root": {
                        borderRadius: "20px",
                        border: "1.5px solid #EFE6D5",
                        maxWidth: 320,
                        p: 1,
                        fontFamily: FONTS.OUTFIT,
                      },
                      "& .MuiPickersDay-root.Mui-selected": {
                        bgcolor: `${COLORS.PRIMARY} !important`,
                        color: "#FFFFFF",
                      },
                      "& .MuiButton-root": {
                        fontFamily: FONTS.OUTFIT,
                        color: COLORS.PRIMARY,
                        fontWeight: 700,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Preferred Time (MUI Select Time Slots) */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="booking-modal-time-label"
                sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" }}
              >
                Preferred Time *
              </InputLabel>
              <Select
                labelId="booking-modal-time-label"
                label="Preferred Time *"
                value={selectedTime || (timeSlots.find((t) => !t.disabled)?.value || "10:00")}
                onChange={(e) => handleTimeChange(e.target.value)}
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13px",
                  color: "#2C1810",
                }}
                MenuProps={{
                  variant: "menu",
                  disableScrollLock: true,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  slotProps: {
                    paper: {
                      sx: {
                        maxHeight: 240,
                        borderRadius: "14px",
                        border: "1px solid #EFE6D5",
                        boxShadow: "0 8px 24px rgba(44, 24, 16, 0.08)",
                        mt: 0.5,
                      },
                    },
                  },
                }}
              >
                {timeSlots.map((slot) => (
                  <MenuItem
                    key={slot.value}
                    value={slot.value}
                    disabled={slot.disabled}
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "13px",
                      color: slot.disabled ? "#CBD5E1" : "#2C1810",
                    }}
                  >
                    {slot.label} {slot.disabled ? "(Passed)" : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Time Slot Helper Note */}
          <Grid size={{ xs: 12 }} sx={{ mt: -0.5 }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "11px",
                color: "#8A7A70",
                lineHeight: 1.3,
              }}
            >
              Note: Same-day pooja bookings require at least 2 hours advance notice.
            </Typography>
          </Grid>

          {/* Language Selection */}
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel
                id="booking-modal-language-label"
                sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" }}
              >
                Pooja Language
              </InputLabel>
              <Select
                labelId="booking-modal-language-label"
                label="Pooja Language"
                value={bookingForm.language || (availableLanguages[0] || "Hindi")}
                onChange={(e) =>
                  setBookingForm({ ...bookingForm, language: e.target.value })
                }
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13px",
                  color: "#2C1810",
                }}
                MenuProps={{
                  variant: "menu",
                  disableScrollLock: true,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  slotProps: {
                    paper: {
                      sx: {
                        maxHeight: 240,
                        borderRadius: "14px",
                        border: "1px solid #EFE6D5",
                        boxShadow: "0 8px 24px rgba(44, 24, 16, 0.08)",
                        mt: 0.5,
                      },
                    },
                  },
                }}
              >
                {availableLanguages.map((lang) => (
                  <MenuItem
                    key={lang}
                    value={lang}
                    sx={{ fontFamily: FONTS.OUTFIT, fontSize: "13px" }}
                  >
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Interactive Payment Option Cards */}
          <Grid size={{ xs: 12 }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "12.5px",
                color: "#2C1810",
                mb: 0.75,
              }}
            >
              Payment Option
            </Typography>
            <Grid container spacing={1.25}>
              <Grid size={{ xs: 6 }}>
                <Box
                  onClick={() => setBookingForm({ ...bookingForm, paymentOption: "TOKEN" })}
                  sx={{
                    p: 1.2,
                    borderRadius: "12px",
                    border: "1.5px solid",
                    borderColor: bookingForm.paymentOption === "TOKEN" ? COLORS.PRIMARY : "#EFE6D5",
                    bgcolor: bookingForm.paymentOption === "TOKEN" ? "#FFF8F5" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    "&:hover": {
                      borderColor: bookingForm.paymentOption === "TOKEN" ? COLORS.PRIMARY : "#FFD4BC",
                      bgcolor: "#FFF8F5",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        fontSize: { xs: "12px", sm: "13px" },
                        color: bookingForm.paymentOption === "TOKEN" ? COLORS.PRIMARY : "#2C1810",
                      }}
                    >
                      Token Amount
                    </Typography>
                    <Radio
                      checked={bookingForm.paymentOption === "TOKEN"}
                      value="TOKEN"
                      size="small"
                      sx={{
                        p: 0,
                        color: "#CBD5E1",
                        "&.Mui-checked": { color: COLORS.PRIMARY },
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "10.5px",
                      color: "#7C6A60",
                      lineHeight: 1.2,
                    }}
                  >
                    Pay advance to confirm
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <Box
                  onClick={() => setBookingForm({ ...bookingForm, paymentOption: "FULL" })}
                  sx={{
                    p: 1.2,
                    borderRadius: "12px",
                    border: "1.5px solid",
                    borderColor: bookingForm.paymentOption === "FULL" ? COLORS.PRIMARY : "#EFE6D5",
                    bgcolor: bookingForm.paymentOption === "FULL" ? "#FFF8F5" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    "&:hover": {
                      borderColor: bookingForm.paymentOption === "FULL" ? COLORS.PRIMARY : "#FFD4BC",
                      bgcolor: "#FFF8F5",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        fontSize: { xs: "12px", sm: "13px" },
                        color: bookingForm.paymentOption === "FULL" ? COLORS.PRIMARY : "#2C1810",
                      }}
                    >
                      Full Payment
                    </Typography>
                    <Radio
                      checked={bookingForm.paymentOption === "FULL"}
                      value="FULL"
                      size="small"
                      sx={{
                        p: 0,
                        color: "#CBD5E1",
                        "&.Mui-checked": { color: COLORS.PRIMARY },
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "10.5px",
                      color: "#7C6A60",
                      lineHeight: 1.2,
                    }}
                  >
                    Pay 100% upfront
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Location Info Note (if offline service) */}
          {!service?.isOnline && defaultAddr && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  bgcolor: "#FAF7F4",
                  p: 1,
                  borderRadius: "10px",
                  border: "1px solid #EFE6D5",
                }}
              >
                <LocationOnIcon sx={{ fontSize: 16, color: COLORS.PRIMARY, flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "11px",
                    color: "#7C6A60",
                    lineHeight: 1.3,
                  }}
                >
                  Pooja Address: <strong>{defaultAddr.city || defaultAddr.addressLine1 || "Registered Address"}{defaultAddr.state ? `, ${defaultAddr.state}` : ""}</strong>
                </Typography>
              </Box>
            </Grid>
          )}

          {/* Special Instructions */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              label="Special Instructions (Optional)"
              placeholder="Any special requests or rituals..."
              value={bookingForm.specialInstructions}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  specialInstructions: e.target.value,
                })
              }
              slotProps={{
                inputLabel: {
                  sx: { fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "12.5px" },
                },
                input: {
                  sx: { fontFamily: FONTS.OUTFIT, fontSize: "13px" },
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          disabled={submitting}
          sx={{
            mt: 2,
            background: COLORS.PRIMARY,
            color: "white",
            textTransform: "none",
            borderRadius: "20px",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "13.5px",
            py: 1.1,
            boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
            "&:hover": {
              background: COLORS.PRIMARY_DARK,
              boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
            },
          }}
        >
          {submitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </Box>
    </Modal>
  );
}
