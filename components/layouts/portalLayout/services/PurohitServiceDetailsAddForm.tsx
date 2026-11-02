"use client";

import { addPurohitServiceAPI } from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { getPurohitPayoutRange } from "@/utils/payoutHelper";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
  const userProfile = useUserStore((state) => state.profile);
  const [submitting, setSubmitting] = useState(false);

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
      "This ceremony is Online Only, but Online Puja is disabled in your profile.";
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
        onAddedSuccess();
      } else {
        showSnackbar(res.message || "Failed to add service", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error adding service",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const defaultPriceDisplay = getPurohitPayoutRange(service);

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
      <Grid container spacing={5} sx={{ alignItems: "center" }}>
        {/* Left Column: Heading & Description */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: COLORS.PRIMARY,
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            {isAlreadyAdded ? "SERVICE STATUS" : "ADD TO MY SERVICES"}
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: COLORS.DARK,
              fontSize: { xs: "26px", sm: "32px", md: "36px" },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            {isAlreadyAdded
              ? "Service Active in Profile"
              : `Add ${service.name} to Profile`}
          </Typography>

          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: COLORS.MUTED_TEXT,
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: 480,
            }}
          >
            {isAlreadyAdded
              ? "This service is currently listed and active under your purohit account. Customers in your default service area can book you directly."
              : "Click the confirm button below to instantly add this service to your purohit profile and start accepting booking requests."}
          </Typography>
        </Grid>

        {/* Right Column: Status Box or Confirm Action */}
        <Grid size={{ xs: 12, md: 6 }}>
          {isAlreadyAdded ? (
            <Box
              sx={{
                p: 4,
                borderRadius: "16px",
                bgcolor: COLORS.WHITE,
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
                  fontFamily: FONTS.PRIMARY,
                  color: COLORS.MUTED_TEXT,
                  fontSize: "14px",
                }}
              >
                You can manage your availability and active status for this
                service from your services dashboard.
              </Typography>
              <Button
                variant="contained"
                onClick={() => router.push("/partner/my-services")}
                sx={{
                  background: `${COLORS.PRIMARY} !important`,
                  color: `${COLORS.WHITE} !important`,
                  borderRadius: "30px",
                  fontWeight: 700,
                  textTransform: "none",
                  fontFamily: FONTS.PRIMARY,
                  px: 4,
                  py: 1.2,
                  "&:hover": { background: `${COLORS.PRIMARY_DARK} !important` },
                }}
              >
                Go to My Services
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                p: { xs: 3, sm: 4 },
                bgcolor: COLORS.WHITE,
                borderRadius: "20px",
                border: "1px solid #EADCCF",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  pb: 2,
                  borderBottom: "1px dashed #EADCCF",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ESTIMATED PAYOUT
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#16a34a",
                      fontSize: "18px",
                      fontFamily: FONTS.PRIMARY,
                    }}
                  >
                    {defaultPriceDisplay}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", ml: "auto" }}>
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    DURATION
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: COLORS.SLATE_DARK,
                      fontSize: "18px",
                      fontFamily: FONTS.PRIMARY,
                    }}
                  >
                    {service?.durationMinutes || 60} mins
                  </Typography>
                </Box>
              </Box>

              {isModeRestricted ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      bgcolor: "#fff7ed",
                      border: "1px solid #fed7aa",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontSize: "13px",
                        color: "#9a3412",
                        fontWeight: 600,
                        lineHeight: 1.5,
                        mb: 1,
                      }}
                    >
                      ⚠️ {modeRestrictionMessage}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push("/partner/profile?tab=skills")}
                      sx={{
                        color: COLORS.PRIMARY,
                        borderColor: COLORS.PRIMARY,
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontFamily: FONTS.PRIMARY,
                        "&:hover": {
                          borderColor: COLORS.PRIMARY_DARK,
                          bgcolor: "#ffedd5",
                        },
                      }}
                    >
                      Update Profile Skills
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
                    disabled={true}
                    sx={{
                      bgcolor: "#e2e8f0 !important",
                      color: "#94a3b8 !important",
                      fontWeight: 800,
                      fontSize: "15px",
                      py: 1.6,
                      borderRadius: "30px",
                      textTransform: "none",
                      fontFamily: FONTS.PRIMARY,
                    }}
                  >
                    Service Mode Not Available in Profile
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleAddService}
                  disabled={submitting}
                  startIcon={
                    !submitting ? (
                      <AddIcon sx={{ color: `${COLORS.WHITE} !important` }} />
                    ) : null
                  }
                  sx={{
                    bgcolor: `${COLORS.PRIMARY} !important`,
                    color: `${COLORS.WHITE} !important`,
                    fontWeight: 800,
                    fontSize: "16px",
                    py: 1.6,
                    borderRadius: "30px",
                    textTransform: "none",
                    fontFamily: FONTS.PRIMARY,
                    boxShadow: "0 8px 24px rgba(255, 98, 0, 0.25)",
                    "&:hover": {
                      bgcolor: `${COLORS.PRIMARY_DARK} !important`,
                    },
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Confirm & Add Service to Profile"
                  )}
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
