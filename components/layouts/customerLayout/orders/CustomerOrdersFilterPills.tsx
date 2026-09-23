"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import { ORDER_STATUS } from "@/utils/enums";

export type OrderStatusFilter =
  | "ALL"
  | ORDER_STATUS.CONFIRMED
  | ORDER_STATUS.PROCESSING
  | ORDER_STATUS.SHIPPED
  | ORDER_STATUS.OUT_FOR_DELIVERY
  | ORDER_STATUS.DELIVERED
  | ORDER_STATUS.CANCELLED;

interface FilterPillOption {
  key: OrderStatusFilter;
  label: string;
  count: number;
}

interface CustomerOrdersFilterPillsProps {
  activeFilter: OrderStatusFilter;
  onFilterChange: (filter: OrderStatusFilter) => void;
  counts: Record<string, number>;
}

export default function CustomerOrdersFilterPills({
  activeFilter,
  onFilterChange,
  counts,
}: CustomerOrdersFilterPillsProps) {
  const filters: FilterPillOption[] = [
    { key: "ALL", label: "All Orders", count: counts.all || 0 },
    { key: ORDER_STATUS.CONFIRMED, label: "Confirmed", count: counts.confirmed || 0 },
    { key: ORDER_STATUS.PROCESSING, label: "Processing", count: counts.processing || 0 },
    { key: ORDER_STATUS.SHIPPED, label: "Shipped", count: counts.shipped || 0 },
    { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: "Out For Delivery", count: counts.out_for_delivery || 0 },
    { key: ORDER_STATUS.DELIVERED, label: "Delivered", count: counts.delivered || 0 },
    { key: ORDER_STATUS.CANCELLED, label: "Cancelled", count: counts.cancelled || 0 },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        overflowX: "auto",
        pb: 1,
        mb: 3,
        mx: { xs: -2, sm: 0 },
        px: { xs: 2, sm: 0 },
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {filters.map((tab) => {
        const isActive = activeFilter === tab.key;

        return (
          <Button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            sx={{
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: "30px",
              px: { xs: 2, sm: 2.5 },
              py: { xs: 0.8, sm: 1 },
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "13px", sm: "14px" },
              textTransform: "none",
              bgcolor: isActive ? "#FF6200" : "#FFFFFF",
              color: isActive ? "white" : "#64534A",
              border: isActive ? "1px solid #FF6200" : "1px solid #EADCCF",
              boxShadow: isActive ? "0 4px 14px rgba(255, 98, 0, 0.3)" : "none",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: isActive ? "#E05600" : "#FFF5EB",
                borderColor: isActive ? "#E05600" : "#D9C3B0",
              },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span>{tab.label}</span>
            <Box
              component="span"
              sx={{
                bgcolor: isActive ? "rgba(255, 255, 255, 0.25)" : "#F0E2D6",
                color: isActive ? "white" : "#64534A",
                px: 0.9,
                py: 0.2,
                borderRadius: "12px",
                fontSize: "11.5px",
                fontWeight: 800,
                minWidth: 18,
                textAlign: "center",
              }}
            >
              {tab.count}
            </Box>
          </Button>
        );
      })}
    </Box>
  );
}
