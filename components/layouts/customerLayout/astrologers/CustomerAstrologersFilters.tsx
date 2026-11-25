"use client";
import React from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface CustomerAstrologersFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function CustomerAstrologersFilters({
  searchTerm,
  onSearchChange,
}: CustomerAstrologersFiltersProps) {
  return (
    <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
      <TextField
        fullWidth
        placeholder="Search astrologers by name, Vedic expertise, or language..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: COLORS.PRIMARY, fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: {
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "13.5px", sm: "14px" },
              borderRadius: "14px",
              bgcolor: "#FFFFFF",
              "& fieldset": { borderColor: "#EFE6D5" },
              "&:hover fieldset": { borderColor: "#FFD4BC" },
              "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
            },
          },
        }}
      />
    </Box>
  );
}
