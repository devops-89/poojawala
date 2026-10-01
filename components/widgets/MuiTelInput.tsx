"use client";

import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";

export interface MuiTelInputProps extends Omit<TextFieldProps, "onChange"> {
  value?: string;
  onChange?: (value: string, info: { nationalNumber: string }) => void;
  defaultCountry?: string;
  onlyCountries?: string[];
  disableDropdown?: boolean;
}

export function MuiTelInput({
  value = "",
  onChange,
  defaultCountry = "IN",
  onlyCountries,
  disableDropdown = true,
  disabled = false,
  sx,
  slotProps,
  ...props
}: MuiTelInputProps) {
  // Extract clean 10-digit national number
  const cleanNumber = (value || "").replace(/^\+91\s*/, "").replace(/\D/g, "").slice(0, 10);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, "").slice(0, 10);
    const newFullVal = digitsOnly ? `+91${digitsOnly}` : "";
    if (onChange) {
      onChange(newFullVal, { nationalNumber: digitsOnly });
    }
  };

  return (
    <TextField
      {...props}
      value={cleanNumber}
      onChange={handleChange}
      disabled={disabled}
      slotProps={{
        ...slotProps,
        input: {
          startAdornment: (
            <InputAdornment
              position="start"
              sx={{
                gap: 0.8,
                color: "#1e293b",
                fontWeight: 600,
                userSelect: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 480"
                style={{
                  width: 22,
                  height: 15,
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                <path fill="#f93" d="M0 0h640v160H0z" />
                <path fill="#fff" d="M0 160h640v160H0z" />
                <path fill="#128807" d="M0 320h640v160H0z" />
                <g transform="translate(320 240)">
                  <circle r="60" fill="none" stroke="#008" strokeWidth="6" />
                  <circle r="12" fill="#008" />
                  <g id="d">
                    <g id="c">
                      <g id="b">
                        <line y2="-60" stroke="#008" strokeWidth="2" />
                      </g>
                      <use href="#b" transform="rotate(15)" />
                    </g>
                    <use href="#c" transform="rotate(30)" />
                  </g>
                  <use href="#d" transform="rotate(60)" />
                  <use href="#d" transform="rotate(120)" />
                  <use href="#d" transform="rotate(180)" />
                  <use href="#d" transform="rotate(240)" />
                  <use href="#d" transform="rotate(300)" />
                </g>
              </svg>
              <span style={{ fontSize: "0.95rem", color: "#334155", fontWeight: 600 }}>+91</span>
            </InputAdornment>
          ),
          ...slotProps?.input,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
        },
        ...sx,
      }}
    />
  );
}

export function matchIsValidTel(tel: string): boolean {
  if (!tel) return false;
  const digits = tel.replace(/\D/g, "");
  return digits.length >= 10;
}

export default MuiTelInput;
