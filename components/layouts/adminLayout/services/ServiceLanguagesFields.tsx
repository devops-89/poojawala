"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { FieldArray } from "formik";
import React from "react";

interface ServiceLanguagesFieldsProps {
  languages: Array<{ name: string; code?: string }>;
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default function ServiceLanguagesFields({
  languages,
  handleChange,
  handleBlur,
}: ServiceLanguagesFieldsProps) {
  return (
    <Grid size={{ xs: 12 }}>
      <FieldArray name="languages">
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
                mb: languages.length > 0 ? 2 : 0,
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
                  Languages
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Add languages supported for this ritual.
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => push({ name: "" })}
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
                Add Language
              </Button>
            </Box>

            {languages.map((lang: any, index: number) => (
              <Box
                key={`lang-${index}`}
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
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    name={`languages.${index}.name`}
                    label="Language"
                    placeholder="e.g. Hindi, Sanskrit, English"
                    value={lang.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                </Box>
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
  );
}
