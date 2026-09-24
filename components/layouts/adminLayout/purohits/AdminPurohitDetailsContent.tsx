"use client";

import { getPurohitByIdAPI } from "@/api/userControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import PurohitProfileCard from "@/components/layouts/adminLayout/purohits/components/PurohitProfileCard";
import PurohitSideInfoCard from "@/components/layouts/adminLayout/purohits/components/PurohitSideInfoCard";
import { useSnackbarStore } from "@/stores/snackbarStore";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminPurohitDetailsContent() {
  const params = useParams();
  const [purohit, setPurohit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
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
        <CircularProgress sx={{ color: "#FF6200" }} />
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
        <DialogContent sx={{ p: 0, height: "80vh" }}>
          {previewDocUrl &&
            (previewDocUrl.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) ? (
              <img
                src={previewDocUrl}
                alt="Document Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "#f8fafc",
                }}
              />
            ) : (
              <iframe
                src={previewDocUrl}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Document Preview"
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setPreviewDocUrl(null)}
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
