"use client";

import { getPurohitServiceByIdAPI } from "@/api/serviceControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PurohitServiceDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();
  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const res = await getPurohitServiceByIdAPI(id as string);
        if (res.success && res.data?.data) {
          setServiceData(res.data.data);
        } else {
          showSnackbar(res.message || "Failed to load details", "error");
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || "Error loading details",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#FF6200" }} />
      </Box>
    );
  }

  if (!serviceData) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Service not found.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/purohit/my-services")}
          sx={{ mt: 2, color: "#FF6200" }}
        >
          Back to My Services
        </Button>
      </Box>
    );
  }

  const {
    service,
    isOnline,
    isOffline,
    onlinePrice,
    offlinePrice,
    durationMinutes,
  } = serviceData;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={() => router.push("/purohit/my-services")}
          sx={{
            minWidth: "auto",
            p: 1,
            color: "#64748b",
            bgcolor: "white",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            "&:hover": { bgcolor: "#f8fafc", color: "#1e293b" },
          }}
        >
          <ArrowBackIcon />
        </Button>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          Service Details
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 0,
          borderRadius: "16px",
          border: "1px solid #eee",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          overflow: "hidden"
        }}
      >
        <Grid container spacing={0}>
          {(service?.iconUrl || service?.iconDownloadurl) && (
            <Grid
              size={{ xs: 12, md: 3 }}
              sx={{
                display: "flex",
                minHeight: { xs: 200, md: '100%' },
              }}
            >
              <img
                src={service.iconDownloadurl || service.iconUrl}
                alt={service.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: (service?.iconUrl || service?.iconDownloadurl) ? 9 : 12 }} sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 800,
                color: "#1e293b",
                mb: 2,
              }}
            >
              {service?.name || "Unknown Service"}
            </Typography>

            <Chip
              label={`${durationMinutes} mins`}
              sx={{
                bgcolor: "#FF6200",
                color: "white",
                fontWeight: 600,
                fontFamily: "var(--font-outfit), sans-serif",
                mb: 3,
              }}
            />

            {service?.description && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, color: "#64748b", mb: 1 }}
                >
                  Description
                </Typography>
                <Typography sx={{ color: "#475569", lineHeight: 1.6 }}>
                  {service.description}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 700,
                color: "#333",
                mb: 2,
              }}
            >
              Pricing & Modes
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: "#475569" }}>
                      Online Mode
                    </Typography>
                    {isOnline ? (
                      <CheckCircleIcon sx={{ color: "#2E7D32" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef4444" }} />
                    )}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: isOnline ? "#1e293b" : "#94a3b8",
                    }}
                  >
                    {isOnline ? `₹${onlinePrice}` : "Not Available"}
                  </Typography>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: "#475569" }}>
                      Offline Mode
                    </Typography>
                    {isOffline ? (
                      <CheckCircleIcon sx={{ color: "#2E7D32" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ef4444" }} />
                    )}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: isOffline ? "#1e293b" : "#94a3b8",
                    }}
                  >
                    {isOffline ? `₹${offlinePrice}` : "Not Available"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
