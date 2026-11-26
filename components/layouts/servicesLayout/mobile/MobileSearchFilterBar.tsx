"use client";

import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Badge,
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface MobileSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
}

const MobileSearchFilterBar = ({
  searchQuery,
  onSearchChange,
  hasActiveFilters,
  onOpenFilters,
}: MobileSearchFilterBarProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        mb: 2,
      }}
    >
      <TextField
        fullWidth
        size="small"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="Search pooja (e.g. Rudrabhishek, Durga)..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#5C4A40", fontSize: 22 }} />
              </InputAdornment>
            ),
            endAdornment: localSearch ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Clear search"
                  onClick={handleClearSearch}
                >
                  <CloseIcon sx={{ fontSize: 18, color: "#8C6D53" }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: COLORS.WHITE,
            borderRadius: "28px",
            height: "46px",
            fontFamily: FONTS.OUTFIT,
            fontSize: "14px",
            color: COLORS.TEXT_DARK,
            "& fieldset": {
              borderColor: COLORS.BORDER_LIGHT,
            },
            "&:hover fieldset": {
              borderColor: COLORS.GOLD_MEDIUM,
            },
            "&.Mui-focused fieldset": {
              borderColor: COLORS.PRIMARY,
              borderWidth: "1.5px",
            },
          },
          "& input::placeholder": {
            color: COLORS.TEXT_MUTED,
            opacity: 1,
          },
        }}
      />

      <IconButton
        aria-label="Open filters"
        onClick={onOpenFilters}
        sx={{
          width: 46,
          height: 46,
          flexShrink: 0,
          borderRadius: "14px",
          bgcolor: COLORS.CREAM_SOFT,
          border: `1px solid ${COLORS.LIGHT_BORDER}`,
          color: COLORS.PRIMARY,
          "&:hover": {
            bgcolor: COLORS.LIGHT_BG_HOVER,
          },
        }}
      >
        <Badge
          variant="dot"
          invisible={!hasActiveFilters}
          sx={{
            "& .MuiBadge-dot": {
              bgcolor: COLORS.PRIMARY,
            },
          }}
        >
          <TuneIcon sx={{ fontSize: 22 }} />
        </Badge>
      </IconButton>
    </Box>
  );
};

export default React.memo(MobileSearchFilterBar);
