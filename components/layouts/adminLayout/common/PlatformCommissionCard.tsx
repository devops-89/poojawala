"use client";
import React from "react";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import { FONTS } from "@/utils/fonts";

interface PlatformCommissionCardProps {
  value: string | number;
  error?: string;
  touched?: boolean;
  onChange: (val: string) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  title?: string;
  subtitle?: string;
  label?: string;
  unit?: "%" | "₹";
  placeholder?: string;
  name?: string;
}

export const PlatformCommissionCard: React.FC<PlatformCommissionCardProps> = ({
  value,
  error,
  touched,
  onChange,
  onBlur,
  unit = "%",
  title = "Platform Commission Percentage (%)",
  subtitle = "Set or modify the platform commission percentage charged for this astrologer.",
  label = "Commission Percentage (%) *",
  placeholder = "e.g. 10.00",
  name = "commissionPercentage",
}) => {
  const isPercent = unit === "%";

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
          {isPercent ? (
            <PercentIcon sx={{ fontSize: 26 }} />
          ) : (
            <CurrencyRupeeIcon sx={{ fontSize: 28 }} />
          )}
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
          name={name}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              onChange("");
              return;
            }
            const sanitized = raw.replace(/[^0-9.]/g, "");
            const parts = sanitized.split(".");
            if (parts.length > 2) return;
            if (isPercent) {
              const num = Number(sanitized);
              if (isNaN(num) || num > 100 || num < 0) return;
            }
            onChange(sanitized);
          }}
          onKeyDown={(e) => {
            if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
              e.preventDefault();
            }
          }}
          onBlur={onBlur}
          slotProps={{
            input: {
              [isPercent ? "endAdornment" : "startAdornment"]: isPercent ? (
                <InputAdornment position="end">
                  <Typography
                    sx={{
                      color: "#d97706",
                      fontWeight: 800,
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "16px",
                    }}
                  >
                    %
                  </Typography>
                </InputAdornment>
              ) : (
                <InputAdornment position="start">
                  <CurrencyRupeeIcon
                    sx={{ color: "#d97706", mr: 0.5, fontSize: 20 }}
                  />
                </InputAdornment>
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
