"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";

interface ServiceDetailsAddressSelectorProps {
  matchingAddresses: any[];
  selectedAddressId: number | string;
  onChangeAddressId: (id: number | string) => void;
  onOpenAddAddressModal: () => void;
  addressError?: string;
}

const formatAddressDetails = (addr: any) => {
  if (!addr) return "";
  const parts: string[] = [];
  const base = (addr.fullAddress || addr.addressLine1 || addr.street || "").trim();
  if (base) parts.push(base);

  const locationParts: string[] = [];
  if (addr.city && !base.toLowerCase().includes(addr.city.toLowerCase())) {
    locationParts.push(addr.city);
  }
  if (addr.state && !base.toLowerCase().includes(addr.state.toLowerCase())) {
    locationParts.push(addr.state);
  }
  if (locationParts.length > 0) {
    parts.push(locationParts.join(", "));
  }
  if (addr.pincode && !base.includes(String(addr.pincode))) {
    parts.push(String(addr.pincode));
  }

  return parts.filter(Boolean).join(", ");
};

export default function ServiceDetailsAddressSelector({
  matchingAddresses,
  selectedAddressId,
  onChangeAddressId,
  onOpenAddAddressModal,
  addressError,
}: ServiceDetailsAddressSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);

  const updateMenuWidth = () => {
    if (containerRef.current) {
      setMenuWidth(containerRef.current.clientWidth);
    }
  };

  useEffect(() => {
    updateMenuWidth();
    window.addEventListener("resize", updateMenuWidth);
    return () => window.removeEventListener("resize", updateMenuWidth);
  }, []);

  const handleOpen = () => {
    updateMenuWidth();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 300) {
        containerRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {matchingAddresses.length > 0 ? (
        <Box sx={{ width: "100%" }}>
          {/* Top Row: Label on left, Add Address Button on right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                fontSize: { xs: "13px", sm: "14px" },
                color: "#64534A",
              }}
            >
              Select Delivery / Pooja Address *
            </Typography>

            <Button
              type="button"
              variant="contained"
              onClick={onOpenAddAddressModal}
              startIcon={<AddIcon sx={{ fontSize: { xs: "16px", sm: "18px" } }} />}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "#ffffff",
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                fontSize: { xs: "12px", sm: "13px" },
                textTransform: "none",
                px: { xs: 1.8, sm: 2.2 },
                py: { xs: 0.6, sm: 0.8 },
                borderRadius: "8px",
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#ea580c",
                  boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
                },
              }}
            >
              Add Address
            </Button>
          </Box>

          {/* Full Width Select Dropdown */}
          <FormControl
            ref={containerRef}
            fullWidth
            error={Boolean(addressError)}
            sx={{
              bgcolor: "#FFFBF7",
              borderRadius: "10px",
              "& .MuiInputLabel-root": {
                fontFamily: FONTS.PRIMARY,
                color: Boolean(addressError) ? "#d32f2f" : "#64534A",
              },
            }}
          >
            <InputLabel
              id="customer-address-label"
              shrink
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: Boolean(addressError) ? "#d32f2f" : "#64534A",
              }}
            >
              Delivery / Pooja Address
            </InputLabel>
            <Select
              labelId="customer-address-label"
              label="Delivery / Pooja Address"
              value={selectedAddressId}
              error={Boolean(addressError)}
              displayEmpty
              onOpen={handleOpen}
              onChange={(e) => {
                if (e.target.value === "ADD_NEW") {
                  onOpenAddAddressModal();
                } else {
                  onChangeAddressId(e.target.value);
                }
              }}
              renderValue={(selectedId) => {
                const addr = matchingAddresses.find(
                  (a: any) => String(a.id) === String(selectedId)
                );
                if (!addr) {
                  return (
                    <span style={{ color: "#9E9E9E", fontFamily: FONTS.PRIMARY }}>
                      Select Delivery / Pooja Address
                    </span>
                  );
                }
                const isDef =
                  addr.isDefault === true ||
                  String(addr.isDefault).toLowerCase() === "true" ||
                  addr.isdefault === true ||
                  addr.is_default === true;
                const label = addr.addressLabel ? `${addr.addressLabel}: ` : "";
                const fullText = formatAddressDetails(addr);

                return (
                  <Box
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "14px",
                      color: "#2C1810",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{label}</span>
                    {fullText}
                    {isDef ? " (Default)" : ""}
                  </Box>
                );
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                marginThreshold: null,
                disableScrollLock: true,
                slotProps: {
                  paper: {
                    sx: {
                      mt: 0.8,
                      maxHeight: 280,
                      overflowY: "auto",
                      borderRadius: "10px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      border: "1px solid #F5ECE3",
                    },
                    style: {
                      width: menuWidth ? `${menuWidth}px` : "100%",
                      maxWidth: menuWidth ? `${menuWidth}px` : "100%",
                    },
                  },
                },
              }}
              sx={{
                borderRadius: "10px",
                fontFamily: FONTS.PRIMARY,
                "& .MuiSelect-select": {
                  py: 1.6,
                  lineHeight: 1.4,
                },
              }}
            >
              {matchingAddresses.map((addr: any) => {
                const isDef =
                  addr.isDefault === true ||
                  String(addr.isDefault).toLowerCase() === "true" ||
                  addr.isdefault === true ||
                  addr.is_default === true;
                const fullText = formatAddressDetails(addr);
                const isSelected = String(addr.id) === String(selectedAddressId);

                return (
                  <MenuItem
                    key={addr.id}
                    value={addr.id}
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      py: 1.5,
                      px: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      borderBottom: "1px solid #F5ECE3",
                      "&:last-child": { borderBottom: "none" },
                      bgcolor: isSelected ? "#FFF8F2 !important" : "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "#FFEFE2 !important" : "#FFFBF7",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontWeight: 700,
                          fontSize: "14px",
                          color: isSelected ? COLORS.PRIMARY : "#2C1810",
                        }}
                      >
                        {addr.addressLabel || "Pooja Address"}
                      </Typography>
                      {isDef && (
                        <Box
                          component="span"
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#059669",
                            bgcolor: "#ECFDF5",
                            px: 1,
                            py: 0.2,
                            borderRadius: "4px",
                          }}
                        >
                          Default
                        </Box>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontSize: "13px",
                        color: "#64534A",
                        lineHeight: 1.4,
                        width: "100%",
                      }}
                    >
                      {fullText}
                    </Typography>
                  </MenuItem>
                );
              })}
              <MenuItem
                value="ADD_NEW"
                sx={{
                  py: 1.5,
                  px: 2,
                  fontFamily: FONTS.PRIMARY,
                  fontSize: "14px",
                  fontWeight: 700,
                  color: COLORS.PRIMARY,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderTop: "1px dashed #FF6200",
                  bgcolor: "#FFF8F2",
                  "&:hover": { bgcolor: "#FFEFE2" },
                }}
              >
                <AddIcon sx={{ fontSize: "18px", color: COLORS.PRIMARY }} />
                + Add New Address
              </MenuItem>
            </Select>
            {addressError && (
              <FormHelperText error sx={{ fontFamily: FONTS.PRIMARY, mt: 0.5, ml: 1 }}>
                {addressError}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            borderRadius: "10px",
            border: "1px dashed #FF6200",
            bgcolor: "#FFFBF7",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 700,
                fontSize: "14px",
                color: "#2C1810",
              }}
            >
              No Saved Address Found
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "13px",
                color: "#64534A",
              }}
            >
              Please add a delivery / pooja address to complete your booking.
            </Typography>
          </Box>
          <Button
            type="button"
            variant="contained"
            onClick={onOpenAddAddressModal}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#FF6200 !important",
              color: "white !important",
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              fontSize: "13px",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "none",
              px: 2,
              py: 0.8,
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: "#ea580c !important" },
            }}
          >
            + Add Address
          </Button>
        </Box>
      )}
    </Box>
  );
}
