"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import {
  getAllBookingsByAdminAPI,
  updateBookingStatusAPI,
} from "@/api/bookingControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import AdminTableActionMenu from "../common/AdminTableActionMenu";
import React, { useEffect, useState } from "react";
import { useSocketStore } from "@/stores/socketStore";

const STATUS_TABS = [
  { id: "All Bookings", label: "All" },
  { id: "ACCEPTED", label: "Accepted" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
];

export default function AdminAstrologyBookingsContent() {
  const searchParams = useSearchParams();

  const getInitialState = () => {
    const paramStatus = searchParams.get("status");
    const paramPage = searchParams.get("page");
    if (paramStatus || paramPage) {
      return {
        status: paramStatus || "All Bookings",
        page: paramPage ? Math.max(0, parseInt(paramPage, 10) - 1) : 0,
      };
    }
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("admin_astrology_bookings_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            status: parsed.status || "All Bookings",
            page: typeof parsed.page === "number" ? parsed.page : 0,
          };
        }
      } catch (e) {}
    }
    return { status: "All Bookings", page: 0 };
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
          "admin_astrology_bookings_state",
          JSON.stringify({ status: statusFilter, page })
        );
      } catch (e) {}

      const params = new URLSearchParams(window.location.search);
      let changed = false;

      if (statusFilter !== "All Bookings") {
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
        const newUrl = queryString
          ? `/admin/astrology-bookings?${queryString}`
          : `/admin/astrology-bookings`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [statusFilter, page]);

  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    id: string | number;
    status: string;
  } | null>(null);
  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await getAllBookingsByAdminAPI(
        page + 1,
        rowsPerPage,
        statusFilter,
        searchValue,
        "ASTROLOGY"
      );
      if (res.success) {
        setBookings(res.data.bookings || []);
        setTotalBookings(res.data.pagination?.total || res.data.total || 0);
      } else {
        showSnackbar(res.message || "Failed to fetch astrology bookings", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error fetching astrology bookings",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage, statusFilter, searchValue, refreshTrigger]);

  const confirmUpdateStatus = async () => {
    if (!confirmStatusChange) return;
    try {
      setIsLoading(true);
      const res = await updateBookingStatusAPI(
        confirmStatusChange.id,
        confirmStatusChange.status
      );
      if (res.success) {
        showSnackbar("Booking status updated successfully", "success");
        setConfirmStatusChange(null);
        fetchBookings();
      } else {
        showSnackbar(res.message || "Failed to update status", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error updating status",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "BOOKING ID",
      width: "12%",
      render: (booking) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          B-{booking.id}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "CUSTOMER DETAILS",
      width: "22%",
      render: (booking) => {
        const customerName = booking.customer?.firstName
          ? `${booking.customer.firstName} ${booking.customer.lastName || ""}`
          : "Unknown";
        return (
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#1e293b",
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
                fontSize: "0.8rem",
              }}
            >
              {booking.customer?.phone || "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "astrologer",
      label: "ASTROLOGER",
      width: "21%",
      render: (booking) => {
        const astro =
          booking.astrologer ||
          booking.astrologerProfile?.user ||
          booking.purohit;
        const technicianName = astro?.firstName
          ? `${astro.firstName} ${astro.lastName || ""}`.trim()
          : astro?.name || astro?.username || "Unassigned";
        if (technicianName === "Unassigned") {
          return (
            <Typography
              sx={{
                color: "#f59e0b",
                fontStyle: "italic",
                fontFamily: FONTS.OUTFIT,
                fontSize: "0.9rem",
              }}
            >
              Unassigned
            </Typography>
          );
        }
        return (
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                color: "#1e293b",
                fontFamily: FONTS.OUTFIT,
              }}
            >
              {technicianName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: FONTS.OUTFIT,
                fontSize: "0.8rem",
              }}
            >
              {astro?.phone || astro?.user?.phone || "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "date",
      label: "BOOKING DATE",
      width: "16%",
      render: (booking) => (
        <Typography
          sx={{
            color: "#64748b",
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.9rem",
          }}
        >
          {booking.scheduledAt || booking.createdAt
            ? new Date(booking.scheduledAt || booking.createdAt).toLocaleString(
                "en-US",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )
            : "-"}
        </Typography>
      ),
    },
    {
      id: "amount",
      label: "AMOUNT",
      width: "9%",
      render: (booking) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          {booking.finalAmount ? `₹${booking.finalAmount}` : "-"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      width: "12%",
      render: (booking) => {
        const currentStatus = booking.status || "ACCEPTED";
        return <AdminStatusSelect value={currentStatus} readOnly />;
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      width: "8%",
      align: "center",
      render: (booking) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                href: `/admin/bookings/${booking.id}`,
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
        title="Astrology Bookings"
        subtitle="Manage all astrology consultation bookings, details, and statuses."
        searchPlaceholder="Search by ID, Customer..."
        searchValue={searchValue}
        onSearchChange={(val: string) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Add Booking"
        actionButtonHref="/admin/astrology-bookings/add"
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable
        columns={columns}
        data={bookings}
        isLoading={isLoading}
        totalCount={totalBookings}
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
        keyExtractor={(booking) => booking.id}
        emptyMessage="No bookings found matching your criteria."
        minWidth="100%"
      />

      <ConfirmStatusDialog
        open={Boolean(confirmStatusChange)}
        title="Confirm Status Change"
        itemName={confirmStatusChange ? `Booking B-${confirmStatusChange.id}` : undefined}
        newStatus={confirmStatusChange?.status}
        onClose={() => setConfirmStatusChange(null)}
        onConfirm={confirmUpdateStatus}
        loading={isLoading}
      />
    </Box>
  );
}
