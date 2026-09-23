"use client";
import { customerCreateBookingAPI } from "@/api/bookingControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  serviceId: number;
}

export default function ServiceDetailsBookingForm({ serviceId }: Props) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const profile = useUserStore((state) => state.profile);

  const todayStr = new Date().toISOString().split("T")[0];

  // Initial state empty as requested
  const [bookingForm, setBookingForm] = useState({
    scheduledDate: "",
    scheduledTime: "",
    bookingMode: "OFFLINE",
    language: "",
    members: "",
    specialInstructions: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingForm.scheduledDate || !bookingForm.scheduledTime) {
      showSnackbar("Please select both scheduled date and time", "error");
      return;
    }

    setSubmitting(true);
    try {
      let customerAddressId = null;
      const currentProfile = useUserStore.getState().profile;
      const userObj = currentProfile?.data || currentProfile;
      const addresses = userObj?.addresses || profile?.addresses || [];

      if (addresses.length > 0) {
        // Send customerAddressId specifically where isDefault is true
        const defaultAddr = addresses.find(
          (a: any) => a.isDefault === true || a.isDefault === "true"
        );
        if (defaultAddr) {
          customerAddressId = defaultAddr.id;
        } else {
          customerAddressId = addresses[0].id;
        }
      }

      if (!customerAddressId && bookingForm.bookingMode === "OFFLINE") {
        showSnackbar(
          "No address found. Please add an address in your profile first.",
          "error"
        );
        setSubmitting(false);
        return;
      }

      const timeFormatted =
        bookingForm.scheduledTime.length === 5
          ? `${bookingForm.scheduledTime}:00`
          : bookingForm.scheduledTime;
      const scheduledAtIso = `${bookingForm.scheduledDate}T${timeFormatted}.000Z`;

      const payload = {
        serviceId: Number(serviceId),
        customerAddressId: customerAddressId,
        scheduledAt: scheduledAtIso,
        specialInstructions: bookingForm.specialInstructions,
        bookingMode: bookingForm.bookingMode || "OFFLINE",
        customFields: {
          language: bookingForm.language || "Hindi",
          members: Number(bookingForm.members) || 1,
        },
      };

      const res = await customerCreateBookingAPI(payload);
      if (res.success || res.statusCode === 201) {
        showSnackbar("Pooja booking request created successfully!", "success");
        setBookingForm({
          scheduledDate: "",
          scheduledTime: "",
          bookingMode: "OFFLINE",
          language: "",
          members: "",
          specialInstructions: "",
        });
        router.push("/customer/bookings");
      } else {
        showSnackbar(res.message || "Failed to create booking request", "error");
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to create booking request",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      id="booking-form-section"
      elevation={0}
      sx={{
        bgcolor: "#FAF4EE",
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
            BOOK YOUR POOJA
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
            Fill in your details to reserve
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
            Share your preferred date, time, and requirements. We'll confirm your
            booking within 24 hours — no advance payment needed.
          </Typography>
        </Grid>

        {/* Right Column: Form */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box
            component="form"
            onSubmit={handleConfirmBooking}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Row 1: Scheduled Date & Preferred Time */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Scheduled Date"
                  type="date"
                  value={bookingForm.scheduledDate}
                  onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { min: todayStr },
                  }}
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
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Preferred Time"
                  type="time"
                  value={bookingForm.scheduledTime}
                  onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                  slotProps={{ inputLabel: { shrink: true } }}
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
              </Grid>
            </Grid>

            {/* Row 2: Booking Mode & Preferred Language */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth sx={{ bgcolor: "#FFFBF7", borderRadius: "10px" }}>
                  <InputLabel
                    id="booking-mode-label"
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                    }}
                  >
                    Booking Mode
                  </InputLabel>
                  <Select
                    labelId="booking-mode-label"
                    label="Booking Mode"
                    value={bookingForm.bookingMode}
                    onChange={(e) => handleInputChange("bookingMode", e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    <MenuItem value="OFFLINE">Offline (In-Person / Home)</MenuItem>
                    <MenuItem value="ONLINE">Online (Virtual / Video Call)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                {/* Standard MUI floating label text input for Language */}
                <TextField
                  fullWidth
                  label="Preferred Language"
                  placeholder="e.g. Hindi, Sanskrit, English"
                  value={bookingForm.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
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
            </Grid>

            {/* Row 3: Number of Members (Standard floating label) */}
            <TextField
              fullWidth
              label="Number of Members"
              type="number"
              placeholder="e.g. 6"
              value={bookingForm.members}
              onChange={(e) => handleInputChange("members", e.target.value)}
              slotProps={{ htmlInput: { min: 1 } }}
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

            {/* Row 4: Special Instructions (Standard floating label) */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Instructions"
              placeholder="Any specific requirements, dietary preferences for Prasad, accessibility needs, or other details..."
              value={bookingForm.specialInstructions}
              onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
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
            <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    <CalendarMonthIcon />
                  )
                }
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  bgcolor: "#C84B16",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 6px 20px rgba(200, 75, 22, 0.3)",
                  "&:hover": {
                    bgcolor: "#FF6200",
                    boxShadow: "0 8px 25px rgba(200, 75, 22, 0.4)",
                  },
                }}
              >
                {submitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
