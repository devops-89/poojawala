"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

const STATUS_TABS = [
  { id: "All Orders", label: "All Orders" },
  { id: ORDER_STATUS.PENDING_PAYMENT, label: "Pending" },
  { id: ORDER_STATUS.CONFIRMED, label: "Confirmed" },
  { id: ORDER_STATUS.PROCESSING, label: "Processing" },
  { id: ORDER_STATUS.SHIPPED, label: "Shipped" },
  { id: ORDER_STATUS.OUT_FOR_DELIVERY, label: "Out For Delivery" },
  { id: ORDER_STATUS.DELIVERED, label: "Delivered" },
  { id: ORDER_STATUS.CANCELLED, label: "Cancelled" },
  { id: ORDER_STATUS.EXPIRED, label: "Expired" },
];

const matchesStatus = (order: any, filter: string) => {
  if (!filter || filter === "All Orders" || filter === "ALL") return true;
  const orderStatus = (order.orderStatus || order.status || "").toUpperCase();
  const target = filter.toUpperCase();
  if (target === "PENDING" || target === "PENDING_PAYMENT") {
    return orderStatus === "PENDING" || orderStatus === "PENDING_PAYMENT";
  }
  return orderStatus === target;
};

const matchesSearch = (order: any, query: string) => {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  const rawId = String(order.id ?? order.orderId ?? "").toLowerCase();
  const formattedId = `ord-${rawId}`.toLowerCase();
  if (rawId.includes(q) || formattedId.includes(q)) return true;

  const user = order.customer || order.user || {};
  const customerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "";
  if (customerName.toLowerCase().includes(q)) return true;

  const phone = String(
    user.phone ||
      order.shippingAddressSnapshot?.phone ||
      order.shippingAddress?.phone ||
      ""
  );
  if (phone.includes(q)) return true;

  const email = String(
    user.email || order.shippingAddressSnapshot?.email || ""
  );
  if (email.toLowerCase().includes(q)) return true;

  const orderStatus = String(
    order.orderStatus || order.status || ""
  ).toLowerCase();
  if (orderStatus.includes(q) || orderStatus.replace(/_/g, " ").includes(q)) {
    return true;
  }

  const paymentStatus = String(
    order.paymentStatus || order.payment?.status || ""
  ).toLowerCase();
  if (
    paymentStatus.includes(q) ||
    paymentStatus.replace(/_/g, " ").includes(q)
  ) {
    return true;
  }

  const items = order.items || [];
  if (
    items.some((item: any) => {
      const pName = String(
        item.productName || item.product?.name || item.name || ""
      ).toLowerCase();
      return pName.includes(q);
    })
  ) {
    return true;
  }

  return false;
};

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminOrdersContent() {
  const router = useRouter();
  const initialPagination = getTablePaginationState("admin_orders_state", {
    defaultStatus: "All Orders",
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);

  useEffect(() => {
    syncTablePagination(
      "admin_orders_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All Orders", defaultLimit: 10 }
    );
  }, [statusFilter, page, rowsPerPage]);

  const [orders, setOrders] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    id: string | number;
    status: string;
  } | null>(null);

  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);
  const currentRequestId = useRef(0);

  const fetchOrders = useCallback(async () => {
    const requestId = ++currentRequestId.current;
    try {
      setIsLoading(true);
      const res = await getAllOrdersAPI(
        page + 1,
        rowsPerPage,
        statusFilter,
        searchValue,
      );

      if (requestId !== currentRequestId.current) return;

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

      let filtered = orderList;
      if (statusFilter && statusFilter !== "All Orders") {
        filtered = filtered.filter((o) => matchesStatus(o, statusFilter));
      }
      if (searchValue && searchValue.trim()) {
        filtered = filtered.filter((o) => matchesSearch(o, searchValue));
      }

      setOrders(filtered);
      if (searchValue && searchValue.trim()) {
        setTotalOrders(filtered.length);
      } else {
        setTotalOrders(totalCount || filtered.length);
      }
    } catch (error: any) {
      if (requestId !== currentRequestId.current) return;
      showSnackbar(
        error.response?.data?.message || "Error fetching product orders",
        "error",
      );
      setOrders([]);
      setTotalOrders(0);
    } finally {
      if (requestId === currentRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [page, rowsPerPage, statusFilter, searchValue, showSnackbar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [fetchOrders, refreshTrigger]);

  const confirmUpdateStatus = async () => {
    if (!confirmStatusChange) return;
    try {
      setIsLoading(true);
      await updateOrderStatusAPI(
        confirmStatusChange.id,
        confirmStatusChange.status,
      );

      showSnackbar("Order status updated successfully", "success");
      if (
        statusFilter !== "All Orders" &&
        confirmStatusChange.status !== statusFilter
      ) {
        setOrders((prev) =>
          prev.filter((o) => (o.id || o.orderId) !== confirmStatusChange.id)
        );
        setTotalOrders((prev) => Math.max(0, prev - 1));
        fetchOrders();
      } else {
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
      }
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
      case ORDER_STATUS.EXPIRED:
      case "EXPIRED":
        return [{ value: ORDER_STATUS.EXPIRED, label: "Expired" }];
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
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
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
                fontFamily: FONTS.OUTFIT,
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: FONTS.OUTFIT,
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
              fontFamily: FONTS.OUTFIT,
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
            fontFamily: FONTS.OUTFIT,
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
            fontFamily: FONTS.OUTFIT,
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
              fontFamily: FONTS.OUTFIT,
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
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                href: `/admin/orders/${order.id || order.orderId}`,
              },
            ]}
          />
        </Box>
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
