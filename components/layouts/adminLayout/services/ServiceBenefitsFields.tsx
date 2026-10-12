"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useFormikContext } from "formik";
import React, { useState } from "react";

interface ServiceBenefitsFieldsProps {
  benefits: Array<{ title: string; description: string }>;
  handleChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  setFieldValue?: (field: string, value: any, shouldValidate?: boolean) => void;
}

export default function ServiceBenefitsFields({
  benefits = [],
  setFieldValue,
}: ServiceBenefitsFieldsProps) {
  const formik = useFormikContext<any>();
  const updateBenefits = (newList: Array<{ title: string; description: string }>) => {
    if (setFieldValue) {
      setFieldValue("benefits", newList);
    } else if (formik?.setFieldValue) {
      formik.setFieldValue("benefits", newList);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleStartAdd = () => {
    setEditingIndex(null);
    setTitleInput("");
    setDescInput("");
    setInputError(null);
    setIsAdding(true);
  };

  const handleStartEdit = (index: number) => {
    const item = benefits[index];
    if (item) {
      setTitleInput(item.title || "");
      setDescInput(item.description || "");
      setEditingIndex(index);
      setInputError(null);
      setIsAdding(true);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setTitleInput("");
    setDescInput("");
    setInputError(null);
  };

  const handleSave = () => {
    const trimmedTitle = titleInput.trim();
    const trimmedDesc = descInput.trim();

    if (!trimmedTitle) {
      setInputError("Please enter benefit title");
      return;
    }

    let updated: Array<{ title: string; description: string }>;
    if (editingIndex !== null && editingIndex >= 0 && editingIndex < benefits.length) {
      updated = [...benefits];
      updated[editingIndex] = {
        title: trimmedTitle,
        description: trimmedDesc,
      };
    } else {
      updated = [
        ...benefits,
        {
          title: trimmedTitle,
          description: trimmedDesc,
        },
      ];
    }

    updateBenefits(updated);
    setIsAdding(false);
    setEditingIndex(null);
    setTitleInput("");
    setDescInput("");
    setInputError(null);
  };

  const handleDelete = (index: number) => {
    const updated = benefits.filter((_, i) => i !== index);
    updateBenefits(updated);
    if (editingIndex === index) {
      handleCancel();
    }
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
              Service Benefits
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
              Add key highlights and benefits of this ritual.
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
              Add Benefit
            </Button>
          )}
        </Box>

        {/* Inline Add / Edit Form */}
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
                {editingIndex !== null
                  ? `Edit Benefit #${editingIndex + 1}`
                  : "New Benefit Details"}
              </Typography>
              <IconButton size="small" onClick={handleCancel}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Title *"
                  placeholder="e.g. Traditional Vedic Rituals & Sankalp"
                  value={titleInput}
                  onChange={(e) => {
                    setTitleInput(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSave();
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
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2.5}
                  size="small"
                  label="Description"
                  placeholder="e.g. Performed according to Vedic scriptures with certified Purohits and custom Sankalp."
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      bgcolor: "white",
                    },
                  }}
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
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={handleSave}
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
                    {editingIndex !== null ? "Save Changes" : "Save Benefit"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Saved Benefits Cards */}
        {benefits.length === 0 && !isAdding ? (
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
              No benefits added yet. Click &quot;Add Benefit&quot; above to add highlights.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {benefits.map((benefit, index) => (
              <Box
                key={`benefit-${index}`}
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: "6px",
                          bgcolor: "#fff7ed",
                          color: COLORS.PRIMARY,
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          fontFamily: FONTS.OUTFIT,
                        }}
                      >
                        Benefit {index + 1}
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                          color: "#1e293b",
                        }}
                      >
                        {benefit.title}
                      </Typography>
                    </Box>
                    {benefit.description && (
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "0.86rem",
                          color: "#64748b",
                          whiteSpace: "pre-line",
                          mt: 0.5,
                        }}
                      >
                        {benefit.description}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleStartEdit(index)}
                      sx={{
                        color: "#64748b",
                        "&:hover": { color: COLORS.PRIMARY, bgcolor: "#fff7ed" },
                      }}
                      title="Edit Benefit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(index)}
                      sx={{
                        color: "#94a3b8",
                        "&:hover": { color: "#ef4444", bgcolor: "#fee2e2" },
                      }}
                      title="Delete Benefit"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Grid>
  );
}
