

"use client";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  FormControl,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { City, State } from "@/utils/indianLocations";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";

export default function WelcomeLocationModal() {
  const pathname = usePathname();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile } = useUserStore();

  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // States & Cities Data (only computed when modal is actually opened)
  const indianStates = React.useMemo(
    () => (open ? State.getStatesOfCountry("IN") || [] : []),
    [open],
  );

  const stateOptions = React.useMemo(() => {
    if (!open) return [];
    return indianStates.map((s) => s.name).sort((a, b) => a.localeCompare(b));
  }, [open, indianStates]);

  const selectedStateObj = React.useMemo(() => {
    if (!open || !selectedState) return null;
    return indianStates.find(
      (s) => s.name.toLowerCase().trim() === selectedState.toLowerCase().trim(),
    );
  }, [open, selectedState, indianStates]);

  const cityOptions = React.useMemo(() => {
    if (!open || !selectedStateObj) return [];
    const rawCities = City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
    const names = rawCities.map((c) => c.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [open, selectedStateObj]);

  useEffect(() => {
    // Only run on home route '/'
    if (pathname !== "/") {
      setOpen(false);
      return;
    }

    // If any user is logged in, do NOT show this welcome modal
    const token =
      sessionStorage.getItem("accessToken") ||
      localStorage.getItem("accessToken");
    const userStr =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    const role =
      sessionStorage.getItem("role") ||
      sessionStorage.getItem("activeRole") ||
      localStorage.getItem("role");

    if (profile || token || userStr || role) {
      setOpen(false);
      return;
    }

    const alreadyShown =
      sessionStorage.getItem("1pooja_welcome_modal_shown") ||
      sessionStorage.getItem("poojawala_welcome_modal_shown");
    if (alreadyShown) {
      setOpen(false);
      return;
    }

    // Smoothly show for fresh unauthenticated visitors
    const timer = setTimeout(() => {
      const currentToken =
        sessionStorage.getItem("accessToken") ||
        localStorage.getItem("accessToken");
      if (!currentToken && !useUserStore.getState().profile) {
        setOpen(true);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedState) {
      setFormError("Please select your State to continue");
      showSnackbar("Please select your State to continue", "warning");
      return;
    }
    if (!selectedCity) {
      setFormError("Please select your City to continue");
      showSnackbar("Please select your City to continue", "warning");
      return;
    }

    setFormError(null);
    setOpen(false);

    sessionStorage.setItem("1pooja_welcome_modal_shown", "true");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user_selected_state", selectedState);
      sessionStorage.setItem("user_selected_city", selectedCity);
      localStorage.setItem("user_selected_state", selectedState);
      localStorage.setItem("user_selected_city", selectedCity);
    }

    showSnackbar(`Location set to ${selectedCity}, ${selectedState}`, "success");
  };

  if (!open || profile) return null;

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        // Prevent closing via backdropClick or escapeKeyDown - filling is compulsory
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          return;
        }
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          bgcolor: "rgba(15, 23, 42, 0.55)",
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            bgcolor: "rgba(15, 23, 42, 0.55)",
          },
        },
        paper: {
          sx: {
            borderRadius: { xs: "20px", sm: "24px" },
            maxWidth: { xs: "92vw", sm: 440 },
            width: "100%",
            m: { xs: 2, sm: 3 },
            p: 0,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(44, 24, 16, 0.25)",
            border: "1px solid #FFE4D6",
          },
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: "24px 18px 22px", sm: "32px 28px 28px" },
          bgcolor: "#FFFDFB",
          position: "relative",
          background: "linear-gradient(180deg, #FFFDF9 0%, #FFF8F2 100%)",
        }}
      >
        {/* Branding & Logo */}
        <Box sx={{ textAlign: "center", mb: { xs: 2, sm: 2.5 } }}>
          <Image
            src="/images/1Poojalogo.webp"
            alt="1Pooja"
            width={116}
            height={47}
            priority
            style={{
              height: "36px",
              width: "auto",
              objectFit: "contain",
              margin: "0 auto 10px auto",
              display: "block",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1E293B",
              fontSize: { xs: "19px", sm: "22px" },
              letterSpacing: "-0.3px",
              mb: 0.8,
            }}
          >
            Welcome to 1Pooja
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: { xs: "12.5px", sm: "13.5px" },
              lineHeight: 1.5,
              maxWidth: 360,
              mx: "auto",
            }}
          >
            Your trusted platform for booking verified Pandits, authentic
            Samagri, and divine ceremonies tailored to your region.
          </Typography>
        </Box>

        {/* Location Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: { xs: 2, sm: 2.5 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* State Input */}
            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  mb: 0.6,
                }}
              >
                SELECT STATE <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
              </Typography>
              <FormControl fullWidth size="small">
                <Autocomplete
                  size="small"
                  openOnFocus
                  forcePopupIcon
                  options={stateOptions}
                  value={selectedState}
                  onChange={(_, newValue) => {
                    setSelectedState(newValue);
                    setSelectedCity(null);
                    setFormError(null);
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        zIndex: 1400,
                        "& .MuiPaper-root": {
                          borderRadius: "14px",
                          border: "1px solid #EFE6D5",
                          boxShadow: "0 10px 30px rgba(44, 24, 16, 0.12)",
                          fontFamily: FONTS.OUTFIT,
                          mt: 0.5,
                          "& .MuiAutocomplete-option": {
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "13.5px",
                            py: 1,
                            "&[aria-selected='true']": {
                              bgcolor: "#FFF3EB",
                              color: COLORS.PRIMARY,
                              fontWeight: 600,
                            },
                            "&:hover": {
                              bgcolor: "#FAF4EE",
                            },
                          },
                        },
                      },
                    },
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder="Select State"
                      autoComplete="off"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start" sx={{ mr: 0.5, ml: 0.5 }}>
                              <LocationOnIcon
                                sx={{ color: COLORS.PRIMARY, fontSize: 18 }}
                              />
                            </InputAdornment>
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        bgcolor: COLORS.WHITE,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "13.5px",
                          minHeight: "44px",
                          "& fieldset": { borderColor: "#EFE6D5" },
                          "&:hover fieldset": { borderColor: "#FFD4BC" },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.1)",
                          },
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </Box>

            {/* City Input */}
            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#64748B",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  mb: 0.6,
                }}
              >
                SELECT CITY <Box component="span" sx={{ color: "#FF6200" }}>*</Box>
              </Typography>
              <FormControl fullWidth size="small">
                <Autocomplete
                  size="small"
                  openOnFocus
                  forcePopupIcon
                  disabled={!selectedState}
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(_, newValue) => {
                    setSelectedCity(newValue);
                    setFormError(null);
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        zIndex: 1400,
                        "& .MuiPaper-root": {
                          borderRadius: "14px",
                          border: "1px solid #EFE6D5",
                          boxShadow: "0 10px 30px rgba(44, 24, 16, 0.12)",
                          fontFamily: FONTS.OUTFIT,
                          mt: 0.5,
                          "& .MuiAutocomplete-option": {
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "13.5px",
                            py: 1,
                            "&[aria-selected='true']": {
                              bgcolor: "#FFF3EB",
                              color: COLORS.PRIMARY,
                              fontWeight: 600,
                            },
                            "&:hover": {
                              bgcolor: "#FAF4EE",
                            },
                          },
                        },
                      },
                    },
                  }}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      size="small"
                      placeholder={
                        !selectedState ? "Select State first" : "Select City"
                      }
                      autoComplete="off"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start" sx={{ mr: 0.5, ml: 0.5 }}>
                              <LocationOnIcon
                                sx={{
                                  color: selectedState ? COLORS.PRIMARY : "#94A3B8",
                                  fontSize: 18,
                                }}
                              />
                            </InputAdornment>
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      }}
                      sx={{
                        bgcolor: selectedState ? COLORS.WHITE : "#FAF7F4",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "13.5px",
                          minHeight: "44px",
                          "& fieldset": { borderColor: "#EFE6D5" },
                          "&:hover fieldset": { borderColor: selectedState ? "#FFD4BC" : "#EFE6D5" },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.PRIMARY,
                            boxShadow: "0 0 0 3px rgba(255, 98, 0, 0.1)",
                          },
                        },
                      }}
                    />
                  )}
                />
              </FormControl>
            </Box>

            {/* Error Message */}
            {formError && (
              <Typography
                sx={{
                  color: "#DC2626",
                  fontSize: "12px",
                  fontFamily: FONTS.OUTFIT,
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {formError}
              </Typography>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 0.8,
                py: { xs: 1.25, sm: 1.3 },
                borderRadius: "30px",
                bgcolor: COLORS.PRIMARY,
                color: COLORS.WHITE,
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: { xs: "14px", sm: "14.5px" },
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(255, 98, 0, 0.28)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#E55800",
                  boxShadow: "0 8px 24px rgba(255, 98, 0, 0.36)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Paper>
    </Dialog>
  );
}
