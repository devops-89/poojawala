"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";

const STATUS_TABS = [
  { id: "All", label: "All" },
  { id: "Available", label: "Available" },
  { id: "Unavailable", label: "Unavailable" },
];

interface ProductFilterHeaderProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function ProductFilterHeader({
  statusFilter,
  onStatusFilterChange,
  searchValue,
  onSearchChange,
}: ProductFilterHeaderProps) {
  const [focused, setFocused] = useState(false);
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
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        borderBottom: "1px solid #e2e8f0",
        px: 3,
        py: 1.5,
        gap: 2,
      }}
    >
      <Tabs
        value={statusFilter}
        onChange={(_, newValue) => onStatusFilterChange(newValue)}
        sx={{
          minHeight: 48,
          "& .MuiTabs-indicator": {
            backgroundColor: COLORS.PRIMARY,
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        }}
      >
        {STATUS_TABS.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={tab.label}
            sx={{
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              fontFamily: FONTS.OUTFIT,
              color: "#64748b",
              "&.Mui-selected": { color: COLORS.PRIMARY },
            }}
          />
        ))}
      </Tabs>

      <TextField
        size="small"
        placeholder="Search products by name..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        sx={{
          width: { xs: "100%", md: 320 },
          transition: "all 0.2s ease-in-out",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            borderColor: focused ? COLORS.PRIMARY : "#e2e8f0",
            "&:hover fieldset": { borderColor: COLORS.PRIMARY },
            "&.Mui-focused fieldset": { borderColor: COLORS.PRIMARY },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: focused ? COLORS.PRIMARY : "#94a3b8" }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
