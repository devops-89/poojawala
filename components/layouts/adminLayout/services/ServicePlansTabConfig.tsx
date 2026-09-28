"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { FieldArray } from "formik";
import React, { useState } from "react";

interface ServicePlansTabConfigProps {
  values: {
    basicPrice: string | number;
    basicFeatures: Array<{ key: string; value: string }>;
    standardPrice: string | number;
    standardFeatures: Array<{ key: string; value: string }>;
  };
  errors: Record<string, any>;
  touched: Record<string, any>;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement>;
}

export default function ServicePlansTabConfig({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: ServicePlansTabConfigProps) {
  const [selectedPlanTab, setSelectedPlanTab] = useState<"basic" | "standard">(
    "basic",
  );

  return (
    <Grid size={{ xs: 12 }}>
      <Divider sx={{ my: 2 }} />
      <Typography
        variant="h6"
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 800,
          color: "#1e293b",
          mb: 0.5,
        }}
      >
        Service Plans (Basic & Standard)
      </Typography>
      <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mb: 2 }}>
        Click on Basic or Standard plan below to set price and feature key-value pairs.
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant={selectedPlanTab === "basic" ? "contained" : "outlined"}
          onClick={() => setSelectedPlanTab("basic")}
          sx={{
            borderRadius: "20px",
            px: 3,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            fontFamily: "var(--font-outfit), sans-serif",
            ...(selectedPlanTab === "basic"
              ? {
                  bgcolor: "#FF6200 !important",
                  color: "white !important",
                }
              : {
                  borderColor: "#cbd5e1",
                  color: "#475569",
                }),
          }}
        >
          Basic Plan
        </Button>
        <Button
          variant={selectedPlanTab === "standard" ? "contained" : "outlined"}
          onClick={() => setSelectedPlanTab("standard")}
          sx={{
            borderRadius: "20px",
            px: 3,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            fontFamily: "var(--font-outfit), sans-serif",
            ...(selectedPlanTab === "standard"
              ? {
                  bgcolor: "#FF6200 !important",
                  color: "white !important",
                }
              : {
                  borderColor: "#cbd5e1",
                  color: "#475569",
                }),
          }}
        >
          Standard Plan
        </Button>
      </Box>

      {/* Basic Plan Tab Content */}
      {selectedPlanTab === "basic" && (
        <Box
          sx={{
            p: 3,
            bgcolor: "#fffbf7",
            border: "1px solid #fed7aa",
            borderRadius: "16px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#c2410c",
              mb: 2,
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Basic Plan Configuration
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  mb: 1,
                  color: "#1e293b",
                }}
              >
                Basic Plan Price (₹) *
              </Typography>
              <TextField
                fullWidth
                name="basicPrice"
                placeholder="e.g. 4100"
                variant="outlined"
                type="number"
                value={values.basicPrice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.basicPrice && Boolean(errors.basicPrice)}
                helperText={touched.basicPrice && errors.basicPrice}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FieldArray name="basicFeatures">
                {({ push, remove }) => (
                  <Box sx={{ mt: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        Basic Plan Features
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => push({ key: "", value: "" })}
                        sx={{
                          ml: "auto",
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
                        Add Feature
                      </Button>
                    </Box>

                    {values.basicFeatures.map((item: any, index: number) => (
                      <Box
                        key={`basic-feat-${index}`}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          mb: 1.5,
                        }}
                      >
                        <Grid container spacing={2} sx={{ flex: 1 }}>
                          <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                              fullWidth
                              size="small"
                              name={`basicFeatures.${index}.key`}
                              placeholder="Key (e.g. flowers, pujaSamagri)"
                              value={item.key}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  bgcolor: "white",
                                },
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 7 }}>
                            <TextField
                              fullWidth
                              size="small"
                              name={`basicFeatures.${index}.value`}
                              placeholder="Value"
                              value={item.value}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  bgcolor: "white",
                                },
                              }}
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
                    ))}
                  </Box>
                )}
              </FieldArray>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Standard Plan Tab Content */}
      {selectedPlanTab === "standard" && (
        <Box
          sx={{
            p: 3,
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "16px",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.05rem",
              color: "#15803d",
              mb: 2,
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Standard Plan Configuration
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  mb: 1,
                  color: "#1e293b",
                }}
              >
                Standard Plan Price (₹) *
              </Typography>
              <TextField
                fullWidth
                name="standardPrice"
                placeholder="e.g. 6100"
                variant="outlined"
                type="number"
                value={values.standardPrice}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.standardPrice && Boolean(errors.standardPrice)}
                helperText={touched.standardPrice && errors.standardPrice}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <FieldArray name="standardFeatures">
                {({ push, remove }) => (
                  <Box sx={{ mt: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        Standard Plan Features
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => push({ key: "", value: "" })}
                        sx={{
                          ml: "auto",
                          borderColor: "#16a34a",
                          color: "#16a34a",
                          textTransform: "none",
                          borderRadius: "8px",
                          fontWeight: 600,
                          "&:hover": {
                            borderColor: "#15803d",
                            bgcolor: "#f0fdf4",
                          },
                        }}
                      >
                        Add Feature
                      </Button>
                    </Box>

                    {values.standardFeatures.map((item: any, index: number) => (
                      <Box
                        key={`std-feat-${index}`}
                        sx={{
                          display: "flex",
                          gap: 2,
                          alignItems: "center",
                          mb: 1.5,
                        }}
                      >
                        <Grid container spacing={2} sx={{ flex: 1 }}>
                          <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                              fullWidth
                              size="small"
                              name={`standardFeatures.${index}.key`}
                              placeholder="Key (e.g. flowers, pujaSamagri)"
                              value={item.key}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  bgcolor: "white",
                                },
                              }}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 7 }}>
                            <TextField
                              fullWidth
                              size="small"
                              name={`standardFeatures.${index}.value`}
                              placeholder="Value"
                              value={item.value}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  bgcolor: "white",
                                },
                              }}
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
                    ))}
                  </Box>
                )}
              </FieldArray>
            </Grid>
          </Grid>
        </Box>
      )}
    </Grid>
  );
}
