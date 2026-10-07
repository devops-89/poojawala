"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

interface VerificationDocsSectionProps {
  values: any;
  selectedFiles: {
    identityDoc: File | null;
    certificate: File | null;
    templeAffiliationProof: File | null;
    profilePhoto: File | null;
  };
  handleFileUpload: (
    key: "identityDoc" | "certificate" | "templeAffiliationProof" | "profilePhoto",
    urlKey: string,
    file: File | null
  ) => void;
}

export const VerificationDocsSection: React.FC<VerificationDocsSectionProps> = ({
  values,
  selectedFiles,
  handleFileUpload,
}) => {
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    title: string;
    url: string;
  }>({
    open: false,
    title: "",
    url: "",
  });

  const documentFieldsList = [
    {
      id: "identityDoc",
      label: "Government Identity Proof (Aadhaar/PAN/Voter ID)",
      urlKey: "identityDocUrl",
      fileKey: "identityDoc" as keyof typeof selectedFiles,
      currentUrl: values.identityDocUrl,
      accept: "image/*,application/pdf",
    },
    {
      id: "certificate",
      label: "Educational Certificates",
      urlKey: "certificateUrl",
      fileKey: "certificate" as keyof typeof selectedFiles,
      currentUrl: values.certificateUrl,
      accept: "image/*,application/pdf",
    },
    {
      id: "templeAffiliationProof",
      label: "Temple Affiliation Proof",
      urlKey: "templeAffiliationProofUrl",
      fileKey: "templeAffiliationProof" as keyof typeof selectedFiles,
      currentUrl: values.templeAffiliationProofUrl,
      accept: "image/*,application/pdf",
    },
    {
      id: "profilePhoto",
      label: "Profile Photograph *",
      urlKey: "profilePhotoUrl",
      fileKey: "profilePhoto" as keyof typeof selectedFiles,
      currentUrl: values.profilePhotoUrl,
      accept: "image/*",
    },
  ];

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
        <DescriptionIcon sx={{ color: "#FF6200" }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            color: "#1e293b",
          }}
        >
          3. Verification Documents Upload
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {documentFieldsList.map((doc) => {
          const file = selectedFiles[doc.fileKey];
          const url = doc.currentUrl;

          return (
            <Grid size={{ xs: 12, sm: 6 }} key={doc.id}>
              <Paper
                sx={{
                  p: 2.5,
                  minHeight: "220px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed",
                  borderColor: file || url ? "#4CAF50" : "#FFE0D0",
                  borderRadius: "16px",
                  textAlign: "center",
                  bgcolor: file || url ? "#F1F8E9" : "#FFFDF9",
                  transition: "all 0.3s",
                  position: "relative",
                  "&:hover": {
                    borderColor: "#FF6200",
                    bgcolor: "#FFF8F4",
                  },
                }}
              >
                <Box sx={{ mb: 1.5 }}>
                  {file || url ? (
                    <CheckCircleIcon sx={{ fontSize: 44, color: "#4CAF50" }} />
                  ) : (
                    <CloudUploadIcon sx={{ fontSize: 44, color: "#FF6200" }} />
                  )}
                </Box>

                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    fontFamily: "var(--font-outfit), sans-serif",
                    color: "#1e293b",
                    mb: 0.5,
                  }}
                >
                  {doc.label}
                </Typography>

                {file ? (
                  <Chip
                    label={file.name}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ mb: 1.5, maxWidth: "100%" }}
                  />
                ) : url ? (
                  <Chip
                    label="Uploaded Document"
                    size="small"
                    color="success"
                    sx={{ mb: 1.5 }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{ color: "#94a3b8", mb: 2 }}
                  >
                    JPG, PNG, WEBP, or PDF
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {(file || (url && typeof url === "string" && !url.startsWith("blob:"))) && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => {
                        const targetUrl = file
                          ? URL.createObjectURL(file)
                          : url;
                        setPreviewModal({
                          open: true,
                          title: doc.label,
                          url: targetUrl,
                        });
                      }}
                      sx={{
                        borderRadius: "8px",
                        textTransform: "none",
                        color: "#1e293b",
                        borderColor: "#cbd5e1",
                      }}
                    >
                      View
                    </Button>
                  )}

                  <Button
                    component="label"
                    size="small"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderRadius: "8px",
                      textTransform: "none",
                      bgcolor: "#FF6200",
                      "&:hover": { bgcolor: "#e05600" },
                    }}
                  >
                    {file || url ? "Change File" : "Upload"}
                    <input
                      type="file"
                      hidden
                      accept={doc.accept}
                      onChange={(e) => {
                        const f = e.target.files?.[0] || null;
                        handleFileUpload(doc.fileKey, doc.urlKey, f);
                      }}
                    />
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Document Preview Dialog */}
      <Dialog
        open={previewModal.open}
        onClose={() => setPreviewModal({ open: false, title: "", url: "" })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
          }}
        >
          {previewModal.title}
          <IconButton
            onClick={() => setPreviewModal({ open: false, title: "", url: "" })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewModal.url.endsWith(".pdf") ? (
            <iframe
              src={previewModal.url}
              width="100%"
              height="500px"
              style={{ border: "none" }}
            />
          ) : (
            <Box
              component="img"
              src={previewModal.url}
              alt={previewModal.title}
              sx={{
                width: "100%",
                maxHeight: "500px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
