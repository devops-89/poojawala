"use client";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { ReactNode } from "react";

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actionButtonText?: string;
  actionButtonHref?: string;
  actionButtonIcon?: ReactNode;
  onActionButtonClick?: () => void;
}

export default function AdminPageHeader({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  actionButtonText,
  actionButtonHref,
  actionButtonIcon = <AddIcon />,
  onActionButtonClick,
}: AdminPageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#64748b",
              mt: 0.5,
              fontSize: "0.95rem",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        {onSearchChange !== undefined && (
          <TextField
            size="small"
            placeholder={searchPlaceholder || "Search..."}
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: "100%", sm: 280, md: 320 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "white",
                fontFamily: "var(--font-outfit), sans-serif",
              },
            }}
          />
        )}

        {actionButtonText && (
          <Button
            component={actionButtonHref ? NextLink : "button"}
            href={actionButtonHref || "#"}
            onClick={onActionButtonClick}
            variant="contained"
            sx={{
              background: "#FF6200",
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              py: 1,
              px: 3,
              boxShadow: "none",
              fontFamily: "var(--font-outfit), sans-serif",
              whiteSpace: "nowrap",
              "&:hover": { background: "#E65800", boxShadow: "none" },
            }}
            startIcon={actionButtonIcon}
          >
            {actionButtonText}
          </Button>
        )}
      </Box>
    </Box>
  );
}
