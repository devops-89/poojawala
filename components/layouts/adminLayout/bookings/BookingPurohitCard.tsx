"use client";
import { FONTS } from "@/utils/fonts";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmailIcon from "@mui/icons-material/Email";
import HandymanIcon from "@mui/icons-material/Handyman";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { Box, Card, Chip, Typography } from "@mui/material";
import React from "react";

export interface BookingPurohitCardProps {
  booking: any;
  technicianName: string;
}

export default function BookingPurohitCard({
  booking,
  technicianName,
}: BookingPurohitCardProps) {
  const isAstrology =
    booking?.bookingType === "ASTROLOGY" || Boolean(booking?.astrologer);

  // If not astrology (e.g. POOJA), preserve the original exact purohit card
  if (!isAstrology) {
    const assignedPartner = booking?.purohit;
    return (
      <Card
        elevation={0}
        sx={{
          p: 3.5,
          borderRadius: 4,
          height: "100%",
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          transition: "transform 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
            pb: 2,
            borderBottom: "1px dashed #e2e8f0",
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              backgroundColor: "#eff6ff",
              display: "flex",
            }}
          >
            <HandymanIcon sx={{ fontSize: 24, color: "#2563eb" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            Purohit Assigned
          </Typography>
        </Box>

        {assignedPartner ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "baseline",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "#64748b",
                  minWidth: "80px",
                  fontSize: "0.95rem",
                }}
              >
                Name:
              </Typography>
              <Typography
                sx={{ fontWeight: 600, color: "#0f172a", fontSize: "1.05rem" }}
              >
                {technicianName}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "baseline",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "#64748b",
                  minWidth: "80px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.95rem",
                }}
              >
                <PhoneIcon sx={{ fontSize: 16 }} /> Phone:
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#334155" }}>
                {assignedPartner.phone || assignedPartner.user?.phone || "N/A"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                alignItems: "baseline",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "#64748b",
                  minWidth: "80px",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.95rem",
                }}
              >
                <EmailIcon sx={{ fontSize: 16 }} /> Email:
              </Typography>
              <Typography sx={{ fontWeight: 600, color: "#334155" }}>
                {assignedPartner.email || assignedPartner.user?.email || "N/A"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "120px",
              backgroundColor: "#f8fafc",
              borderRadius: 3,
              border: "1px dashed #cbd5e1",
            }}
          >
            <Typography
              sx={{
                color: "#64748b",
                fontWeight: 600,
                fontFamily: FONTS.OUTFIT,
              }}
            >
              Purohit not yet assigned
            </Typography>
          </Box>
        )}
      </Card>
    );
  }

  // Astrology Assigned Card
  const astrologer = booking?.astrologer;
  const astroProfile =
    booking?.astrologerProfile || astrologer?.astrologerProfile;
  const astrologerName = astrologer
    ? `${astrologer.firstName || ""} ${astrologer.lastName || ""}`.trim() ||
      astrologer.username ||
      "Astrologer"
    : "Not Assigned";

  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        height: "100%",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        transition: "transform 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          pb: 2,
          borderBottom: "1px dashed #e2e8f0",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "#fdf4ff",
            display: "flex",
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 24, color: "#c026d3" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          Astrologer Assigned
        </Typography>
      </Box>

      {astrologer ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "baseline",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                color: "#64748b",
                minWidth: "80px",
                fontSize: "0.95rem",
              }}
            >
              Name:
            </Typography>
            <Typography
              sx={{ fontWeight: 600, color: "#0f172a", fontSize: "1.05rem" }}
            >
              {astrologerName}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "baseline",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                color: "#64748b",
                minWidth: "80px",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.95rem",
              }}
            >
              <PhoneIcon sx={{ fontSize: 16 }} /> Phone:
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "#334155" }}>
              {astrologer.phone || "N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "baseline",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                color: "#64748b",
                minWidth: "80px",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: "0.95rem",
              }}
            >
              <EmailIcon sx={{ fontSize: 16 }} /> Email:
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "#334155" }}>
              {astrologer.email || "N/A"}
            </Typography>
          </Box>

          {(astroProfile?.city || astroProfile?.experienceYears) && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
                pt: 0.5,
              }}
            >
              {astroProfile.city && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationCityIcon sx={{ fontSize: 16, color: "#64748b" }} />
                  <Typography sx={{ fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                    {astroProfile.city}
                  </Typography>
                </Box>
              )}
              {astroProfile.experienceYears && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <WorkspacePremiumIcon sx={{ fontSize: 16, color: "#64748b" }} />
                  <Typography sx={{ fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                    {astroProfile.experienceYears} Years Exp
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {Array.isArray(astroProfile?.specializations) &&
            astroProfile.specializations.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, pt: 0.5 }}>
                {astroProfile.specializations.map((spec: string) => (
                  <Chip
                    key={spec}
                    label={spec}
                    size="small"
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      backgroundColor: "#fdf4ff",
                      color: "#a21caf",
                      border: "1px solid #f0abfc",
                    }}
                  />
                ))}
              </Box>
            )}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "120px",
            backgroundColor: "#f8fafc",
            borderRadius: 3,
            border: "1px dashed #cbd5e1",
          }}
        >
          <Typography
            sx={{
              color: "#64748b",
              fontWeight: 600,
              fontFamily: FONTS.OUTFIT,
            }}
          >
            Astrologer not yet assigned
          </Typography>
        </Box>
      )}
    </Card>
  );
}

