"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import { City, State } from "country-state-city";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CustomerServicesFilters from "../customerLayout/services/CustomerServicesFilters";
import ServiceGrid from "./ServiceGrid";

export default function ServicesLayout() {
  const searchParams = useSearchParams();
  const stateParam = searchParams.get("state");
  const cityParam = searchParams.get("city");
  const categoryParam = searchParams.get("category");
  const categoryIdParam = searchParams.get("categoryId");

  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>(
    stateParam || "All",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryIdParam || "",
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    categoryParam || "All Categories",
  );
  const [selectedCity, setSelectedCity] = useState<string>(cityParam || "All");

  useEffect(() => {
    if (stateParam) {
      setSelectedState(stateParam);
    }
    if (categoryIdParam) {
      setSelectedCategoryId(categoryIdParam);
    }
    if (categoryParam) {
      setSelectedCategoryName(categoryParam);
    }
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [stateParam, categoryParam, categoryIdParam, cityParam]);

  useEffect(() => {
    const params = new URLSearchParams();
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
    if (
      selectedCategoryId &&
      selectedCategoryId !== "All" &&
      selectedCategoryId !== "All Categories"
    ) {
      params.set("categoryId", selectedCategoryId);
    }
    if (selectedCategoryName && selectedCategoryName !== "All Categories") {
      params.set("category", selectedCategoryName);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    const queryStr = params.toString();
    const newUrl = queryStr
      ? `${window.location.pathname}?${queryStr}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [
    selectedState,
    selectedCity,
    selectedCategoryId,
    selectedCategoryName,
    searchQuery,
  ]);

  const indianStates = useMemo(() => State.getStatesOfCountry("IN") || [], []);
  const stateOptions = useMemo(
    () => indianStates.map((s) => s.name).sort((a, b) => a.localeCompare(b)),
    [indianStates],
  );

  const selectedStateObj = useMemo(() => {
    if (!selectedState || selectedState === "All") return null;
    return indianStates.find(
      (s) => s.name.toLowerCase().trim() === selectedState.toLowerCase().trim(),
    );
  }, [selectedState, indianStates]);

  const cityOptions = useMemo(() => {
    const rawCities = selectedStateObj
      ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
      : [];
    const names = rawCities.map((c) => c.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [selectedStateObj]);

  const handleCategoryChange = (catId: string, catName: string) => {
    setSelectedCategoryId(catId);
    setSelectedCategoryName(catName);
  };

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
  };

  return (
    <Box
      sx={{
        bgcolor: "#FFFDF9",
        minHeight: "100vh",
        pb: 10,
        position: "relative",
      }}
    >
      {/* Hero Section matching Homepage & Purohits page */}
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: "380px", sm: "480px", md: "777px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.88) 0%, rgba(255, 253, 249, 0.6) 35%, rgba(255, 253, 249, 0.05) 70%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, rgba(255, 253, 249, 0.82) 0%, rgba(255, 253, 249, 0.45) 25%, rgba(255, 253, 249, 0.02) 50%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 2.5, md: 4 },
          pb: { xs: 3.5, md: 8 },
          mb: { xs: 4, md: 8 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Content */}
          <Box sx={{ maxWidth: "600px", mt: "auto", mb: "auto" }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                color: "#0f172a",
                mb: 0.5,
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.04em",
              }}
            >
              Explore Our
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                color: "#D32F2F",
                mb: { xs: 1.5, md: 3 },
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.04em",
              }}
            >
              Sacred Pooja Services
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#0f172a",
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                lineHeight: "1.45",
                maxWidth: "500px",
                letterSpacing: "0em",
              }}
            >
              Discover and book verified Pandits and Purohits for a wide range
              of religious ceremonies, tailored to your language and local
              traditions.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area Below Hero */}
      <Box sx={{ position: "relative" }}>
        {/* Search, Category & City Filters Bar */}
        <Container
          id="services-filters"
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, mb: 4 }}
        >
          <CustomerServicesFilters
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            stateOptions={stateOptions}
            selectedState={selectedState}
            onStateChange={(newVal) => {
              setSelectedState(newVal);
              setSelectedCity("All");
            }}
            selectedCategory={selectedCategoryName}
            onCategoryChange={handleCategoryChange}
            cityOptions={cityOptions}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
        </Container>

        {/* Services Grid */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <ServiceGrid
                activeCategory={selectedCategoryName}
                selectedCategoryId={selectedCategoryId}
                activeFilters={activeFilters}
                searchQuery={searchQuery}
                selectedState={selectedState}
                selectedCity={selectedCity}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
