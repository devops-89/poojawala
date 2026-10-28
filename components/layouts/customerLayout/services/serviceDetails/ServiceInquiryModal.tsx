"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
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

const getMinDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

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
  const [minDateTime, setMinDateTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    subject?: string;
    preferredDateTime?: string;
    address?: string;
    message?: string;
  }>({});

  useEffect(() => {
    if (open) {
      setMinDateTime(getMinDateTime());
      const planSuffix = planName
        ? ` (${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan)`
        : "";
      setSubject(serviceName ? `Inquiry for ${serviceName}${planSuffix}` : "");
      setMessage("");
      setPreferredDateTime("");
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
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            p: { xs: 1, sm: 2 },
            bgcolor: "#FFFFFF",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.15)",
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
          pb: 1.5,
          pt: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              bgcolor: "rgba(255, 98, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.PRIMARY,
            }}
          >
            <HelpOutlinedIcon fontSize="medium" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                color: "#1e293b",
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              Get Service Inquiry
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: "#64748b",
                fontSize: "12.5px",
              }}
            >
              Send your questions or custom requirements to our team
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          disabled={submitting}
          size="small"
          sx={{
            color: "#94a3b8",
            "&:hover": { bgcolor: "#f1f5f9", color: "#334155" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Row 1: Name and Email (Prefilled from Profile) */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
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
                    inputLabel: { required: true },
                    input: {
                      startAdornment: (
                        <PersonIcon
                          sx={{
                            color: "#94a3b8",
                            fontSize: 20,
                            mr: 1,
                          }}
                        />
                      ),
                    },
                  }}
                  sx={{
                    bgcolor: "#FFFDF9",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.PRIMARY,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
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
                    inputLabel: { required: true },
                    input: {
                      startAdornment: (
                        <EmailIcon
                          sx={{
                            color: "#94a3b8",
                            fontSize: 20,
                            mr: 1,
                          }}
                        />
                      ),
                    },
                  }}
                  sx={{
                    bgcolor: "#FFFDF9",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.PRIMARY,
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Row 2: Subject */}
            <TextField
              required
              fullWidth
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
                inputLabel: { required: true },
              }}
              sx={{
                bgcolor: "#FFFDF9",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontFamily: FONTS.PRIMARY,
                },
                "& .MuiInputLabel-root": {
                  fontFamily: FONTS.PRIMARY,
                },
              }}
            />

            {/* Row 3: Preferred Date & Time + Address */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Preferred Date & Time"
                  type="datetime-local"
                  value={preferredDateTime}
                  onChange={(e) => {
                    setPreferredDateTime(e.target.value);
                    if (errors.preferredDateTime)
                      setErrors((prev) => ({
                        ...prev,
                        preferredDateTime: undefined,
                      }));
                  }}
                  error={Boolean(errors.preferredDateTime)}
                  helperText={
                    errors.preferredDateTime ||
                    "Select future pooja date & time"
                  }
                  disabled={submitting}
                  slotProps={{
                    inputLabel: { shrink: true, required: true },
                    htmlInput: { min: minDateTime },
                    input: {
                      startAdornment: (
                        <CalendarMonthIcon
                          sx={{
                            color: "#94a3b8",
                            fontSize: 20,
                            mr: 1,
                          }}
                        />
                      ),
                    },
                  }}
                  sx={{
                    bgcolor: "#FFFDF9",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.PRIMARY,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Address / Venue"
                  placeholder="e.g. Flat 301, Palm Grove Apts, Whitefield, Bangalore"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address)
                      setErrors((prev) => ({ ...prev, address: undefined }));
                  }}
                  error={Boolean(errors.address)}
                  helperText={
                    errors.address || "Pooja venue or residential address"
                  }
                  disabled={submitting}
                  slotProps={{
                    inputLabel: { required: true },
                    input: {
                      startAdornment: (
                        <LocationOnIcon
                          sx={{
                            color: "#94a3b8",
                            fontSize: 20,
                            mr: 1,
                          }}
                        />
                      ),
                    },
                  }}
                  sx={{
                    bgcolor: "#FFFDF9",
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontFamily: FONTS.PRIMARY,
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: FONTS.PRIMARY,
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Row 4: Message */}
            <TextField
              required
              fullWidth
              multiline
              rows={4}
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
                inputLabel: { required: true },
              }}
              sx={{
                bgcolor: "#FFFDF9",
                borderRadius: "10px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  fontFamily: FONTS.PRIMARY,
                },
                "& .MuiInputLabel-root": {
                  fontFamily: FONTS.PRIMARY,
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, gap: 1.5 }}>
          <Button
            onClick={onClose}
            disabled={submitting}
            sx={{
              color: "#64748b",
              fontFamily: FONTS.PRIMARY,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              "&:hover": { bgcolor: "#f1f5f9" },
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
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <SendIcon sx={{ fontSize: 18 }} />
              )
            }
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "white",
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 3.5,
              py: 1.2,
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.3)",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_DARK,
                boxShadow: "0 6px 18px rgba(255, 98, 0, 0.4)",
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
