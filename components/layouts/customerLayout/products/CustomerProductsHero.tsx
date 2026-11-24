"use client";

import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";

export default function CustomerProductsHero() {
  const handleScrollToProducts = () => {
    const el = document.getElementById("customer-products-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#23150D",
        color: "white",
        borderRadius: { xs: "20px", sm: "24px" },
        border: "1px solid rgba(255, 255, 255, 0.08)",
        p: { xs: 2.5, sm: 4, md: 5 },
        mb: { xs: 3, md: 5 },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Grid container spacing={{ xs: 2.5, md: 4 }} sx={{ alignItems: "center" }}>
        {/* Left Content Area */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Tag Badge */}
          <Box sx={{ mb: 1.5 }}>
            <Chip
              icon={
                <SparklesIcon
                  sx={{ fontSize: "14px !important", color: "#FF7A30 !important" }}
                />
              }
              label="SACRED POOJA SAMAGRI"
              size="small"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.08em",
                bgcolor: "rgba(255, 98, 0, 0.15)",
                color: "#FF9254",
                border: "1px solid rgba(255, 98, 0, 0.3)",
                borderRadius: "20px",
                height: 26,
              }}
            />
          </Box>

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "26px", sm: "36px", md: "46px" },
              lineHeight: 1.18,
              color: "#FFFFFF",
              mb: 1.5,
            }}
          >
            Everything sacred,{" "}
            <Typography
              component="span"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontStyle: "italic",
                fontWeight: 800,
                color: "#FF6200",
                fontSize: "inherit",
              }}
            >
              in one place.
            </Typography>
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#C5B7AE",
              fontSize: { xs: "13.5px", sm: "14.5px" },
              lineHeight: 1.6,
              maxWidth: 480,
              mb: { xs: 2.5, md: 3.5 },
            }}
          >
            Pure, authentic pooja samagri — from natural dhoop and pure ghee
            diyas to complete ritual kits. Sourced directly, tested for purity,
            and delivered with reverence.
          </Typography>

          {/* Action Button */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <Button
              onClick={handleScrollToProducts}
              variant="contained"
              startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "white",
                px: { xs: 2.75, sm: 3.5 },
                py: 1.1,
                borderRadius: "20px",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "13.5px",
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(255, 98, 0, 0.35)",
                "&:hover": {
                  bgcolor: COLORS.PRIMARY_DARK,
                  boxShadow: "0 8px 24px rgba(255, 98, 0, 0.45)",
                },
              }}
            >
              Explore Products
            </Button>
          </Box>
        </Grid>

        {/* Right Hero Image Area */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 200, sm: 260, md: 320 },
              borderRadius: "18px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.35)",
            }}
          >
            <Box
              component="img"
              src="/images/productsHero.webp"
              alt="Sacred Pooja Items"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: "transform 0.4s ease",
                "&:hover": { transform: "scale(1.03)" },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
