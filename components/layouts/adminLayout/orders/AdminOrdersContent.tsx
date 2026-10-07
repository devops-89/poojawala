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

  const getInitialState = () => {
    const paramStatus = searchParams.get("status");
    const paramPage = searchParams.get("page");
    if (paramStatus || paramPage) {
      return {
        status: paramStatus || "All Orders",
        page: paramPage ? Math.max(0, parseInt(paramPage, 10) - 1) : 0,
      };
    }
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("admin_orders_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            status: parsed.status || "All Orders",
            page: typeof parsed.page === "number" ? parsed.page : 0,
          };
        }
      } catch (e) {}
    }
    return { status: "All Orders", page: 0 };
  };

  const initialState = getInitialState();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialState.status);
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "admin_orders_state",
          JSON.stringify({ status: statusFilter, page })
        );
      } catch (e) {}

      const params = new URLSearchParams(window.location.search);
      let changed = false;

      if (statusFilter !== "All Orders") {
        if (params.get("status") !== statusFilter) {
          params.set("status", statusFilter);
          changed = true;
        }
      } else {
        if (params.has("status")) {
          params.delete("status");
          changed = true;
        }
      }

      if (page > 0) {
        if (params.get("page") !== String(page + 1)) {
          params.set("page", String(page + 1));
          changed = true;
        }
      } else {
        if (params.has("page")) {
          params.delete("page");
          changed = true;
        }
      }

      if (changed) {
        const queryString = params.toString();
        const newUrl = queryString ? `/admin/product-orders?${queryString}` : `/admin/product-orders`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [statusFilter, page]);

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
      width: "12%",
      minWidth: 100,
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
      width: "20%",
      minWidth: 170,
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
      width: "11%",
      minWidth: 90,
      render: (order) => {
        const items = order.items || [];
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
      width: "17%",
      minWidth: 150,
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
      width: "10%",
      minWidth: 90,
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
      width: "14%",
      minWidth: 130,
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
      width: "14%",
      minWidth: 130,
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
      width: "8%",
      minWidth: 70,
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
