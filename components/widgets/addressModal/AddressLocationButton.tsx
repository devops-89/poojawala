"use client";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Button, CircularProgress } from "@mui/material";

interface AddressLocationButtonProps {
  isFetchingLocation: boolean;
  onFetchLocation: () => void;
}

export default function AddressLocationButton({
  isFetchingLocation,
  onFetchLocation,
}: AddressLocationButtonProps) {
  return (
    <Button
      onClick={onFetchLocation}
      disabled={isFetchingLocation}
      startIcon={
        isFetchingLocation ? (
          <CircularProgress size={16} sx={{ color: "#1f8a3b" }} />
        ) : (
          <MyLocationIcon sx={{ color: "#1f8a3b", fontSize: 18 }} />
        )
      }
      sx={{
        py: 0.8,
        px: 2,
        width: "fit-content",
        bgcolor: "#e4f5e8",
        color: "#1f8a3b",
        border: "1px solid #bfe3c8",
        borderRadius: "30px",
        fontWeight: 700,
        fontSize: { xs: "0.8rem", sm: "0.88rem" },
        textTransform: "none",
        fontFamily: '"DM Sans", sans-serif',
        boxShadow: "0 2px 6px rgba(31, 138, 59, 0.08)",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#d7efdd",
          borderColor: "#a5d6a7",
          boxShadow: "0 4px 10px rgba(31, 138, 59, 0.15)",
        },
      }}
    >
      {isFetchingLocation
        ? "Getting location..."
        : "Use Current Location"}
    </Button>
  );
}
