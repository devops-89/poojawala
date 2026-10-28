"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import { City, State } from "country-state-city";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import CustomerServicesFilters from "../customerLayout/services/CustomerServicesFilters";
import ServiceGrid from "./ServiceGrid";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { getServiceCategoriesAPI } from "@/api/serviceControllers";

export default function ServicesLayout() {
  const searchParams = useSearchParams();
  const isOffline = searchParams.get("isOffline") === "true";
  const isOnline = searchParams.get("isOnline") === "true";
  const stateParam = searchParams.get("state");
  const cityParam = searchParams.get("city");
  const categoryParam = searchParams.get("category");
  const categoryIdParam = searchParams.get("categoryId");

  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string>(
    stateParam || "All",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryIdParam || "",
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    categoryParam || "All Categories",
  );
  const [selectedCity, setSelectedCity] = useState<string>(cityParam || "All");

  useEffect(() => {
    if (stateParam) {
      setSelectedState(stateParam);
    }
    const targetCatId =
      categoryIdParam ||
      (typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("categoryId")
        : "");
    if (targetCatId) {
      setSelectedCategoryId(targetCatId);
      getServiceCategoriesAPI(1, 100, "", true, "SERVICE")
        .then((res: any) => {
          let list: any[] = [];
          if (Array.isArray(res)) list = res;
          else if (res?.data) {
            if (Array.isArray(res.data.data)) list = res.data.data;
            else if (Array.isArray(res.data)) list = res.data;
            else if (Array.isArray(res.data.categories)) list = res.data.categories;
          } else if (Array.isArray(res?.categories)) {
            list = res.categories;
          }
          const found = list.find(
            (c: any) => String(c.id || c._id) === String(targetCatId),
          );
          if (found?.name) {
            setSelectedCategoryName(found.name);
          }
        })
        .catch(() => {});
    }
    if (categoryParam) {
      setSelectedCategoryName(categoryParam);
    }
    if (cityParam) {
      setSelectedCity(cityParam);
    }
  }, [stateParam, categoryParam, categoryIdParam, cityParam]);

  useEffect(() => {
    let pageTitle = "Book Pandit & Purohit Online or Offline for All Pooja | 1Pooja";
    let pageDesc =
      "Book experienced pandit & Purohit online or offline for Ganesh Pooja, Griha Pravesh, Havan and other Hindu rituals with 1Pooja.";

    if (isOffline) {
      pageTitle = "Offline Pooja Services | Book Verified Pandit at Home | 1Pooja";
      pageDesc =
        "Discover and book verified Pandits and Purohits for offline pooja at home or temple. Authentic Vedic rituals tailored to your language and local traditions.";
    } else if (isOnline) {
      pageTitle = "Online Pooja Services | Book Live Digital E-Pooja | 1Pooja";
      pageDesc =
        "Experience authentic sacred rituals performed live via interactive digital video by experienced Purohits from anywhere with 1Pooja.";
    }

    if (typeof document !== "undefined") {
      document.title = pageTitle;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", pageDesc);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", pageDesc);
        document.head.appendChild(metaDesc);
      }
    }
  }, [isOffline, isOnline]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (isOnline) {
      params.set("isOnline", "true");
    }
    if (isOffline) {
      params.set("isOffline", "true");
    }
    if (
      !isOnline &&
      selectedState &&
      selectedState !== "All" &&
      selectedState !== "All States"
    ) {
      params.set("state", selectedState);
    }
    if (
      !isOnline &&
      selectedCity &&
      selectedCity !== "All" &&
      selectedCity !== "All Cities"
    ) {
      params.set("city", selectedCity);
    }
    if (
      selectedCategoryId &&
      selectedCategoryId !== "All" &&
      selectedCategoryId !== "All Categories"
    ) {
      params.set("categoryId", selectedCategoryId);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    const queryStr = params.toString();
    const newUrl = queryStr
      ? `${window.location.pathname}?${queryStr}`
      : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [
    isOnline,
    isOffline,
    selectedState,
    selectedCity,
    selectedCategoryId,
    selectedCategoryName,
    searchQuery,
  ]);

  const indianStates = useMemo(() => State.getStatesOfCountry("IN") || [], []);
  const stateOptions = useMemo(
    () => indianStates.map((s) => s.name).sort((a, b) => a.localeCompare(b)),
    [indianStates],
  );

  const selectedStateObj = useMemo(() => {
    if (!selectedState || selectedState === "All") return null;
    return indianStates.find(
      (s) => s.name.toLowerCase().trim() === selectedState.toLowerCase().trim(),
    );
  }, [selectedState, indianStates]);

  const cityOptions = useMemo(() => {
    const rawCities = selectedStateObj
      ? City.getCitiesOfState("IN", selectedStateObj.isoCode) || []
      : [];
    const names = rawCities.map((c) => c.name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [selectedStateObj]);

  const handleCategoryChange = (catId: string, catName: string) => {
    setSelectedCategoryId(catId);
    setSelectedCategoryName(catName);
  };

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
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
      {/* Hero Section matching Homepage & Purohits page */}
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
              Explore Our{" "}
              <Box
                component="span"
                sx={{
                  display: { xs: "inline", sm: "block" },
                  fontWeight: 800,
                  color: "#D32F2F",
                }}
              >
                {isOnline
                  ? "Online Pooja Services"
                  : isOffline
                  ? "Offline Pooja Services"
                  : "Sacred Pooja Services"}
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
              {isOnline
                ? "Experience authentic sacred rituals performed live via interactive digital video by experienced Purohits from anywhere."
                : "Discover and book verified Pandits and Purohits for a wide range of religious ceremonies, tailored to your language and local traditions."}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content Area Below Hero */}
      <Box sx={{ position: "relative" }}>
        {/* Search, Category & City Filters Bar */}
        <Container
          id="services-filters"
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 1, mb: 4 }}
        >
          <CustomerServicesFilters
            searchTerm={searchQuery}
            onSearchChange={setSearchQuery}
            stateOptions={isOnline ? [] : stateOptions}
            selectedState={isOnline ? "All" : selectedState}
            onStateChange={(newVal) => {
              setSelectedState(newVal);
              setSelectedCity("All");
            }}
            selectedCategory={selectedCategoryName}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
            cityOptions={isOnline ? [] : cityOptions}
            selectedCity={isOnline ? "All" : selectedCity}
            onCityChange={handleCityChange}
            hideLocationFilters={isOnline}
          />
        </Container>

        {/* Services Grid */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <ServiceGrid
                activeCategory={selectedCategoryName}
                selectedCategoryId={selectedCategoryId}
                activeFilters={activeFilters}
                searchQuery={searchQuery}
                selectedState={selectedState}
                selectedCity={selectedCity}
                isOnline={isOnline}
                isOffline={isOffline}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
