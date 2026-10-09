"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";

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
        borderRadius: "24px",
        p: { xs: 2.5, sm: 4, md: 6 },
        mb: { xs: 3, md: 6 },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Grid container spacing={{ xs: 2, md: 5 }} sx={{ alignItems: "center" }}>
        {/* Left Content Area */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Subtitle / Tag */}
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              color: "#D9531E",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            POOJAS FOR EVERY OCCASION
          </Typography>

          {/* Main Title */}
          <Typography
            variant="h1"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "24px", sm: "36px", md: "52px" },
              lineHeight: 1.15,
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
                color: "#D9531E",
                fontSize: "inherit",
              }}
            >
              in one place.
            </Typography>
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              color: "#C5B7AE",
              fontSize: { xs: "13px", md: "15px" },
              lineHeight: 1.5,
              maxWidth: 480,
              mb: { xs: 2.5, md: 4 },
            }}
          >
            Pure, authentic pooja samagri — from diyas and dhoop to complete
            puja kits. Sourced directly, priced fairly, delivered with devotion.
          </Typography>

          {/* Buttons Row */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: { xs: 2, md: 5 },
            }}
          >
            <Button
              onClick={handleScrollToProducts}
              variant="contained"
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "white",
                px: 3,
                py: 1,
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "13px",
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(200, 75, 22, 0.3)",
                "&:hover": {
                  bgcolor: COLORS.PRIMARY,
                  boxShadow: "0 8px 25px rgba(200, 75, 22, 0.4)",
                },
              }}
            >
              Shop Samagri
            </Button>
          </Box>
        </Grid>

        {/* Right Hero Image Area */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 180, sm: 280, md: 380 },
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 15px 35px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Box
              component="img"
              src="/images/productsHero.webp"
              alt="Sacred Puja Items"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
