"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import {
  createServiceCategoryAPI,
  updateServiceCategoryAPI,
} from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { convertImageToWebP } from "@/utils/imageHelper";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CategoryImageUpload from "./CategoryImageUpload";

export type CategoryModalMode = "add" | "edit" | "view";

interface CategoryModalProps {
  open: boolean;
  mode: CategoryModalMode;
  category?: any;
  loading?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CategoryModal({
  open,
  mode,
  category,
  loading = false,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  const [nameInput, setNameInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [categoryType, setCategoryType] = useState<"SERVICE" | "PRODUCT">(
    "SERVICE",
  );
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (open) {
      setTouched(false);
      if (mode === "edit" || mode === "view") {
        setNameInput(category?.name || category?.title || "");
        setDescriptionInput(category?.description || category?.details || "");
        setCategoryType(category?.categoryType || "SERVICE");
        setIconFile(null);
        setIconPreview(
          category?.iconDownloadurl ||
            category?.iconUrl ||
            category?.image ||
            category?.imageUrl ||
            "",
        );
      } else {
        // Add mode reset
        setNameInput("");
        setDescriptionInput("");
        setCategoryType("SERVICE");
        setIconFile(null);
        setIconPreview("");
      }
    }
  }, [open, mode, category]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const webpFile = await convertImageToWebP(file);
      setIconFile(webpFile);
      setIconPreview(URL.createObjectURL(webpFile));
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIconFile(null);
    setIconPreview("");
  };

  const handleSave = async () => {
    setTouched(true);
    if (!nameInput.trim()) {
      showSnackbar("Please fill in all mandatory fields", "error");
      return;
    }
    setSaving(true);
    try {
      if (mode === "add") {
        const formData = new FormData();
        formData.append("name", nameInput.trim());
        formData.append("categoryType", categoryType);
        if (descriptionInput.trim()) {
          formData.append("description", descriptionInput.trim());
        }
        if (iconFile) {
          formData.append("icon", iconFile);
        }

        const res = await createServiceCategoryAPI(formData);
        if (res?.success || res?.status === "success" || res?.data) {
          showSnackbar("Category created successfully", "success");
          onSuccess?.();
          onClose();
        } else {
          showSnackbar(res?.message || "Failed to create category", "error");
        }
      } else if (mode === "edit" && category) {
        const targetId = category.id || category._id;
        let data: any;

        if (iconFile) {
          const formData = new FormData();
          formData.append("name", nameInput.trim());
          formData.append("categoryType", categoryType);
          if (descriptionInput.trim()) {
            formData.append("description", descriptionInput.trim());
          }
          formData.append("icon", iconFile);
          data = formData;
        } else {
          data = {
            name: nameInput.trim(),
            description: descriptionInput.trim(),
            categoryType: categoryType,
          };
        }

        const res = await updateServiceCategoryAPI(targetId, data);
        if (res?.success || res?.status === "success" || res?.data || res) {
          showSnackbar("Category updated successfully", "success");
          onSuccess?.();
          onClose();
        } else {
          showSnackbar(res?.message || "Failed to update category", "error");
        }
      }
    } catch (err: any) {
      console.error(err);
      showSnackbar(
        err.response?.data?.message ||
          `Error ${mode === "add" ? "creating" : "updating"} category`,
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const getTitle = () => {
    if (mode === "add") return "Add Category";
    if (mode === "edit") return "Edit Category";
    return "Category Details";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: "16px", p: 1 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 700,
          color: "#1e293b",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {getTitle()}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: "none" }}>
        {mode === "view" ? (
          loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: COLORS.PRIMARY }} />
            </Box>
          ) : category ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "12px",
                    overflow: "hidden",
                    bgcolor: "#fff0e6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    border: "1px solid #fed7aa",
                  }}
                >
                  {iconPreview ? (
                    <Image
                      src={iconPreview}
                      alt={category.name || "Category"}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  ) : (
                    <CategoryIcon sx={{ color: COLORS.PRIMARY, fontSize: 32 }} />
                  )}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#1e293b",
                    }}
                  >
                    {category.name || category.title}
                  </Typography>
                  <Chip
                    label={category.isActive !== false ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor:
                        category.isActive !== false ? "#dcfce7" : "#fee2e2",
                      color:
                        category.isActive !== false ? "#166534" : "#991b1b",
                    }}
                  />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#94a3b8",
                    mb: 0.5,
                  }}
                >
                  DESCRIPTION
                </Typography>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 400,
                    fontSize: "0.95rem",
                    color: "#334155",
                    lineHeight: 1.5,
                  }}
                >
                  {category.description || "No description provided."}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {(category.id || category._id) && (
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                      }}
                    >
                      CATEGORY ID
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#1e293b",
                      }}
                    >
                      C-{category.id || category._id}
                    </Typography>
                  </Grid>
                )}

                <Grid size={{ xs: 6 }}>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      color: "#94a3b8",
                    }}
                  >
                    CATEGORY TYPE
                  </Typography>
                  <Chip
                    label={category.categoryType || "SERVICE"}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      bgcolor:
                        (category.categoryType || "SERVICE") === "SERVICE"
                          ? "#e0f2fe"
                          : "#fef3c7",
                      color:
                        (category.categoryType || "SERVICE") === "SERVICE"
                          ? "#0369a1"
                          : "#b45309",
                      borderRadius: "6px",
                    }}
                  />
                </Grid>

                {category.createdAt && (
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                      }}
                    >
                      CREATED AT
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        color: "#1e293b",
                      }}
                    >
                      {new Date(category.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : null
        ) : (
          /* Add & Edit Mode Form */
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          >
            <TextField
              label="Category Name *"
              placeholder="e.g. Festival Poojas"
              fullWidth
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={() => setTouched(true)}
              error={touched && !nameInput.trim()}
              helperText={
                touched && !nameInput.trim()
                  ? "Category name is required"
                  : undefined
              }
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              select
              label="Category Type *"
              fullWidth
              value={categoryType}
              onChange={(e) =>
                setCategoryType(e.target.value as "SERVICE" | "PRODUCT")
              }
              slotProps={{ inputLabel: { shrink: true } }}
            >
              <MenuItem value="SERVICE">SERVICE</MenuItem>
              <MenuItem value="PRODUCT">PRODUCT</MenuItem>
            </TextField>

            <TextField
              label="Description"
              placeholder="Enter category description..."
              fullWidth
              multiline
              rows={3}
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <CategoryImageUpload
              iconPreview={iconPreview}
              onFileChange={handleFileChange}
              onRemoveImage={handleRemoveImage}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        {mode === "view" ? (
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: "#cbd5e1",
              color: "#475569",
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
              borderRadius: "8px",
            }}
          >
            Close
          </Button>
        ) : (
          <>
            <Button
              onClick={onClose}
              sx={{
                color: "#64748b",
                fontWeight: 600,
                fontFamily: FONTS.OUTFIT,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="contained"
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "#ffffff",
                fontWeight: 600,
                fontFamily: FONTS.OUTFIT,
                borderRadius: "8px",
                px: 3,
                "&:hover": { bgcolor: "#e55800" },
              }}
            >
              {saving ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : mode === "add" ? (
                "Create Category"
              ) : (
                "Save Changes"
              )}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
