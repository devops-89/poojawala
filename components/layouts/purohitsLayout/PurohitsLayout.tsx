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
    icon: <LocalFireDepartmentIcon sx={{ fontSize: 28, color: COLORS.PRIMARY }} />,
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
          minHeight: { xs: "380px", sm: "480px", md: "777px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.88) 0%, rgba(255, 253, 249, 0.6) 35%, rgba(255, 253, 249, 0.05) 70%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, rgba(255, 253, 249, 0.82) 0%, rgba(255, 253, 249, 0.45) 25%, rgba(255, 253, 249, 0.02) 50%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 2.5, md: 4 },
          pb: { xs: 3.5, md: 8 },
          mb: { xs: 4, md: 8 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Content */}
          <Box sx={{ maxWidth: "600px", mt: "auto", mb: "auto" }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                color: "#0f172a",
                mb: 0.5,
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.04em",
              }}
            >
              Explore Our
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                color: "#D32F2F",
                mb: { xs: 1.5, md: 3 },
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.04em",
              }}
            >
              Verified Purohits
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: "#0f172a",
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                lineHeight: "1.45",
                maxWidth: "500px",
                letterSpacing: "0em",
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
