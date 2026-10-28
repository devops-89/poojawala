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
                color: "#F1F5F9",
                fontWeight: 500,
                fontSize: { xs: "14.5px", sm: "15px", md: "16px" },
                lineHeight: 1.6,
                maxWidth: "520px",
                letterSpacing: "0em",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.9)",
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
