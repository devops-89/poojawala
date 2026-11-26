"use client";

import { City, State } from "@/utils/indianLocations";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ServicesMode } from "./ServicesHero";

const INDIAN_STATES = State.getStatesOfCountry("IN") || [];
const INDIAN_STATE_OPTIONS = INDIAN_STATES.map((s) => s.name).sort((a, b) =>
  a.localeCompare(b),
);
const EMPTY_OPTIONS: string[] = [];

const SEO_METADATA: Record<ServicesMode, { title: string; description: string }> =
  {
    offline: {
      title: "Offline Pooja Services | Book Verified Pandit at Home | 1Pooja",
      description:
        "Discover and book verified Pandits and Purohits for offline pooja at home or temple. Authentic Vedic rituals tailored to your language and local traditions.",
    },
    online: {
      title: "Online Pooja Services | Book Live Digital E-Pooja | 1Pooja",
      description:
        "Experience authentic sacred rituals performed live via interactive digital video by experienced Purohits from anywhere with 1Pooja.",
    },
    default: {
      title: "Book Pandit & Purohit Online or Offline for All Pooja | 1Pooja",
      description:
        "Book experienced pandit & Purohit online or offline for Ganesh Pooja, Griha Pravesh, Havan and other Hindu rituals with 1Pooja.",
    },
  };

const isAllValue = (value: string, allLabel: string) =>
  !value || value === "All" || value === allLabel;

export const getIndianCitiesByState = (stateName: string): string[] => {
  if (isAllValue(stateName, "All States")) return EMPTY_OPTIONS;

  const normalizedState = stateName.toLowerCase().trim();
  const stateObj = INDIAN_STATES.find(
    (s) => s.name.toLowerCase().trim() === normalizedState,
  );
  if (!stateObj) return EMPTY_OPTIONS;

  const rawCities = City.getCitiesOfState("IN", stateObj.isoCode) || [];
  return Array.from(new Set(rawCities.map((c) => c.name))).sort((a, b) =>
    a.localeCompare(b),
  );
};

const getStoredLocationValue = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(key) || localStorage.getItem(key);
};

export const useServicesLayout = () => {
  const searchParams = useSearchParams();
  const isOffline = searchParams.get("isOffline") === "true";
  const isOnline = searchParams.get("isOnline") === "true";
  const stateParam = searchParams.get("state");
  const cityParam = searchParams.get("city");
  const categoryParam = searchParams.get("category");
  const categoryIdParam = searchParams.get("categoryId");
  const searchParam = searchParams.get("search");

  const mode: ServicesMode = isOnline
    ? "online"
    : isOffline
      ? "offline"
      : "default";

  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [selectedState, setSelectedState] = useState(
    () => stateParam || getStoredLocationValue("user_selected_state") || "All",
  );
  const [selectedCity, setSelectedCity] = useState(
    () => cityParam || getStoredLocationValue("user_selected_city") || "All",
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categoryIdParam || "",
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    categoryParam || "All Categories",
  );

  const prevParamsRef = useRef({ stateParam, cityParam });

  // Sync incoming URL parameter changes into local filter state
  useEffect(() => {
    const prev = prevParamsRef.current;

    if (stateParam !== null) {
      setSelectedState(stateParam || "All");
    } else if (prev.stateParam !== null) {
      setSelectedState("All");
    }

    if (cityParam !== null) {
      setSelectedCity(cityParam || "All");
    } else if (prev.cityParam !== null) {
      setSelectedCity("All");
    }

    prevParamsRef.current = { stateParam, cityParam };
    setSelectedCategoryId(categoryIdParam || "");
    setSelectedCategoryName(categoryParam || "All Categories");
    setSearchQuery(searchParam || "");
  }, [stateParam, cityParam, categoryIdParam, categoryParam, searchParam]);

  // Keep document title & description aligned with active service mode
  useEffect(() => {
    if (typeof document === "undefined") return;
    const { title, description } = SEO_METADATA[mode];
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);
  }, [mode]);

  // Sync active filters to URL without clobbering pagination managed by ServiceGrid
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentParams = new URLSearchParams(window.location.search);
    const params = new URLSearchParams();

    if (isOnline) params.set("isOnline", "true");
    if (isOffline) params.set("isOffline", "true");
    if (!isOnline && !isAllValue(selectedState, "All States")) {
      params.set("state", selectedState);
    }
    if (!isOnline && !isAllValue(selectedCity, "All Cities")) {
      params.set("city", selectedCity);
    }
    if (!isAllValue(selectedCategoryId, "All Categories")) {
      params.set("categoryId", selectedCategoryId);
    }
    if (searchQuery) params.set("search", searchQuery);

    const currentPage = currentParams.get("page");
    if (currentPage) params.set("page", currentPage);

    const queryStr = params.toString();
    const nextUrl = queryStr
      ? `${window.location.pathname}?${queryStr}`
      : window.location.pathname;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [
    isOnline,
    isOffline,
    selectedState,
    selectedCity,
    selectedCategoryId,
    searchQuery,
  ]);

  const cityOptions = useMemo(() => {
    if (isOnline) return EMPTY_OPTIONS;
    return getIndianCitiesByState(selectedState);
  }, [isOnline, selectedState]);

  const handleStateChange = useCallback((nextState: string) => {
    setSelectedState(nextState);
    setSelectedCity("All");
  }, []);

  const handleApplyLocation = useCallback(
    (nextState: string, nextCity: string) => {
      setSelectedState(nextState);
      setSelectedCity(nextState === "All" ? "All" : nextCity);
    },
    [],
  );

  const handleCategoryChange = useCallback((catId: string, catName: string) => {
    setSelectedCategoryId(catId);
    setSelectedCategoryName(catName);
  }, []);

  return {
    mode,
    isOnline,
    isOffline,
    searchQuery,
    setSearchQuery,
    stateOptions: isOnline ? EMPTY_OPTIONS : INDIAN_STATE_OPTIONS,
    selectedState: isOnline ? "All" : selectedState,
    handleStateChange,
    handleApplyLocation,
    cityOptions,
    selectedCity: isOnline ? "All" : selectedCity,
    setSelectedCity,
    selectedCategoryId,
    selectedCategoryName,
    handleCategoryChange,
  };
};
