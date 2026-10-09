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
}

export default function AddressMapPreview({
  mapContainerRef,
  statusMessage,
  isSearchingGeo,
  onFindLocation,
}: AddressMapPreviewProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {/* Status Row & Find Location Button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          mt: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.82rem", sm: "0.88rem" },
            color:
              statusMessage.type === "error"
                ? "#c0261b"
                : statusMessage.type === "success"
                ? "#1f8a3b"
                : "#6b7280",
            fontWeight: 500,
            flex: 1,
            minHeight: "1.2em",
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
              <CircularProgress size={14} sx={{ color: COLORS.PRIMARY }} />
            ) : (
              <SearchIcon />
            )
          }
          sx={{
            width: { xs: "100%", sm: "auto" },
            borderColor: COLORS.PRIMARY,
            color: COLORS.PRIMARY,
            fontWeight: 600,
            fontSize: { xs: "0.8rem", sm: "0.85rem" },
            py: { xs: 1, sm: 0.8 },
            borderRadius: "8px",
            textTransform: "none",
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: "#d45b00",
              bgcolor: "#fff3e8",
            },
          }}
        >
          Find location from these details
        </Button>
      </Box>

      {/* Map Box */}
      <Box
        ref={mapContainerRef}
        sx={{
          height: { xs: "200px", sm: "250px", md: "280px" },
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #d1d5db",
          zIndex: 0,
          bgcolor: "#f8fafc",
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "#6b7280",
          mt: 0.5,
          display: "block",
          fontSize: { xs: "0.75rem", sm: "0.8rem" },
        }}
      >
        Click the map or drag the marker to set the exact spot. The address fields update to match.
      </Typography>
    </Box>
  );
}
