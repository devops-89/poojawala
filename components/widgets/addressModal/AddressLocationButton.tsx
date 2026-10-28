"use client";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Button, CircularProgress } from "@mui/material";
import { FONTS } from "@/utils/fonts";

interface AddressLocationButtonProps {
  isFetchingLocation: boolean;
  onFetchLocation: () => void;
  size?: "small" | "medium";
  sx?: any;
}

export default function AddressLocationButton({
  isFetchingLocation,
  onFetchLocation,
  size = "medium",
  sx = {},
}: AddressLocationButtonProps) {
  const isSmall = size === "small";

  return (
    <Button
      onClick={onFetchLocation}
      disabled={isFetchingLocation}
      startIcon={
        isFetchingLocation ? (
          <CircularProgress
            size={isSmall ? 12 : 16}
            sx={{ color: "#1f8a3b" }}
          />
        ) : (
          <MyLocationIcon
            sx={{ color: "#1f8a3b", fontSize: isSmall ? 14 : 18 }}
          />
        )
      }
      sx={{
        py: isSmall ? 0.35 : 0.8,
        px: isSmall ? 1.25 : 2,
        width: "fit-content",
        bgcolor: "#e4f5e8",
        color: "#1f8a3b",
        border: "1px solid #bfe3c8",
        borderRadius: "30px",
        fontWeight: 700,
        fontSize: isSmall ? "11px" : { xs: "0.8rem", sm: "0.88rem" },
        textTransform: "none",
        fontFamily: FONTS.OUTFIT,
        boxShadow: "0 1px 4px rgba(31, 138, 59, 0.08)",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#d7efdd",
          borderColor: "#a5d6a7",
          boxShadow: "0 3px 8px rgba(31, 138, 59, 0.15)",
        },
        ...sx,
      }}
    >
      {isFetchingLocation
        ? isSmall
          ? "Locating..."
          : "Getting location..."
        : "Use Current Location"}
    </Button>
  );
}

