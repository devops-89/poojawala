"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { City, State } from "country-state-city";
import { useFormikContext } from "formik";
import React, { useMemo, useState } from "react";

interface ServiceCitiesFieldsProps {
  cities: Array<{ name: string; state: string }>;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function ServiceCitiesFields({
  cities = [],
  setFieldValue,
}: ServiceCitiesFieldsProps) {
  const formik = useFormikContext<any>();
  const updateCities = (newList: Array<{ name: string; state: string }>) => {
    if (setFieldValue) {
      setFieldValue("cities", newList);
    } else if (formik?.setFieldValue) {
      formik.setFieldValue("cities", newList);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const indianStates = useMemo(() => {
    const states = State.getStatesOfCountry("IN") || [];
    return states.map((s) => s.name);
  }, []);

  const cityOptions = useMemo(() => {
    if (!selectedState) {
      return (City.getCitiesOfCountry("IN") || []).slice(0, 100).map((c) => c.name);
    }
    const allStates = State.getStatesOfCountry("IN") || [];
    const currentState = allStates.find(
      (s) => s.name?.toLowerCase().trim() === selectedState.toLowerCase().trim()
    );
    if (currentState && currentState.isoCode) {
      const stateCities = City.getCitiesOfState("IN", currentState.isoCode) || [];
      return Array.from(new Set(stateCities.map((c) => c.name))).sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return [];
  }, [selectedState]);

  const handleStartAdd = () => {
    setSelectedState("");
    setSelectedCity("");
    setInputError(null);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedState("");
    setSelectedCity("");
    setInputError(null);
  };

  const handleSaveCity = () => {
    const trimmedCity = selectedCity.trim();
    const trimmedState = selectedState.trim();

    if (!trimmedCity) {
      setInputError("Please select or type a city name");
      return;
    }

    // Check if city already added
    const alreadyExists = cities.some(
      (c) =>
        c.name.toLowerCase() === trimmedCity.toLowerCase() &&
        c.state.toLowerCase() === trimmedState.toLowerCase()
    );
    if (alreadyExists) {
      setInputError("This city has already been added");
      return;
    }

    const updated = [
      ...cities,
      {
        name: trimmedCity,
        state: trimmedState,
      },
    ];

    updateCities(updated);
    setSelectedCity("");
    setInputError(null);
    // Keep state selected so user can quickly add more cities from same state
  };

  const handleDeleteCity = (index: number) => {
    const updated = cities.filter((_, i) => i !== index);
    updateCities(updated);
  };

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          p: 3,
          bgcolor: "#f8fafc",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#1e293b",
                fontSize: "1.05rem",
              }}
            >
              Service Cities
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
              Specify cities and states where this service is available.
            </Typography>
          </Box>
          {!isAdding && (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleStartAdd}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "white",
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 600,
                fontFamily: FONTS.OUTFIT,
                boxShadow: "none",
                "&:hover": {
                  bgcolor: COLORS.PRIMARY_DARK,
                  boxShadow: "none",
                },
              }}
            >
              Add City
            </Button>
          )}
        </Box>

        {/* Inline Add City Input Box */}
        {isAdding && (
          <Box
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: "14px",
              border: "1.5px solid #fed7aa",
              bgcolor: "#fffbf5",
              boxShadow: "0 2px 8px rgba(234, 88, 12, 0.05)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#9a3412",
                }}
              >
                Add Available City & State
              </Typography>
              <IconButton size="small" onClick={handleCancel}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  options={indianStates}
                  value={selectedState}
                  onChange={(_, newValue) => {
                    const clean = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                    setSelectedState(clean);
                    setSelectedCity("");
                    if (inputError) setInputError(null);
                  }}
                  onInputChange={(_, newInputValue) => {
                    const clean = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                    setSelectedState(clean);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="State"
                      placeholder="Select or type state (e.g. Uttar Pradesh)"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          bgcolor: "white",
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  options={cityOptions}
                  value={selectedCity}
                  onChange={(_, newValue) => {
                    const clean = (newValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                    setSelectedCity(clean);
                    if (inputError) setInputError(null);
                  }}
                  onInputChange={(_, newInputValue) => {
                    const clean = (newInputValue || "").replace(/[^a-zA-Z\s.-]/g, "");
                    setSelectedCity(clean);
                    if (inputError) setInputError(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="City *"
                      placeholder={
                        selectedState
                          ? `Select or type city in ${selectedState}`
                          : "Select state or type city directly"
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveCity();
                        }
                      }}
                      error={Boolean(inputError)}
                      helperText={inputError || undefined}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          bgcolor: "white",
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      color: "#64748b",
                      borderColor: "#cbd5e1",
                      fontFamily: FONTS.OUTFIT,
                      "&:hover": { borderColor: "#94a3b8", bgcolor: "#f1f5f9" },
                    }}
                  >
                    Done
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={handleSaveCity}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      bgcolor: COLORS.PRIMARY,
                      fontWeight: 700,
                      fontFamily: FONTS.OUTFIT,
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: COLORS.PRIMARY_DARK,
                        boxShadow: "none",
                      },
                    }}
                  >
                    Save City
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Saved Cities List */}
        {cities.length === 0 && !isAdding ? (
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              bgcolor: "white",
              borderRadius: "12px",
              border: "1px dashed #cbd5e1",
            }}
          >
            <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem", fontFamily: FONTS.OUTFIT }}>
              No cities added yet. Click &quot;Add City&quot; above to specify service locations.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {cities.map((city, index) => {
              const displayLabel = city.state
                ? `${city.name}, ${city.state}`
                : city.name;
              return (
                <Chip
                  key={`city-chip-${index}`}
                  icon={<LocationOnIcon sx={{ fontSize: 18, color: `${COLORS.PRIMARY} !important` }} />}
                  label={displayLabel}
                  onDelete={() => handleDeleteCity(index)}
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "white",
                    border: "1px solid #e2e8f0",
                    py: 2.2,
                    px: 0.5,
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    color: "#1e293b",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    "& .MuiChip-deleteIcon": {
                      color: "#94a3b8",
                      "&:hover": { color: "#ef4444" },
                    },
                    "&:hover": {
                      borderColor: "#cbd5e1",
                      bgcolor: "#fffbf5",
                    },
                  }}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </Grid>
  );
}
