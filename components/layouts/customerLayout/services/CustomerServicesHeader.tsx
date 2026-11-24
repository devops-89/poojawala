"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { Box, Typography, Chip } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface Props {
  isOffline?: boolean;
  isOnline?: boolean;
}

export default function CustomerServicesHeader({ isOffline, isOnline }: Props) {
  const title = isOffline
    ? "Offline Pooja Services"
    : isOnline
    ? "Online Pooja Services"
    : "Explore Pooja Services";

  const subtitle = isOffline
    ? "Browse and book verified Vedic purohits for authentic in-person poojas at your home, office, or venue."
    : isOnline
    ? "Experience authentic sacred rituals performed live via interactive digital video by experienced Purohits."
    : "Browse and book verified Vedic purohits for your sacred ceremonies.";

  return (
    <Box sx={{ mb: { xs: 3, md: 4 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Chip
          icon={
            isOffline ? (
              <LocationOnIcon sx={{ fontSize: "14px !important", color: "#0284C7 !important" }} />
            ) : isOnline ? (
              <VideocamIcon sx={{ fontSize: "14px !important", color: "#16a34a !important" }} />
            ) : (
              <AutoAwesomeIcon sx={{ fontSize: "14px !important", color: "#D94E00 !important" }} />
            )
          }
          label={isOffline ? "IN-PERSON CEREMONIES" : isOnline ? "VIRTUAL / LIVE STREAM" : "SACRED RITUALS"}
          size="small"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "11px",
            letterSpacing: "0.08em",
            bgcolor: isOffline ? "#F0F9FF" : isOnline ? "#F0FDF4" : "#FFF7ED",
            color: isOffline ? "#0284C7" : isOnline ? "#166534" : "#C2410C",
            border: `1px solid ${isOffline ? "#BAE6FD" : isOnline ? "#BBF7D0" : "#FED7AA"}`,
            borderRadius: "20px",
            height: "26px",
          }}
        />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#2C1810",
          fontSize: { xs: "22px", sm: "28px", md: "32px" },
          mb: 0.8,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontFamily: FONTS.OUTFIT,
          color: "#7C6A60",
          fontSize: { xs: "13.5px", sm: "15px" },
          lineHeight: 1.5,
          maxWidth: "750px",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}
