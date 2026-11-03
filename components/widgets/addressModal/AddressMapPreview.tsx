"use client";

import React from "react";
import { Box } from "@mui/material";
import { StatusMessage } from "@/utils/types";

interface AddressMapPreviewProps {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  statusMessage?: StatusMessage;
  isSearchingGeo?: boolean;
  onFindLocation?: () => void;
  height?: any;
}

export default function AddressMapPreview({
  mapContainerRef,
}: AddressMapPreviewProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Hidden map container keeps geocoding/Mapbox refs fully functional without visual rendering */}
      <Box
        ref={mapContainerRef}
        sx={{
          display: "none",
          width: 0,
          height: 0,
          overflow: "hidden",
          visibility: "hidden",
        }}
      />
    </Box>
  );
}
