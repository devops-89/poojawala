"use client";
import { FONTS } from "@/utils/fonts";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Typography } from "@mui/material";
import React from "react";

interface ServiceIconUploadFieldProps {
  iconPreview: string | null;
  onIconChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ServiceIconUploadField({
  iconPreview,
  onIconChange,
}: ServiceIconUploadFieldProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          mb: 1,
          color: "#1e293b",
        }}
      >
        Service Icon *
      </Typography>
      <Box
        sx={{
          width: "100%",
          minHeight: "56px",
          border: "1px solid #c4c4c4",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { borderColor: "#212121" },
          overflow: "hidden",
        }}
        component="label"
      >
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={onIconChange}
        />
        {iconPreview ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              component="img"
              src={iconPreview}
              alt="Icon Preview"
              sx={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <Typography
              sx={{ color: "#1e293b", fontSize: "16px", flex: 1 }}
            >
              Image Selected (Click to change)
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <CloudUploadIcon
              sx={{ color: "#94a3b8", fontSize: 24 }}
            />
            <Typography sx={{ color: "#94a3b8", fontSize: "16px" }}>
              Click to upload an image...
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
