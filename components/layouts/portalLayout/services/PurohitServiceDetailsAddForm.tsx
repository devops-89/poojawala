"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { addPurohitServiceAPI } from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useRouter } from "next/navigation";

interface Props {
  service: any;
  isAlreadyAdded: boolean;
  onAddedSuccess: () => void;
}

export default function PurohitServiceDetailsAddForm({
  service,
  isAlreadyAdded,
  onAddedSuccess,
}: Props) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [onlinePrice, setOnlinePrice] = useState(
    service?.minPrice ? String(service.minPrice) : ""
  );
  const [offlinePrice, setOfflinePrice] = useState(
    service?.minPrice ? String(service.minPrice) : ""
  );
  const [isOnline, setIsOnline] = useState(true);
  const [isOffline, setIsOffline] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(
    service?.durationMinutes ? String(service.durationMinutes) : "60"
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!durationMinutes) {
      showSnackbar("Please enter service duration", "error");
      return;
    }

    if (isOnline && !onlinePrice) {
      showSnackbar("Please enter online price", "error");
      return;
    }
    if (isOffline && !offlinePrice) {
      showSnackbar("Please enter offline price", "error");
      return;
    }
    if (!isOnline && !isOffline) {
      showSnackbar(
        "At least one ceremony mode (online/offline) must be supported",
        "error"
      );
      return;
    }

    try {
      setSubmitting(true);
      const payload = [
        {
          serviceId: service.id,
          onlinePrice: isOnline ? Number(onlinePrice) : null,
          offlinePrice: isOffline ? Number(offlinePrice) : null,
          isOnline,
          isOffline,
          durationMinutes: Number(durationMinutes),
        },
      ];

      const res = await addPurohitServiceAPI(payload);
      if (res.success) {
        showSnackbar("Service added to your profile successfully!", "success");
        onAddedSuccess();
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

  return (
    <Paper
      id="purohit-add-form-section"
      elevation={0}
      sx={{
        bgcolor: "#FFFBF7",
        border: "1px solid #EADCCF",
        borderRadius: "24px",
        p: { xs: 3, sm: 4, md: 5 },
        mt: 4,
        mb: 6,
        scrollMarginTop: "100px",
      }}
    >
      <Grid container spacing={5} sx={{ alignItems: "flex-start" }}>
        {/* Left Column: Heading & Description */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "#C84B16",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            {isAlreadyAdded ? "SERVICE STATUS" : "ADD TO MY SERVICES"}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "28px", sm: "36px", md: "40px" },
              lineHeight: 1.2,
              mb: 2.5,
            }}
          >
            {isAlreadyAdded
              ? "Service Active in Profile"
              : `Configure ${service.name}`}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: 440,
            }}
          >
            {isAlreadyAdded
              ? "This service is currently listed and active under your purohit account. Customers in your default service area can book you directly."
              : "Specify your pricing, supported ceremony modes, and duration to list this service under your purohit account."}
          </Typography>
        </Grid>

        {/* Right Column: Form or Status Box */}
        <Grid size={{ xs: 12, md: 7 }}>
          {isAlreadyAdded ? (
            <Box
              sx={{
                p: 4,
                borderRadius: "16px",
                bgcolor: "#FFFFFF",
                border: "1px solid #EADCCF",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                alignItems: "flex-start",
              }}
            >
              <Chip
                icon={<CheckCircleIcon style={{ color: "#16a34a" }} />}
                label="Active in Your Services"
                sx={{
                  bgcolor: "#f0fdf4",
                  color: "#16a34a",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  py: 2.5,
                  px: 1.5,
                  borderRadius: "12px",
                  border: "1px solid #bbf7d0",
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#64534A",
                  fontSize: "14px",
                }}
              >
                You can manage your pricing, availability, and active status for this service from your services dashboard.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/purohit/my-services")}
                sx={{
                  background: "#C84B16 !important",
                  color: "white !important",
                  borderRadius: "30px",
                  fontWeight: 700,
                  textTransform: "none",
                  fontFamily: '"DM Sans", sans-serif',
                  px: 4,
                  py: 1.2,
                  "&:hover": { background: "#A0380E !important" },
                }}
              >
                Go to My Services
              </Button>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {/* Row 1: Online / Offline Mode Switches */}
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #EADCCF",
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isOnline}
                      onChange={(e) => setIsOnline(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#C84B16" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#C84B16",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#2C1810",
                      }}
                    >
                      Supports Online Ceremony
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isOffline}
                      onChange={(e) => setIsOffline(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": { color: "#C84B16" },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#C84B16",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#2C1810",
                      }}
                    >
                      Supports Offline Ceremony
                    </Typography>
                  }
                />
              </Box>

              {/* Row 2: Prices */}
              <Grid container spacing={2}>
                {isOnline && (
                  <Grid size={{ xs: 12, sm: isOffline ? 6 : 12 }}>
                    <TextField
                      fullWidth
                      label="Online Price (₹)"
                      type="number"
                      value={onlinePrice}
                      onChange={(e) => setOnlinePrice(e.target.value)}
                      helperText={`Suggested range: ₹${service?.minPrice || 0} - ₹${service?.maxPrice || 0}`}
                      sx={{
                        bgcolor: "#FFFBF7",
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontFamily: '"DM Sans", sans-serif',
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#64534A",
                        },
                      }}
                    />
                  </Grid>
                )}

                {isOffline && (
                  <Grid size={{ xs: 12, sm: isOnline ? 6 : 12 }}>
                    <TextField
                      fullWidth
                      label="Offline Price (₹)"
                      type="number"
                      value={offlinePrice}
                      onChange={(e) => setOfflinePrice(e.target.value)}
                      helperText={`Suggested range: ₹${service?.minPrice || 0} - ₹${service?.maxPrice || 0}`}
                      sx={{
                        bgcolor: "#FFFBF7",
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontFamily: '"DM Sans", sans-serif',
                        },
                        "& .MuiInputLabel-root": {
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#64534A",
                        },
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Row 3: Duration */}
              <TextField
                fullWidth
                label="Duration (Minutes)"
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                helperText={`Standard duration: ${service?.durationMinutes || 60} minutes`}
                required
                sx={{
                  bgcolor: "#FFFBF7",
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontFamily: '"DM Sans", sans-serif',
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#64534A",
                  },
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || (!isOnline && !isOffline) || !durationMinutes}
                sx={{
                  bgcolor: "#C84B16 !important",
                  color: "#FFFFFF !important",
                  fontWeight: 800,
                  fontSize: "16px",
                  py: 1.8,
                  borderRadius: "30px",
                  textTransform: "none",
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: "0 8px 24px rgba(200, 75, 22, 0.25)",
                  "&:hover": {
                    bgcolor: "#A0380E !important",
                  },
                }}
              >
                {submitting ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Confirm & Add Service to Profile"
                )}
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
