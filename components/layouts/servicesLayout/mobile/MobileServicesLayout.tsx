"use client";

import ListingBackButton from "@/components/widgets/ListingBackButton";
import { COLORS } from "@/utils/enums";
import { Box } from "@mui/material";
import { useCallback, useState } from "react";
import ServiceGrid from "../ServiceGrid";
import { useServicesLayout } from "../useServicesLayout";
import MobileFilterDrawer from "./MobileFilterDrawer";
import MobileSearchFilterBar from "./MobileSearchFilterBar";
import MobileServiceCard from "./MobileServiceCard";

const MobileServicesLayout = () => {
  const {
    isOnline,
    isOffline,
    searchQuery,
    setSearchQuery,
    stateOptions,
    selectedState,
    handleStateChange,
    handleApplyLocation,
    selectedCity,
    setSelectedCity,
    selectedCategoryId,
    selectedCategoryName,
    handleCategoryChange,
  } = useServicesLayout();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const hasLocationFilter = Boolean(
    !isOnline &&
      ((selectedState && selectedState !== "All") ||
        (selectedCity && selectedCity !== "All")),
  );

  const handleOpenFilters = useCallback(() => setFilterDrawerOpen(true), []);
  const handleCloseFilters = useCallback(() => setFilterDrawerOpen(false), []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    handleStateChange("All");
    setSelectedCity("All");
    handleCategoryChange("", "All Categories");
    setFilterDrawerOpen(false);
  }, [setSearchQuery, handleStateChange, setSelectedCity, handleCategoryChange]);

  const mobileTitle = isOnline
    ? "Online Pooja Services"
    : isOffline
      ? "Offline Pooja Services"
      : "Pooja Services";

  return (
    <Box
      sx={{
        bgcolor: COLORS.PRIMARY,
        minHeight: "100vh",
      }}
    >
      <ListingBackButton variant="mobile" title={mobileTitle} />

      <Box
        sx={{
          bgcolor: COLORS.BG_MAIN,
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          minHeight: "calc(100vh - 58px)",
          pt: 2.25,
          pb: 8,
          px: 2,
        }}
      >
        <MobileSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hasActiveFilters={hasLocationFilter}
          onOpenFilters={handleOpenFilters}
        />

        <ServiceGrid
          activeCategory={selectedCategoryName}
          selectedCategoryId={selectedCategoryId}
          searchQuery={searchQuery}
          selectedState={selectedState}
          selectedCity={selectedCity}
          isOnline={isOnline}
          isOffline={isOffline}
          CardComponent={MobileServiceCard}
        />
      </Box>

      <MobileFilterDrawer
        open={filterDrawerOpen}
        onClose={handleCloseFilters}
        isOnline={isOnline}
        stateOptions={stateOptions}
        selectedState={selectedState}
        selectedCity={selectedCity}
        onSubmit={handleApplyLocation}
        onClearAll={handleClearFilters}
      />
    </Box>
  );
};

export default MobileServicesLayout;
