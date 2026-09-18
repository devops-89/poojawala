"use client";
import { Box, Button, Container, Grid, Typography } from "@mui/material";

import PurohitGrid from "./PurohitGrid";

import { useEffect, useState } from "react";

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
    icon: <AppsIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Astrology Consultation",
    label: "Astrology Consultation",
    icon: <AutoAwesomeIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Online Puja",
    label: "Online Puja",
    icon: <LaptopMacIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Temple Puja",
    label: "Temple Puja",
    icon: <AccountBalanceIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Home Puja & Grah Pravesh",
    label: "Home & Grah Pravesh",
    icon: <HomeIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Vastu Consultation",
    label: "Vastu Consultation",
    icon: <ExploreIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Marriage Ceremony",
    label: "Marriage Ceremony",
    icon: <CelebrationIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Satyanarayan Katha",
    label: "Satyanarayan Katha",
    icon: <MenuBookIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Havan/Yagya",
    label: "Havan / Yagya",
    icon: <LocalFireDepartmentIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
  },
  {
    id: "Festival Special Pujas",
    label: "Festival Special Pujas",
    icon: <SpaIcon sx={{ fontSize: 28, color: "#FF6200" }} />,
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
          minHeight: { xs: "600px", md: "777px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.85) 0%, rgba(255, 253, 249, 0.6) 55%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, #FFFDF9 0%, rgba(255, 253, 249, 0.1) 50%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: 4,
          pb: 8,
          mb: 8,
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
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                color: "#1A1A1A",
                mb: 2,
                fontSize: { xs: "2.5rem", md: "48px" },
                letterSpacing: "-0.04em",
              }}
            >
              Explore Our Purohits
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#333",
                fontWeight: { xs: 600, md: 400 },
                mb: 4,
                fontSize: "18px",
                lineHeight: "1.5",
                maxWidth: "500px",
                letterSpacing: "0em",
              }}
            >
              Discover and book verified Pandits and Purohits for a wide range
              of religious ceremonies, tailored to your language and local
              traditions.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                "&:has(.talk-to:hover) .book-now": {
                  background: "transparent",
                  color: "#FF6200",
                  borderColor: "#FF6200",
                  border: "2px solid #FF6200",
                  boxShadow: "none",
                },
              }}
            >
              <Button
                className="book-now"
                variant="contained"
                href="/purohits#top-purohits"
                sx={{
                  background: "#FF6200",
                  border: "2px solid #FF6200",
                  color: "#fff",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: "30px",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#F05A00",
                    borderColor: "#F05A00",
                    boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                  },
                }}
              >
                Book Now
              </Button>
              <Button
                className="talk-to"
                variant="outlined"
                href="/purohit/register"
                sx={{
                  borderColor: "#1A1A1A",
                  color: "#1A1A1A",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: "30px",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  borderWidth: "2px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#FF6200",
                    background: "#FF6200",
                    color: "#FFFFFF",
                    borderWidth: "2px",
                  },
                }}
              >
                Register as Purohit
              </Button>
            </Box>
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
