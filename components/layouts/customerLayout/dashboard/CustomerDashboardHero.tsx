"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { useUserStore } from "@/stores/userStore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { City, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function CustomerDashboardHero() {
  const router = useRouter();
  const { profile, fetchProfile } = useUserStore();

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Extract user first name or full name from profile
  const rawFirstName =
    profile?.firstName ||
    profile?.name?.split(" ")[0] ||
    profile?.user?.firstName ||
    profile?.user?.name?.split(" ")[0] ||
    "";

  const displayName = rawFirstName ? `${rawFirstName.toUpperCase()}` : "USER";

  // State Options from country-state-city
  const indianStates = useMemo(() => State.getStatesOfCountry("IN") || [], []);
  const stateOptions = useMemo(
    () => indianStates.map((s) => s.name).sort((a, b) => a.localeCompare(b)),
    [indianStates],
  );

  // Selected State Object for ISO Code
  const selectedStateObj = useMemo(() => {
    if (!selectedState || selectedState === "All") return null;
    return indianStates.find(
      (s) => s.name.toLowerCase().trim() === selectedState.toLowerCase().trim(),
    );
  }, [selectedState, indianStates]);

  // City Options for selected state
  const cityOptions = useMemo(() => {
    const rawCities = selectedStateObj
      ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
      : [];
    const names = rawCities.map((c) => c.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [selectedStateObj]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("isOffline", "true");
    if (selectedState && selectedState !== "All" && selectedState !== "All States") {
      params.set("state", selectedState.trim());
    }
    if (selectedCity && selectedCity !== "All" && selectedCity !== "All Cities") {
      params.set("city", selectedCity.trim());
    }

    const queryString = params.toString();
    const targetUrl = `/customer/services?${queryString}`;

    router.push(targetUrl);
  };

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 3, md: 4.5 },
        px: { xs: 2.5, sm: 3.5, md: 5 },
        mb: { xs: 3, md: 4.5 },
        borderRadius: "28px",
        background:
          "linear-gradient(135deg, #FFF9F2 0%, #FFF3E6 50%, #FFEDE0 100%)",
        border: "1px solid #FFDFC7",
        boxShadow: "0 10px 30px rgba(255, 98, 0, 0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient background glows */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 98, 0, 0.09) 0%, rgba(255, 98, 0, 0) 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 133, 51, 0.08) 0%, rgba(255, 133, 51, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        sx={{ alignItems: "center", position: "relative", zIndex: 1 }}
      >
        {/* Left Column: Greeting, Main Heading, Subtitle & Trust Badges */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ pr: { md: 2 } }}>
            {/* Namaste Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                bgcolor: "rgba(255, 98, 0, 0.08)",
                border: "1px solid rgba(255, 98, 0, 0.22)",
                borderRadius: "30px",
                px: 1.8,
                py: 0.6,
                mb: 2,
                boxShadow: "0 2px 6px rgba(255, 98, 0, 0.05)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  fontSize: { xs: "11px", sm: "13px" },
                  color: COLORS.PRIMARY,
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                NAMASTE, {displayName} JI
              </Typography>
            </Box>

            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1E293B",
                fontSize: { xs: "1.85rem", sm: "2.4rem", md: "3.1rem" },
                lineHeight: 1.16,
                letterSpacing: "-0.025em",
                mb: 2,
              }}
            >
              Book sacred{" "}
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(135deg, #FF6200 0%, #FF8533 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                pooja services
              </Box>{" "}
              near you
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: "#64748B",
                fontSize: { xs: "14px", md: "16px" },
                lineHeight: 1.6,
                fontWeight: 400,
                maxWidth: "520px",
              }}
            >
              Find experienced pandits, authentic samagri, and auspicious
              muhurts — all in one place.
            </Typography>
          </Box>
        </Grid>

        {/* Right Column: Search Card */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4 },
              borderRadius: "24px",
              bgcolor: "#FFFFFF",
              border: "1.5px solid #FFDFC7",
              boxShadow: "0 14px 38px rgba(255, 98, 0, 0.09)",
              position: "relative",
            }}
          >
            {/* Card Header with Icon */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2.5,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, rgba(255, 98, 0, 0.15) 0%, rgba(255, 98, 0, 0.05) 100%)",
                  border: "1px solid rgba(255, 98, 0, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.PRIMARY,
                  flexShrink: 0,
                }}
              >
                <SearchIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: "#1E293B",
                    fontSize: { xs: "19px", md: "22px" },
                    lineHeight: 1.2,
                  }}
                >
                  Find Pooja Services
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    color: "#64748B",
                    fontSize: "13px",
                    mt: 0.3,
                  }}
                >
                  Select your state & city to discover nearby verified services
                </Typography>
              </Box>
            </Box>

            {/* Form Fields */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
              {/* State & City Selector Row */}
              <Grid container spacing={2}>
                {/* State Autocomplete / Dropdown */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#475569",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      mb: 0.8,
                    }}
                  >
                    STATE
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
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select State"
                          autoComplete="off"
                          slotProps={{
                            ...params.slotProps,
                            input: {
                              ...params.slotProps?.input,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start">
                                    <LocationOnIcon
                                      sx={{
                                        color: COLORS.PRIMARY,
                                        fontSize: 19,
                                      }}
                                    />
                                  </InputAdornment>
                                  {params.slotProps?.input?.startAdornment}
                                </>
                              ),
                            },
                          }}
                          sx={{
                            bgcolor: "#FAFAFA",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "14px",
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "14px",
                              transition: "all 0.2s ease",
                              "& fieldset": { borderColor: "#E2E8F0" },
                              "&:hover fieldset": {
                                borderColor: COLORS.PRIMARY,
                              },
                              "&.Mui-focused": {
                                bgcolor: "#FFFFFF",
                                "& fieldset": {
                                  borderColor: COLORS.PRIMARY,
                                  borderWidth: "1.5px",
                                },
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* City Autocomplete / Dropdown */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#475569",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      mb: 0.8,
                    }}
                  >
                    CITY
                  </Typography>
                  <FormControl fullWidth>
                    <Autocomplete
                      openOnFocus
                      forcePopupIcon
                      options={cityOptions}
                      value={selectedCity}
                      onChange={(_, newValue) => setSelectedCity(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select City"
                          autoComplete="off"
                          slotProps={{
                            ...params.slotProps,
                            input: {
                              ...params.slotProps?.input,
                              startAdornment: (
                                <>
                                  <InputAdornment position="start">
                                    <LocationOnIcon
                                      sx={{
                                        color: COLORS.PRIMARY,
                                        fontSize: 19,
                                      }}
                                    />
                                  </InputAdornment>
                                  {params.slotProps?.input?.startAdornment}
                                </>
                              ),
                            },
                          }}
                          sx={{
                            bgcolor: "#FAFAFA",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "14px",
                              fontFamily: FONTS.PRIMARY,
                              fontSize: "14px",
                              transition: "all 0.2s ease",
                              "& fieldset": { borderColor: "#E2E8F0" },
                              "&:hover fieldset": {
                                borderColor: COLORS.PRIMARY,
                              },
                              "&.Mui-focused": {
                                bgcolor: "#FFFFFF",
                                "& fieldset": {
                                  borderColor: COLORS.PRIMARY,
                                  borderWidth: "1.5px",
                                },
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              {/* Search Button */}
              <Button
                type="submit"
                variant="contained"
                endIcon={
                  <ArrowForwardIcon sx={{ fontSize: "18px !important" }} />
                }
                sx={{
                  mt: 0.5,
                  py: 1.6,
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #FF6200 0%, #E65800 100%)",
                  color: "#FFFFFF",
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.3px",
                  textTransform: "none",
                  boxShadow: "0 8px 22px rgba(255, 98, 0, 0.3)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #E65800 0%, #D04F00 100%)",
                    boxShadow: "0 10px 28px rgba(255, 98, 0, 0.4)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Explore Services
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
