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
  IconButton,
  TextField,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
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
}

export default function ServiceInquiryModal({
  open,
  onClose,
  serviceId,
  serviceName,
}: ServiceInquiryModalProps) {
  const { showSnackbar } = useSnackbarStore();
  const { profile, fetchProfile } = useUserStore();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  useEffect(() => {
    if (open) {
      fetchProfile();
      setSubject("");
      setMessage("");
      setErrors({});
    }
  }, [open, fetchProfile]);

  // Extract logged in user data (directly from me API, profile or sessionStorage)
  const getUserData = async () => {
    let u: any = profile;
    if (!u || (!u.firstName && !u.name)) {
      try {
        const meRes = await getMeAPI();
        u = meRes?.data?.user || meRes?.data?.data || meRes?.data;
      } catch (e) {
        try {
          u = await fetchProfile(true);
        } catch (err) {}
      }
    }
    if (!u && typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("user");
        if (stored) u = JSON.parse(stored);
      } catch (e) {}
    }

    const firstName = u?.firstName || "";
    const lastName = u?.lastName || "";
    const name = [firstName, lastName].filter(Boolean).join(" ").trim() || u?.name || u?.username || "";
    const email = u?.email || "";
    return { name, firstName, lastName, email };
  };

  const validate = () => {
    const newErrors: { subject?: string; message?: string } = {};
    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (subject.trim().length < 4) {
      newErrors.subject = "Subject must be at least 4 characters";
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
      const userData = await getUserData();
      const payload: Record<string, any> = {
        name: userData.name,
        email: userData.email,
        serviceId: Number(serviceId) || serviceId,
        subject: subject.trim(),
        message: message.trim(),
      };

      const res = await submitContactFormAPI(payload);

      if (res?.success || res?.data || res?.statusCode === 200 || res?.statusCode === 201) {
        showSnackbar(
          res?.message || "Inquiry submitted successfully! Our team will get back to you shortly.",
          "success"
        );
        onClose();
      } else {
        showSnackbar(res?.message || "Failed to submit inquiry", "error");
      }
    } catch (err: any) {
      console.error("Error submitting service inquiry:", err);
      showSnackbar(
        err?.response?.data?.message || err?.message || "Failed to submit inquiry",
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
              width: 40,
              height: 40,
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
                fontSize: "12px",
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

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1, pb: 2 }}>
          {/* Form Fields: Only Subject and Message */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              label="Subject"
              placeholder="e.g., Custom Samagri request / Date inquiry / Pandit requirements"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }));
              }}
              error={Boolean(errors.subject)}
              helperText={errors.subject}
              disabled={submitting}
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

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Message"
              placeholder="Please describe your requirements, questions about muhurat, specific vidhi details, or any custom arrangements..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              error={Boolean(errors.message)}
              helperText={errors.message}
              disabled={submitting}
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

        <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1.5 }}>
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
