"use client";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

import PurohitGrid from "./PurohitGrid";
import { useEffect, useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AppsIcon from "@mui/icons-material/Apps";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ExploreIcon from "@mui/icons-material/Explore";
import HomeIcon from "@mui/icons-material/Home";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SpaIcon from "@mui/icons-material/Spa";

const categories = [
  {
    id: "All",
    label: "All Services",
    icon: <AppsIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Astrology Consultation",
    label: "Astrology Consultation",
    icon: <AutoAwesomeIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Online Puja",
    label: "Online Puja",
    icon: <LaptopMacIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Temple Puja",
    label: "Temple Puja",
    icon: <AccountBalanceIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Home Puja & Grah Pravesh",
    label: "Home & Grah Pravesh",
    icon: <HomeIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Vastu Consultation",
    label: "Vastu Consultation",
    icon: <ExploreIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Marriage Ceremony",
    label: "Marriage Ceremony",
    icon: <CelebrationIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Satyanarayan Katha",
    label: "Satyanarayan Katha",
    icon: <MenuBookIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
  {
    id: "Havan/Yagya",
    label: "Havan / Yagya",
    icon: (
      <LocalFireDepartmentIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />
    ),
  },
  {
    id: "Festival Special Pujas",
    label: "Festival Special Pujas",
    icon: <SpaIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
  },
];

export default function PurohitsLayout() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilters, setActiveFilters] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "#FFFDF9",
        minHeight: "100vh",
        pb: 10,
        position: "relative",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "auto", md: "calc(100vh - 80px)" },
          minHeight: { xs: "380px", sm: "460px", md: "calc(100vh - 80px)" },
          maxHeight: { md: "calc(100vh - 80px)" },
          backgroundImage: {
            xs: "linear-gradient(180deg, rgba(12, 6, 2, 0.78) 0%, rgba(12, 6, 2, 0.52) 60%, rgba(12, 6, 2, 0.18) 100%), url(/images/home/hero/heroSectionHome.webp)",
            sm: "linear-gradient(90deg, rgba(12, 6, 2, 0.82) 0%, rgba(12, 6, 2, 0.55) 55%, rgba(12, 6, 2, 0.12) 80%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, rgba(12, 6, 2, 0.84) 0%, rgba(12, 6, 2, 0.55) 42%, rgba(12, 6, 2, 0.15) 68%, transparent 85%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: { xs: "top right", md: "center" },
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 3.5, sm: 4, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Content */}
          <Box sx={{ maxWidth: { xs: "100%", md: "620px" }, mt: "auto", mb: "auto", position: "relative", zIndex: 2 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                color: "#FFFFFF",
                mb: { xs: 1.5, md: 3 },
                fontSize: { xs: "1.85rem", sm: "2.4rem", md: "48px" },
                lineHeight: { xs: 1.2, md: 1.22 },
                letterSpacing: "-0.03em",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.85), 0 4px 20px rgba(0, 0, 0, 0.7)",
              }}
            >
              Explore Our{" "}
              <Box
                component="span"
                sx={{
                  display: { xs: "inline", sm: "block" },
                  fontWeight: 800,
                  color: "#FFB300",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 179, 0, 0.5)",
                }}
              >
                Verified Purohits
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: "#F1F5F9",
                fontWeight: 500,
                fontSize: { xs: "14.5px", sm: "15px", md: "16px" },
                lineHeight: 1.6,
                maxWidth: "520px",
                letterSpacing: "0em",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.9)",
              }}
            >
              Discover and book verified Pandits and Purohits for a wide range
              of religious ceremonies, tailored to your language and local
              traditions.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area Below Hero */}
      <Box sx={{ position: "relative" }}>
        {/* Main Content */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <PurohitGrid />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
