"use client";
import { useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { City, State } from "country-state-city";
import CustomerServicesFilters from "../customerLayout/services/CustomerServicesFilters";
import ServiceGrid from "./ServiceGrid";

export default function ServicesLayout() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");

  const indianStates = State.getStatesOfCountry("IN");
  const stateOptions = indianStates.map((s) => s.name);

  const selectedStateObj = indianStates.find(
    (s) => s.name.toLowerCase() === selectedState.toLowerCase()
  );
  const cityOptions = selectedStateObj
    ? City.getCitiesOfState("IN", selectedStateObj.isoCode).map((c) => c.name)
    : [];

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    setSelectedCity("All");
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
          minHeight: { xs: "360px", md: "480px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.85) 0%, rgba(255, 253, 249, 0.6) 55%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, #FFFDF9 0%, rgba(255, 253, 249, 0.1) 50%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)"
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: 4,
          pb: 6,
          mb: 6,
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
                color: "#1A1A1A",
                mb: 1.5,
                fontSize: { xs: "2rem", md: "42px" },
                letterSpacing: "-0.03em",
              }}
            >
              Explore Our Services
            </Box>
            <Box
              component="p"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#475569",
                fontWeight: 500,
                mb: 3,
                fontSize: "16px",
                lineHeight: "1.6",
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
        {/* Search & State/City Filters Bar */}
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, mb: 4 }}
        >
          <CustomerServicesFilters
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            stateOptions={stateOptions}
            selectedState={selectedState}
            onStateChange={handleStateChange}
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
                activeCategory={activeCategory}
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
