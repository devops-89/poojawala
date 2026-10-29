"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { getTempleByIdAPI, registerTempleSlugMapping } from "@/api/templeControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useLoaderStore } from "@/stores/loaderStore";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ITemple } from "@/utils/types";

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

export default function AdminTempleDetailsContent() {
  const params = useParams();
  const [temple, setTemple] = useState<ITemple | any>(null);
  const [loading, setLoading] = useState(true);
  const [docModal, setDocModal] = useState<{
    open: boolean;
    title: string;
    url: string;
  }>({
    open: false,
    title: "",
    url: "",
  });
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
                  {temple.verificationStatus && (
                    <AdminStatusSelect
                      value={temple.verificationStatus.toUpperCase()}
                      readOnly={true}
                    />
                  )}
                </Box>

                {temple.verificationStatus === "REJECTED" && temple.verificationRemarks && (
                  <Box
                    sx={{
                      mb: 2,
                      p: 1.5,
                      borderRadius: "8px",
                      bgcolor: "#fee2e2",
                      border: "1px solid #fecaca",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "#991b1b",
                      }}
                    >
                      Verification Rejection Remarks:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "0.875rem",
                        color: "#b91c1c",
                      }}
                    >
                      {temple.verificationRemarks}
                    </Typography>
                  </Box>
                )}

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

            {/* Shrine & Trust Information */}
            {(temple.primaryDeity ||
              temple.trustName ||
              temple.contactName ||
              temple.phone ||
              temple.email ||
              temple.trustRegNo) && (
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
                  Shrine & Authority
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {temple.primaryDeity && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Primary Deity
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: COLORS.PRIMARY }}>
                        {temple.primaryDeity}
                      </Typography>
                    </Box>
                  )}

                  {temple.trustName && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Managing Trust
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", textAlign: "right" }}>
                        {temple.trustName}
                      </Typography>
                    </Box>
                  )}

                  {temple.trustRegNo && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Trust Reg No
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                        {temple.trustRegNo}
                      </Typography>
                    </Box>
                  )}

                  {temple.contactName && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Contact Person
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                        {temple.contactName}
                      </Typography>
                    </Box>
                  )}

                  {temple.phone && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Phone
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                        {temple.phone.length === 10
                          ? `+91 ${temple.phone.slice(0, 5)} ${temple.phone.slice(5)}`
                          : temple.phone}
                      </Typography>
                    </Box>
                  )}

                  {temple.email && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Email
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                        {temple.email}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}

            {/* Timings & Aarti Schedule */}
            {(temple.openingTime || temple.closingTime || temple.aartis) && (
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
                  Visiting Hours & Aartis
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {temple.openingTime && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Opening Time
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                        {(() => {
                          const parts = temple.openingTime.split(":");
                          if (parts.length >= 2) {
                            let h = parseInt(parts[0], 10);
                            const m = parts[1];
                            const ampm = h >= 12 ? "PM" : "AM";
                            h = h % 12 || 12;
                            return `${h < 10 ? "0" + h : h}:${m} ${ampm}`;
                          }
                          return temple.openingTime;
                        })()}
                      </Typography>
                    </Box>
                  )}

                  {temple.closingTime && (
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Closing Time
                      </Typography>
                      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" }}>
                        {(() => {
                          const parts = temple.closingTime.split(":");
                          if (parts.length >= 2) {
                            let h = parseInt(parts[0], 10);
                            const m = parts[1];
                            const ampm = h >= 12 ? "PM" : "AM";
                            h = h % 12 || 12;
                            return `${h < 10 ? "0" + h : h}:${m} ${ampm}`;
                          }
                          return temple.closingTime;
                        })()}
                      </Typography>
                    </Box>
                  )}

                  {(() => {
                    let aartiList: any[] = [];
                    if (Array.isArray(temple.aartis)) {
                      aartiList = temple.aartis;
                    } else if (typeof temple.aartis === "string") {
                      try {
                        const parsed = JSON.parse(temple.aartis);
                        if (Array.isArray(parsed)) aartiList = parsed;
                      } catch {}
                    }
                    aartiList = aartiList.filter((a: any) => !a.isDeleted);
                    if (aartiList.length === 0) return null;
                    return (
                      <Box sx={{ mt: 1, pt: 1.5, borderTop: "1px solid #F1F5F9" }}>
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#EA580C", mb: 1 }}>
                          DAILY AARTI SCHEDULE
                        </Typography>
                        {aartiList.map((a, idx) => {
                          const timeStr = (() => {
                            if (!a.time) return "";
                            const parts = a.time.split(":");
                            if (parts.length >= 2) {
                              let h = parseInt(parts[0], 10);
                              const m = parts[1];
                              const ampm = h >= 12 ? "PM" : "AM";
                              h = h % 12 || 12;
                              return `${h < 10 ? "0" + h : h}:${m} ${ampm}`;
                            }
                            return a.time;
                          })();
                          return (
                            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                              <Typography sx={{ fontSize: "0.85rem", color: "#1E293B", fontWeight: 600 }}>
                                {a.name}
                              </Typography>
                              <Typography sx={{ fontSize: "0.85rem", color: "#64748B" }}>
                                {timeStr}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    );
                  })()}
                </Box>
              </Paper>
            )}

            {/* Documents & Media (Trust Deed & Deity Photo) */}
            {(temple.trustDocDownloadUrl ||
              temple.trustDocUrl ||
              temple.deityPhotoDownloadUrl ||
              temple.deityPhotoUrl) && (
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
                  Documents & Media
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Deity Photo */}
                  {(temple.deityPhotoDownloadUrl || temple.deityPhotoUrl) && (
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#64748B",
                            textTransform: "uppercase",
                          }}
                        >
                          Main Shrine / Deity Photo
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<VisibilityIcon sx={{ fontSize: 15 }} />}
                          onClick={() =>
                            setDocModal({
                              open: true,
                              title: `${temple.primaryDeity || temple.name} - Main Shrine Photo`,
                              url: temple.deityPhotoDownloadUrl || temple.deityPhotoUrl,
                            })
                          }
                          sx={{
                            textTransform: "none",
                            color: COLORS.PRIMARY,
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            p: 0,
                            minWidth: "auto",
                          }}
                        >
                          Preview
                        </Button>
                      </Box>
                      <Box
                        onClick={() =>
                          setDocModal({
                            open: true,
                            title: `${temple.primaryDeity || temple.name} - Main Shrine Photo`,
                            url: temple.deityPhotoDownloadUrl || temple.deityPhotoUrl,
                          })
                        }
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 180,
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "1px solid #E2E8F0",
                          bgcolor: "#F8FAFC",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          "&:hover": {
                            opacity: 0.9,
                            borderColor: COLORS.PRIMARY,
                          },
                        }}
                      >
                        <Image
                          src={temple.deityPhotoDownloadUrl || temple.deityPhotoUrl}
                          alt="Main Deity"
                          fill
                          style={{ objectFit: "cover" }}
                          unoptimized
                        />
                      </Box>
                    </Box>
                  )}

                  {/* Trust Deed Document */}
                  {(temple.trustDocDownloadUrl || temple.trustDocUrl) && (
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#64748B",
                          textTransform: "uppercase",
                          mb: 1,
                        }}
                      >
                        Trust Deed / Registration Document
                      </Typography>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: "10px",
                          border: "1px solid #E2E8F0",
                          bgcolor: "#F8FAFC",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1.5,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                          <PictureAsPdfIcon sx={{ color: "#DC2626", fontSize: 26 }} />
                          <Box>
                            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B" }}>
                              Trust Registration Deed
                            </Typography>
                            <Typography sx={{ fontSize: "0.75rem", color: "#64748B" }}>
                              PDF Document
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon fontSize="small" />}
                          onClick={() =>
                            setDocModal({
                              open: true,
                              title: "Trust Deed / Registration Document",
                              url: temple.trustDocDownloadUrl || temple.trustDocUrl,
                            })
                          }
                          sx={{
                            textTransform: "none",
                            borderRadius: "8px",
                            borderColor: "#CBD5E1",
                            color: COLORS.PRIMARY,
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            px: 1.5,
                            py: 0.4,
                            "&:hover": {
                              borderColor: COLORS.PRIMARY,
                              bgcolor: "#FFF5EE",
                            },
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* PDF & Document Preview Modal */}
      <Dialog
        open={docModal.open}
        onClose={() => setDocModal({ open: false, title: "", url: "" })}
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
          }}
        >
          {docModal.title}
          <IconButton
            onClick={() => setDocModal({ open: false, title: "", url: "" })}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 1.5,
            height: "75vh",
            bgcolor: "#f8fafc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {docModal.url &&
            (checkIsImage(docModal.url) ? (
              <Box
                component="img"
                src={docModal.url}
                alt={docModal.title}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <object
                data={getPdfUrlWithParams(docModal.url)}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{ borderRadius: "8px" }}
              >
                <iframe
                  src={
                    docModal.url.startsWith("blob:") ||
                    docModal.url.startsWith("data:")
                      ? getPdfUrlWithParams(docModal.url)
                      : `https://docs.google.com/gview?url=${encodeURIComponent(
                          docModal.url
                        )}&embedded=true`
                  }
                  width="100%"
                  height="100%"
                  style={{ border: "none", borderRadius: "8px" }}
                  title={docModal.title}
                >
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography sx={{ mb: 2, fontFamily: FONTS.OUTFIT }}>
                      Unable to display PDF preview directly in browser dialog.
                    </Typography>
                    <Button
                      component="a"
                      href={docModal.url}
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
      </Dialog>
    </Box>
  );
}
