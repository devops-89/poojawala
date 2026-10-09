"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
import React, { useState, useEffect } from "react";

import { AdminPageHeaderProps } from "@/utils/types";
export type { AdminPageHeaderProps };

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
  const [localSearch, setLocalSearch] = useState(searchValue || "");

  useEffect(() => {
    setLocalSearch(searchValue || "");
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearch !== (searchValue || "")) {
        onSearchChange(localSearch);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchValue]);

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
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
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
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
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
                fontFamily: FONTS.OUTFIT,
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
              background: COLORS.PRIMARY,
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              py: 1,
              px: 3,
              boxShadow: "none",
              fontFamily: FONTS.OUTFIT,
              whiteSpace: "nowrap",
              "&:hover": { background: COLORS.PRIMARY_DARK, boxShadow: "none" },
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
