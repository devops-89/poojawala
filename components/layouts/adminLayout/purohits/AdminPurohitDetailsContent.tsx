"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { getPurohitByIdAPI, updatePurohitVerificationAPI } from "@/api/userControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import PurohitProfileCard from "@/components/layouts/adminLayout/purohits/components/PurohitProfileCard";
import PurohitSideInfoCard from "@/components/layouts/adminLayout/purohits/components/PurohitSideInfoCard";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const checkIsImage = (url: string) => {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.startsWith("data:image/") || lowerUrl.startsWith("blob:")) {
    return !lowerUrl.includes("pdf");
  }
  const cleanUrl = lowerUrl.split("?")[0].split("#")[0];
  return /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i.test(cleanUrl);
};

const getPdfUrlWithParams = (url: string) => {
  if (!url) return "";
  if (url.includes("#")) return url;
  return `${url}#toolbar=0&navpanes=0&view=FitH`;
};

export default function AdminPurohitDetailsContent() {
  const params = useParams();
  const [purohit, setPurohit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [newStatusTarget, setNewStatusTarget] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (params.id) {
      fetchPurohitDetails(params.id as string);
    }
  }, [params.id]);

  const fetchPurohitDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await getPurohitByIdAPI(id);
      if (res.success && res.data) {
        const userData =
          res.data.data?.user || res.data.data || res.data.user || res.data;
        setPurohit(userData);
      } else {
        showSnackbar("Failed to fetch purohit details", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error fetching purohit details",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!newStatusTarget || !purohit) return;
    setIsSubmitting(true);
    try {
      const backendStatus =
        newStatusTarget === "Approved"
          ? "APPROVED"
          : newStatusTarget === "Rejected"
            ? "REJECTED"
            : "PENDING";
      const reason =
        backendStatus === "REJECTED" ? rejectionReason : undefined;

      const res = await updatePurohitVerificationAPI(
        purohit.id,
        backendStatus,
        reason
      );
      if (res.success) {
        showSnackbar("Purohit status updated successfully", "success");
        setRejectionReason("");
        if (params.id) {
          fetchPurohitDetails(params.id as string);
        }
      } else {
        showSnackbar(res.message || "Failed to update status", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error updating status",
        "error"
      );
    } finally {
      setIsSubmitting(false);
      setNewStatusTarget(null);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  if (!purohit) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Purohit not found
        </Typography>
      </Box>
    );
  }

  const profile = purohit.profile || purohit.purohitProfile || {};
  const bankAccount = (purohit.bankAccounts && purohit.bankAccounts[0]) || {};

  const verificationStatus = profile.verificationStatus || purohit.status;
  let statusColor = { bg: "#f1f5f9", text: "#64748b" };
  let statusLabel = "No Profile";

  if (verificationStatus === "APPROVED" || verificationStatus === "ACTIVE") {
    statusColor = { bg: "#d1fae5", text: "#059669" };
    statusLabel = "Approved";
  } else if (verificationStatus === "PENDING") {
    statusColor = { bg: "#fef3c7", text: "#d97706" };
    statusLabel = "Pending Approval";
  } else if (verificationStatus === "REJECTED") {
    statusColor = { bg: "#fee2e2", text: "#ef4444" };
    statusLabel = "Rejected";
  }

  const purohitName =
    `${purohit.firstName || ""} ${purohit.lastName || ""}`.trim() ||
    purohit.username;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <AdminDetailsHeader
        title="Purohit Details"
        breadcrumbs={[
          { label: "Purohits", href: "/admin/purohits" },
          { label: "Purohit Details" },
        ]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <PurohitProfileCard
            purohit={purohit}
            profile={profile}
            statusLabel={statusLabel}
            statusColor={statusColor}
            onPreviewDoc={(url) => setPreviewDocUrl(url)}
            onStatusChange={(status) => setNewStatusTarget(status)}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <PurohitSideInfoCard
            purohit={purohit}
            profile={profile}
            bankAccount={bankAccount}
          />
        </Grid>
      </Grid>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewDocUrl}
        onClose={() => setPreviewDocUrl(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          Document Preview
          <IconButton onClick={() => setPreviewDocUrl(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 2,
            height: "75vh",
            bgcolor: "#f8fafc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {previewDocUrl &&
            (checkIsImage(previewDocUrl) ? (
              <img
                src={previewDocUrl}
                alt="Document Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <object
                data={getPdfUrlWithParams(previewDocUrl)}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ borderRadius: "8px" }}
              >
                <iframe
                  src={
                    previewDocUrl.startsWith("blob:") || previewDocUrl.startsWith("data:")
                      ? getPdfUrlWithParams(previewDocUrl)
                      : `https://docs.google.com/gview?url=${encodeURIComponent(previewDocUrl)}&embedded=true`
                  }
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: "8px" }}
                  title="Document Preview"
                >
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography sx={{ mb: 2, fontFamily: FONTS.OUTFIT }}>
                      Unable to display document directly in browser dialog.
                    </Typography>
                    <Button
                      component="a"
                      href={previewDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      sx={{ bgcolor: COLORS.PRIMARY }}
                    >
                      Open / Download Document
                    </Button>
                  </Box>
                </iframe>
              </object>
            ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPreviewDocUrl(null)}
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmStatusDialog
        open={Boolean(newStatusTarget)}
        title="Change Verification Status"
        itemName={purohitName}
        newStatus={newStatusTarget || undefined}
        customMessage={
          newStatusTarget === "Rejected" ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
              <Typography sx={{ color: "#475569", fontFamily: FONTS.OUTFIT }}>
                Please provide a rejection reason for <strong>{purohitName}</strong>:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Rejection Reason *"
                placeholder="e.g. Invalid documents uploaded"
                variant="outlined"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>
          ) : undefined
        }
        onClose={() => {
          setNewStatusTarget(null);
          setRejectionReason("");
        }}
        onConfirm={confirmStatusChange}
        loading={isSubmitting}
      />
    </Box>
  );
}

