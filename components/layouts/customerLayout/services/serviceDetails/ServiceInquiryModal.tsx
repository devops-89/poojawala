"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { submitContactFormAPI } from "@/api/userControllers";
import { getMeAPI } from "@/api/authControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

interface ServiceInquiryModalProps {
  open: boolean;
  onClose: () => void;
  serviceId: number | string;
  serviceName?: string;
  planName?: string;
}

export default function ServiceInquiryModal({
  open,
  onClose,
  serviceId,
  serviceName,
  planName,
}: ServiceInquiryModalProps) {
  const { showSnackbar } = useSnackbarStore();
  const { profile, fetchProfile } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [preferredDateTime, setPreferredDateTime] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    preferredDateTime?: string;
    address?: string;
    message?: string;
  }>({});

  // Parse Date & Time from preferredDateTime
  const selectedDate = useMemo(() => {
    if (!preferredDateTime) return "";
    const m = moment(preferredDateTime);
    return m.isValid() ? m.format("YYYY-MM-DD") : "";
  }, [preferredDateTime]);

  const selectedTime = useMemo(() => {
    if (!preferredDateTime) return "10:00";
    const m = moment(preferredDateTime);
    return m.isValid() ? m.format("HH:mm") : "10:00";
  }, [preferredDateTime]);

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
        const isPast = isToday && slotMoment.isBefore(now.clone().add(2, "hours"));

        slots.push({ value: timeVal, label, disabled: isPast });
      }
    }
    return slots;
  }, [selectedDate]);

  const handleDateChange = (newDateStr: string) => {
    if (newDateStr) {
      const timeToUse = selectedTime || "10:00";
      const combined = moment(`${newDateStr} ${timeToUse}`, "YYYY-MM-DD HH:mm");
      setPreferredDateTime(combined.toISOString());
    } else {
      setPreferredDateTime("");
    }
    if (errors.preferredDateTime) {
      setErrors((prev) => ({ ...prev, preferredDateTime: undefined }));
    }
  };

  const handleTimeChange = (newTimeStr: string) => {
    const dateToUse = selectedDate || moment().add(1, "day").format("YYYY-MM-DD");
    const combined = moment(`${dateToUse} ${newTimeStr}`, "YYYY-MM-DD HH:mm");
    setPreferredDateTime(combined.toISOString());
    if (errors.preferredDateTime) {
      setErrors((prev) => ({ ...prev, preferredDateTime: undefined }));
    }
  };

  useEffect(() => {
    if (open) {
      const planSuffix = planName
        ? ` (${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan)`
        : "";
      setSubject(serviceName ? `Inquiry for ${serviceName}${planSuffix}` : "");
      setMessage("");
      // Default to tomorrow 10:00 AM
      const defaultSlot = moment().add(1, "day").set({ hour: 10, minute: 0, second: 0 });
      setPreferredDateTime(defaultSlot.toISOString());
      setAddress("");
      setErrors({});

      // Fetch user profile to prefill name, email, and address
      const loadUser = async () => {
        let u: any = profile;
        if (!u || (!u.firstName && !u.name)) {
          try {
            u = await fetchProfile(true);
          } catch (e) {}
        }
        if (!u || (!u.firstName && !u.name)) {
          try {
            const meRes = await getMeAPI();
            u = meRes?.data?.user || meRes?.data?.data || meRes?.data;
          } catch (e) {}
        }
        if (!u && typeof window !== "undefined") {
          try {
            const stored = sessionStorage.getItem("user");
            if (stored) u = JSON.parse(stored);
          } catch (e) {}
        }

        const fName = u?.firstName || "";
        const lName = u?.lastName || "";
        const fullName =
          [fName, lName].filter(Boolean).join(" ").trim() ||
          u?.name ||
          u?.username ||
          "";
        const userEmail = u?.email || "";

        setName(fullName);
        setEmail(userEmail);

        // Prefill address from user addresses if available
        if (Array.isArray(u?.addresses) && u.addresses.length > 0) {
          const addr = u.addresses.find((a: any) => a.isDefault) || u.addresses[0];
          if (addr) {
            const formatted = [
              addr.addressLine1 || addr.address || addr.flatNo || addr.houseNo,
              addr.addressLine2 || addr.street || addr.area,
              addr.landmark,
              addr.city,
              addr.state,
              addr.pincode || addr.postalCode,
            ]
              .filter(Boolean)
              .join(", ");
            if (formatted) setAddress(formatted);
          }
        } else if (u?.address && typeof u.address === "string") {
          setAddress(u.address);
        }
      };

      loadUser();
    }
  }, [open, serviceName, planName]);

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      subject?: string;
      preferredDateTime?: string;
      address?: string;
      message?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Full Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (subject.trim().length < 4) {
      newErrors.subject = "Subject must be at least 4 characters";
    }

    if (!preferredDateTime) {
      newErrors.preferredDateTime = "Preferred Date & Time is required";
    } else {
      const selected = new Date(preferredDateTime).getTime();
      const now = new Date().getTime();
      if (isNaN(selected)) {
        newErrors.preferredDateTime = "Please enter a valid date and time";
      } else if (selected < now - 60000) {
        newErrors.preferredDateTime = "Date & time cannot be in the past";
      }
    }

    if (!address.trim()) {
      newErrors.address = "Address / Venue is required";
    } else if (address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        serviceId: String(serviceId),
        preferredDateTime: new Date(preferredDateTime).toISOString(),
        address: address.trim(),
      };

      const res = await submitContactFormAPI(payload);

      if (
        res?.success ||
        res?.data ||
        res?.statusCode === 200 ||
        res?.statusCode === 201
      ) {
        showSnackbar(
          res?.message ||
            "Inquiry submitted successfully! Our team will get back to you shortly.",
          "success"
        );
        onClose();
      } else {
        showSnackbar(res?.message || "Failed to submit inquiry", "error");
      }
    } catch (err: any) {
      console.error("Error submitting service inquiry:", err);
      showSnackbar(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit inquiry",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            border: "1.5px solid #EFE6D5",
            p: { xs: 1.5, sm: 2 },
            bgcolor: "#FFFFFF",
            boxShadow: "0 20px 50px rgba(44, 24, 16, 0.16)",
            maxHeight: "92vh",
          },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1.25,
          pt: 0.5,
          borderBottom: "1px dashed #EFE6D5",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "#FFF0E6",
              border: "1px solid #FFD4BC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.PRIMARY,
              flexShrink: 0,
            }}
          >
            <HelpOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
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
            Get Service Inquiry
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          disabled={submitting}
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
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ pt: 1.5, pb: 1.5, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {/* Row 1: Name and Email */}
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Full Name"
                  placeholder="e.g. Rohan Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  disabled={submitting}
                  slotProps={{
                    inputLabel: {
                      required: true,
                      sx: { fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" },
                    },
                    input: {
                      startAdornment: (
                        <PersonIcon
                          sx={{
                            color: "#8A7A70",
                            fontSize: 18,
                            mr: 0.75,
                          }}
                        />
                      ),
                      sx: {
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "13px",
                        borderRadius: "12px",
                        bgcolor: "#FFFFFF",
                        "& fieldset": { borderColor: "#EFE6D5" },
                        "&:hover fieldset": { borderColor: "#FFD4BC" },
                        "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                      },
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Email Address"
                  placeholder="e.g. rohan@yopmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  disabled={submitting}
                  slotProps={{
                    inputLabel: {
                      required: true,
                      sx: { fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" },
                    },
                    input: {
                      startAdornment: (
                        <EmailIcon
                          sx={{
                            color: "#8A7A70",
                            fontSize: 18,
                            mr: 0.75,
                          }}
                        />
                      ),
                      sx: {
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "13px",
                        borderRadius: "12px",
                        bgcolor: "#FFFFFF",
                        "& fieldset": { borderColor: "#EFE6D5" },
                        "&:hover fieldset": { borderColor: "#FFD4BC" },
                        "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Row 2: Subject */}
            <TextField
              required
              fullWidth
              size="small"
              label="Subject"
              placeholder="e.g., Satyanarayan Pooja Booking Inquiry"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject)
                  setErrors((prev) => ({ ...prev, subject: undefined }));
              }}
              error={Boolean(errors.subject)}
              helperText={errors.subject}
              disabled={submitting}
              slotProps={{
                inputLabel: {
                  required: true,
                  sx: { fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" },
                },
                input: {
                  sx: {
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "13px",
                    borderRadius: "12px",
                    bgcolor: "#FFFFFF",
                    "& fieldset": { borderColor: "#EFE6D5" },
                    "&:hover fieldset": { borderColor: "#FFD4BC" },
                    "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                  },
                },
              }}
            />

            {/* Preferred Date & Preferred Time: Side-by-Side on Desktop, Stacked on Mobile */}
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Preferred Date *"
                    format="DD/MM/YYYY"
                    value={selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null}
                    disablePast
                    minDate={moment()}
                    maxDate={moment().add(6, "months")}
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
                        error: Boolean(errors.preferredDateTime),
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

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel
                    id="inquiry-modal-time-label"
                    sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" }}
                  >
                    Preferred Time *
                  </InputLabel>
                  <Select
                    labelId="inquiry-modal-time-label"
                    label="Preferred Time *"
                    value={selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "13px",
                      color: "#2C1810",
                      borderRadius: "12px",
                      bgcolor: "#FFFFFF",
                      "& fieldset": { borderColor: "#EFE6D5" },
                      "&:hover fieldset": { borderColor: "#FFD4BC" },
                      "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
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
            </Grid>

            {/* Row 4: Address / Venue */}
            <TextField
              required
              fullWidth
              size="small"
              label="Address / Venue"
              placeholder="e.g. Flat 301, Palm Grove Apts, Whitefield, Bangalore"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (errors.address)
                  setErrors((prev) => ({ ...prev, address: undefined }));
              }}
              error={Boolean(errors.address)}
              helperText={errors.address}
              disabled={submitting}
              slotProps={{
                inputLabel: {
                  required: true,
                  sx: { fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" },
                },
                input: {
                  startAdornment: (
                    <LocationOnIcon
                      sx={{
                        color: "#8A7A70",
                        fontSize: 18,
                        mr: 0.75,
                      }}
                    />
                  ),
                  sx: {
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "13px",
                    borderRadius: "12px",
                    bgcolor: "#FFFFFF",
                    "& fieldset": { borderColor: "#EFE6D5" },
                    "&:hover fieldset": { borderColor: "#FFD4BC" },
                    "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                  },
                },
              }}
            />

            {/* Row 5: Message */}
            <TextField
              required
              fullWidth
              size="small"
              multiline
              rows={2.5}
              label="Your Message"
              placeholder="Looking to book pooja for housewarming ceremony, muhurat details, pandit requirements..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message)
                  setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              error={Boolean(errors.message)}
              helperText={errors.message}
              disabled={submitting}
              slotProps={{
                inputLabel: {
                  required: true,
                  sx: { fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#7C6A60", fontSize: "13px" },
                },
                input: {
                  sx: {
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "13px",
                    borderRadius: "12px",
                    bgcolor: "#FFFFFF",
                    "& fieldset": { borderColor: "#EFE6D5" },
                    "&:hover fieldset": { borderColor: "#FFD4BC" },
                    "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                  },
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, pt: 0.5, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={submitting}
            sx={{
              color: "#7C6A60",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "20px",
              px: 2.5,
              fontSize: "13px",
              "&:hover": { bgcolor: "#FAF7F4", color: "#2C1810" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            startIcon={
              submitting ? (
                <CircularProgress size={16} sx={{ color: "white" }} />
              ) : (
                <SendIcon sx={{ fontSize: 16 }} />
              )
            }
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "white",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "13.5px",
              textTransform: "none",
              borderRadius: "20px",
              px: 3,
              py: 0.85,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_DARK,
                boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
              },
            }}
          >
            {submitting ? "Submitting..." : "Send Inquiry"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
