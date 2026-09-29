"use client";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface CategoryImageUploadProps {
  iconPreview: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (e: React.MouseEvent) => void;
  label?: string;
}

export default function CategoryImageUpload({
  iconPreview,
  onFileChange,
  onRemoveImage,
  label = "Category Image / Icon",
}: CategoryImageUploadProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "#334155",
          mb: 1,
        }}
      >
        {label}
      </Typography>

      {iconPreview ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2.5,
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            bgcolor: "#f8fafc",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 90,
              height: 90,
              borderRadius: "12px",
              overflow: "visible",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "2px solid #FF6200",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Image
                src={iconPreview}
                alt="Category Icon Preview"
                fill
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </Box>
            <IconButton
              onClick={onRemoveImage}
              size="small"
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                bgcolor: "#ef4444",
                color: "#ffffff",
                p: "4px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                "&:hover": { bgcolor: "#dc2626" },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
          <Button
            component="label"
            size="small"
            sx={{
              mt: 1.5,
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#FF6200",
              textTransform: "none",
            }}
          >
            Change Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onFileChange}
            />
          </Button>
        </Box>
      ) : (
        <Box
          component="label"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            p: 3,
            border: "2px dashed #fed7aa",
            borderRadius: "12px",
            bgcolor: "#fffaf5",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              bgcolor: "#fff0e6",
              borderColor: "#FF6200",
            },
          }}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={onFileChange}
          />
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(255, 98, 0, 0.15)",
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 24, color: "#FF6200" }} />
          </Box>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#1e293b",
            }}
          >
            Click to upload image
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontSize: "0.75rem",
              color: "#94a3b8",
            }}
          >
            PNG, JPG, WEBP, SVG (Max 5MB)
          </Typography>
        </Box>
      )}
    </Box>
  );
}
