"use client";
import React from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FONTS } from "@/utils/fonts";

interface CustomerAstrologersFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function CustomerAstrologersFilters({
  searchTerm,
  onSearchChange,
}: CustomerAstrologersFiltersProps) {
  return (
    <Box
      sx={{
        mb: 4,
        p: { xs: 1.5, sm: 2 },
        bgcolor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <TextField
        fullWidth
        placeholder="Search astrologers by name...."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94a3b8", fontSize: "1.3rem" }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            fontFamily: FONTS.OUTFIT,
            bgcolor: "#f8fafc",
            "& fieldset": {
              borderColor: "#e2e8f0",
            },
            "&:hover fieldset": {
              borderColor: "#cbd5e1",
            },
          },
        }}
      />
    </Box>
  );
}
