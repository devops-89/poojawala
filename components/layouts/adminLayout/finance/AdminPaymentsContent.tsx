"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import {
  downloadInvoiceAPI,
  downloadOrderInvoiceAPI,
  getAllPaymentsAPI,
} from "@/api/paymentControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { COLORS, PAYMENT_STATUS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { sanitizeAdminSearchTerm } from "@/utils/helpers";
import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

const PAYMENT_TYPE_TABS = [
  { id: "ALL", label: "All Payments" },
  { id: "BOOKING_PAYMENT", label: "Pooja Bookings" },
  { id: "PRODUCT_PAYMENT", label: "Product Orders" },
  { id: "ASTROLOGY_PAYMENT", label: "Astrology Bookings" },
];

const PAYMENT_STATUS_TABS = [
  { id: "ALL", label: "All" },
  { id: PAYMENT_STATUS.PENDING, label: "Pending" },
  { id: PAYMENT_STATUS.SUCCESS, label: "Success" },
  { id: PAYMENT_STATUS.FAILED, label: "Failed" },
];

export const cleanPaymentSearchTerm = (term: string): string => {
  return sanitizeAdminSearchTerm(term);
};

export default function AdminPaymentsContent() {
  const { showSnackbar } = useSnackbarStore();

  const initialPagination = getTablePaginationState("admin_payments_state", {
    defaultLimit: 10,
  });

  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [payments, setPayments] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [paymentTypeTab, setPaymentTypeTab] = useState<string>("ALL");
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | number | null>(null);

  // Sync pagination state with storage
  useEffect(() => {
    syncTablePagination(
      "admin_payments_state",
      { page, rowsPerPage, status: statusTab },
      {
        defaultLimit: 10,
        defaultStatus: "ALL",
        extraUrlParams: {
          type: paymentTypeTab !== "ALL" ? paymentTypeTab : null,
        },
      },
    );
  }, [page, rowsPerPage, statusTab, paymentTypeTab]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const cleanedSearch = cleanPaymentSearchTerm(searchTerm);
      const res = await getAllPaymentsAPI(
        page + 1,
        rowsPerPage,
        cleanedSearch,
        statusTab !== "ALL" ? statusTab : undefined,
        paymentTypeTab !== "ALL" ? paymentTypeTab : undefined,
      );

      let list: any[] = [];
      let total = 0;

      // Extract list and total from various possible response formats
      if (Array.isArray(res?.data?.items)) {
        list = res.data.items;
        total = res.data.pagination?.total ?? list.length;
      } else if (Array.isArray(res?.items)) {
        list = res.items;
        total = res.pagination?.total ?? list.length;
      } else if (Array.isArray(res?.data?.data)) {
        list = res.data.data;
        total = res.data.meta?.total ?? res.data.total ?? list.length;
      } else if (Array.isArray(res?.data)) {
        list = res.data;
        total = res.meta?.total ?? res.total ?? list.length;
      } else if (Array.isArray(res?.data?.payments)) {
        list = res.data.payments;
        total = res.data.total ?? list.length;
      } else if (Array.isArray(res?.payments)) {
        list = res.payments;
        total = res.total ?? list.length;
      } else if (Array.isArray(res)) {
        list = res;
        total = res.length;
      }

      // Client-side fallback filter if backend does not filter by paymentType or status
      const activeType = paymentTypeTab;
      const activeStatus = statusTab;

      let filteredList = list;

      if (activeType !== "ALL") {
        filteredList = filteredList.filter((item: any) => {
          const type = String(item.paymentType || "").toUpperCase();
          return type === activeType;
        });
      }

      if (activeStatus !== "ALL") {
        filteredList = filteredList.filter((item: any) => {
          const st = String(item.status || item.paymentStatus || "").toUpperCase();
          return st === activeStatus;
        });
      }

      if (cleanedSearch) {
        const q = cleanedSearch.toLowerCase();
        const searchFiltered = filteredList.filter((item: any) => {
          const rawId = String(item.id ?? "").toLowerCase();
          const payId = String(item.paymentId ?? "").toLowerCase();
          const customer = String(
            item.customer ||
              (item.customerDetails
                ? `${item.customerDetails.firstName || ""} ${item.customerDetails.lastName || ""}`
                : "") ||
              item.user?.name ||
              item.userName ||
              ""
          ).toLowerCase();
          const phone = String(
            item.customerDetails?.phone || item.user?.phone || ""
          ).toLowerCase();
          const rzpId = String(
            item.razorpayPaymentId || item.razorpayOrderId || ""
          ).toLowerCase();
          return (
            rawId.includes(q) ||
            payId.includes(q) ||
            customer.includes(q) ||
            phone.includes(q) ||
            rzpId.includes(q)
          );
        });

        if (searchFiltered.length < filteredList.length) {
          filteredList = searchFiltered;
        }
      }

      if (filteredList.length !== list.length) {
        list = filteredList;
        total = filteredList.length;
      }

      setPayments(list);
      setTotalCount(total);
    } catch (error: any) {
      console.error("Error fetching all payments:", error);
      showSnackbar(
        error?.message || "Failed to fetch payments ledger",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, paymentTypeTab, statusTab, showSnackbar]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Invoice download handler
  const handleDownloadInvoice = async (item: any) => {
    try {
      setDownloadingId(item.id);
      let blobData: any;
      let filename = `Invoice_${item.paymentId || item.id}.pdf`;

      const isOrder =
        item.paymentType === "PRODUCT_PAYMENT" ||
        item.orderId != null ||
        Boolean(item.orderNumber);

      if (isOrder) {
        const orderIdToUse = item.orderId || item.id;
        filename = `Order_Invoice_${item.orderNumber || orderIdToUse}.pdf`;
        blobData = await downloadOrderInvoiceAPI(orderIdToUse);
      } else {
        const bookingIdToUse =
          item.bookingId ||
          item.linkedBookings?.[0]?.id ||
          item.id;
        filename = `Booking_Invoice_${item.linkedBookings?.[0]?.bookingNumber || bookingIdToUse}.pdf`;
        blobData = await downloadInvoiceAPI(bookingIdToUse);
      }

      if (blobData) {
        const blob = new Blob([blobData], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showSnackbar("Invoice downloaded successfully", "success");
      }
    } catch (err: any) {
      console.error("Invoice download error:", err);
      showSnackbar(
        err?.message || "Failed to download invoice for this transaction",
        "error",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusChip = (statusRaw?: string) => {
    const st = String(statusRaw || "PENDING").toUpperCase();
    if (
      st === "PAID" ||
      st === "SUCCESS" ||
      st === "COMPLETED" ||
      st === "SETTLED"
    ) {
      return (
        <Chip
          label={st}
          size="small"
          sx={{
            bgcolor: "#ECFDF5",
            color: "#047857",
            fontWeight: 700,
            fontSize: "11px",
            border: "1px solid #A7F3D0",
            borderRadius: "6px",
          }}
        />
      );
    }
    if (st === "PENDING" || st === "CREATED" || st === "INITIATED") {
      return (
        <Chip
          label={st}
          size="small"
          sx={{
            bgcolor: "#FFFBEB",
            color: "#B45309",
            fontWeight: 700,
            fontSize: "11px",
            border: "1px solid #FDE68A",
            borderRadius: "6px",
          }}
        />
      );
    }
    if (st === "FAILED" || st === "CANCELLED" || st === "REJECTED") {
      return (
        <Chip
          label={st}
          size="small"
          sx={{
            bgcolor: "#FEF2F2",
            color: "#B91C1C",
            fontWeight: 700,
            fontSize: "11px",
            border: "1px solid #FECACA",
            borderRadius: "6px",
          }}
        />
      );
    }
    return (
      <Chip
        label={st}
        size="small"
        sx={{
          bgcolor: "#F1F5F9",
          color: "#475569",
          fontWeight: 700,
          fontSize: "11px",
          border: "1px solid #CBD5E1",
          borderRadius: "6px",
        }}
      />
    );
  };

  const formatPaymentType = (typeRaw?: string) => {
    const t = String(typeRaw || "BOOKING_PAYMENT").toUpperCase();
    if (t === "PRODUCT_PAYMENT") return "Product Order";
    if (t === "ASTROLOGY_PAYMENT") return "Astrology Booking";
    if (t === "BOOKING_PAYMENT") return "Pooja Booking";
    if (t === "PUROHIT_PAYOUT") return "Purohit Payout";
    return t.replace(/_/g, " ");
  };

  const columns: Column[] = useMemo(
    () => [
      {
        id: "paymentId",
        label: "PAYMENT ID",
        width: "14%",
        minWidth: 110,
        render: (p: any) => {
          const displayId = p.paymentId || (p.id != null ? `PAY-${p.id}` : "-");
          return (
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#1E293B",
                whiteSpace: "nowrap",
              }}
            >
              {displayId}
            </Typography>
          );
        },
      },
      {
        id: "customer",
        label: "CUSTOMER",
        width: "23%",
        minWidth: 170,
        render: (p: any) => {
          const customerName =
            p.customer ||
            (p.customerDetails
              ? `${p.customerDetails.firstName || ""} ${p.customerDetails.lastName || ""}`.trim()
              : null) ||
            p.user?.name ||
            p.userName ||
            "Customer";

          const customerSub =
            p.customerDetails?.phone ||
            p.customerDetails?.email ||
            p.user?.phone ||
            p.user?.email ||
            "";

          return (
            <Box>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                {customerName}
              </Typography>
              {customerSub && (
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "12px",
                    color: "#64748B",
                  }}
                >
                  {customerSub}
                </Typography>
              )}
            </Box>
          );
        },
      },
      {
        id: "paymentType",
        label: "TYPE",
        width: "17%",
        minWidth: 140,
        render: (p: any) => {
          const typeFormatted = formatPaymentType(p.paymentType);
          return (
            <Chip
              label={typeFormatted}
              size="small"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "11px",
                fontWeight: 700,
                bgcolor:
                  p.paymentType === "PRODUCT_PAYMENT"
                    ? "#EFF6FF"
                    : p.paymentType === "ASTROLOGY_PAYMENT"
                    ? "#FDF4FF"
                    : "#FFF7ED",
                color:
                  p.paymentType === "PRODUCT_PAYMENT"
                    ? "#1D4ED8"
                    : p.paymentType === "ASTROLOGY_PAYMENT"
                    ? "#A21CAF"
                    : "#C2410C",
                border:
                  p.paymentType === "PRODUCT_PAYMENT"
                    ? "1px solid #BFDBFE"
                    : p.paymentType === "ASTROLOGY_PAYMENT"
                    ? "1px solid #F0ABFC"
                    : "1px solid #FFEDD5",
                borderRadius: "6px",
              }}
            />
          );
        },
      },
      {
        id: "amount",
        label: "AMOUNT",
        width: "12%",
        minWidth: 100,
        render: (p: any) => (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "14.5px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            ₹{Number(p.amount || 0).toLocaleString("en-IN")}
          </Typography>
        ),
      },
      {
        id: "status",
        label: "STATUS",
        width: "13%",
        minWidth: 110,
        render: (p: any) => getStatusChip(p.status),
      },
      {
        id: "date",
        label: "DATE",
        width: "15%",
        minWidth: 140,
        render: (p: any) => {
          const dateFormatted =
            p.paidAt || p.createdAt
              ? new Date(p.paidAt || p.createdAt).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";
          return (
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: "12.5px",
                color: "#64748B",
              }}
            >
              {dateFormatted}
            </Typography>
          );
        },
      },
      {
        id: "actions",
        label: "ACTIONS",
        width: "6%",
        minWidth: 70,
        align: "center",
        render: (p: any) => {
          const isDownloadingThis = downloadingId === p.id;
          return (
            <Tooltip title="Download Invoice">
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleDownloadInvoice(p)}
                  disabled={isDownloadingThis}
                  sx={{
                    color: COLORS.PRIMARY,
                    bgcolor: "#FFF7ED",
                    p: 0.8,
                    "&:hover": { bgcolor: "#FFEDD5" },
                  }}
                >
                  {isDownloadingThis ? (
                    <CircularProgress size={16} sx={{ color: COLORS.PRIMARY }} />
                  ) : (
                    <ReceiptLongIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          );
        },
      },
    ],
    [downloadingId],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* 1. Standard Admin Page Header with Title, Subtitle, Search bar & Refresh action */}
      <AdminPageHeader
        title="Payments Ledger"
        subtitle="Manage and view all customer payments, transactions, and download invoices"
        searchPlaceholder="Search by Payment ID, Customer, Razorpay ID..."
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(0);
        }}
        actionButtonText="Refresh Data"
        actionButtonIcon={<RefreshIcon />}
        onActionButtonClick={fetchPayments}
      />

      {/* 2. Primary Payment Type Tabs (outside table card, matching Services layout) */}
      <Box sx={{ borderBottom: "1px solid #E2E8F0" }}>
        <Tabs
          value={paymentTypeTab}
          onChange={(_, val) => {
            setPaymentTypeTab(val);
            setPage(0);
          }}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "15px",
              textTransform: "none",
              color: "#64748B",
              minHeight: "48px",
              px: 3,
              "&.Mui-selected": {
                color: COLORS.PRIMARY,
              },
            },
            "& .MuiTabs-indicator": {
              bgcolor: COLORS.PRIMARY,
              height: "3px",
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          {PAYMENT_TYPE_TABS.map((tab) => (
            <Tab key={tab.id} value={tab.id} label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* 3. Admin DataTable with Status Tabs attached directly to table container */}
      <AdminDataTable
        columns={columns}
        data={payments}
        isLoading={loading}
        totalCount={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(newLimit) => {
          setRowsPerPage(newLimit);
          setPage(0);
        }}
        tabs={PAYMENT_STATUS_TABS}
        activeTab={statusTab}
        onTabChange={(tabId) => {
          setStatusTab(tabId);
          setPage(0);
        }}
        minWidth={950}
        keyExtractor={(p, idx) => p.id || p.paymentId || `pay-${idx}`}
        emptyMessage="No payments found matching your criteria."
      />
    </Box>
  );
}

