"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Container, Grid } from "@mui/material";
import { State, City } from "country-state-city";
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
    stateParam || "All"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryIdParam || ""
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    categoryParam || "All Categories"
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    cityParam || "All"
  );

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

  const indianStates = State.getStatesOfCountry("IN") || [];
  const stateOptions = indianStates.map((s) => s.name).sort();

  const selectedStateObj =
    selectedState && selectedState !== "All"
      ? indianStates.find(
          (s) =>
            s.name.toLowerCase().trim() === selectedState.toLowerCase().trim()
        )
      : null;

  const rawCities = selectedStateObj
    ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
    : City.getCitiesOfCountry("IN") || [];

  const cityOptions = Array.from(new Set(rawCities.map((c) => c.name))).sort();

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
      {/* Hero Section */}
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: "320px", md: "480px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.95) 0%, rgba(255, 253, 249, 0.82) 45%, rgba(255, 253, 249, 0.1) 80%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, #FFFDF9 0%, rgba(255, 253, 249, 0.85) 35%, rgba(255, 253, 249, 0.1) 65%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)"
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 2.5, md: 4 },
          pb: { xs: 3.5, md: 6 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          {/* Content */}
          <Box sx={{ maxWidth: "600px", my: "auto" }}>
            <Box
              component="h1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                color: "#0f172a",
                mb: 1.5,
                fontSize: { xs: "1.6rem", md: "42px" },
                letterSpacing: "-0.03em",
              }}
            >
              Explore Our Services
            </Box>
            <Box
              component="p"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#0f172a",
                fontWeight: 600,
                mb: 3,
                fontSize: { xs: "14px", md: "16px" },
                lineHeight: "1.5",
                maxWidth: "520px",
              }}
            >
              Discover and book verified Pandits and Purohits for a wide range
              of religious ceremonies, tailored to your language and local
              traditions.
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area Below Hero */}
      <Box sx={{ position: "relative" }}>
        {/* Search, Category & City Filters Bar */}
        <Container
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
                selectedCity={selectedCity}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
