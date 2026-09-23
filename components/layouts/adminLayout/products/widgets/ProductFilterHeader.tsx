"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Box, InputAdornment, Tab, Tabs, TextField } from "@mui/material";
import React, { useState } from "react";

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
            backgroundColor: "#FF6200",
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
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#64748b",
              "&.Mui-selected": { color: "#FF6200" },
            }}
          />
        ))}
      </Tabs>

      <TextField
        size="small"
        placeholder="Search products by name..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        sx={{
          width: { xs: "100%", md: 320 },
          transition: "all 0.2s ease-in-out",
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            borderColor: focused ? "#FF6200" : "#e2e8f0",
            "&:hover fieldset": { borderColor: "#FF6200" },
            "&.Mui-focused fieldset": { borderColor: "#FF6200" },
          },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: focused ? "#FF6200" : "#94a3b8" }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
