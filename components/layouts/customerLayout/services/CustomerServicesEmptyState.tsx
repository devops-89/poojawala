"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
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
        <LocationOffIcon sx={{ fontSize: 36, color: COLORS.PRIMARY }} />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontWeight: 800,
          color: "#1A1A1A",
          mb: 1,
        }}
      >
        We aren't in {locationText} yet!
      </Typography>
      <Typography
        sx={{
          fontFamily: FONTS.PRIMARY,
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
          borderColor: COLORS.PRIMARY,
          color: COLORS.PRIMARY,
          borderRadius: "30px",
          textTransform: "none",
          fontWeight: 700,
          px: 3,
          "&:hover": {
            borderColor: COLORS.PRIMARY_DARK,
            bgcolor: "#FFF0E6",
          },
        }}
      >
        View All Available Locations
      </Button>
    </Paper>
  );
}
