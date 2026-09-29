"use client";

import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

export interface CategoryOption {
  id: string | number;
  name: string;
}

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
  cityOptions,
  selectedCity,
  onCityChange,
}: CustomerServicesFiltersProps) {
  const [internalCategories, setInternalCategories] = useState<CategoryOption[]>([]);

  useEffect(() => {
    if (onCategoryChange && (!categoryOptions || categoryOptions.length === 0)) {
      const fetchCats = async () => {
        try {
          const res = await getServiceCategoriesAPI(1, 100, "", true);
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

  const catsToUse = categoryOptions && categoryOptions.length > 0 ? categoryOptions : internalCategories;
  const categoryNames = ["All Categories", ...catsToUse.map((c) => c.name)];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {/* Search Input */}
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search pujas or services..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
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
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Autocomplete
            options={categoryNames}
            value={selectedCategory || "All Categories"}
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
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <Autocomplete
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
              placeholder="Select or type City"
              variant="outlined"
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
