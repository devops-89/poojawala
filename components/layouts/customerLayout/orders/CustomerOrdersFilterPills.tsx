"use client";
import { ORDER_STATUS } from "@/utils/enums";
import { Box, Button } from "@mui/material";

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
}

interface CustomerOrdersFilterPillsProps {
  activeFilter: OrderStatusFilter;
  onFilterChange: (filter: OrderStatusFilter) => void;
}

export default function CustomerOrdersFilterPills({
  activeFilter,
  onFilterChange,
}: CustomerOrdersFilterPillsProps) {
  const filters: FilterPillOption[] = [
    { key: "ALL", label: "All Orders" },
    { key: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
    { key: ORDER_STATUS.PROCESSING, label: "Processing" },
    { key: ORDER_STATUS.SHIPPED, label: "Shipped" },
    { key: ORDER_STATUS.OUT_FOR_DELIVERY, label: "Out For Delivery" },
    { key: ORDER_STATUS.DELIVERED, label: "Delivered" },
    { key: ORDER_STATUS.CANCELLED, label: "Cancelled" },
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
          </Button>
        );
      })}
    </Box>
  );
}
