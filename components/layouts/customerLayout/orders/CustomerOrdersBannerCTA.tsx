"use client";
import React from "react";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function CustomerOrdersBannerCTA() {
  const router = useRouter();

  return (
    <Box
      sx={{
        mt: 0,
        mb: { xs: -2, sm: -3, md: -5 },
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        bgcolor: "#24120B",
        color: "white",
        py: { xs: 4, sm: 6, md: 7 },
        px: { xs: 2.5, sm: 5, md: 8 },
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2.5, md: 4 },
        }}
      >
        {/* Left Column: Heading & Paragraph */}
        <Box sx={{ maxWidth: 620 }}>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              fontSize: { xs: "11px", sm: "12px" },
              letterSpacing: "1.5px",
              color: "#B89C82",
              textTransform: "uppercase",
              mb: 1.2,
            }}
          >
            NEVER MISS A RITUAL
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#FFFFFF",
              fontSize: { xs: "24px", sm: "34px", md: "42px" },
              lineHeight: 1.2,
              mb: 1.5,
            }}
          >
            Running low on pooja essentials?
          </Typography>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#D6C2B4",
              fontSize: { xs: "13.5px", sm: "15px" },
              lineHeight: 1.6,
            }}
          >
            Reorder your favourites in one tap, or explore fresh arrivals
            curated for the upcoming festive season. Your next pooja is already
            waiting.
          </Typography>
        </Box>

        {/* Right Column: Compact CTA Button */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "flex-start" },
            width: { xs: "fit-content", md: "auto" },
          }}
        >
          <Button
            onClick={() => router.push("/customer/products")}
            variant="contained"
            startIcon={<ShoppingCartOutlinedIcon />}
            sx={{
              width: "fit-content",
              bgcolor: "#C84B16",
              color: "white",
              py: { xs: 1.2, sm: 1.5 },
              px: { xs: 3, sm: 3.5 },
              borderRadius: "12px",
              fontWeight: 800,
              fontSize: { xs: "13.5px", sm: "15px" },
              fontFamily: '"DM Sans", sans-serif',
              textTransform: "none",
              boxShadow: "0 6px 20px rgba(200, 75, 22, 0.4)",
              "&:hover": {
                bgcolor: "#B84A17",
                boxShadow: "0 8px 24px rgba(200, 75, 22, 0.5)",
              },
            }}
          >
            Shop Pooja Essentials
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
