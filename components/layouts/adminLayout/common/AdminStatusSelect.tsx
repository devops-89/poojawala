"use client";
import { FONTS } from "@/utils/fonts";

import { Box, MenuItem, Select } from "@mui/material";
import React from "react";

import { StatusOption, AdminStatusSelectProps } from "@/utils/types";
export type { StatusOption, AdminStatusSelectProps };

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

  const getDisplayLabel = (val: any) => {
    const found = options?.find((o) => String(o.value) === String(val));
    const labelStr = found
      ? found.label
      : typeof val === "string"
      ? val.replace(/_/g, " ")
      : String(val || "");
    return labelStr.toUpperCase().trim();
  };

  const displayLabel = getDisplayLabel(value);

  if (readOnly || !options || options.length <= 1 || !onChange) {
    return (
      <Box
        sx={{
          bgcolor: theme.bg,
          color: theme.text,
          fontWeight: 700,
          fontFamily: FONTS.OUTFIT,
          borderRadius: "8px",
          height: "28px",
          px: 1.5,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.75rem",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          boxSizing: "border-box",
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
      renderValue={(selected) => getDisplayLabel(selected)}
      sx={{
        bgcolor: theme.bg,
        color: theme.text,
        fontWeight: 700,
        fontFamily: FONTS.OUTFIT,
        borderRadius: "8px",
        height: "28px",
        fontSize: "0.75rem",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiSelect-select": {
          display: "inline-flex",
          alignItems: "center",
          py: 0,
          pl: 1.5,
          pr: "26px !important",
          height: "28px",
          boxSizing: "border-box",
          fontWeight: 700,
          fontFamily: FONTS.OUTFIT,
          fontSize: "0.75rem",
          letterSpacing: "0.5px",
          textTransform: "uppercase !important",
        },
        "& .MuiSvgIcon-root": {
          color: theme.text,
          right: "4px",
          fontSize: "1.1rem",
        },
      }}
    >
      {options.map((opt) => (
        <MenuItem
          key={String(opt.value)}
          value={String(opt.value)}
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {opt.label.toUpperCase()}
        </MenuItem>
      ))}
    </Select>
  );
}
