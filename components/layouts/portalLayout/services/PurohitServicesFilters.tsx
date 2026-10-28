"use client";

import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface PurohitServicesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // State filter
  stateOptions?: string[];
  selectedState?: string;
  onStateChange: (value: string) => void;
  // City filter
  cityOptions?: string[];
  selectedCity?: string;
  onCityChange: (value: string) => void;
  // Mode filter (Online / Offline / All Modes)
  selectedMode?: string;
  onModeChange: (value: string) => void;
}

const MODE_OPTIONS = ["All Modes", "Online", "Offline"];

export default function PurohitServicesFilters({
  searchTerm,
  onSearchChange,
  stateOptions = [],
  selectedState = "All",
  onStateChange,
  cityOptions = [],
  selectedCity = "All",
  onCityChange,
  selectedMode = "All",
  onModeChange,
}: PurohitServicesFiltersProps) {
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
      {/* Search Input */}
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

      {/* Online / Offline Mode Filter */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <Autocomplete
          openOnFocus
          options={MODE_OPTIONS}
          value={
            !selectedMode || selectedMode === "All" || selectedMode === "All Modes"
              ? "All Modes"
              : selectedMode === "Online"
              ? "Online"
              : selectedMode === "Offline"
              ? "Offline"
              : selectedMode
          }
          onChange={(_, newValue) => {
            const val =
              !newValue || newValue === "All Modes" || newValue === "All"
                ? "All"
                : newValue;
            onModeChange(val);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filter by Mode"
              placeholder="Select Mode"
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

      {/* State Filter */}
      <Grid size={{ xs: 12, sm: 4 }}>
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

      {/* City Filter */}
      <Grid size={{ xs: 12, sm: 4 }}>
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
