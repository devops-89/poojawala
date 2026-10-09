"use client";

import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import { getTemplesAPI } from "@/api/templeControllers";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CategoryOption, TempleOption } from "@/utils/types";
export type { CategoryOption, TempleOption };

interface CustomerServicesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // Optional State filter props (used in customer dashboard & purohit portal)
  stateOptions?: string[];
  selectedState?: string;
  onStateChange?: (value: string) => void;
  // Optional Category filter props (used in public services page)
  categoryOptions?: CategoryOption[];
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string, categoryName: string) => void;
  // Optional Temple filter props (used in public services page)
  templeOptions?: TempleOption[];
  selectedTemple?: string;
  onTempleChange?: (templeId: string, templeName: string) => void;
  // City filter props
  cityOptions: string[];
  selectedCity: string;
  onCityChange: (value: string) => void;
}

export default function CustomerServicesFilters({
  searchTerm,
  onSearchChange,
  stateOptions,
  selectedState,
  onStateChange,
  categoryOptions,
  selectedCategory = "All Categories",
  onCategoryChange,
  templeOptions,
  selectedTemple = "All Temples",
  onTempleChange,
  cityOptions,
  selectedCity,
  onCityChange,
}: CustomerServicesFiltersProps) {
  const [internalCategories, setInternalCategories] = useState<CategoryOption[]>([]);
  const [internalTemples, setInternalTemples] = useState<TempleOption[]>([]);

  useEffect(() => {
    if (onCategoryChange && (!categoryOptions || categoryOptions.length === 0)) {
      const fetchCats = async () => {
        try {
          const res = await getServiceCategoriesAPI(1, 100, "", true, "SERVICE");
          let list: any[] = [];
          if (res) {
            if (Array.isArray(res)) list = res;
            else if (res.data) {
              if (Array.isArray(res.data.data)) list = res.data.data;
              else if (Array.isArray(res.data)) list = res.data;
              else if (Array.isArray(res.data.categories)) list = res.data.categories;
            } else if (res.categories && Array.isArray(res.categories)) {
              list = res.categories;
            }
          }
          const activeOnly = list.filter((c: any) => c.isActive !== false);
          const formatted = activeOnly.map((c: any) => ({
            id: c.id || c._id,
            name: c.name || c.title || "Category",
          }));
          setInternalCategories(formatted);
        } catch (err) {
          console.error("Failed to fetch service categories for filter", err);
        }
      };
      fetchCats();
    }
  }, [categoryOptions, onCategoryChange]);

  useEffect(() => {
    if (onTempleChange && (!templeOptions || templeOptions.length === 0)) {
      const fetchTemples = async () => {
        try {
          const res = await getTemplesAPI(1, 100, "", true);
          let list: any[] = [];
          if (res) {
            if (Array.isArray(res)) list = res;
            else if (res.data) {
              if (Array.isArray(res.data.data)) list = res.data.data;
              else if (Array.isArray(res.data)) list = res.data;
              else if (Array.isArray(res.data.temples)) list = res.data.temples;
            } else if (res.temples && Array.isArray(res.temples)) {
              list = res.temples;
            }
          }
          const activeOnly = list.filter((t: any) => t.isActive !== false);
          const formatted = activeOnly.map((t: any) => ({
            id: t.id || t._id,
            name: t.name || "Temple",
          }));
          setInternalTemples(formatted);
        } catch (err) {
          console.error("Failed to fetch temples for filter", err);
        }
      };
      fetchTemples();
    }
  }, [templeOptions, onTempleChange]);

  const catsToUse = categoryOptions && categoryOptions.length > 0 ? categoryOptions : internalCategories;
  const categoryNames = ["All Categories", ...catsToUse.map((c) => c.name)];

  const displayCategoryName = React.useMemo(() => {
    if (!selectedCategory || selectedCategory === "All" || selectedCategory === "All Categories") {
      return "All Categories";
    }
    const matchById = catsToUse.find((c) => String(c.id) === String(selectedCategory));
    if (matchById) return matchById.name;

    const matchByName = catsToUse.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
    if (matchByName) return matchByName.name;

    return selectedCategory;
  }, [selectedCategory, catsToUse]);

  const templesToUse = templeOptions && templeOptions.length > 0 ? templeOptions : internalTemples;
  const templeNames = ["All Temples", ...templesToUse.map((t) => t.name)];

  const displayTempleName = React.useMemo(() => {
    if (!selectedTemple || selectedTemple === "All" || selectedTemple === "All Temples") {
      return "All Temples";
    }
    const matchById = templesToUse.find((t) => String(t.id) === String(selectedTemple));
    if (matchById) return matchById.name;

    const matchByName = templesToUse.find((t) => t.name.toLowerCase() === selectedTemple.toLowerCase());
    if (matchByName) return matchByName.name;

    return selectedTemple;
  }, [selectedTemple, templesToUse]);

  const filterCount =
    (stateOptions && onStateChange ? 1 : 0) +
    (onCategoryChange ? 1 : 0) +
    (onTempleChange ? 1 : 0) +
    1; // City is always present
  const filterGridSize =
    filterCount === 4
      ? { xs: 12, sm: 6, md: 3 }
      : filterCount === 3
      ? { xs: 12, sm: 4 }
      : filterCount === 2
      ? { xs: 12, sm: 6 }
      : { xs: 12 };

  const [localSearch, setLocalSearch] = useState(searchTerm || "");

  useEffect(() => {
    setLocalSearch(searchTerm || "");
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearchChange && localSearch !== (searchTerm || "")) {
        onSearchChange(localSearch);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchTerm]);

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {/* Search Input - Full Width */}
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search pujas or services..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#999" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "12px",
                bgcolor: "white",
                "& fieldset": { borderColor: "#E0E0E0" },
              },
            },
          }}
        />
      </Grid>

      {/* State Filter (Rendered if stateOptions & onStateChange are passed) */}
      {stateOptions && onStateChange && (
        <Grid size={filterGridSize}>
          <Autocomplete
            openOnFocus
            options={["All States", ...stateOptions]}
            value={
              selectedState && selectedState !== "All"
                ? selectedState
                : "All States"
            }
            onChange={(_, newValue) => {
              const val =
                !newValue || newValue === "All States" ? "All" : newValue;
              onStateChange(val);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by State"
                placeholder="Select or type State"
                variant="outlined"
                autoComplete="off"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                    "& fieldset": { borderColor: "#E0E0E0" },
                  },
                }}
              />
            )}
          />
        </Grid>
      )}

      {/* Category Filter (Rendered if onCategoryChange is passed) */}
      {onCategoryChange && (
        <Grid size={filterGridSize}>
          <Autocomplete
            openOnFocus
            options={categoryNames}
            value={displayCategoryName}
            onChange={(_, newValue) => {
              if (!newValue || newValue === "All Categories") {
                onCategoryChange("", "All Categories");
              } else {
                const found = catsToUse.find((c) => c.name === newValue);
                if (found) {
                  onCategoryChange(String(found.id), found.name);
                } else {
                  onCategoryChange("", newValue);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by Category"
                placeholder="Select or type Category"
                variant="outlined"
                autoComplete="off"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                    "& fieldset": { borderColor: "#E0E0E0" },
                  },
                }}
              />
            )}
          />
        </Grid>
      )}

      {/* Temple Filter (Rendered if onTempleChange is passed) */}
      {onTempleChange && (
        <Grid size={filterGridSize}>
          <Autocomplete
            openOnFocus
            options={templeNames}
            value={displayTempleName}
            onChange={(_, newValue) => {
              if (!newValue || newValue === "All Temples") {
                onTempleChange("", "All Temples");
              } else {
                const found = templesToUse.find((t) => t.name === newValue);
                if (found) {
                  onTempleChange(String(found.id), found.name);
                } else {
                  onTempleChange("", newValue);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter by Temple"
                placeholder="Select or type Temple"
                variant="outlined"
                autoComplete="off"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                    "& fieldset": { borderColor: "#E0E0E0" },
                  },
                }}
              />
            )}
          />
        </Grid>
      )}

      {/* City Filter */}
      <Grid size={filterGridSize}>
        <Autocomplete
          openOnFocus
          disabled={!selectedState || selectedState === "All"}
          options={["All Cities", ...cityOptions]}
          value={
            selectedCity && selectedCity !== "All"
              ? selectedCity
              : "All Cities"
          }
          onChange={(_, newValue) => {
            const val =
              !newValue || newValue === "All Cities" ? "All" : newValue;
            onCityChange(val);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by City"
              placeholder={
                !selectedState || selectedState === "All"
                  ? "Select State first"
                  : "Select or type City"
              }
              variant="outlined"
              autoComplete="off"
              helperText={
                !selectedState || selectedState === "All"
                  ? "Select state to enable city filter"
                  : undefined
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "white",
                  "& fieldset": { borderColor: "#E0E0E0" },
                },
              }}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}
