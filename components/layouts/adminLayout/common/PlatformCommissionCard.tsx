"use client";
import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { FONTS } from "@/utils/fonts";

interface PlatformCommissionCardProps {
  value: string | number;
  error?: string;
  touched?: boolean;
  onChange: (val: string) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  title?: string;
  subtitle?: string;
}

export const PlatformCommissionCard: React.FC<PlatformCommissionCardProps> = ({
  value,
  error,
  touched,
  onChange,
  onBlur,
  title = "Platform Commission Price (₹)",
  subtitle = "Set or modify the platform commission price charged for this partner.",
}) => {
  return (
    <Box
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: "16px",
        bgcolor: "#fffbeb",
        border: "1.5px solid #fde68a",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: 2.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: "#fef3c7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#d97706",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(217, 119, 6, 0.12)",
          }}
        >
          <CurrencyRupeeIcon sx={{ fontSize: 28 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "16px",
              color: "#92400e",
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "13px",
              color: "#b45309",
              mt: 0.25,
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: { xs: "100%", md: "280px" }, minWidth: "220px" }}>
        <TextField
          fullWidth
          name="commissionPrice"
          label="Commission Price (₹) *"
          placeholder="e.g. 50.00"
          variant="outlined"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "");
            const parts = val.split(".");
            const sanitized =
              parts.length > 2
                ? `${parts[0]}.${parts.slice(1).join("")}`
                : val;
            onChange(sanitized);
          }}
          onBlur={onBlur}
          slotProps={{
            input: {
              startAdornment: (
                <CurrencyRupeeIcon
                  sx={{ color: "#d97706", mr: 0.5, fontSize: 20 }}
                />
              ),
            },
          }}
          error={Boolean(touched && error)}
          helperText={touched && error ? error : undefined}
          sx={{
            bgcolor: "#ffffff",
            borderRadius: "12px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              fontWeight: 600,
              "& fieldset": {
                borderColor: "#fde68a",
              },
              "&:hover fieldset": {
                borderColor: "#d97706",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#d97706",
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};
