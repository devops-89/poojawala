"use client";

import { Box, Container, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import TempleGrid from "./TempleGrid";
import { FONTS } from "@/utils/fonts";

export default function TemplesLayout() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search");

  const [activeSearch, setActiveSearch] = useState(searchParam || "");

  useEffect(() => {
    if (searchParam !== null) {
      setActiveSearch(searchParam);
    }
  }, [searchParam]);

  // Sync active search to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeSearch && activeSearch.trim()) {
      params.set("search", activeSearch.trim());
    } else {
      params.delete("search");
    }
    const queryStr = params.toString();
    const newUrl = queryStr
      ? `${window.location.pathname}?${queryStr}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [activeSearch]);

  const handleClear = () => {
    setActiveSearch("");
  };

  return (
    <Box
      sx={{
        bgcolor: "#FFFDF9",
        minHeight: "100vh",
        pb: 10,
        position: "relative",
      }}
    >
      {/* Hero Section matching Homepage & Services page */}
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
              component="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                color: "#0f172a",
                mb: { xs: 1.5, md: 3 },
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.04em",
              }}
            >
              Explore Sacred{" "}
              <Box
                component="span"
                sx={{
                  display: { xs: "inline", sm: "block" },
                  fontWeight: 800,
                  color: "#D32F2F",
                }}
              >
                Temples & Dhams
              </Box>
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
              Connect with consecrated shrines and historic dhams across India.
              Discover sacred legends, rich traditions, and book verified temple
              poojas directly.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content: Temple Grid */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <TempleGrid
          searchQuery={activeSearch}
          onSearchChange={setActiveSearch}
          onClearSearch={handleClear}
        />
      </Container>
    </Box>
  );
}
