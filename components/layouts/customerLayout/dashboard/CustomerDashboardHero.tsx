"use client";

import { useUserStore } from "@/stores/userStore";
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
import { useEffect, useState } from "react";

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
  const indianStates = State.getStatesOfCountry("IN") || [];
  const stateOptions = indianStates.map((s) => s.name).sort();

  // Selected State Object for ISO Code
  const selectedStateObj = selectedState
    ? indianStates.find(
        (s) =>
          s.name.toLowerCase().trim() === selectedState.toLowerCase().trim(),
      )
    : null;

  // City Options for selected state (or all cities if no state selected)
  const rawCities = selectedStateObj
    ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
    : City.getCitiesOfCountry("IN") || [];

  const cityOptions = Array.from(new Set(rawCities.map((c) => c.name))).sort();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedState && selectedState !== "All") {
      params.append("state", selectedState);
    }
    if (selectedCity && selectedCity !== "All") {
      params.append("city", selectedCity);
    }

    const queryString = params.toString();
    const targetUrl = queryString
      ? `/customer/services?${queryString}`
      : "/customer/services";

    router.push(targetUrl);
  };

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 2, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 2.5, md: 4 },
        borderRadius: "24px",
        background: "linear-gradient(135deg, #FFFDF9 0%, #FFF8F0 100%)",
        border: "1px solid #FFEBE0",
        boxShadow: "0 4px 20px rgba(255, 98, 0, 0.04)",
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }} sx={{ alignItems: "center" }}>
        {/* Left Column: Greeting & Main Heading */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ pr: { md: 2 } }}>
            {/* Namaste Greeting */}
            <Typography
              sx={{
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "12px", md: "15px" },
                color: "#FF6200",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                mb: 0.8,
                display: "inline-block",
              }}
            >
              NAMASTE, {displayName} JI
            </Typography>

            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                fontWeight: 800,
                color: "#1E293B",
                fontSize: { xs: "1.5rem", sm: "2.3rem", md: "3.2rem" },
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                mb: { xs: 1.5, md: 2.5 },
              }}
            >
              Book sacred{" "}
              <Box component="span" sx={{ color: "#FF6200" }}>
                pooja services
              </Box>{" "}
              near you
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64748B",
                fontSize: { xs: "13px", md: "17px" },
                lineHeight: 1.5,
                fontWeight: 400,
                maxWidth: "540px",
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
              p: { xs: 2, sm: 4 },
              borderRadius: "24px",
              bgcolor: "#FFFDFB",
              border: "1px solid #FFE4D6",
              boxShadow: "0 12px 35px rgba(255, 98, 0, 0.08)",
            }}
          >
            {/* Card Header */}
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                fontWeight: 800,
                color: "#1E293B",
                fontSize: { xs: "20px", md: "24px" },
                mb: 0.5,
              }}
            >
              Find Pooja Services
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64748B",
                fontSize: "14px",
                mb: 3,
              }}
            >
              Select your state and city to discover nearby services
            </Typography>

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
                      renderInput={(params: any) => {
                        const updatedParams = {
                          ...params,
                          InputProps: {
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <LocationOnIcon
                                    sx={{ color: "#FF6200", fontSize: 20 }}
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
                      renderInput={(params: any) => {
                        const updatedParams = {
                          ...params,
                          InputProps: {
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <LocationOnIcon
                                    sx={{ color: "#FF6200", fontSize: 20 }}
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
                </Grid>
              </Grid>

              {/* Search Button */}
              <Button
                type="submit"
                variant="contained"
                startIcon={<SearchIcon />}
                sx={{
                  mt: 1,
                  py: 1.6,
                  borderRadius: "12px",
                  bgcolor: "#FF6200",
                  color: "#FFFFFF",
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: "16px",
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(255, 98, 0, 0.25)",
                  "&:hover": {
                    bgcolor: "#E55800",
                    boxShadow: "0 10px 25px rgba(255, 98, 0, 0.35)",
                  },
                }}
              >
                Search Pooja Services
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
