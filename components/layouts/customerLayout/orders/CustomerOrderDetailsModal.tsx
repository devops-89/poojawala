"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  IconButton,
  Skeleton,
  Paper,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { CustomerOrder } from "./CustomerOrdersCard";
import { getCustomerOrderByIdAPI } from "@/api/orderControllers";
import { ORDER_STATUS, ORDER_PAYMENT_STATUS } from "@/utils/enums";

interface CustomerOrderDetailsModalProps {
  open: boolean;
  order: CustomerOrder | null;
  onClose: () => void;
  onReorder: (order: CustomerOrder) => void;
}

export default function CustomerOrderDetailsModal({
  open,
  order,
  onClose,
  onReorder,
}: CustomerOrderDetailsModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<any | null>(null);

  useEffect(() => {
    if (open && order?.id) {
      fetchOrderDetails(order.id);
    } else {
      setDetails(null);
    }
  }, [open, order?.id]);

  const fetchOrderDetails = async (id: string | number) => {
    setLoading(true);
    try {
      const res = await getCustomerOrderByIdAPI(id);
      // Un-nest response safely across all API response shapes
      const orderData = res?.data?.data || res?.data || res;
      setDetails(orderData);
    } catch (err) {
      console.error("Failed to fetch order details by id:", err);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  // Derive order data combining fetched details + fallback prop
  const currentData = details || {};
  const orderNumber = currentData.orderNumber || order.orderNumber;
  const rawOrderStatus = (currentData.orderStatus || order.orderStatus || order.status || "CONFIRMED").toString().toUpperCase();
  const rawPaymentStatus = (currentData.paymentStatus || currentData.payment?.status || order.paymentStatus || "PENDING").toString().toUpperCase();

  const createdDateObj = currentData.createdAt ? new Date(currentData.createdAt) : null;
  const formattedOrderDate = createdDateObj
    ? createdDateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : order.orderDate;

  // Items mapping from API response (supporting nested product object & snapshot fields)
  const itemsList = Array.isArray(currentData.items) && currentData.items.length > 0
    ? currentData.items.map((it: any) => ({
        id: String(it.id || it.productId),
        productId: Number(it.productId || it.product?.id || it.id),
        title: it.productNameSnapshot || it.product?.name || it.productName || it.title || "Pooja Item",
        description: it.product?.description || "",
        quantity: Number(it.quantity) || 1,
        price: Number(it.unitPriceSnapshot || it.product?.price || it.unitPrice || it.price) || 0,
        total: Number(it.totalAmount || (Number(it.unitPriceSnapshot || it.product?.price || 0) * Number(it.quantity || 1))) || 0,
        image: it.productImageSnapshot || it.product?.imageUrl || it.productImage || it.image || "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=400&q=80",
        pricingUnit: it.product?.pricingUnit || it.pricingUnit || "PIECE",
      }))
    : order.items;

  // Shipping Address Snapshot mapping
  const addrSnap = currentData.shippingAddressSnapshot;
  const recipientName = addrSnap?.name || "";
  const recipientPhone = addrSnap?.phone || "";
  const addressType = addrSnap?.addressLine2 || "";
  const fullAddress = addrSnap
    ? [addrSnap.addressLine1, addrSnap.city, addrSnap.state, addrSnap.pincode]
        .filter(Boolean)
        .join(", ")
    : order.deliveryAddress || "Address information unavailable";

  // Payment mapping
  const paymentObj = currentData.payment;
  const razorpayPaymentId = paymentObj?.razorpayPaymentId || null;
  const razorpayOrderId = paymentObj?.razorpayOrderId || null;
  const paidAtFormatted = paymentObj?.paidAt
    ? new Date(paymentObj.paidAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const paymentMethodStr =
    paymentObj?.paymentMethod ||
    paymentObj?.customerPaymentMethod ||
    currentData.paymentMethod ||
    order.paymentMethod ||
    "ONLINE";

  // Financials
  const subtotal = Number(currentData.subtotal || order.totalAmount) || 0;
  const discountAmount = Number(currentData.discountAmount) || 0;
  const grandTotal = Number(currentData.totalAmount || paymentObj?.customerPaidAmount || order.totalAmount) || subtotal;

  // Helper for order status chip config
  const getStatusChipConfig = (s: string) => {
    switch (s) {
      case ORDER_STATUS.CONFIRMED:
        return { label: "CONFIRMED", bgcolor: "#E3F2FD", color: "#1976D2", border: "#BBDEFB" };
      case ORDER_STATUS.PROCESSING:
        return { label: "PROCESSING", bgcolor: "#FFF3E0", color: "#E65100", border: "#FFE0B2" };
      case ORDER_STATUS.PENDING_PAYMENT:
        return { label: "PENDING PAYMENT", bgcolor: "#FFF8E1", color: "#F57F17", border: "#FFE082" };
      case ORDER_STATUS.SHIPPED:
        return { label: "SHIPPED", bgcolor: "#F3E5F5", color: "#7B1FA2", border: "#E1BEE7" };
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return { label: "OUT FOR DELIVERY", bgcolor: "#E0F7FA", color: "#00838F", border: "#B2EBF2" };
      case ORDER_STATUS.DELIVERED:
        return { label: "DELIVERED", bgcolor: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" };
      case ORDER_STATUS.CANCELLED:
        return { label: "CANCELLED", bgcolor: "#FFEBEE", color: "#D32F2F", border: "#FFCDD2" };
      default:
        return { label: s.replace(/_/g, " "), bgcolor: "#E3F2FD", color: "#1976D2", border: "#BBDEFB" };
    }
  };

  const getPaymentChipConfig = (p: string) => {
    switch (p) {
      case ORDER_PAYMENT_STATUS.PAID:
      case "SUCCESS":
        return { label: "PAID", bgcolor: "#E8F5E9", color: "#2E7D32", border: "#C8E6C9" };
      case ORDER_PAYMENT_STATUS.FAILED:
        return { label: "FAILED", bgcolor: "#FFEBEE", color: "#D32F2F", border: "#FFCDD2" };
      case ORDER_PAYMENT_STATUS.COD_PENDING:
        return { label: "COD PENDING", bgcolor: "#FFF8E1", color: "#E65100", border: "#FFE082" };
      default:
        return { label: p.replace(/_/g, " "), bgcolor: "#FFF4E5", color: "#ED6C02", border: "#FFE0B2" };
    }
  };

  const orderChip = getStatusChipConfig(rawOrderStatus);
  const paymentChip = getPaymentChipConfig(rawPaymentStatus);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: "16px", sm: "24px" },
            m: { xs: 1.5, sm: 3 },
            maxHeight: "92vh",
            bgcolor: "#FFFBF7",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* MODAL HEADER */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1.5,
          pt: { xs: 2, sm: 2.5 },
          px: { xs: 2, sm: 3.5 },
          bgcolor: "#FAF4EE",
          borderBottom: "1px solid #EADCCF",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: { xs: "10.5px", sm: "11.5px" },
              fontWeight: 800,
              letterSpacing: "1.2px",
              color: "#C84B16",
              textTransform: "uppercase",
            }}
          >
            SACRED ORDER DETAILS
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "18px", sm: "22px" },
              mt: 0.2,
            }}
          >
            {orderNumber}
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: "#64534A",
            bgcolor: "#FFFFFF",
            border: "1px solid #EADCCF",
            "&:hover": { bgcolor: "#FAF4EE", color: "#C84B16" },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      {/* MODAL CONTENT */}
      <DialogContent
        sx={{
          px: { xs: 2, sm: 3.5 },
          py: { xs: 2, sm: 3 },
          overflowY: "auto",
        }}
      >
        {loading ? (
          <Box sx={{ py: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="rectangular" height={70} sx={{ borderRadius: "14px" }} />
            <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "14px" }} />
            <Skeleton variant="rectangular" height={160} sx={{ borderRadius: "14px" }} />
          </Box>
        ) : (
          <>
            {/* Top Status & Timestamp Banner */}
            <Box
              sx={{
                bgcolor: "#FAF4EE",
                p: { xs: 2, sm: 2.5 },
                borderRadius: "16px",
                border: "1px solid #EADCCF",
                mb: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 1.5,
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeOutlinedIcon sx={{ color: "#C84B16", fontSize: 18 }} />
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                      fontSize: { xs: "12.5px", sm: "13.5px" },
                    }}
                  >
                    Placed on: <strong>{formattedOrderDate}</strong>
                  </Typography>
                </Box>
                {paidAtFormatted && (
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#8C7A70",
                      fontSize: "12px",
                      mt: 0.3,
                      pl: 3.2,
                    }}
                  >
                    Paid at: <strong>{paidAtFormatted}</strong>
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={orderChip.label}
                  size="small"
                  sx={{
                    bgcolor: orderChip.bgcolor,
                    color: orderChip.color,
                    border: `1px solid ${orderChip.border}`,
                    fontWeight: 800,
                    fontSize: "11px",
                    borderRadius: "12px",
                    px: 0.5,
                  }}
                />
                <Chip
                  label={paymentChip.label}
                  size="small"
                  sx={{
                    bgcolor: paymentChip.bgcolor,
                    color: paymentChip.color,
                    border: `1px solid ${paymentChip.border}`,
                    fontWeight: 800,
                    fontSize: "11px",
                    borderRadius: "12px",
                    px: 0.5,
                  }}
                />
              </Box>
            </Box>

            {/* Address & Payment Grid */}
            <Grid container spacing={2.5} sx={{ mb: 3 }}>
              {/* Shipping Address Box */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "white",
                    border: "1px solid #EADCCF",
                    borderRadius: "16px",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationOnOutlinedIcon sx={{ color: "#C84B16", fontSize: 20 }} />
                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 800,
                          color: "#2C1810",
                          fontSize: "13.5px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        SHIPPING ADDRESS
                      </Typography>
                    </Box>
                    {addressType && (
                      <Chip
                        label={addressType}
                        size="small"
                        sx={{
                          bgcolor: "#FAF4EE",
                          color: "#C84B16",
                          border: "1px solid #EADCCF",
                          fontWeight: 700,
                          fontSize: "10px",
                          height: 20,
                        }}
                      />
                    )}
                  </Box>

                  {recipientName && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <PersonOutlinedIcon sx={{ color: "#8C7A70", fontSize: 16 }} />
                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 700,
                          color: "#2C1810",
                          fontSize: "13.5px",
                        }}
                      >
                        {recipientName}
                      </Typography>
                    </Box>
                  )}

                  {recipientPhone && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <PhoneOutlinedIcon sx={{ color: "#8C7A70", fontSize: 16 }} />
                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#64534A",
                          fontSize: "13px",
                        }}
                      >
                        +91 {recipientPhone}
                      </Typography>
                    </Box>
                  )}

                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    {fullAddress}
                  </Typography>
                </Paper>
              </Grid>

              {/* Payment Details Box */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    bgcolor: "white",
                    border: "1px solid #EADCCF",
                    borderRadius: "16px",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <PaymentOutlinedIcon sx={{ color: "#C84B16", fontSize: 20 }} />
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontWeight: 800,
                        color: "#2C1810",
                        fontSize: "13.5px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      PAYMENT DETAILS
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                      fontSize: "13px",
                      mb: 0.6,
                    }}
                  >
                    Payment Method: <strong>{paymentMethodStr}</strong>
                  </Typography>

                  {razorpayPaymentId && (
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        color: "#64534A",
                        fontSize: "12.5px",
                        mb: 0.6,
                        wordBreak: "break-all",
                      }}
                    >
                      Payment ID: <strong>{razorpayPaymentId}</strong>
                    </Typography>
                  )}

                  {razorpayOrderId && (
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        color: "#64534A",
                        fontSize: "12.5px",
                        mb: 0.6,
                        wordBreak: "break-all",
                      }}
                    >
                      Razorpay Order: <strong>{razorpayOrderId}</strong>
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                      fontSize: "13px",
                    }}
                  >
                    Payment Status:{" "}
                    <span style={{ fontWeight: 800, color: paymentChip.color }}>
                      {rawPaymentStatus}
                    </span>
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Items Section */}
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "1px",
                color: "#8C7A70",
                textTransform: "uppercase",
                mb: 1.8,
              }}
            >
              ORDERED ITEMS ({itemsList.length})
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}>
              {itemsList.map((item: any) => (
                <Paper
                  key={item.id}
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "white",
                    p: { xs: 1.8, sm: 2.2 },
                    borderRadius: "16px",
                    border: "1px solid #EADCCF",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, width: { xs: "100%", sm: "auto" } }}>
                    <Box
                      sx={{
                        width: { xs: 56, sm: 64 },
                        height: { xs: 56, sm: 64 },
                        borderRadius: "12px",
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
                        }}
                      >
                        {item.title}
                      </Typography>

                      {item.description && (
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            color: "#8C7A70",
                            fontSize: "12px",
                            mt: 0.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#64534A",
                          fontSize: { xs: "12px", sm: "13px" },
                          mt: 0.4,
                        }}
                      >
                        Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")} ({item.pricingUnit})
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontWeight: 800,
                      color: "#2C1810",
                      fontSize: { xs: "17px", sm: "19px" },
                      alignSelf: { xs: "flex-end", sm: "center" },
                    }}
                  >
                    ₹{(item.total || item.price * item.quantity).toLocaleString("en-IN")}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Divider sx={{ borderColor: "#EADCCF", mb: 2.5 }} />

            {/* Financial Summary */}
            <Box sx={{ bgcolor: "#FAF4EE", p: 2.5, borderRadius: "16px", border: "1px solid #EADCCF" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: "#64534A", fontSize: "14px" }}>
                  Items Subtotal
                </Typography>
                <Typography sx={{ fontFamily: '"Georgia", serif', fontWeight: 700, color: "#2C1810" }}>
                  ₹{subtotal.toLocaleString("en-IN")}
                </Typography>
              </Box>

              {discountAmount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: "#64534A", fontSize: "14px" }}>
                    Discount
                  </Typography>
                  <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: "#2E7D32", fontWeight: 700 }}>
                    - ₹{discountAmount.toLocaleString("en-IN")}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: "#64534A", fontSize: "14px" }}>
                  Sacred Delivery & Packaging
                </Typography>
                <Typography sx={{ fontFamily: '"DM Sans", sans-serif', color: "#2E7D32", fontWeight: 700 }}>
                  FREE
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pt: 1.5,
                  mt: 1,
                  borderTop: "1px dashed #EADCCF",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontWeight: 800,
                    color: "#2C1810",
                    fontSize: { xs: "17px", sm: "19px" },
                  }}
                >
                  Grand Total Paid
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontWeight: 800,
                    color: "#C84B16",
                    fontSize: { xs: "22px", sm: "26px" },
                  }}
                >
                  ₹{grandTotal.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      {/* MODAL ACTIONS */}
      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 1.5,
          bgcolor: "#FAF4EE",
          borderTop: "1px solid #EADCCF",
          justifyContent: "space-between",
          flexDirection: { xs: "column-reverse", sm: "row" },
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            width: { xs: "100%", sm: "auto" },
            color: "#64534A",
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 2.5,
          }}
        >
          Close
        </Button>

        <Button
          onClick={() => {
            onClose();
            onReorder(order);
          }}
          variant="contained"
          sx={{
            width: { xs: "100%", sm: "auto" },
            bgcolor: "#C84B16",
            color: "white",
            fontWeight: 700,
            borderRadius: "10px",
            px: 3.5,
            py: 1,
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(200, 75, 22, 0.25)",
            "&:hover": { bgcolor: "#B84A17" },
          }}
        >
          Reorder Sacred Items
        </Button>
      </DialogActions>
    </Dialog>
  );
}
