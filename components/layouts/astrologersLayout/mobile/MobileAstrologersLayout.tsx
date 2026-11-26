"use client";

import ListingBackButton from "@/components/widgets/ListingBackButton";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import AstrologerGrid from "../AstrologerGrid";
import MobileAstrologerCard from "./MobileAstrologerCard";

const MobileAstrologersLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box
      sx={{
        bgcolor: COLORS.PRIMARY,
        minHeight: "100vh",
      }}
    >
      <ListingBackButton variant="mobile" title="Verified Astrologers" />

      <Box
        sx={{
          bgcolor: COLORS.BG_MAIN,
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          minHeight: "calc(100vh - 58px)",
          pt: 2.25,
          pb: 8,
          px: 2,
        }}
      >
        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search astrologers by name..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: COLORS.TEXT_DARK, fontSize: 22 }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery("")}
                    >
                      <CloseIcon
                        sx={{ fontSize: 18, color: COLORS.TEXT_MUTED }}
                      />
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
        </Box>

        <AstrologerGrid
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          CardComponent={MobileAstrologerCard}
          hideSearchHeader
        />
      </Box>
    </Box>
  );
};

export default React.memo(MobileAstrologersLayout);
