"use client";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import { Box, Button, Paper, Typography } from "@mui/material";

interface CustomerServicesEmptyStateProps {
  selectedCity: string;
  selectedState: string;
  onReset: () => void;
}

export default function CustomerServicesEmptyState({
  selectedCity,
  selectedState,
  onReset,
}: CustomerServicesEmptyStateProps) {
  const isCityActive = selectedCity && selectedCity !== "All";
  const isStateActive = selectedState && selectedState !== "All";

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
        py: 8,
        px: 3,
        bgcolor: "#FFF8F5",
        borderRadius: "16px",
        border: "1px dashed #FF6200",
        maxWidth: 600,
        mx: "auto",
        my: 4,
      }}
    >
      <Box
        sx={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          bgcolor: "#FFF0E6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <LocationOffIcon sx={{ fontSize: 36, color: "#FF6200" }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 800,
          color: "#1A1A1A",
          mb: 1,
        }}
      >
        We aren't in {locationText} yet!
      </Typography>
      <Typography
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          color: "#666",
          fontSize: "14px",
          lineHeight: 1.6,
          mb: 3,
        }}
      >
        We currently do not offer services in <strong>{regionText}</strong>, but we
        are expanding rapidly! We will start serving here very soon. In the
        meantime, please check services in another city or state.
      </Typography>
      <Button
        variant="outlined"
        onClick={onReset}
        sx={{
          borderColor: "#FF6200",
          color: "#FF6200",
          borderRadius: "30px",
          textTransform: "none",
          fontWeight: 700,
          px: 3,
          "&:hover": {
            borderColor: "#F05A00",
            bgcolor: "#FFF0E6",
          },
        }}
      >
        View All Available Locations
      </Button>
    </Paper>
  );
}
