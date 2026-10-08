"use client";
import React from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { BreadcrumbItem } from "@/utils/types";
export type { BreadcrumbItem };

interface AppBreadcrumbsProps {
  items: BreadcrumbItem[];
  sx?: any;
}

export default function AppBreadcrumbs({ items, sx }: AppBreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumbs
      separator={
        <NavigateNextIcon
          sx={{ fontSize: 16, color: "#94a3b8" }}
        />
      }
      aria-label="breadcrumb"
      sx={{
        mb: 1.5,
        fontFamily: '"DM Sans", var(--font-outfit), sans-serif',
        fontSize: "14px",
        ...sx,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.href) {
          return (
            <Typography
              key={index}
              sx={{
                fontFamily: '"DM Sans", var(--font-outfit), sans-serif',
                fontSize: "14px",
                fontWeight: 700,
                color: "#FF6200",
              }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            href={item.href}
            style={{
              textDecoration: "none",
              color: "#64748b",
              fontFamily: '"DM Sans", var(--font-outfit), sans-serif',
              fontSize: "14px",
              fontWeight: 600,
              transition: "color 0.2s ease",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
