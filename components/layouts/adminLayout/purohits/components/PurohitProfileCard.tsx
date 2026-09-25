"use client";

import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";

export interface PurohitProfileCardProps {
  purohit: any;
  profile: any;
  statusLabel: string;
  statusColor: { bg: string; text: string };
  onPreviewDoc: (url: string) => void;
  onStatusChange?: (newStatus: string) => void;
}

export default function PurohitProfileCard({
  purohit,
  profile,
  statusLabel,
  statusColor,
  onPreviewDoc,
  onStatusChange,
}: PurohitProfileCardProps) {
  const fullName =
    `${purohit.firstName || ""} ${purohit.lastName || ""}`.trim() ||
    purohit.username ||
    "Purohit";
  const initials =
    `${purohit.firstName?.[0] || ""}${purohit.lastName?.[0] || ""}`.toUpperCase() ||
    "P";

  // Parse comma-separated strings or arrays
  const parseList = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      return data
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const specializationsList = parseList(profile.specializations);
  const languagesList = parseList(profile.languages);
  const serviceAreas = Array.isArray(purohit.serviceAreas)
    ? purohit.serviceAreas
    : [];

  // Get primary location city or fallback to profile city / birthPlace
  const primaryArea = serviceAreas.find((a: any) => a.isDefault);
  const displayCity =
    primaryArea?.city ||
    profile.city ||
    purohit.birthPlace ||
    "No City specified";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 4 },
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "white",
        height: "100%",
      }}
    >
      {/* Basic Profile Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 3,
          mb: 4,
        }}
      >
        <Avatar
          src={purohit.profileImage || ""}
          sx={{
            width: { xs: 70, sm: 84 },
            height: { xs: 70, sm: 84 },
            bgcolor: "#FF6200",
            fontSize: "2rem",
            fontWeight: 700,
            border: "3px solid #fff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          {initials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
            {onStatusChange ? (
              <AdminStatusSelect
                value={statusLabel}
                options={
                  statusLabel === "Approved"
                    ? [
                        { value: "Approved", label: "Approved" },
                        { value: "Rejected", label: "Rejected" },
                      ]
                    : statusLabel === "Rejected"
                    ? [
                        { value: "Rejected", label: "Rejected" },
                        { value: "Approved", label: "Approved" },
                      ]
                    : [
                        { value: "Pending Approval", label: "Pending Approval" },
                        { value: "Approved", label: "Approved" },
                        { value: "Rejected", label: "Rejected" },
                      ]
                }
                onChange={(newStatus) => {
                  if (newStatus !== statusLabel) {
                    onStatusChange(newStatus);
                  }
                }}
              />
            ) : (
              <Chip
                label={statusLabel}
                sx={{
                  bgcolor: statusColor.bg,
                  color: statusColor.text,
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  borderRadius: "8px",
                }}
              />
            )}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              color: "#1e293b",
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            {fullName}
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              color: "#64748b",
              fontSize: "0.9rem",
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            <LocationOnIcon sx={{ fontSize: 16, color: "#FF6200" }} />
            {displayCity}
            {profile.experienceYears
              ? ` • ${profile.experienceYears} Years Experience`
              : ""}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Professional Details */}
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 700,
          color: "#1e293b",
          fontSize: "1.1rem",
          mb: 2.5,
        }}
      >
        Professional Profile
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
            Bio
          </Typography>
          <Typography sx={{ color: "#1e293b", mt: 0.5, fontSize: "0.95rem", lineHeight: 1.6 }}>
            {profile.bio || "No bio provided."}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
            Qualification
          </Typography>
          <Typography sx={{ color: "#1e293b", mt: 0.5, fontWeight: 600, fontSize: "0.95rem" }}>
            {profile.qualification || "N/A"}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
            Average Rating
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            <StarIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
            <Typography sx={{ color: "#1e293b", fontWeight: 700, fontSize: "0.95rem" }}>
              {purohit.avgRating || profile.avgRating || "0.0"}
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, mb: 0.5 }}>
            Service Availability
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {profile.isOnlineAvailable && (
              <Chip
                label="Online Pooja Available"
                size="small"
                sx={{ bgcolor: "#d1fae5", color: "#059669", fontWeight: 700 }}
              />
            )}
            {profile.isOfflineAvailable && (
              <Chip
                label="Offline / In-Person Available"
                size="small"
                sx={{ bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700 }}
              />
            )}
            {!profile.isOnlineAvailable && !profile.isOfflineAvailable && (
              <Typography sx={{ color: "#1e293b" }}>N/A</Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, mb: 0.5 }}>
            Specializations
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {specializationsList.length > 0 ? (
              specializationsList.map((s: string, i: number) => (
                <Chip
                  key={i}
                  label={s}
                  size="small"
                  sx={{ bgcolor: "#FFF0E6", color: "#FF6200", fontWeight: 700 }}
                />
              ))
            ) : (
              <Typography sx={{ color: "#1e293b", fontSize: "0.9rem" }}>N/A</Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, mb: 0.5 }}>
            Languages Spoken
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {languagesList.length > 0 ? (
              languagesList.map((l: string, i: number) => (
                <Chip
                  key={i}
                  label={l}
                  size="small"
                  sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 700 }}
                />
              ))
            ) : (
              <Typography sx={{ color: "#1e293b", fontSize: "0.9rem" }}>N/A</Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* Services Offered */}
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 700,
          color: "#1e293b",
          fontSize: "1.1rem",
          mb: 2.5,
        }}
      >
        Services Offered ({profile.purohitServices?.length || 0})
      </Typography>
      {profile.purohitServices && profile.purohitServices.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 4, alignItems: "stretch" }}>
          {profile.purohitServices.map((ps: any, index: number) => {
            const duration = ps.durationMinutes || ps.service?.durationMinutes || "N/A";
            const offlinePrice = ps.offlinePrice || ps.customPrice;
            const onlinePrice = ps.onlinePrice;
            const iconImg = ps.service?.iconDownloadurl || ps.service?.iconUrl || "";

            return (
              <Grid size={{ xs: 12, sm: 6 }} key={ps.id || index} sx={{ display: "flex" }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "#f8fafc",
                    borderRadius: "14px",
                    border: "1px solid #e2e8f0",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 1.5 }}>
                    <Avatar
                      src={iconImg}
                      sx={{ width: 44, height: 44, borderRadius: "10px", bgcolor: "#fff", border: "1px solid #e2e8f0" }}
                    >
                      {ps.service?.name?.[0] || "P"}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                        {ps.service?.name || "Puja Service"}
                      </Typography>
                      <Typography sx={{ fontSize: "0.825rem", color: "#64748b", mt: 0.2 }}>
                        Duration: <b>{duration} mins</b>
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 1.5 }}>
                    {offlinePrice && (
                      <Typography sx={{ fontSize: "0.85rem", color: "#1e293b" }}>
                        Offline Price: <b style={{ color: "#FF6200" }}>₹{offlinePrice}</b>
                      </Typography>
                    )}
                    {onlinePrice && (
                      <Typography sx={{ fontSize: "0.85rem", color: "#1e293b" }}>
                        Online Price: <b style={{ color: "#059669" }}>₹{onlinePrice}</b>
                      </Typography>
                    )}
                    {!offlinePrice && !onlinePrice && (
                      <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                        Price: ₹{ps.customPrice || "N/A"}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                    {ps.isOffline && (
                      <Chip
                        label="Offline"
                        size="small"
                        sx={{ bgcolor: "#e0e7ff", color: "#4338ca", fontSize: "0.75rem", fontWeight: 700 }}
                      />
                    )}
                    {ps.isOnline && (
                      <Chip
                        label="Online"
                        size="small"
                        sx={{ bgcolor: "#d1fae5", color: "#059669", fontSize: "0.75rem", fontWeight: 700 }}
                      />
                    )}
                    {ps.isActive && (
                      <Chip
                        label="Active"
                        size="small"
                        sx={{ bgcolor: "#d1fae5", color: "#047857", fontSize: "0.75rem", fontWeight: 700 }}
                      />
                    )}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mb: 4 }}>
          No services offered yet.
        </Typography>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Service Areas / Operating Locations */}
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 700,
          color: "#1e293b",
          fontSize: "1.1rem",
          mb: 2.5,
        }}
      >
        Service Areas & Locations ({serviceAreas.length})
      </Typography>

      {serviceAreas.length > 0 ? (
        <Grid container spacing={2} sx={{ mb: 4, alignItems: "stretch" }}>
          {serviceAreas.map((area: any, index: number) => (
            <Grid size={{ xs: 12, sm: 6 }} key={area.id || index} sx={{ display: "flex" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: "#f8fafc",
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, gap: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                      {area.addressLabel || "Location"}
                    </Typography>
                    {area.isDefault && (
                      <Chip
                        label="Primary Location"
                        size="small"
                        sx={{ bgcolor: "#ffedd5", color: "#c2410c", fontWeight: 700, fontSize: "0.75rem" }}
                      />
                    )}
                  </Box>
                  <Typography sx={{ fontSize: "0.85rem", color: "#334155", mb: 1.5, lineHeight: 1.5 }}>
                    {area.fullAddress || `${area.streetName || ""}, ${area.city || ""}`}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, color: "#64748b", fontSize: "0.8rem", flexWrap: "wrap", borderTop: "1px dashed #cbd5e1", pt: 1.5, mt: 1 }}>
                  <span>City: <b>{area.city || "N/A"}</b></span>
                  <span>Pincode: <b>{area.pincode || "N/A"}</b></span>
                  {area.serviceRadiusKm && (
                    <span>Radius: <b>{area.serviceRadiusKm} km</b></span>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ color: "#64748b", fontSize: "0.9rem", mb: 4 }}>
          No service areas added yet.
        </Typography>
      )}

      <Divider sx={{ mb: 4 }} />

      {/* Verification Documents */}
      <Typography
        sx={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 700,
          color: "#1e293b",
          fontSize: "1.1rem",
          mb: 2.5,
        }}
      >
        Verification Documents
      </Typography>

      <Grid container spacing={2}>
        {profile.aadhaarDocUrl && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                  Aadhaar Card
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>
                  {profile.aadhaarNumber || "Uploaded"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => onPreviewDoc(profile.aadhaarDocUrl)}
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={profile.aadhaarDocDownloadUrl || profile.aadhaarDocUrl}
                  target="_blank"
                  download
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        )}

        {profile.panDocUrl && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                  PAN Card
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>
                  Uploaded
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => onPreviewDoc(profile.panDocUrl)}
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={profile.panDocDownloadUrl || profile.panDocUrl}
                  target="_blank"
                  download
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        )}

        {profile.certificateUrl && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                  Certificate
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>
                  {profile.qualification || "Uploaded"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => onPreviewDoc(profile.certificateUrl)}
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={profile.certificateDownloadUrl || profile.certificateUrl}
                  target="_blank"
                  download
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        )}

        {profile.templeAffiliationProofUrl && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: "#f8fafc",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700, color: "#1e293b" }}>
                  Temple Affiliation
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>
                  Uploaded
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => onPreviewDoc(profile.templeAffiliationProofUrl)}
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton
                  component="a"
                  href={profile.templeAffiliationProofDownloadUrl || profile.templeAffiliationProofUrl}
                  target="_blank"
                  download
                  sx={{ color: "#FF6200", bgcolor: "#FFF0E6", "&:hover": { bgcolor: "#FFE0CC" } }}
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        )}

        {!profile.aadhaarDocUrl &&
          !profile.panDocUrl &&
          !profile.certificateUrl &&
          !profile.templeAffiliationProofUrl && (
            <Grid size={{ xs: 12 }}>
              <Typography sx={{ color: "#64748b", fontSize: "0.9rem" }}>
                No documents uploaded yet.
              </Typography>
            </Grid>
          )}
      </Grid>
    </Paper>
  );
}
