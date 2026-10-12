"use client";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import TempleGrid from "./TempleGrid";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export default function TemplesLayout() {
  const searchParams = useSearchParams();
  const searchParam = searchParams.get("search");

  const [searchInput, setSearchInput] = useState(searchParam || "");
  const [activeSearch, setActiveSearch] = useState(searchParam || "");

  useEffect(() => {
    if (searchParam !== null) {
      setSearchInput(searchParam);
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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActiveSearch(searchInput.trim());
  };

  const handleClear = () => {
    setSearchInput("");
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
          minHeight: { xs: "380px", sm: "460px", md: "520px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.92) 0%, rgba(255, 253, 249, 0.75) 45%, rgba(255, 253, 249, 0.1) 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, rgba(255, 253, 249, 0.88) 0%, rgba(255, 253, 249, 0.55) 40%, rgba(255, 253, 249, 0.05) 75%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 4, md: 6 },
          pb: { xs: 5, md: 7 },
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
          {/* Hero Content */}
          <Box sx={{ maxWidth: "680px" }}>
            {/* Tag Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.8,
                bgcolor: "#FFF0E6",
                color: COLORS.PRIMARY,
                border: "1px solid #FED7AA",
                px: 1.6,
                py: 0.5,
                borderRadius: "30px",
                fontSize: "12px",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                mb: 2,
              }}
            >
              <TempleHinduIcon sx={{ fontSize: 16 }} />
              <span>Divine Sanctuaries & Pilgrimages</span>
            </Box>

            {/* Headline */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                color: "#0f172a",
                mb: 0.5,
                fontSize: { xs: "2rem", sm: "2.8rem", md: "46px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.03em",
              }}
            >
              Explore Sacred
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                color: "#D32F2F",
                mb: { xs: 2, md: 2.5 },
                fontSize: { xs: "2rem", sm: "2.8rem", md: "46px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.03em",
              }}
            >
              Temples & Dhams
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: "#475569",
                fontWeight: 500,
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                lineHeight: 1.6,
                maxWidth: "560px",
                mb: 3.5,
              }}
            >
              Connect with consecrated shrines and historic dhams across India.
              Discover sacred legends, rich traditions, and book verified temple
              poojas directly.
            </Typography>

            {/* Search Bar in Hero */}
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#FFFFFF",
                borderRadius: "16px",
                p: "6px 8px 6px 16px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                border: "1.5px solid #E2E8F0",
                maxWidth: "520px",
                transition: "all 0.3s ease",
                "&:focus-within": {
                  borderColor: COLORS.PRIMARY,
                  boxShadow: "0 12px 34px rgba(255, 98, 0, 0.16)",
                },
              }}
            >
              <SearchIcon sx={{ color: "#94a3b8", fontSize: 22, mr: 1 }} />
              <TextField
                variant="standard"
                placeholder="Search temples by name or city..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  // Real-time API search update
                  setActiveSearch(e.target.value);
                }}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    sx: {
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "15px",
                      color: "#1e293b",
                      "&::placeholder": { color: "#94a3b8" },
                    },
                    endAdornment: searchInput ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClear}
                          aria-label="clear search"
                          sx={{ p: 0.5, mr: 0.5 }}
                        >
                          <ClearIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  },
                }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "13.5px",
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 2.8,
                  py: 1,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#E05500",
                    boxShadow: "0 4px 12px rgba(255, 98, 0, 0.3)",
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content: Temple Grid */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <TempleGrid
          searchQuery={activeSearch}
          onClearSearch={handleClear}
        />
      </Container>
    </Box>
  );
}
