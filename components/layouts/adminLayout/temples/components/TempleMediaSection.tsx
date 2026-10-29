"use client";
import React from "react";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { inputSx, labelSx } from "@/utils/templeFormUtils";

interface TempleMediaSectionProps {
  formik: any;
  isEdit: boolean;
  imagePreview: string | null;
  imageFile: File | null;
  imageError: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  trustDocFile: File | null;
  trustDocPreview: string | null;
  trustDocName: string;
  onTrustDocChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveTrustDoc: () => void;
  deityPhotoFile: File | null;
  deityPhotoPreview: string | null;
  onDeityPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDeityPhoto: () => void;
}

export default function TempleMediaSection({
  formik,
  isEdit,
  imagePreview,
  imageFile,
  imageError,
  onImageChange,
  onRemoveImage,
  trustDocFile,
  trustDocPreview,
  trustDocName,
  onTrustDocChange,
  onRemoveTrustDoc,
  deityPhotoFile,
  deityPhotoPreview,
  onDeityPhotoChange,
  onRemoveDeityPhoto,
}: TempleMediaSectionProps) {
  const [docImgError, setDocImgError] = React.useState(false);

  React.useEffect(() => {
    setDocImgError(false);
  }, [trustDocFile, trustDocPreview]);

  const isPdf =
    docImgError ||
    (trustDocFile &&
      (trustDocFile.type === "application/pdf" ||
        trustDocFile.name.toLowerCase().endsWith(".pdf"))) ||
    (typeof trustDocPreview === "string" &&
      (trustDocPreview.toLowerCase().includes(".pdf") ||
        trustDocPreview.toLowerCase().includes("/pdf") ||
        trustDocName.toLowerCase().endsWith(".pdf") ||
        (!trustDocFile &&
          !/\.(jpg|jpeg|png|webp|avif|gif)($|\?)/i.test(trustDocPreview))));

  const [previewModal, setPreviewModal] = React.useState<{
    open: boolean;
    title: string;
    url: string;
    isPdf?: boolean;
  }>({
    open: false,
    title: "",
    url: "",
    isPdf: false,
  });
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "18px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* Section Header */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: "10px",
            bgcolor: "#FFF7ED",
            color: "#EA580C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 0.3,
          }}
        >
          <VerifiedUserOutlinedIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "1.15rem",
              color: "#1E293B",
            }}
          >
            3. Trust Verification & Media Uploads
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: "0.85rem",
              mt: 0.25,
            }}
          >
            Legal registration details and temple photos for public profile setup.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      {/* Trust Registration Number */}
      <Box>
        <Typography sx={labelSx}>TRUST REGISTRATION NUMBER / ACT ID</Typography>
        <TextField
          fullWidth
          name="trustRegNo"
          placeholder="e.g. TR/GJ/1951/0042"
          value={formik.values.trustRegNo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          sx={inputSx}
        />
      </Box>

      {/* Main Cover Image Upload */}
      <Box>
        <Typography sx={labelSx}>
          MAIN TEMPLE COVER IMAGE / BANNER{" "}
          {!isEdit && <span style={{ color: "#DC2626" }}>*</span>}
        </Typography>
        {imagePreview ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "72px",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              bgcolor: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              py: 1.5,
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                component="img"
                src={imagePreview}
                alt="Temple Cover Preview"
                sx={{
                  width: 56,
                  height: 56,
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 600,
                    color: "#1E293B",
                    fontSize: "0.95rem",
                  }}
                >
                  {imageFile ? "New Cover Selected" : "Main Temple Cover"}
                </Typography>
                <Typography sx={{ color: "#64748B", fontSize: "0.8rem" }}>
                  Click Change to replace or Remove to clear
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                onClick={() =>
                  setPreviewModal({
                    open: true,
                    title: "Main Temple Cover Image",
                    url: imagePreview || "",
                    isPdf: false,
                  })
                }
                sx={{
                  borderRadius: "8px",
                  borderColor: "#CBD5E1",
                  color: "#334155",
                  textTransform: "none",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  "&:hover": {
                    borderColor: COLORS.PRIMARY,
                    color: COLORS.PRIMARY,
                    bgcolor: "#FFF7ED",
                  },
                }}
              >
                View
              </Button>
              <Button
                component="label"
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "8px",
                  borderColor: "#CBD5E1",
                  color: "#334155",
                  textTransform: "none",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  "&:hover": {
                    borderColor: COLORS.PRIMARY,
                    color: COLORS.PRIMARY,
                  },
                }}
              >
                Change
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={onImageChange}
                />
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={onRemoveImage}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                Remove
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            component="label"
            sx={{
              width: "100%",
              minHeight: "80px",
              border: "1.5px dashed #CBD5E1",
              borderRadius: "12px",
              bgcolor: "#F8FAFC",
              display: "flex",
              alignItems: "center",
              px: 2.5,
              py: 2,
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: COLORS.PRIMARY,
                bgcolor: "#FFF0E6",
              },
            }}
          >
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onImageChange}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AddPhotoAlternateOutlinedIcon
                sx={{ color: "#EA580C", fontSize: 32 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "#334155",
                  }}
                >
                  Click to upload main temple cover image
                </Typography>
                <Typography sx={{ color: "#94A3B8", fontSize: "0.8rem" }}>
                  Used as header banner and card thumbnail (PNG, JPG, WebP)
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        {imageError && (
          <Typography
            sx={{ fontSize: "0.75rem", color: "#d32f2f", mt: 0.5, ml: 1 }}
          >
            {imageError}
          </Typography>
        )}
      </Box>

      {/* Side-by-Side Uploads: Trust Deed & Deity Photo */}
      <Grid container spacing={2.5}>
        {/* 1. Trust Deed Upload */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>
            TRUST DEED / REGISTRATION DOCUMENT
          </Typography>
          {trustDocFile || trustDocPreview ? (
            <Box
              sx={{
                minHeight: "76px",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                bgcolor: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.5,
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  minWidth: 0,
                }}
              >
                {!isPdf && trustDocPreview ? (
                  <Box
                    component="img"
                    src={trustDocPreview}
                    alt="Trust Deed Preview"
                    onError={() => setDocImgError(true)}
                    sx={{
                      width: 44,
                      height: 44,
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #E2E8F0",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "8px",
                      bgcolor: "#FEE2E2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #FECACA",
                      flexShrink: 0,
                    }}
                  >
                    <PictureAsPdfIcon sx={{ color: "#DC2626", fontSize: 26 }} />
                  </Box>
                )}
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "0.85rem",
                      maxWidth: "180px",
                    }}
                  >
                    {trustDocName || (isPdf ? "Trust Document (PDF)" : "Trust Document")}
                  </Typography>
                  <Typography sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                    Document attached
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                  onClick={() =>
                    setPreviewModal({
                      open: true,
                      title: "Trust Deed / Registration Document",
                      url:
                        trustDocPreview ||
                        (trustDocFile ? URL.createObjectURL(trustDocFile) : ""),
                      isPdf: isPdf,
                    })
                  }
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#CBD5E1",
                    color: "#334155",
                    textTransform: "none",
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    px: 1.25,
                    py: 0.35,
                    "&:hover": {
                      borderColor: COLORS.PRIMARY,
                      color: COLORS.PRIMARY,
                      bgcolor: "#FFF7ED",
                    },
                  }}
                >
                  View
                </Button>
                <Button
                  component="label"
                  size="small"
                  sx={{
                    color: COLORS.PRIMARY,
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: "auto",
                    p: 0.5,
                  }}
                >
                  Change
                  <input
                    type="file"
                    hidden
                    accept=".pdf,image/*"
                    onChange={onTrustDocChange}
                  />
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={onRemoveTrustDoc}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              component="label"
              sx={{
                minHeight: "76px",
                border: "1.5px dashed #CBD5E1",
                borderRadius: "12px",
                bgcolor: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                py: 2,
                px: 2,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: COLORS.PRIMARY,
                  bgcolor: "#FFF0E6",
                },
              }}
            >
              <input
                type="file"
                hidden
                accept=".pdf,image/*"
                onChange={onTrustDocChange}
              />
              <UploadFileIcon
                sx={{ color: "#EA580C", fontSize: 28, mb: 0.5 }}
              />
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: "#334155",
                  textAlign: "center",
                }}
              >
                Click to upload PDF or Image
              </Typography>
            </Box>
          )}
        </Grid>

        {/* 2. Main Shrine / Deity Photo Upload */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={labelSx}>MAIN SHRINE / DEITY PHOTO</Typography>
          {deityPhotoFile || deityPhotoPreview ? (
            <Box
              sx={{
                minHeight: "76px",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                bgcolor: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1.5,
                gap: 1.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  component="img"
                  src={deityPhotoPreview || ""}
                  alt="Deity Photo"
                  sx={{
                    width: 44,
                    height: 44,
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 600,
                      color: "#1E293B",
                      fontSize: "0.85rem",
                    }}
                  >
                    Deity Photo Attached
                  </Typography>
                  <Typography sx={{ color: "#64748B", fontSize: "0.75rem" }}>
                    Image uploaded
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityOutlinedIcon fontSize="small" />}
                  onClick={() =>
                    setPreviewModal({
                      open: true,
                      title: "Main Shrine / Deity Photo",
                      url:
                        deityPhotoPreview ||
                        (deityPhotoFile ? URL.createObjectURL(deityPhotoFile) : ""),
                      isPdf: false,
                    })
                  }
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#CBD5E1",
                    color: "#334155",
                    textTransform: "none",
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    px: 1.25,
                    py: 0.35,
                    "&:hover": {
                      borderColor: COLORS.PRIMARY,
                      color: COLORS.PRIMARY,
                      bgcolor: "#FFF7ED",
                    },
                  }}
                >
                  View
                </Button>
                <Button
                  component="label"
                  size="small"
                  sx={{
                    color: COLORS.PRIMARY,
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: "auto",
                    p: 0.5,
                  }}
                >
                  Change
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onDeityPhotoChange}
                  />
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  onClick={onRemoveDeityPhoto}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              component="label"
              sx={{
                minHeight: "76px",
                border: "1.5px dashed #CBD5E1",
                borderRadius: "12px",
                bgcolor: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                py: 2,
                px: 2,
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: COLORS.PRIMARY,
                  bgcolor: "#FFF0E6",
                },
              }}
            >
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={onDeityPhotoChange}
              />
              <CameraAltOutlinedIcon
                sx={{ color: "#EA580C", fontSize: 28, mb: 0.5 }}
              />
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  color: "#334155",
                  textAlign: "center",
                }}
              >
                Click to upload Temple Photo
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* Media & Document Preview Modal */}
      <Dialog
        open={previewModal.open}
        onClose={() =>
          setPreviewModal({ open: false, title: "", url: "", isPdf: false })
        }
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: "16px", overflow: "hidden" },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "1.05rem",
            color: "#1e293b",
            px: 2.5,
            py: 1.75,
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          {previewModal.title}
          <IconButton
            onClick={() =>
              setPreviewModal({
                open: false,
                title: "",
                url: "",
                isPdf: false,
              })
            }
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            p: 2,
            minHeight: "50vh",
            maxHeight: "75vh",
            bgcolor: "#0f172a",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          {previewModal.url &&
            (!previewModal.isPdf &&
            !previewModal.url.toLowerCase().includes(".pdf") ? (
              <Box
                component="img"
                src={previewModal.url}
                alt={previewModal.title}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <object
                data={previewModal.url}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{
                  minHeight: "65vh",
                  borderRadius: "8px",
                  border: "none",
                }}
              >
                <iframe
                  src={
                    previewModal.url.startsWith("blob:") ||
                    previewModal.url.startsWith("data:")
                      ? previewModal.url
                      : `https://docs.google.com/gview?url=${encodeURIComponent(
                          previewModal.url
                        )}&embedded=true`
                  }
                  width="100%"
                  height="100%"
                  style={{
                    minHeight: "65vh",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  title={previewModal.title}
                />
              </object>
            ))}
        </DialogContent>
        <DialogActions
          sx={{ px: 2.5, py: 1.5, borderTop: "1px solid #E2E8F0" }}
        >
          {previewModal.url && (
            <Button
              component="a"
              href={previewModal.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                color: COLORS.PRIMARY,
                borderColor: COLORS.PRIMARY,
                "&:hover": { borderColor: COLORS.PRIMARY_DARK },
              }}
            >
              Open in New Window ↗
            </Button>
          )}
          <Button
            onClick={() =>
              setPreviewModal({
                open: false,
                title: "",
                url: "",
                isPdf: false,
              })
            }
            variant="contained"
            size="small"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              bgcolor: COLORS.PRIMARY,
              "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
