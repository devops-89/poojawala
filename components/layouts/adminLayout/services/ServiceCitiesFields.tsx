"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Autocomplete, Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { City, State } from "country-state-city";
import { FieldArray } from "formik";
import React from "react";

interface ServiceCitiesFieldsProps {
  cities: Array<{ name: string; state: string }>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function ServiceCitiesFields({
  cities,
  setFieldValue,
}: ServiceCitiesFieldsProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <FieldArray name="cities">
        {({ push, remove }) => (
          <Box
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              p: 3,
              bgcolor: "#f8fafc",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: cities.length > 0 ? 2 : 0,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  Service Cities
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Specify cities and states where this service is available.
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => push({ name: "", state: "" })}
                sx={{
                  borderColor: "#FF6200",
                  color: "#FF6200",
                  textTransform: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#E65800",
                    bgcolor: "#fff7ed",
                  },
                }}
              >
                Add City
              </Button>
            </Box>

            {cities.map((city: any, index: number) => {
              const indianStates = State.getStatesOfCountry("IN") || [];
              const currentState = indianStates.find(
                (s) =>
                  s.name?.toLowerCase() === (city?.state || "").toLowerCase(),
              );
              const cityOptions = currentState
                ? (
                    City.getCitiesOfState("IN", currentState.isoCode) || []
                  ).map((c) => c.name)
                : (City.getCitiesOfCountry("IN") || [])
                    .slice(0, 100)
                    .map((c) => c.name);

              return (
                <Box
                  key={`city-${index}`}
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    mt: 2,
                    p: 2,
                    bgcolor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Grid container spacing={2} sx={{ flex: 1 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        freeSolo
                        forcePopupIcon={true}
                        options={indianStates.map((s) => s.name)}
                        value={city.state || ""}
                        onChange={(_, newValue) => {
                          setFieldValue(
                            `cities.${index}.state`,
                            newValue || "",
                          );
                        }}
                        onInputChange={(_, newInputValue) => {
                          setFieldValue(
                            `cities.${index}.state`,
                            newInputValue || "",
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="State"
                            placeholder="Select or type State (e.g. Uttar Pradesh)"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Autocomplete
                        freeSolo
                        forcePopupIcon={true}
                        options={cityOptions}
                        value={city.name || ""}
                        onChange={(_, newValue) => {
                          setFieldValue(`cities.${index}.name`, newValue || "");
                        }}
                        onInputChange={(_, newInputValue) => {
                          setFieldValue(
                            `cities.${index}.name`,
                            newInputValue || "",
                          );
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            label="City"
                            placeholder="Select or type City (e.g. Ghaziabad)"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <IconButton
                    onClick={() => remove(index)}
                    sx={{
                      color: "#ef4444",
                      "&:hover": { bgcolor: "#fee2e2" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}
      </FieldArray>
    </Grid>
  );
}
