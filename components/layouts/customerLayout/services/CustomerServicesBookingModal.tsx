"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
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

  const serviceCityNamesText = useMemo(() => {
    if (!serviceCities || serviceCities.length === 0) return "";
    return serviceCities.map((c) => c.name).join(", ");
  }, [serviceCities]);

  const isGlobal =
    service?.isGlobal === true ||
    !serviceCities ||
    serviceCities.length === 0;

  const isAddressCityCoveredForOffline = useMemo(() => {
    if (isGlobal) return true;
    if (!service?.isOffline) return false;
    if (!defaultAddr) return false;
    return serviceCities.some((sc) => checkCityMatch(defaultAddr, sc));
  }, [isGlobal, service?.isOffline, serviceCities, defaultAddr]);

  const isOnlineAllowed = isGlobal || service?.isOnline !== false;
  const isOfflineAllowed =
    isGlobal || (service?.isOffline === true && isAddressCityCoveredForOffline);
  const isBothAllowed = isOnlineAllowed && isOfflineAllowed;
  const isSingleMode = !isBothAllowed;

  const currentBookingMode =
    isSingleMode
      ? isOnlineAllowed
        ? "ONLINE"
        : isOfflineAllowed
          ? "OFFLINE"
          : ""
      : bookingForm.bookingMode || (isOfflineAllowed ? "OFFLINE" : "ONLINE");

  useEffect(() => {
    if (!isOfflineAllowed && isOnlineAllowed && bookingForm.bookingMode !== "ONLINE") {
      setBookingForm((prev: any) => ({ ...prev, bookingMode: "ONLINE" }));
    } else if (isOfflineAllowed && !isOnlineAllowed && bookingForm.bookingMode !== "OFFLINE") {
      setBookingForm((prev: any) => ({ ...prev, bookingMode: "OFFLINE" }));
    }
  }, [isOfflineAllowed, isOnlineAllowed, bookingForm.bookingMode, setBookingForm]);

  const now = new Date();
  const minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const max = new Date(now);
  max.setMonth(max.getMonth() + 6);
  const maxDate = new Date(max.getTime() - max.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 500 },
          bgcolor: "background.paper",
          borderRadius: "12px",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflowY: "auto",
          "& .MuiOutlinedInput-root.Mui-focused fieldset": {
            borderColor: COLORS.PRIMARY,
          },
          "& .MuiInputLabel-root.Mui-focused": { color: COLORS.PRIMARY },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: FONTS.PRIMARY, fontWeight: 700 }}
          >
            Book Service
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Scheduled Date & Time"
              value={bookingForm.scheduledAt}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  scheduledAt: e.target.value,
                })
              }
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: minDate, max: maxDate },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth disabled={isSingleMode}>
              <InputLabel>Booking Mode</InputLabel>
              <Select
                value={currentBookingMode}
                label="Booking Mode"
                disabled={isSingleMode}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    bookingMode: e.target.value,
                  })
                }
              >
                {isOnlineAllowed && (
                  <MenuItem value="ONLINE">Online</MenuItem>
                )}
                {isOfflineAllowed && (
                  <MenuItem value="OFFLINE">Offline</MenuItem>
                )}
              </Select>
              {isSingleMode && (
                <FormHelperText>
                  {service?.isOffline && !isAddressCityCoveredForOffline ? (
                    <>
                      Offline mode is only available in {serviceCityNamesText}. Your address is in {defaultAddr?.city || "another city"}, so only Online mode is available.
                    </>
                  ) : (
                    `Available in ${isOnlineAllowed ? "Online" : "Offline"} mode only`
                  )}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Language"
              placeholder="e.g. Hindi, Sanskrit"
              value={bookingForm.language}
              onChange={(e) =>
                setBookingForm({ ...bookingForm, language: e.target.value })
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#2C1810",
                  mb: 0.5,
                  "&.Mui-focused": { color: COLORS.PRIMARY },
                }}
              >
                Payment Option
              </FormLabel>
              <RadioGroup
                row
                name="paymentOption"
                value={bookingForm.paymentOption || "TOKEN"}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    paymentOption: e.target.value,
                  })
                }
              >
                <FormControlLabel
                  value="TOKEN"
                  control={
                    <Radio
                      sx={{
                        color: COLORS.PRIMARY,
                        "&.Mui-checked": { color: COLORS.PRIMARY },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2C1810",
                      }}
                    >
                      Token Amount
                    </Typography>
                  }
                  sx={{ mr: 3 }}
                />
                <FormControlLabel
                  value="FULL"
                  control={
                    <Radio
                      sx={{
                        color: COLORS.PRIMARY,
                        "&.Mui-checked": { color: COLORS.PRIMARY },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#2C1810",
                      }}
                    >
                      Full Payment
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Instructions"
              placeholder="Any special requirements..."
              value={bookingForm.specialInstructions}
              onChange={(e) =>
                setBookingForm({
                  ...bookingForm,
                  specialInstructions: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          fullWidth
          onClick={onSubmit}
          disabled={submitting}
          sx={{
            mt: 4,
            background: COLORS.PRIMARY,
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            py: 1.5,
            "&:hover": { background: COLORS.PRIMARY_DARK },
          }}
        >
          {submitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirm Booking"
          )}
        </Button>
      </Box>
    </Modal>
  );
}

