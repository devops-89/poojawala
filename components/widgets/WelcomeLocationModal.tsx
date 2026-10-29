

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
    const rawCities = City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
    const names = rawCities.map((c) => c.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [open, selectedStateObj]);

  useEffect(() => {
    // Only run on home route '/'
    if (pathname !== "/") return;

    const alreadyShown = sessionStorage.getItem(
      "1pooja_welcome_modal_shown",
    ) || sessionStorage.getItem("poojawala_welcome_modal_shown");
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
            borderRadius: "20px",
            maxWidth: 440,
            width: "92%",
            p: 0,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
            border: "1px solid #FFE4D6",
          },
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          bgcolor: "#FFFDFB",
          position: "relative",
          background: "linear-gradient(135deg, #FFFDF9 0%, #FFF8F0 100%)",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 14,
            right: 14,
            color: "#64748b",
            bgcolor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            "&:hover": { bgcolor: "#f1f5f9", color: COLORS.PRIMARY },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Branding & Logo */}
        <Box sx={{ textCenter: "center", textAlign: "center", mb: 2 }}>
          <Image
            src="/images/1Poojalogo.webp"
            alt="1Pooja"
            width={116}
            height={47}
            style={{ height: "38px", width: "auto", objectFit: "contain", margin: "0 auto 12px auto", display: "block" }}
          />
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1E293B",
              fontSize: { xs: "20px", sm: "22px" },
              mb: 0.8,
            }}
          >
            Welcome to 1Pooja 🙏
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: "#64748B",
              fontSize: "13.5px",
              lineHeight: 1.5,
              maxWidth: 380,
              mx: "auto",
            }}
          >
            Your trusted platform for booking verified Pandits, authentic
            Samagri, and divine ceremonies tailored to your region.
          </Typography>
        </Box>

        {/* Location Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* State Input */}
            <Box>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: "0.5px",
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
                      sx: { zIndex: 1400 },
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
                          borderRadius: "10px",
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "13.5px",
                          minHeight: "42px",
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: COLORS.BRAND_ORANGE },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.BRAND_ORANGE,
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
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#475569",
                  letterSpacing: "0.5px",
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
                      sx: { zIndex: 1400 },
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
                        bgcolor: selectedState ? COLORS.WHITE : "#F8FAFC",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "13.5px",
                          minHeight: "42px",
                          "& fieldset": { borderColor: "#E2E8F0" },
                          "&:hover fieldset": { borderColor: COLORS.BRAND_ORANGE },
                          "&.Mui-focused fieldset": {
                            borderColor: COLORS.BRAND_ORANGE,
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
                mt: 0.5,
                py: 1.15,
                borderRadius: "10px",
                bgcolor: COLORS.BRAND_ORANGE,
                color: COLORS.WHITE,
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                fontSize: "14.5px",
                textTransform: "none",
                boxShadow: `0 6px 16px ${COLORS.PRIMARY_SHADOW}`,
                "&:hover": {
                  bgcolor: "#E55800",
                  boxShadow: `0 8px 20px ${COLORS.PRIMARY_SHADOW}`,
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
