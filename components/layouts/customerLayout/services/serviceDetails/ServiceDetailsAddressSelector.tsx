"use client";

import React from "react";
import {
  Box,
  Button,
  FormControl,
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
}

export default function ServiceDetailsAddressSelector({
  matchingAddresses,
  selectedAddressId,
  onChangeAddressId,
  onOpenAddAddressModal,
}: ServiceDetailsAddressSelectorProps) {
  return (
    <Box sx={{ width: "100%" }}>
      {matchingAddresses.length > 0 ? (
        <Box sx={{ width: "100%" }}>
          {/* Top Right Responsive Add Address Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 1,
              width: "100%",
            }}
          >
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
          <FormControl fullWidth sx={{ bgcolor: "#FFFBF7", borderRadius: "10px" }}>
            <InputLabel
              id="customer-address-label"
              sx={{
                fontFamily: FONTS.PRIMARY,
                color: "#64534A",
              }}
            >
              Select Delivery / Pooja Address
            </InputLabel>
            <Select
              labelId="customer-address-label"
              label="Select Delivery / Pooja Address"
              value={selectedAddressId}
              onChange={(e) => {
                if (e.target.value === "ADD_NEW") {
                  onOpenAddAddressModal();
                } else {
                  onChangeAddressId(e.target.value);
                }
              }}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 320,
                      maxWidth: { xs: "90vw", sm: "600px" },
                      borderRadius: "14px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                    },
                  },
                },
              }}
              sx={{
                borderRadius: "10px",
                fontFamily: FONTS.PRIMARY,
                "& .MuiSelect-select": {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  py: 1.5,
                  lineHeight: 1.4,
                },
              }}
            >
              {matchingAddresses.map((addr: any) => {
                const labelPrefix = addr.addressLabel ? `${addr.addressLabel}: ` : "";
                const displayAddress =
                  addr.fullAddress ||
                  [
                    addr.addressLine1 || addr.street,
                    addr.city,
                    addr.state,
                    addr.pincode || addr.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ");
                const isDef =
                  addr.isDefault === true ||
                  String(addr.isDefault).toLowerCase() === "true" ||
                  addr.isdefault === true ||
                  addr.is_default === true;

                return (
                  <MenuItem
                    key={addr.id}
                    value={addr.id}
                    sx={{
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      py: 1.5,
                      px: 2,
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "14px",
                      lineHeight: 1.5,
                      borderBottom: "1px solid #F5ECE3",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    {labelPrefix}
                    {displayAddress}
                    {isDef ? " (Default)" : ""}
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
