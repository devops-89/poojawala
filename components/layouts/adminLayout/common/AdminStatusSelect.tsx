"use client";

import { Box, MenuItem, Select } from "@mui/material";
import React from "react";

export interface StatusOption {
  value: string;
  label: string;
}

export interface AdminStatusSelectProps {
  value: string;
  options?: StatusOption[];
  onChange?: (newValue: string) => void;
  readOnly?: boolean;
}

export const getStatusTheme = (statusStr?: string) => {
  const status = (statusStr || "").toUpperCase().replace(/_/g, " ").trim();

  if (
    ["DELIVERED", "COMPLETED", "APPROVED", "RESOLVED", "ACTIVE", "PUBLISHED", "READ", "SUCCESS", "PAID", "AVAILABLE", "IN STOCK", "ENABLED"].includes(status)
  ) {
    return { bg: "#d1fae5", text: "#059669" };
  }

  if (["CONFIRMED", "ACCEPTED"].includes(status)) {
    return { bg: "#dbeafe", text: "#1d4ed8" };
  }

  if (["PROCESSING", "UNDER REVIEW", "IN PROGRESS"].includes(status)) {
    return { bg: "#ffedd5", text: "#c2410c" };
  }

  if (["SHIPPED", "ENROUTE", "ARRIVED"].includes(status)) {
    return { bg: "#f3e8ff", text: "#7e22ce" };
  }

  if (["OUT FOR DELIVERY", "ONGOING"].includes(status)) {
    return { bg: "#cffafe", text: "#0e7490" };
  }

  if (
    ["PENDING", "PENDING PAYMENT", "PENDING APPROVAL", "DRAFT", "OPEN"].includes(status)
  ) {
    return { bg: "#fef3c7", text: "#d97706" };
  }

  if (
    ["CANCELLED", "BLOCKED", "REJECTED", "FAILED", "UNAVAILABLE", "OUT OF STOCK", "INACTIVE", "DISABLED"].includes(status)
  ) {
    return { bg: "#fee2e2", text: "#ef4444" };
  }

  if (["CLOSED", "ARCHIVED"].includes(status)) {
    return { bg: "#e2e8f0", text: "#475569" };
  }

  return { bg: "#f1f5f9", text: "#64748b" };
};


export default function AdminStatusSelect({
  value,
  options,
  onChange,
  readOnly = false,
}: AdminStatusSelectProps) {
  const theme = getStatusTheme(value);

  if (readOnly || !options || options.length <= 1 || !onChange) {
    const displayLabel =
      options?.find((o) => o.value === value)?.label ||
      value.replace(/_/g, " ");
    return (
      <Box
        sx={{
          bgcolor: theme.bg,
          color: theme.text,
          fontWeight: 700,
          fontFamily: "var(--font-outfit), sans-serif",
          borderRadius: "6px",
          py: 0.5,
          px: 1.5,
          display: "inline-block",
          fontSize: "0.85rem",
        }}
      >
        {displayLabel}
      </Box>
    );
  }

  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        bgcolor: theme.bg,
        color: theme.text,
        fontWeight: 700,
        fontFamily: "var(--font-outfit), sans-serif",
        borderRadius: "8px",
        fontSize: "0.825rem",
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiSelect-select": { py: 0.5, px: 1.5 },
        "& .MuiSvgIcon-root": { color: theme.text },
      }}
    >
      {options.map((opt) => (
        <MenuItem
          key={opt.value}
          value={opt.value}
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
