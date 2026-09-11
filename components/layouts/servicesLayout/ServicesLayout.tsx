"use client";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ServiceGrid from "./ServiceGrid";

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

export default function ServicesLayout() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
            md: "linear-gradient(90deg, #FFFDF9 0%, rgba(255, 253, 249, 0.1) 50%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)"
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
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
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
              Explore Our Services
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

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                href="/purohits#top-purohits"
                sx={{
                  background: "#FF6200",
                  color: "#fff",
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.2, md: 1.5 },
                  borderRadius: "30px",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  boxShadow: "0 4px 14px rgba(255, 98, 0, 0.4)",
                  transition: "all 0.3s ease",
                  "&:hover": { background: "#F05A00" },
                }}
              >
                Book Now
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area Below Hero (Sticky container) */}
      <Box sx={{ position: "relative" }}>
        {/* Sticky Background Decorations */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              height: "100vh",
              width: "100%",
              overflow: "hidden",
            }}
          >
            {/* Left Chakra */}
            <Box
              component="img"
              src="/images/home/chakra.webp"
              alt="Chakra Decor Left"
              sx={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "400px", md: "700px" },
                height: { xs: "400px", md: "700px" },
                objectFit: "contain",
              }}
            />

            {/* Right Chakra */}
            <Box
              component="img"
              src="/images/home/chakraright.webp"
              alt="Chakra Decor Right"
              sx={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translate(50%, -50%)",
                width: { xs: "400px", md: "700px" },
                height: { xs: "400px", md: "700px" },
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>

        {/* Service Categories Grid Removed - Replaced with Search Bar */}
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, mb: 6 }}
        >
          <Paper
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              // The search query is already updated on change, so it's handled.
            }}
            sx={{
              p: "2px 16px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              mb: 4,
              borderRadius: "30px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255, 98, 0, 0.2)",
            }}
          >
            <InputBase
              sx={{
                ml: 1,
                flex: 1,
                py: 1.5,
                fontFamily: '"DM Sans", sans-serif',
              }}
              placeholder="Search for Services..."
              inputProps={{ "aria-label": "search for services" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton
              type="button"
              sx={{ p: "10px", color: "#FF6200" }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Container>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <ServiceGrid
                activeCategory={activeCategory}
                activeFilters={activeFilters}
                searchQuery={searchQuery}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
