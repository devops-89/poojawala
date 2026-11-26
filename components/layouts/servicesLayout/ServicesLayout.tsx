"use client";

import { Box, Container, Grid, useMediaQuery } from "@mui/material";
import CustomerServicesFilters from "../customerLayout/services/CustomerServicesFilters";
import ServiceGrid from "./ServiceGrid";
import ServicesHero from "./ServicesHero";
import { useServicesLayout } from "./useServicesLayout";
import MobileServicesLayout from "./mobile/MobileServicesLayout";

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
  const [selectedState, setSelectedState] = useState<string>(() => {
    if (stateParam) return stateParam;
    if (typeof window !== "undefined") {
      const stored =
        sessionStorage.getItem("user_selected_state") ||
        localStorage.getItem("user_selected_state");
      if (stored) return stored;
    }
    return "All";
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryIdParam || "",
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    categoryParam || "All Categories",
  );
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (cityParam) return cityParam;
    if (typeof window !== "undefined") {
      const stored =
        sessionStorage.getItem("user_selected_city") ||
        localStorage.getItem("user_selected_city");
      if (stored) return stored;
    }
    return "All";
  });

  useEffect(() => {
    if (stateParam) {
      setSelectedState(stateParam);
    } else if (typeof window !== "undefined") {
      const storedState =
        sessionStorage.getItem("user_selected_state") ||
        localStorage.getItem("user_selected_state");
      if (storedState) {
        setSelectedState(storedState);
      }
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
    } else if (typeof window !== "undefined") {
      const storedCity =
        sessionStorage.getItem("user_selected_city") ||
        localStorage.getItem("user_selected_city");
      if (storedCity) {
        setSelectedCity(storedCity);
      }
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
    searchQuery,
    setSearchQuery,
    stateOptions,
    selectedState,
    handleStateChange,
    cityOptions,
    selectedCity,
    setSelectedCity,
    selectedCategoryId,
    selectedCategoryName,
    handleCategoryChange,
  } = useServicesLayout();

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      sx={{
        bgcolor: "#FFFDF9",
        minHeight: "100vh",
        pb: 10,
        position: "relative",
      }}
    >
      {isMobile ? (
        <>
          <MobileServicesLayout />
        </>
      ) : (
        <>
          <ServicesHero mode={mode} />

          <Box sx={{ position: "relative" }}>
            <Container
              id="services-filters"
              maxWidth="lg"
              sx={{ position: "relative", zIndex: 1, mb: 4 }}
            >
              <CustomerServicesFilters
                searchTerm={searchQuery}
                onSearchChange={setSearchQuery}
                stateOptions={stateOptions}
                selectedState={selectedState}
                onStateChange={handleStateChange}
                selectedCategory={selectedCategoryName}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
                cityOptions={cityOptions}
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                hideLocationFilters={isOnline}
              />
            </Container>

            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12 }}>
                  <ServiceGrid
                    activeCategory={selectedCategoryName}
                    selectedCategoryId={selectedCategoryId}
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
        </>
      )}
    </Box>
  );
}
