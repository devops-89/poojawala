"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { getTempleByIdAPI, registerTempleSlugMapping } from "@/api/templeControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useLoaderStore } from "@/stores/loaderStore";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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
import Image from "next/image";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ITemple } from "@/utils/types";

export default function AdminTempleDetailsContent() {
  const params = useParams();
  const [temple, setTemple] = useState<ITemple | any>(null);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbarStore();
  const { showLoader, hideLoader } = useLoaderStore();

  useEffect(() => {
    const fetchTempleDetails = async () => {
      const identifier = params.id as string;
      if (!identifier) return;

      if (
        temple &&
        (temple.slug === identifier || String(temple.id) === String(identifier))
      ) {
        return;
      }

      try {
        setLoading(true);
        showLoader("Loading temple details...");
        const response = await getTempleByIdAPI(identifier);
        if (response?.success || response?.data) {
          let data = response.data;
          while (data?.data && !data?.id) {
            data = data.data;
          }
          if (data?.id) {
            setTemple(data);
            if (data?.slug) {
              registerTempleSlugMapping(data.slug, data.id);
            }
            if (typeof window !== "undefined" && data?.slug) {
              const currentPath = window.location.pathname;
              const targetPath = `/admin/temples/${data.slug}`;
              if (currentPath !== targetPath) {
                window.history.replaceState(null, "", targetPath);
              }
            }
          } else {
            showSnackbar(response?.message || "Temple not found", "error");
          }
        } else {
          showSnackbar(
            response.message || "Failed to fetch temple details",
            "error"
          );
        }
      } catch (error) {
        console.error("Error fetching temple:", error);
        showSnackbar("Error fetching temple details", "error");
      } finally {
        setLoading(false);
        hideLoader();
      }
    };
    fetchTempleDetails();
  }, [params.id, showSnackbar, showLoader, hideLoader]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  if (!temple) {
    return (
      <Box sx={{ textAlign: "center", py: 10 }}>
        <Typography variant="h5" color="text.secondary">
          Temple not found
        </Typography>
        <Button
          component={NextLink}
          href="/admin/temples"
          sx={{ mt: 2, color: COLORS.PRIMARY }}
        >
          Back to Temples
        </Button>
      </Box>
    );
  }

  const imageSrc = temple.downloadUrl || temple.imageUrl;
  const services = temple.services || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminDetailsHeader
        title={`Temple Details (T-${temple.id})`}
        breadcrumbs={[
          { label: "Temples", href: "/admin/temples" },
          { label: temple.name || "Temple Details" },
        ]}
        actionButton={
          <Button
            component={NextLink}
            href={`/admin/temples/edit/${temple.slug || temple.id}`}
            variant="contained"
            sx={{
              background: COLORS.PRIMARY,
              color: "white",
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 600,
              py: 1.5,
              px: 3,
              boxShadow: "0 4px 14px 0 rgba(255, 98, 0, 0.39)",
              "&:hover": {
                background: COLORS.PRIMARY_DARK,
                boxShadow: "0 6px 20px rgba(255, 98, 0, 0.23)",
              },
            }}
            startIcon={<EditIcon />}
          >
            Edit Temple
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Left Column: Image, Main Details & Offered Services */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Temple Info Paper */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {imageSrc && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: { xs: 240, sm: 340 },
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Image
                    src={imageSrc}
                    alt={temple.name}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </Box>
              )}

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 800,
                      color: "#1e293b",
                    }}
                  >
                    {temple.name}
                  </Typography>
                  <Chip
                    label={temple.isActive ? "Active" : "Inactive"}
                    color={temple.isActive ? "success" : "default"}
                    size="small"
                    sx={{ fontWeight: 600, borderRadius: "6px" }}
                  />
                </Box>

                <Box
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#475569",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    mt: 1.5,
                    "& p": { m: 0, mb: 1 },
                    "& ul, & ol": { pl: 3, mb: 1 },
                    "& strong": { color: "#1e293b", fontWeight: 700 },
                    "& a": { color: COLORS.PRIMARY, textDecoration: "underline" },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: temple.description || "No description available.",
                  }}
                />
              </Box>
            </Paper>

            {/* Services Offered Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <BookOnlineIcon sx={{ color: COLORS.PRIMARY, fontSize: 26 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
                    Services Offered at this Temple
                  </Typography>
                </Box>
                <Chip
                  label={`${services.length} ${services.length === 1 ? "Service" : "Services"}`}
                  size="small"
                  sx={{
                    bgcolor: "#FFF0E6",
                    color: COLORS.PRIMARY,
                    fontWeight: 700,
                    borderRadius: "8px",
                  }}
                />
              </Box>

              <Divider />

              {services.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {services.map((svc: any) => (
                    <Box
                      key={svc.id}
                      sx={{
                        p: 2.5,
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        bgcolor: "#f8fafc",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.25,
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: COLORS.PRIMARY,
                          bgcolor: "#fffdfa",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color: "#64748b",
                            }}
                          >
                            S-{svc.id}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 700,
                              fontSize: "1rem",
                              color: "#1e293b",
                            }}
                          >
                            {svc.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip
                            label={svc.isActive ? "Active" : "Inactive"}
                            color={svc.isActive ? "success" : "default"}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              height: 24,
                              borderRadius: "6px",
                            }}
                          />
                          <Button
                            component={NextLink}
                            href={`/admin/services/${svc.slug || svc.id}`}
                            size="small"
                            endIcon={<OpenInNewIcon fontSize="small" />}
                            sx={{
                              textTransform: "none",
                              color: COLORS.PRIMARY,
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              minWidth: "auto",
                              p: "4px 8px",
                            }}
                          >
                            View
                          </Button>
                        </Box>
                      </Box>

                      {svc.description && (
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "0.875rem",
                            color: "#64748b",
                            lineHeight: 1.5,
                          }}
                        >
                          {svc.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    py: 4,
                    textAlign: "center",
                    bgcolor: "#f8fafc",
                    borderRadius: "12px",
                    border: "1px dashed #cbd5e1",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      color: "#64748b",
                      fontSize: "0.95rem",
                    }}
                  >
                    No services are currently linked with this temple.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Grid>

        {/* Right Column: Location & Meta info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                Location Details
              </Typography>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOnIcon
                  sx={{ color: COLORS.PRIMARY, mt: 0.3, fontSize: "1.25rem" }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "#1e293b",
                    }}
                  >
                    {temple.city}
                    {temple.state ? `, ${temple.state}` : ""}
                  </Typography>
                  {temple.address && (
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "0.875rem",
                        color: "#64748b",
                        mt: 0.5,
                      }}
                    >
                      {temple.address}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "white",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: "#1e293b",
                }}
              >
                System Metadata
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Temple ID
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                    T-{temple.id}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Status
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: temple.isActive ? "#16a34a" : "#64748b",
                    }}
                  >
                    {temple.isActive ? "Active" : "Inactive"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                    Offered Services
                  </Typography>
                  <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                    {services.length}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
