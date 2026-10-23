"use client";
import { FONTS } from "@/utils/fonts";
import { Box, Typography } from "@mui/material";

interface Props {
  isOffline?: boolean;
  isOnline?: boolean;
}

export default function CustomerServicesHeader({ isOffline, isOnline }: Props) {
  const title = isOffline
    ? "Offline Pooja Services"
    : isOnline
    ? "Online Pooja Services"
    : "Explore Services";

  const subtitle = isOffline
    ? "Browse and book verified purohits for in-person pujas at your home or venue."
    : isOnline
    ? "Browse and book verified purohits for virtual pujas via live video consultation."
    : "Browse and book verified purohits for your pujas.";

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
        {title}
      </Typography>
      <Typography
        sx={{ fontFamily: FONTS.PRIMARY, color: "#666" }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}
