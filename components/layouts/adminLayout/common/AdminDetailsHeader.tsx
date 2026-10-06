"use client";

import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import { Box, Typography } from "@mui/material";
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
  actionButton,
  children,
}: AdminDetailsHeaderProps) {
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
        <Box>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <AppBreadcrumbs items={breadcrumbs} />
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
