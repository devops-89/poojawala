"use client";

import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { City, State } from "@/utils/indianLocations";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

export default function WelcomeLocationModal() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

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
    const rawCities =
      City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
    const names = rawCities.map((c) => c.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [open, selectedStateObj]);

  useEffect(() => {
    // Only run on home route '/'
    if (pathname !== "/") return;

    const alreadyShown =
      sessionStorage.getItem("1pooja_welcome_modal_shown") ||
      sessionStorage.getItem("poojawala_welcome_modal_shown");
    if (alreadyShown) return;

    // Trigger modal after 15 seconds (15000 ms)
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("1pooja_welcome_modal_shown", "true");
    }, 10000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);

    const params = new URLSearchParams();
    params.set("isOffline", "true");

    if (
      selectedState &&
      selectedState !== "All" &&
      selectedState !== "All States"
    ) {
      params.set("state", selectedState);
    }
    if (
      selectedCity &&
      selectedCity !== "All" &&
      selectedCity !== "All Cities"
    ) {
      params.set("city", selectedCity);
    }

    const queryString = params.toString();
    const targetUrl = `/services?${queryString}`;

    router.push(targetUrl);
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: "20px", sm: "24px" },
            maxWidth: { xs: "92vw", sm: 440 },
            width: "100%",
            m: { xs: 2, sm: 3 },
            p: 0,
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(44, 24, 16, 0.18)",
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
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          size="small"
          aria-label="Close welcome modal"
          sx={{
            position: "absolute",
            top: { xs: 12, sm: 14 },
            right: { xs: 12, sm: 14 },
            width: 32,
            height: 32,
            color: "#64748B",
            bgcolor: "#FFFFFF",
            border: "1px solid #EFE6D5",
            boxShadow: "0 2px 6px rgba(44, 24, 16, 0.05)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#FFF8F2",
              color: COLORS.PRIMARY,
              borderColor: "#FFD4BC",
              transform: "scale(1.05)",
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>

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
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: { xs: 2, sm: 2.5 } }}
        >
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
                SELECT STATE
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
                            <InputAdornment
                              position="start"
                              sx={{ mr: 0.5, ml: 0.5 }}
                            >
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
                SELECT CITY
              </Typography>
              <FormControl fullWidth size="small">
                <Autocomplete
                  size="small"
                  openOnFocus
                  forcePopupIcon
                  disabled={!selectedState}
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(_, newValue) => setSelectedCity(newValue)}
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
                            <InputAdornment
                              position="start"
                              sx={{ mr: 0.5, ml: 0.5 }}
                            >
                              <LocationOnIcon
                                sx={{
                                  color: selectedState
                                    ? COLORS.PRIMARY
                                    : "#94A3B8",
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
                          "&:hover fieldset": {
                            borderColor: selectedState ? "#FFD4BC" : "#EFE6D5",
                          },
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon sx={{ fontSize: 18 }} />}
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
              Explore Pooja Services
            </Button>
          </Box>
        </Box>
      </Paper>
    </Dialog>
  );
}
