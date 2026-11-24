"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Box, Button, Paper, Typography } from "@mui/material";

interface CustomerServicesEmptyStateProps {
  selectedCity?: string;
  selectedState?: string;
  onReset: () => void;
}

export default function CustomerServicesEmptyState({
  selectedCity,
  selectedState,
  onReset,
}: CustomerServicesEmptyStateProps) {
  const isCityActive =
    selectedCity && selectedCity !== "All" && selectedCity !== "All Cities";
  const isStateActive =
    selectedState && selectedState !== "All" && selectedState !== "All States";

  const locationText = isCityActive
    ? selectedCity
    : isStateActive
      ? selectedState
      : "this location";

  const regionText = isCityActive
    ? `${selectedCity}${isStateActive ? `, ${selectedState}` : ""}`
    : isStateActive
      ? selectedState
      : "this region";

  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: "center",
        py: { xs: 5, sm: 7 },
        px: { xs: 2.5, sm: 4 },
        bgcolor: "#FAF7F4",
        borderRadius: "20px",
        border: "1.5px dashed #FFD4BC",
        maxWidth: 580,
        mx: "auto",
        my: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          bgcolor: "#FFF0E6",
          border: "1px solid #FFD4BC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        {isCityActive || isStateActive ? (
          <LocationOffIcon sx={{ fontSize: 32, color: COLORS.PRIMARY }} />
        ) : (
          <SearchOffIcon sx={{ fontSize: 32, color: COLORS.PRIMARY }} />
        )}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#2C1810",
          fontSize: { xs: "1.1rem", sm: "1.25rem" },
          mb: 1,
        }}
      >
        {isCityActive || isStateActive
          ? `We aren't in ${locationText} yet!`
          : "No pooja services found"}
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: "#7C6A60",
          fontSize: { xs: "13.5px", sm: "14px" },
          lineHeight: 1.6,
          mb: 3,
          maxWidth: 480,
          mx: "auto",
        }}
      >
        {isCityActive || isStateActive ? (
          <>
            We currently do not offer services in <strong>{regionText}</strong>,
            but we are expanding rapidly! We will start serving here very soon.
            In the meantime, please check services in another city or state.
          </>
        ) : (
          "No pooja services found matching your selected search or category filters. Please try resetting your filters or searching for something else."
        )}
      </Typography>
      <Button
        variant="contained"
        onClick={onReset}
        sx={{
          bgcolor: COLORS.PRIMARY,
          color: "#FFFFFF",
          fontFamily: FONTS.OUTFIT,
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "14px",
          px: 3.5,
          py: 1,
          boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
          "&:hover": {
            bgcolor: COLORS.PRIMARY_DARK,
            boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
          },
        }}
      >
        {isCityActive || isStateActive
          ? "View All Available Locations"
          : "Clear Filters"}
      </Button>
    </Paper>
  );
}
