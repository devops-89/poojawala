"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { Avatar, Box, Card, Divider, Typography } from "@mui/material";
import React from "react";

export interface OrderCustomerCardProps {
  customer: any;
  shippingAddr: any;
  orderCustomerId?: any;
}

export default function OrderCustomerCard({
  customer,
  shippingAddr,
  orderCustomerId,
}: OrderCustomerCardProps) {
  const customerName = customer
    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
      customer.username ||
      customer.email ||
      "Customer"
    : shippingAddr?.name || "Customer";

  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        height: "100%",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          pb: 2,
          borderBottom: "1px dashed #e2e8f0",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "#fff7ed",
            display: "flex",
          }}
        >
          <PersonIcon sx={{ fontSize: 24, color: COLORS.PRIMARY }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          Customer Details
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {customer?.profileImage ? (
            <Avatar
              src={customer.profileImage}
              sx={{ width: 52, height: 52 }}
            />
          ) : (
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: COLORS.PRIMARY,
                fontWeight: 700,
              }}
            >
              {customerName.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#0f172a",
                fontSize: "1.1rem",
                fontFamily: FONTS.OUTFIT,
              }}
            >
              {customerName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: FONTS.OUTFIT,
              }}
            >
              Customer ID: CM-{customer?.id || orderCustomerId || "N/A"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <PhoneIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <Typography
            sx={{
              fontWeight: 500,
              color: "#334155",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {customer?.phone || shippingAddr?.phone || "N/A"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <EmailIcon sx={{ fontSize: 18, color: "#64748b" }} />
          <Typography
            sx={{
              fontWeight: 500,
              color: "#334155",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {customer?.email || "N/A"}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
