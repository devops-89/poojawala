"use client";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface ProductImageUploadProps {
  imagePreview: string | null;
  imageFile: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductImageUpload({
  imagePreview,
  imageFile,
  onImageChange,
}: ProductImageUploadProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 700,
          mb: 1,
          color: "#1e293b",
        }}
      >
        Product Image
      </Typography>
      <Box
        component="label"
        sx={{
          width: "100%",
          minHeight: "60px",
          border: "1px dashed #cbd5e1",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          px: 2.5,
          py: 1.5,
          cursor: "pointer",
          transition: "all 0.2s",
          "&:hover": { borderColor: "#FF6200", bgcolor: "#fff7ed" },
        }}
      >
        <input type="file" hidden accept="image/*" onChange={onImageChange} />
        {imagePreview ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              <Image
                src={imagePreview}
                alt="Product Preview"
                fill
                style={{ objectFit: "cover" }}
                unoptimized={true}
              />
            </Box>
            <Typography
              sx={{
                color: "#1e293b",
                fontSize: "15px",
                fontWeight: 500,
                flex: 1,
              }}
            >
              {imageFile ? "New Image Selected" : "Existing Image"} (Click to
              replace)
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
            }}
          >
            <CloudUploadIcon sx={{ color: "#FF6200", fontSize: 24 }} />
            <Typography sx={{ color: "#64748b", fontSize: "15px" }}>
              Click to upload product image
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
