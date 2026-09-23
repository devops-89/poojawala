"use client";
import React from "react";
import { Box, Typography, Button, Paper, Chip } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { ORDER_STATUS, ORDER_PAYMENT_STATUS } from "@/utils/enums";

export interface OrderItem {
  id: string | number;
  productId?: string | number;
  title: string;
  quantity: number;
  image: string;
  price: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  categoryTag?: string;
  status: ORDER_STATUS | string;
  orderStatus: ORDER_STATUS | string;
  paymentStatus: ORDER_PAYMENT_STATUS | string;
  items: OrderItem[];
  totalAmount: number;
  deliveredDate?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
}

interface CustomerOrdersCardProps {
  order: CustomerOrder;
  onViewDetails: (order: CustomerOrder) => void;
  onReorder: (order: CustomerOrder) => void;
}

export default function CustomerOrdersCard({
  order,
  onViewDetails,
  onReorder,
}: CustomerOrdersCardProps) {
  // Order Status Config Helper with distinct colors per status
  const getStatusChipConfig = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case ORDER_STATUS.CONFIRMED:
        return {
          label: "CONFIRMED",
          bgcolor: "#E3F2FD",
          color: "#1976D2",
          borderColor: "#BBDEFB",
          icon: <AutorenewIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.PROCESSING:
        return {
          label: "PROCESSING",
          bgcolor: "#FFF3E0",
          color: "#E65100",
          borderColor: "#FFE0B2",
          icon: <AutorenewIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.PENDING_PAYMENT:
        return {
          label: "PENDING PAYMENT",
          bgcolor: "#FFF8E1",
          color: "#F57F17",
          borderColor: "#FFE082",
          icon: <AutorenewIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.SHIPPED:
        return {
          label: "SHIPPED",
          bgcolor: "#F3E5F5",
          color: "#7B1FA2",
          borderColor: "#E1BEE7",
          icon: <LocalShippingOutlinedIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return {
          label: "OUT FOR DELIVERY",
          bgcolor: "#E0F7FA",
          color: "#00838F",
          borderColor: "#B2EBF2",
          icon: <LocalShippingOutlinedIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.DELIVERED:
        return {
          label: "DELIVERED",
          bgcolor: "#E8F5E9",
          color: "#2E7D32",
          borderColor: "#C8E6C9",
          icon: <CheckIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.CANCELLED:
        return {
          label: "CANCELLED",
          bgcolor: "#FFEBEE",
          color: "#D32F2F",
          borderColor: "#FFCDD2",
          icon: <CancelOutlinedIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.RETURN_REQUESTED:
        return {
          label: "RETURN REQUESTED",
          bgcolor: "#EDE7F6",
          color: "#512DA8",
          borderColor: "#D1C4E9",
          icon: <AutorenewIcon sx={{ fontSize: 13 }} />,
        };
      case ORDER_STATUS.RETURNED:
        return {
          label: "RETURNED",
          bgcolor: "#EFEBE9",
          color: "#4E342E",
          borderColor: "#D7CCC8",
          icon: <CancelOutlinedIcon sx={{ fontSize: 13 }} />,
        };
      default:
        return {
          label: s.replace(/_/g, " "),
          bgcolor: "#E3F2FD",
          color: "#1976D2",
          borderColor: "#BBDEFB",
          icon: <AutorenewIcon sx={{ fontSize: 13 }} />,
        };
    }
  };

  // Payment Status Config Helper
  const getPaymentStatusChipConfig = (pStatus?: string) => {
    const s = (pStatus || "").toUpperCase();
    switch (s) {
      case ORDER_PAYMENT_STATUS.PAID:
        return {
          label: "PAID",
          bgcolor: "#E8F5E9",
          color: "#2E7D32",
          borderColor: "#C8E6C9",
        };
      case ORDER_PAYMENT_STATUS.FAILED:
        return {
          label: "FAILED",
          bgcolor: "#FFEBEE",
          color: "#D32F2F",
          borderColor: "#FFCDD2",
        };
      case ORDER_PAYMENT_STATUS.COD_PENDING:
        return {
          label: "COD PENDING",
          bgcolor: "#FFF8E1",
          color: "#E65100",
          borderColor: "#FFE082",
        };
      case ORDER_PAYMENT_STATUS.REFUNDED:
        return {
          label: "REFUNDED",
          bgcolor: "#F3E5F5",
          color: "#7B1FA2",
          borderColor: "#E1BEE7",
        };
      case ORDER_PAYMENT_STATUS.PENDING:
      default:
        return {
          label: s ? s.replace(/_/g, " ") : "PAYMENT PENDING",
          bgcolor: "#FFF4E5",
          color: "#ED6C02",
          borderColor: "#FFE0B2",
        };
    }
  };

  const statusConfig = getStatusChipConfig(order.orderStatus || order.status);
  const paymentStatusConfig = getPaymentStatusChipConfig(order.paymentStatus);
  const visibleItems = order.items.slice(0, 2);
  const hiddenCount = order.items.length - 2;

  // Render Left Footer Note corresponding to Order Status
  const renderFooterStatusNote = () => {
    const statusStr = (order.orderStatus || order.status || "").toUpperCase();

    switch (statusStr) {
      case ORDER_STATUS.CONFIRMED:
        return (
          <>
            <AutorenewIcon sx={{ fontSize: 18, color: "#1976D2" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Order confirmed • Packing with purity
            </Typography>
          </>
        );

      case ORDER_STATUS.PROCESSING:
        return (
          <>
            <AutorenewIcon sx={{ fontSize: 18, color: "#E65100" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Processing • Preparing sacred offerings
            </Typography>
          </>
        );

      case ORDER_STATUS.PENDING_PAYMENT:
        return (
          <>
            <AutorenewIcon sx={{ fontSize: 18, color: "#F57F17", flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              Pending Payment • Awaiting completion
            </Typography>
          </>
        );

      case ORDER_STATUS.SHIPPED:
        return (
          <>
            <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: "#7B1FA2" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Shipped • Package in transit
            </Typography>
          </>
        );

      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return (
          <>
            <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: "#00838F" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Out for delivery • Arriving today
            </Typography>
          </>
        );

      case ORDER_STATUS.DELIVERED:
        return (
          <>
            <CheckIcon sx={{ fontSize: 18, color: "#2E7D32" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Delivered on {order.deliveredDate || order.orderDate}
            </Typography>
          </>
        );

      case ORDER_STATUS.CANCELLED:
        return (
          <>
            <CancelOutlinedIcon sx={{ fontSize: 18, color: "#D32F2F" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Order Cancelled
            </Typography>
          </>
        );

      case ORDER_STATUS.RETURN_REQUESTED:
        return (
          <>
            <AutorenewIcon sx={{ fontSize: 18, color: "#512DA8" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Return Requested • Processing request
            </Typography>
          </>
        );

      case ORDER_STATUS.RETURNED:
        return (
          <>
            <CancelOutlinedIcon sx={{ fontSize: 18, color: "#4E342E" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Order Returned
            </Typography>
          </>
        );

      default:
        return (
          <>
            <AutorenewIcon sx={{ fontSize: 18, color: "#1976D2" }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: { xs: "12.5px", sm: "13.5px" },
                fontWeight: 600,
              }}
            >
              Status: {statusStr.replace(/_/g, " ")}
            </Typography>
          </>
        );
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#FFFBF7",
        border: "1px solid #EADCCF",
        borderRadius: "20px",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(44, 24, 16, 0.07)",
          borderColor: "#D9C3B0",
        },
      }}
    >
      {/* 1. CARD TOP HEADER BAR (Order Number + Status Chips on left, Order Date on RIGHT CORNER) */}
      <Box
        sx={{
          p: { xs: 1.8, sm: 2.2 },
          px: { xs: 2, sm: 3 },
          bgcolor: "#FAF4EE",
          borderBottom: "1px solid #EADCCF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {/* Left Side: Order Number + Order Status Chip + Payment Status Chip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
          <Typography
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "15px", sm: "17px" },
            }}
          >
            {order.orderNumber}
          </Typography>

          {/* Order Status Chip */}
          <Chip
            label={statusConfig.label}
            size="small"
            icon={statusConfig.icon}
            sx={{
              bgcolor: statusConfig.bgcolor,
              color: statusConfig.color,
              border: `1px solid ${statusConfig.borderColor}`,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              fontSize: { xs: "10px", sm: "11px" },
              letterSpacing: "0.5px",
              px: 0.5,
              height: 24,
              borderRadius: "20px",
              "& .MuiChip-icon": { color: statusConfig.color },
            }}
          />

          {/* Payment Status Chip */}
          {order.paymentStatus && (
            <Chip
              label={paymentStatusConfig.label}
              size="small"
              sx={{
                bgcolor: paymentStatusConfig.bgcolor,
                color: paymentStatusConfig.color,
                border: `1px solid ${paymentStatusConfig.borderColor}`,
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "10px", sm: "11px" },
                letterSpacing: "0.5px",
                px: 0.6,
                height: 24,
                borderRadius: "20px",
              }}
            />
          )}
        </Box>

        {/* Right Corner: Order Date */}
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: "#64534A",
            fontSize: { xs: "12.5px", sm: "13.5px" },
            fontWeight: 600,
            ml: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {order.orderDate}
        </Typography>
      </Box>

      {/* 2. CARD MIDDLE CONTENT AREA */}
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {/* Left: Items List */}
        <Box sx={{ flexGrow: 1, width: "100%", minWidth: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {visibleItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 48, sm: 54 },
                    height: { xs: 48, sm: 54 },
                    borderRadius: "10px",
                    overflow: "hidden",
                    bgcolor: "#FAF4EE",
                    border: "1px solid #EADCCF",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      color: "#2C1810",
                      fontSize: { xs: "14px", sm: "15px" },
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                      fontSize: { xs: "12px", sm: "13px" },
                      mt: 0.3,
                    }}
                  >
                    Qty: {item.quantity}
                  </Typography>
                </Box>
              </Box>
            ))}

            {hiddenCount > 0 && (
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#8C7A70",
                  fontSize: "13px",
                  fontWeight: 600,
                  pl: 0.5,
                }}
              >
                + {hiddenCount} more {hiddenCount === 1 ? "item" : "items"}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Right: Order Total Column */}
        <Box
          sx={{
            textAlign: { xs: "left", sm: "right" },
            flexShrink: 0,
            alignSelf: { xs: "flex-start", sm: "center" },
            pt: { xs: 1, sm: 0 },
            borderTop: { xs: "1px dashed #EADCCF", sm: "none" },
            width: { xs: "100%", sm: "auto" },
            display: "flex",
            flexDirection: { xs: "row", sm: "column" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-end" },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 800,
              fontSize: "11px",
              letterSpacing: "1.2px",
              color: "#8C7A70",
              textTransform: "uppercase",
              mb: { xs: 0, sm: 0.5 },
            }}
          >
            ORDER TOTAL
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "22px", sm: "28px" },
              lineHeight: 1,
            }}
          >
            ₹{order.totalAmount.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </Box>

      {/* 3. CARD FOOTER BAR */}
      <Box
        sx={{
          p: { xs: 1.8, sm: 2 },
          px: { xs: 2, sm: 2.5 },
          borderTop: "1px solid #F0E2D6",
          bgcolor: "#FAF4EE",
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 1 },
          flexWrap: "wrap",
        }}
      >
        {/* Left Footer: Dynamic Status Note based on orderStatus */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0, flex: 1 }}>
          {renderFooterStatusNote()}
        </Box>

        {/* Right Footer: Action Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            width: { xs: "100%", sm: "auto" },
            flexShrink: 0,
            ml: { sm: "auto" },
          }}
        >
          <Button
            size="small"
            onClick={() => onViewDetails(order)}
            sx={{
              flex: { xs: 1, sm: "none" },
              color: "#2C1810",
              borderColor: "#EADCCF",
              borderStyle: "solid",
              borderWidth: "1px",
              bgcolor: "#FFFBF7",
              borderRadius: "10px",
              px: { xs: 1.2, sm: 1.8 },
              py: 0.6,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "12px", sm: "13px" },
              whiteSpace: "nowrap",
              textTransform: "none",
              "&:hover": {
                borderColor: "#FF6200",
                color: "#FF6200",
                bgcolor: "white",
              },
            }}
          >
            View Details
          </Button>

          <Button
            size="small"
            onClick={() => onReorder(order)}
            variant="contained"
            sx={{
              flex: { xs: 1, sm: "none" },
              bgcolor: "#C84B16",
              color: "white",
              borderRadius: "10px",
              px: { xs: 1.5, sm: 2 },
              py: 0.6,
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "12px", sm: "13px" },
              whiteSpace: "nowrap",
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(200, 75, 22, 0.25)",
              "&:hover": {
                bgcolor: "#B84A17",
                boxShadow: "0 6px 16px rgba(200, 75, 22, 0.35)",
              },
            }}
          >
            Reorder
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
