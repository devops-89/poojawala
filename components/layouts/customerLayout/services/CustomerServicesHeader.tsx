"use client";
import { FONTS } from "@/utils/fonts";
import { Box, Typography } from "@mui/material";

export default function CustomerServicesHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontWeight: 800,
          color: "#1A1A1A",
          mb: 1,
        }}
      >
        Explore Services
      </Typography>
      <Typography
        sx={{ fontFamily: FONTS.PRIMARY, color: "#666" }}
      >
        Browse and book verified purohits for your pujas.
      </Typography>
    </Box>
  );
}
