"use client";

import { getAllOrdersAPI, updateOrderStatusAPI } from "@/api/orderControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect, {
  getStatusTheme,
} from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useSocketStore } from "@/stores/socketStore";
import { ORDER_PAYMENT_STATUS, ORDER_STATUS } from "@/utils/enums";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "All Orders", label: "All Orders" },
  { id: ORDER_STATUS.PENDING_PAYMENT, label: "Pending" },
  { id: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
  { id: ORDER_STATUS.PROCESSING, label: "Processing" },
  { id: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { id: ORDER_STATUS.OUT_FOR_DELIVERY, label: "Out For Delivery" },
  { id: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { id: ORDER_STATUS.CANCELLED, label: "Cancelled" },
];

export default function AdminOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "All Orders";

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [orders, setOrders] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    id: string | number;
    status: string;
  } | null>(null);

  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await getAllOrdersAPI(
        page + 1,
        rowsPerPage,
        statusFilter,
        searchValue,
      );

      let orderList: any[] = [];
      let totalCount = 0;
      const payload = res?.data?.data || res?.data || res;
      if (payload) {
        if (Array.isArray(payload.orders)) {
          orderList = payload.orders;
          totalCount =
            typeof payload.total === "number"
              ? payload.total
              : orderList.length;
        } else if (Array.isArray(payload)) {
          orderList = payload;
          totalCount = orderList.length;
        }
      }
      setOrders(orderList);
      setTotalOrders(totalCount);
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error fetching product orders",
        "error",
      );
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, statusFilter, searchValue, refreshTrigger]);

  const confirmUpdateStatus = async () => {
    if (!confirmStatusChange) return;
    try {
      setIsLoading(true);
      await updateOrderStatusAPI(
        confirmStatusChange.id,
        confirmStatusChange.status,
      );

      showSnackbar("Order status updated successfully", "success");
      setOrders((prev) =>
        prev.map((o) =>
          (o.id || o.orderId) === confirmStatusChange.id
            ? {
                ...o,
                orderStatus: confirmStatusChange.status,
                status: confirmStatusChange.status,
              }
            : o,
        ),
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
      setIsLoading(false);
    }
  };

  const getAvailableNextStatuses = (statusStr: string) => {
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

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "ORDER ID",
      render: (order) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#FF6200",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          ORD-{order.id || order.orderId}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "CUSTOMER DETAILS",
      render: (order) => {
        const user = order.customer || order.user;
        const name = user
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.username
          : "Guest";
        return (
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#1e293b",
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "0.8rem",
              }}
            >
              {user?.phone || order.shippingAddressSnapshot?.phone || "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "items",
      label: "ITEMS",
      render: (order) => {
        const items = order.items || [];
        const totalQty = items.reduce(
          (sum: number, it: any) => sum + (Number(it.quantity) || 1),
          0,
        );
        const count = items.length || 1;
        return (
          <Typography
            sx={{
              color: "#1e293b",
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            {`${count} ${count === 1 ? "Item" : "Items"}`}
          </Typography>
        );
      },
    },
    {
      id: "createdAt",
      label: "ORDER DATE",
      render: (order) => (
        <Typography
          sx={{
            color: "#64748b",
            fontFamily: "var(--font-outfit), sans-serif",
            fontSize: "0.9rem",
          }}
        >
          {order.createdAt
            ? new Date(order.createdAt).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "-"}
        </Typography>
      ),
    },
    {
      id: "totalAmount",
      label: "AMOUNT",
      render: (order) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          ₹{order.totalAmount || order.amount || 0}
        </Typography>
      ),
    },
    {
      id: "paymentStatus",
      label: "PAYMENT STATUS",
      render: (order) => {
        const pStatus =
          order.paymentStatus ||
          order.payment?.status ||
          ORDER_PAYMENT_STATUS.PENDING;
        const theme = getStatusTheme(pStatus);
        return (
          <Chip
            label={pStatus.replace("_", " ").toUpperCase()}
            size="small"
            sx={{
              bgcolor: theme.bg,
              color: theme.text,
              fontWeight: 700,
              borderRadius: "6px",
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          />
        );
      },
    },
    {
      id: "orderStatus",
      label: "ORDER STATUS",
      render: (order) => {
        const currentStatus = (
          order.orderStatus ||
          order.status ||
          ORDER_STATUS.CONFIRMED
        ).toUpperCase();
        const availableOptions = getAvailableNextStatuses(currentStatus);
        return (
          <AdminStatusSelect
            value={
              currentStatus === "PENDING"
                ? ORDER_STATUS.PENDING_PAYMENT
                : currentStatus
            }
            options={availableOptions}
            onChange={(newStatus) =>
              setConfirmStatusChange({
                id: order.id || order.orderId,
                status: newStatus,
              })
            }
          />
        );
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "center",
      render: (order) => (
        <IconButton
          onClick={() =>
            router.push(`/admin/orders/${order.id || order.orderId}`)
          }
          sx={{
            color: "#FF6200",
            bgcolor: "#fff7ed",
            "&:hover": { color: "#E65800", bgcolor: "#ffedd5" },
          }}
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Product Orders"
        subtitle="Manage all sacred pooja products and samagri customer orders"
        searchPlaceholder="Search by Order ID, Name, Phone..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
      />

      <AdminDataTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        totalCount={totalOrders || orders.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(newRows) => {
          setRowsPerPage(newRows);
          setPage(0);
        }}
        tabs={STATUS_TABS}
        activeTab={statusFilter}
        onTabChange={(tab) => {
          setStatusFilter(tab);
          setPage(0);
        }}
        keyExtractor={(order) => order.id || order.orderId}
        emptyMessage="No product orders found matching your criteria."
      />

      <ConfirmStatusDialog
        open={Boolean(confirmStatusChange)}
        title="Confirm Order Status Change"
        itemName={
          confirmStatusChange ? `ORD-${confirmStatusChange.id}` : undefined
        }
        newStatus={confirmStatusChange?.status.replace("_", " ")}
        onClose={() => setConfirmStatusChange(null)}
        onConfirm={confirmUpdateStatus}
        loading={isLoading}
      />
    </Box>
  );
}
