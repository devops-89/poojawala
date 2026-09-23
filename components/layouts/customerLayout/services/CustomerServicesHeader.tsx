"use client";
import { Box, Typography } from "@mui/material";

export default function CustomerServicesHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontFamily: '"DM Sans", sans-serif',
          fontWeight: 800,
          color: "#1A1A1A",
          mb: 1,
        }}
      >
        Explore Services
      </Typography>
      <Typography
        sx={{ fontFamily: '"DM Sans", sans-serif', color: "#666" }}
      >
        Browse and book verified purohits for your pujas.
      </Typography>
    </Box>
  );
}
