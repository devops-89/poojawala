"use client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityIcon from "@mui/icons-material/Security";
import { Box, Typography } from "@mui/material";

export default function CartBottomFeatureStrip() {
  return (
    <Box
      sx={{
        mt: 8,
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        bgcolor: "#FF6200",
        color: "white",
        py: 3,
        px: { xs: 3, sm: 5, md: 8 },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <SecurityIcon sx={{ fontSize: 22 }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            100% Secure Payment
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <AccessTimeIcon sx={{ fontSize: 22 }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Easy 7-Day Returns
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <LocalShippingOutlinedIcon sx={{ fontSize: 22 }} />
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Free Delivery over ₹499
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
