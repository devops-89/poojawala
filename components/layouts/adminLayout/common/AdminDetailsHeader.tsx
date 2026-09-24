"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface AdminDetailsHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  onBack?: () => void;
  actionButton?: React.ReactNode;
  children?: React.ReactNode;
}

export default function AdminDetailsHeader({
  title,
  breadcrumbs,
  backHref,
  onBack,
  actionButton,
  children,
}: AdminDetailsHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { sm: "flex-start" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        {(backHref || onBack) && (
          <Box
            onClick={handleBack}
            sx={{
              p: 1,
              mt: breadcrumbs ? 3 : 0,
              borderRadius: "50%",
              "&:hover": { bgcolor: "#f1f5f9" },
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
            }}
          >
            <ArrowBackIcon sx={{ color: "#475569", fontSize: 24 }} />
          </Box>
        )}

        <Box>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{ mb: 1.5 }}
            >
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return isLast || !crumb.href ? (
                  <Typography
                    key={idx}
                    sx={{
                      color: isLast ? "#FF6200" : "#64748b",
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: isLast ? 700 : 600,
                      fontSize: "14px",
                    }}
                  >
                    {crumb.label}
                  </Typography>
                ) : (
                  <NextLink
                    key={idx}
                    href={crumb.href}
                    style={{
                      textDecoration: "none",
                      color: "#64748b",
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    {crumb.label}
                  </NextLink>
                );
              })}
            </Breadcrumbs>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                fontFamily: "var(--font-outfit), sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </Typography>
            {children}
          </Box>
        </Box>
      </Box>

      {actionButton && <Box sx={{ flexShrink: 0 }}>{actionButton}</Box>}
    </Box>
  );
}
