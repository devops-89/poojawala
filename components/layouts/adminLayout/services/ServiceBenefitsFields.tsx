"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { FieldArray } from "formik";
import React from "react";

interface ServiceBenefitsFieldsProps {
  benefits: Array<{ title: string; description: string }>;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default function ServiceBenefitsFields({
  benefits,
  handleChange,
  handleBlur,
}: ServiceBenefitsFieldsProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <FieldArray name="benefits">
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
                mb: benefits.length > 0 ? 2 : 0,
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
                  Service Benefits
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Add key highlights and benefits of this ritual.
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => push({ title: "", description: "" })}
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
                Add Benefit
              </Button>
            </Box>

            {benefits.map((benefit: any, index: number) => (
              <Box
                key={`benefit-${index}`}
                sx={{
                  mt: 2,
                  p: 2.5,
                  bgcolor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "#475569",
                      fontSize: "0.9rem",
                    }}
                  >
                    Benefit #{index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => remove(index)}
                    sx={{
                      color: "#ef4444",
                      "&:hover": { bgcolor: "#fee2e2" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      size="small"
                      name={`benefits.${index}.title`}
                      label="Title *"
                      placeholder="e.g. Traditional Vedic Rituals"
                      value={benefit.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      name={`benefits.${index}.description`}
                      label="Description *"
                      placeholder="e.g. Performed according to traditional Vedic practices with Sankalp and Mantras."
                      value={benefit.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </FieldArray>
    </Grid>
  );
}
