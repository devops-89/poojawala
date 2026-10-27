"use client";
import { COLORS } from "@/utils/enums";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { StatusMessage } from "@/utils/types";

interface AddressMapPreviewProps {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  statusMessage: StatusMessage;
  isSearchingGeo: boolean;
  onFindLocation: () => void;
  height?: any;
}

export default function AddressMapPreview({
  mapContainerRef,
  statusMessage,
  isSearchingGeo,
  onFindLocation,
  height,
}: AddressMapPreviewProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Status Row & Find Location Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.25,
          mt: 0.25,
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            color:
              statusMessage.type === "error"
                ? "#c0261b"
                : statusMessage.type === "success"
                ? "#1f8a3b"
                : "#6b7280",
            fontWeight: 600,
            flex: 1,
            lineHeight: 1.3,
          }}
        >
          {statusMessage.text}
        </Typography>
        <Button
          variant="outlined"
          onClick={onFindLocation}
          disabled={isSearchingGeo}
          startIcon={
            isSearchingGeo ? (
              <CircularProgress size={12} sx={{ color: COLORS.PRIMARY }} />
            ) : (
              <SearchIcon sx={{ fontSize: 14 }} />
            )
          }
          sx={{
            borderColor: COLORS.PRIMARY,
            color: COLORS.PRIMARY,
            fontWeight: 700,
            fontSize: "11px",
            py: 0.35,
            px: 1.25,
            borderRadius: "7px",
            textTransform: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            "&:hover": {
              borderColor: "#d45b00",
              bgcolor: "#fff3e8",
            },
          }}
        >
          {isSearchingGeo ? "Searching..." : "Find on Map"}
        </Button>
      </Box>

      {/* Map Box */}
      <Box
        ref={mapContainerRef}
        sx={{
          height: height || { xs: "200px", sm: "250px", md: "280px" },
          width: "100%",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          zIndex: 0,
          bgcolor: "#f8fafc",
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "#6b7280",
          mt: 0.25,
          display: "block",
          fontSize: "10.5px",
        }}
      >
        Click the map or drag the marker to set the exact spot. The address fields update to match.
      </Typography>
    </Box>
  );
}
