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
  Typography
} from "@mui/material";
import { City, State } from "country-state-city";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function WelcomeLocationModal() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // States & Cities Data
  const indianStates = State.getStatesOfCountry("IN") || [];
  const stateOptions = indianStates.map((s) => s.name).sort();

  const selectedStateObj = selectedState
    ? indianStates.find(
        (s) => s.name.toLowerCase().trim() === selectedState.toLowerCase().trim()
      )
    : null;

  const rawCities = selectedStateObj
    ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
    : City.getCitiesOfCountry("IN") || [];

  const cityOptions = Array.from(new Set(rawCities.map((c) => c.name))).sort();

  useEffect(() => {
    // Only run on home route '/'
    if (pathname !== "/") return;

    const alreadyShown = sessionStorage.getItem("poojawala_welcome_modal_shown");
    if (alreadyShown) return;

    // Trigger modal after 15 seconds (15000 ms)
    const timer = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("poojawala_welcome_modal_shown", "true");
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
    if (selectedState && selectedState !== "All") {
      params.append("state", selectedState);
    }
    if (selectedCity && selectedCity !== "All") {
      params.append("city", selectedCity);
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `/services?${queryString}` : "/services";

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
            borderRadius: "24px",
            maxWidth: 480,
            width: "90%",
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
          p: { xs: 3, sm: 4 },
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
            "&:hover": { bgcolor: "#f1f5f9", color: "#FF6200" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Branding & Logo */}
        <Box sx={{ textCenter: "center", textAlign: "center", mb: 2 }}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="Poojawala"
            sx={{ height: 46, objectFit: "contain", mx: "auto", mb: 1.5 }}
          />
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              fontWeight: 800,
              color: "#1E293B",
              fontSize: { xs: "20px", sm: "22px" },
              mb: 0.8,
            }}
          >
            Welcome to Poojawala 🙏
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64748B",
              fontSize: "13.5px",
              lineHeight: 1.5,
              maxWidth: 380,
              mx: "auto",
            }}
          >
            Your trusted platform for booking verified Pandits, authentic Samagri,
            and divine ceremonies tailored to your region.
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
              <FormControl fullWidth>
                <Autocomplete
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
                  renderInput={(params: any) => {
                    const updatedParams = {
                      ...params,
                      InputProps: {
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocationOnIcon
                                sx={{ color: "#FF6200", fontSize: 18 }}
                              />
                            </InputAdornment>
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      },
                    };
                    return (
                      <TextField
                        {...updatedParams}
                        placeholder="Select State"
                        autoComplete="off"
                        sx={{
                          bgcolor: "#FFFFFF",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: "14px",
                            "& fieldset": { borderColor: "#E2E8F0" },
                            "&:hover fieldset": { borderColor: "#FF6200" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#FF6200",
                            },
                          },
                        }}
                      />
                    );
                  }}
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
              <FormControl fullWidth>
                <Autocomplete
                  openOnFocus
                  forcePopupIcon
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(_, newValue) => setSelectedCity(newValue)}
                  slotProps={{
                    popper: {
                      sx: { zIndex: 1400 },
                    },
                  }}
                  renderInput={(params: any) => {
                    const updatedParams = {
                      ...params,
                      InputProps: {
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocationOnIcon
                                sx={{ color: "#FF6200", fontSize: 18 }}
                              />
                            </InputAdornment>
                            {params.InputProps?.startAdornment}
                          </>
                        ),
                      },
                    };
                    return (
                      <TextField
                        {...updatedParams}
                        placeholder="Select City"
                        autoComplete="off"
                        sx={{
                          bgcolor: "#FFFFFF",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: "14px",
                            "& fieldset": { borderColor: "#E2E8F0" },
                            "&:hover fieldset": { borderColor: "#FF6200" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#FF6200",
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </FormControl>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              sx={{
                mt: 1,
                py: 1.4,
                borderRadius: "12px",
                bgcolor: "#FF6200",
                color: "#FFFFFF",
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: "15px",
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  bgcolor: "#E55800",
                  boxShadow: "0 10px 25px rgba(255, 98, 0, 0.35)",
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
