"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { Box, Chip, Paper, Typography } from "@mui/material";
import Image from "next/image";
import NextLink from "next/link";
import React from "react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

export interface ServiceHeaderCardProps {
  service: any;
  languagesList: any[];
  languagesText: string;
}

export default function ServiceHeaderCard({
  service,
  languagesList,
  languagesText,
}: ServiceHeaderCardProps) {
  const isTempleService = Boolean(service.templeId || service.temple);
  const templeName =
    service.temple?.name ||
    service.templeName ||
    (typeof service.temple === "string" ? service.temple : null);
  const templeId = service.templeId || service.temple?.id;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        background: "linear-gradient(135deg, #ffffff 0%, #fff7f2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
            flexShrink: 0,
            border: "4px solid white",
          }}
        >
          <Image
            src={service.iconDownloadurl || service.iconUrl || PLACEHOLDER}
            alt={service.name}
            fill
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              color: "#1e293b",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              mb: 1.5,
            }}
          >
            {service.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={service.isActive ? "Active" : "Inactive"}
              sx={{
                bgcolor: service.isActive ? "#10b981" : "#f1f5f9",
                color: service.isActive ? "#ffffff" : "#94a3b8",
                fontWeight: 700,
                fontFamily: "var(--font-outfit), sans-serif",
                borderRadius: "8px",
                boxShadow: service.isActive
                  ? "0 4px 14px 0 rgba(16, 185, 129, 0.39)"
                  : "none",
              }}
            />

            {/* Service Type Chip (Temple Service vs Regular/Festival Service) */}
            {isTempleService ? (
              <Chip
                icon={
                  <TempleHinduIcon
                    sx={{ color: "#ffffff !important", fontSize: "1.1rem" }}
                  />
                }
                label="Temple Service"
                sx={{
                  bgcolor: "#FF6200",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px 0 rgba(255, 98, 0, 0.35)",
                }}
              />
            ) : (
              <Chip
                label={
                  service.isUpcomingFestival
                    ? "Upcoming Festival"
                    : "Regular Service"
                }
                sx={{
                  bgcolor: service.isUpcomingFestival ? "#8b5cf6" : "#f1f5f9",
                  color: service.isUpcomingFestival ? "#ffffff" : "#64748b",
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  borderRadius: "8px",
                  boxShadow: service.isUpcomingFestival
                    ? "0 4px 14px 0 rgba(139, 92, 246, 0.39)"
                    : "none",
                }}
              />
            )}

            {/* Temple Name Chip if available */}
            {templeName && (
              <Chip
                icon={
                  <TempleHinduIcon
                    sx={{ color: "#b45309 !important", fontSize: "1.1rem" }}
                  />
                }
                label={templeName}
                component={templeId ? NextLink : "div"}
                href={templeId ? `/admin/temples/${templeId}` : undefined}
                clickable={Boolean(templeId)}
                sx={{
                  bgcolor: "#fef3c7",
                  color: "#b45309",
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  borderRadius: "8px",
                  border: "1px solid #fde68a",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#fde68a",
                  },
                }}
              />
            )}

            <Chip
              icon={
                <AccessTimeIcon
                  style={{ color: "#FF6200", fontSize: "1.1rem" }}
                />
              }
              label={`${service.durationMinutes} Mins`}
              sx={{
                bgcolor: "#FFF0E6",
                color: "#FF6200",
                fontWeight: 700,
                fontFamily: "var(--font-outfit), sans-serif",
                borderRadius: "8px",
                border: "1px solid #ffedd5",
              }}
            />

            {service.category?.name && (
              <Chip
                label={service.category.name}
                sx={{
                  bgcolor: "#e0f2fe",
                  color: "#0369a1",
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  borderRadius: "8px",
                  border: "1px solid #bae6fd",
                }}
              />
            )}

            {/* Show Upcoming Festival Chip if also marked as festival */}
            {isTempleService && service.isUpcomingFestival && (
              <Chip
                label="Upcoming Festival"
                sx={{
                  bgcolor: "#8b5cf6",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)",
                }}
              />
            )}
          </Box>

          {languagesText && (
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                color: "#64748b",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              <Box
                component="span"
                sx={{ color: "#1e293b", fontWeight: 700, mr: 0.5 }}
              >
                {languagesList.length === 1 ? "Language:" : "Languages:"}
              </Box>
              {languagesText}
            </Typography>
          )}

          {templeName && (
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                color: "#64748b",
                fontSize: "0.95rem",
                fontWeight: 600,
                mt: 0.5,
              }}
            >
              <Box
                component="span"
                sx={{ color: "#1e293b", fontWeight: 700, mr: 0.5 }}
              >
                Temple:
              </Box>
              {templeId ? (
                <NextLink
                  href={`/admin/temples/${templeId}`}
                  style={{
                    color: "#FF6200",
                    textDecoration: "none",
                    fontWeight: 700,
                  }}
                >
                  {templeName}
                </NextLink>
              ) : (
                <Box
                  component="span"
                  sx={{ color: "#FF6200", fontWeight: 700 }}
                >
                  {templeName}
                </Box>
              )}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
