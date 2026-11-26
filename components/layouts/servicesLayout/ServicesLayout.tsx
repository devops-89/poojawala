"use client";

import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import CustomerServicesFilters from "../customerLayout/services/CustomerServicesFilters";
import ServiceGrid from "./ServiceGrid";
import ServicesHero from "./ServicesHero";
import { useServicesLayout } from "./useServicesLayout";
import MobileServicesLayout from "./mobile/MobileServicesLayout";

export default function ServicesLayout() {
  const {
    mode,
    isOnline,
    isOffline,
    searchQuery,
    setSearchQuery,
    stateOptions,
    selectedState,
    handleStateChange,
    cityOptions,
    selectedCity,
    setSelectedCity,
    selectedCategoryId,
    selectedCategoryName,
    handleCategoryChange,
  } = useServicesLayout();

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        bgcolor: "#FFFDF9",
        minHeight: "100vh",
        pb: 10,
        position: "relative",
      }}
    >
      {isMobile ? (
        <>
          <MobileServicesLayout />
        </>
      ) : (
        <>
          <ServicesHero mode={mode} />

          <Box sx={{ position: "relative" }}>
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
                onStateChange={handleStateChange}
                selectedCategory={selectedCategoryName}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
                cityOptions={cityOptions}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                hideLocationFilters={isOnline}
              />
            </Container>

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12 }}>
                  <ServiceGrid
                    activeCategory={selectedCategoryName}
                    selectedCategoryId={selectedCategoryId}
                    searchQuery={searchQuery}
                    selectedState={selectedState}
                    selectedCity={selectedCity}
                    isOnline={isOnline}
                    isOffline={isOffline}
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      )}
    </Box>
  );
}
