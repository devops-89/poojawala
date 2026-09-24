"use client";

import {
  getCustomerOrderByIdAPI,
  updateOrderStatusAPI,
} from "@/api/orderControllers";
import AdminDetailsHeader from "@/components/layouts/adminLayout/common/AdminDetailsHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import OrderCustomerCard from "@/components/layouts/adminLayout/orders/components/OrderCustomerCard";
import OrderItemsTable from "@/components/layouts/adminLayout/orders/components/OrderItemsTable";
import OrderPaymentCard from "@/components/layouts/adminLayout/orders/components/OrderPaymentCard";
import OrderShippingCard from "@/components/layouts/adminLayout/orders/components/OrderShippingCard";
import OrderSummaryCard from "@/components/layouts/adminLayout/orders/components/OrderSummaryCard";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { ORDER_STATUS } from "@/utils/enums";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { useSocketStore } from "@/stores/socketStore";

export default function AdminOrderDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    id: string | number;
    status: string;
  } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await getCustomerOrderByIdAPI(id);

      const payload =
        res?.data?.data?.data ||
        res?.data?.data ||
        res?.data?.order ||
        res?.data ||
        res?.order ||
        res;

      const orderData = payload?.data || payload;
      setOrder(orderData);
    } catch (err: any) {
      console.error("Error fetching order details:", err);
      showSnackbar(
        err.response?.data?.message || "Failed to load order details",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id, refreshTrigger]);

  const confirmUpdateStatus = async () => {
    if (!confirmStatusChange) return;
    try {
      setIsUpdatingStatus(true);
      await updateOrderStatusAPI(
        confirmStatusChange.id,
        confirmStatusChange.status
      );

      showSnackbar("Order status updated successfully", "success");
      setOrder((prev: any) =>
        prev
          ? {
              ...prev,
              orderStatus: confirmStatusChange.status,
              status: confirmStatusChange.status,
            }
          : null
      );
      setConfirmStatusChange(null);
    } catch (error: any) {
      const errMsg =
        (Array.isArray(error.response?.data?.error)
          ? error.response?.data?.error?.[0]
          : error.response?.data?.message) || "Error updating status";
      showSnackbar(errMsg, "error");
      setConfirmStatusChange(null);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getAvailableNextStatuses = (statusStr?: string) => {
    const current = (statusStr || ORDER_STATUS.CONFIRMED).toUpperCase();

    switch (current) {
      case ORDER_STATUS.PENDING_PAYMENT:
      case "PENDING":
        return [
          { value: ORDER_STATUS.PENDING_PAYMENT, label: "Pending" },
          { value: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
          { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
        ];
      case ORDER_STATUS.CONFIRMED:
        return [
          { value: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
          { value: ORDER_STATUS.PROCESSING, label: "Processing" },
          { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
        ];
      case ORDER_STATUS.PROCESSING:
        return [
          { value: ORDER_STATUS.PROCESSING, label: "Processing" },
          { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
          { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
        ];
      case ORDER_STATUS.SHIPPED:
        return [
          { value: ORDER_STATUS.SHIPPED, label: "Shipped" },
          { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: "Out For Delivery" },
          { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
        ];
      case ORDER_STATUS.OUT_FOR_DELIVERY:
        return [
          { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: "Out For Delivery" },
          { value: ORDER_STATUS.DELIVERED, label: "Delivered" },
          { value: ORDER_STATUS.CANCELLED, label: "Cancelled" },
        ];
      default:
        return [{ value: current, label: current.replace("_", " ") }];
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress sx={{ color: "#FF6200" }} />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography
          color="error"
          variant="h6"
          sx={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Order not found or could not be loaded.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/admin/orders")}
          sx={{ mt: 2, color: "#FF6200" }}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  const customer = order.customer || order.user || order.customerDetails;
  const customerName = customer
    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
      customer.username ||
      customer.email ||
      "Customer"
    : order.shippingAddressSnapshot?.name || "Customer";

  const currentOrderStatus = (
    order.orderStatus ||
    order.status ||
    ORDER_STATUS.CONFIRMED
  ).toUpperCase();

  const availableOptions = getAvailableNextStatuses(currentOrderStatus);
  const shippingAddr =
    order.shippingAddressSnapshot || order.shippingAddress || {};
  const itemsList = order.items || order.orderItems || [];
  const payment = order.payment || {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3.5,
        pb: 6,
        maxWidth: "1280px",
        mx: "auto",
      }}
    >
      {/* Top Header */}
      <AdminDetailsHeader
        title={`Order ID: ORD-${order.id}`}
        backHref="/admin/orders"
        actionButton={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: "#475569",
                fontSize: "0.9rem",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              Order Status:
            </Typography>
            <AdminStatusSelect
              value={
                currentOrderStatus === "PENDING"
                  ? ORDER_STATUS.PENDING_PAYMENT
                  : currentOrderStatus
              }
              options={availableOptions}
              onChange={(newStatus) =>
                setConfirmStatusChange({
                  id: order.id || order.orderId || id,
                  status: newStatus,
                })
              }
            />
          </Box>
        }
      >
        <AdminStatusSelect
          value={order.paymentStatus || payment.status || "PENDING"}
          readOnly
        />
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.875rem",
            width: "100%",
            mt: 0.5,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          <CalendarTodayIcon sx={{ fontSize: 16 }} />
          Placed on{" "}
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "N/A"}
        </Typography>
      </AdminDetailsHeader>

      {/* Main Grid Layout */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <OrderCustomerCard
            customer={customer}
            shippingAddr={shippingAddr}
            orderCustomerId={order.customerId}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <OrderShippingCard
            shippingAddr={shippingAddr}
            customerName={customerName}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <OrderItemsTable itemsList={itemsList} />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <OrderPaymentCard
            payment={payment}
            orderPaymentStatus={order.paymentStatus}
            orderPaymentMethod={order.paymentMethod}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummaryCard order={order} />
        </Grid>
      </Grid>

      {/* Confirm Status Change Dialog */}
      <ConfirmStatusDialog
        open={Boolean(confirmStatusChange)}
        title="Confirm Order Status Change"
        itemName={
          confirmStatusChange ? `ORD-${confirmStatusChange.id}` : undefined
        }
        newStatus={
          confirmStatusChange
            ? confirmStatusChange.status.replace("_", " ")
            : undefined
        }
        onClose={() => setConfirmStatusChange(null)}
        onConfirm={confirmUpdateStatus}
        loading={isUpdatingStatus}
      />
    </Box>
  );
}
