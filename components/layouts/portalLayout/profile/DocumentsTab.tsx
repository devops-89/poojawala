"use client";

import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionIcon from "@mui/icons-material/Description";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BadgeIcon from "@mui/icons-material/Badge";
import { convertImageToWebP } from "@/utils/imageHelper";

interface DocumentsTabProps {
  aadhaarNumber: string;
  setAadhaarNumber: (val: string) => void;
  aadhaarDoc: File | null;
  setAadhaarDoc: (file: File | null) => void;
  aadhaarDocUrl: string | null;
  panDoc: File | null;
  setPanDoc: (file: File | null) => void;
  panDocUrl: string | null;
  certificateDoc: File | null;
  setCertificateDoc: (file: File | null) => void;
  certificateUrl: string | null;
  templeAffiliationProofDoc: File | null;
  setTempleAffiliationProofDoc: (file: File | null) => void;
  templeAffiliationProofUrl: string | null;
  verificationStatus: string | null;
  rejectionReason: string | null;
  saving: boolean;
  onSave: () => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  aadhaarNumber,
  setAadhaarNumber,
  aadhaarDoc,
  setAadhaarDoc,
  aadhaarDocUrl,
  panDoc,
  setPanDoc,
  panDocUrl,
  certificateDoc,
  setCertificateDoc,
  certificateUrl,
  templeAffiliationProofDoc,
  setTempleAffiliationProofDoc,
  templeAffiliationProofUrl,
  verificationStatus,
  rejectionReason,
  saving,
  onSave,
}) => {
  const getStatusChip = () => {
    const status = (verificationStatus || "PENDING").toUpperCase();
    if (status === "APPROVED") {
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Verification Approved"
          color="success"
          sx={{ fontWeight: 700, borderRadius: "20px" }}
        />
      );
    }
    if (status === "REJECTED") {
      return (
        <Chip
          icon={<ErrorIcon />}
          label="Verification Rejected"
          color="error"
          sx={{ fontWeight: 700, borderRadius: "20px" }}
        />
      );
    }
    return (
      <Chip
        icon={<HourglassEmptyIcon />}
        label="Pending Verification"
        color="warning"
        sx={{ fontWeight: 700, borderRadius: "20px" }}
      />
    );
  };

  const handleDocFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const webpFile = await convertImageToWebP(file);
        setter(webpFile);
      } catch (err) {
        setter(file);
      }
    }
  };

  const docConfigs = [
    {
      id: "aadhaarDoc",
      title: "Aadhaar / PAN Card Document",
      desc: "Upload front & back scan of your Aadhaar card or PAN card.",
      icon: <BadgeIcon sx={{ color: "#FF6200", fontSize: 28 }} />,
      file: aadhaarDoc || panDoc,
      setFile: setAadhaarDoc,
      url: aadhaarDocUrl || panDocUrl,
    },
    {
      id: "certificate",
      title: "Qualification / Degree Certificate",
      desc: "Upload Shastri / Acharya / Ph.D Sanskrit degree certificate.",
      icon: <SchoolIcon sx={{ color: "#FF6200", fontSize: 28 }} />,
      file: certificateDoc,
      setFile: setCertificateDoc,
      url: certificateUrl,
    },
    {
      id: "templeAffiliationProof",
      title: "Temple / Vedic Sansthan Proof",
      desc: "Upload proof of temple affiliation or gurukul certification.",
      icon: <AccountBalanceIcon sx={{ color: "#FF6200", fontSize: 28 }} />,
      file: templeAffiliationProofDoc,
      setFile: setTempleAffiliationProofDoc,
      url: templeAffiliationProofUrl,
    },
  ];

  return (
    <Box>
      {/* Header & Status Card */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              fontSize: "20px",
            }}
          >
            Verification Documents
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#666",
              fontSize: "14px",
              mt: 0.5,
            }}
          >
            Upload official identification & qualification documents to maintain verified Purohit status.
          </Typography>
        </Box>
        {getStatusChip()}
      </Box>

      {rejectionReason && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          <Typography sx={{ fontWeight: 700 }}>Rejection Reason:</Typography>
          {rejectionReason}
        </Alert>
      )}

      {/* Aadhaar Number Field */}
      <Card
        elevation={0}
        sx={{
          bgcolor: "#FAFAFA",
          border: "1px solid #EAEAEA",
          borderRadius: "14px",
          p: 2.5,
          mb: 4,
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              label="Aadhaar / Identity Number"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="Enter 12-digit Aadhaar Number or Identity Number"
              slotProps={{
                htmlInput: { maxLength: 12 },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "13px",
                color: "#666",
              }}
            >
              Required for identity verification and payout tax processing.
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Documents Grid */}
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          mb: 2,
        }}
      >
        Upload / Update Documents
      </Typography>

      <Grid container spacing={3}>
        {docConfigs.map((doc) => {
          const hasExistingUrl = Boolean(doc.url);
          const hasNewFile = Boolean(doc.file);

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doc.id}>
              <Card
                elevation={0}
                sx={{
                  border: hasNewFile
                    ? "2px solid #FF6200"
                    : hasExistingUrl
                    ? "1.5px solid #2e7d32"
                    : "1px dashed #CCCCCC",
                  borderRadius: "14px",
                  bgcolor: "#FFFFFF",
                  p: 2.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "#FF6200",
                    boxShadow: "0 4px 16px rgba(255, 98, 0, 0.08)",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    {doc.icon}
                    <Typography
                      sx={{
                        fontFamily: "var(--font-outfit), sans-serif",
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#1e293b",
                      }}
                    >
                      {doc.title}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "13px",
                      color: "#64748b",
                      mb: 2,
                    }}
                  >
                    {doc.desc}
                  </Typography>
                </Box>

                <Box>
                  {/* Status & Preview */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                      bgcolor: "#F8FAFC",
                      p: 1.5,
                      borderRadius: "10px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {hasNewFile ? (
                        <Chip label="New File Selected" color="warning" size="small" />
                      ) : hasExistingUrl ? (
                        <Chip label="Uploaded" color="success" size="small" />
                      ) : (
                        <Chip label="Not Uploaded" variant="outlined" size="small" />
                      )}
                    </Box>

                    {hasExistingUrl && (
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        href={doc.url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          textTransform: "none",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#FF6200",
                        }}
                      >
                        View
                      </Button>
                    )}
                  </Box>

                  {/* Selected File Name Preview */}
                  {hasNewFile && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#FF6200",
                        fontWeight: 600,
                        mb: 1.5,
                        wordBreak: "break-all",
                      }}
                    >
                      Selected: {doc.file?.name}
                    </Typography>
                  )}

                  {/* Upload Button */}
                  <Button
                    component="label"
                    variant={hasNewFile ? "contained" : "outlined"}
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      borderColor: "#FF6200",
                      color: hasNewFile ? "white" : "#FF6200",
                      bgcolor: hasNewFile ? "#FF6200" : "transparent",
                      "&:hover": {
                        bgcolor: hasNewFile ? "#F05A00" : "#FFF5EF",
                        borderColor: "#F05A00",
                      },
                    }}
                  >
                    {hasNewFile ? "Change File" : hasExistingUrl ? "Update Document" : "Upload File"}
                    <input
                      type="file"
                      hidden
                      accept="image/*,application/pdf"
                      onChange={(e) => handleDocFileChange(e, doc.setFile)}
                    />
                  </Button>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Save Button */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving}
          sx={{
            background: "#FF6200 !important",
            color: "white !important",
            borderRadius: "8px",
            px: 4,
            py: 1.2,
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { background: "#F05A00 !important" },
          }}
        >
          {saving ? "Saving Documents..." : "Save Documents"}
        </Button>
      </Box>
    </Box>
  );
};
