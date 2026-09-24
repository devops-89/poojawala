"use client";

import {
  assignBookingAPI,
  getAllBookingsByAdminAPI,
  updateBookingStatusAPI,
} from "@/api/bookingControllers";
import { getPurohitsAPI } from "@/api/userControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "All Bookings", label: "All Bookings" },
  { id: "PENDING", label: "Pending" },
  { id: "ACCEPTED", label: "Accepted" },
  { id: "ENROUTE", label: "Enroute" },
  { id: "ARRIVED", label: "Arrived" },
  { id: "ONGOING", label: "Ongoing" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" },
];

import { useSocketStore } from "@/stores/socketStore";

export default function AdminBookingsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "All Bookings";

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const [assignTarget, setAssignTarget] = useState<string | number | null>(null);
  const [selectedPurohit, setSelectedPurohit] = useState<string | number>("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    id: string | number;
    status: string;
  } | null>(null);
  const [purohitsList, setPurohitsList] = useState<any[]>([]);
  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const handleOpenAssignModal = async (bookingId: string | number) => {
    setAssignTarget(bookingId);
    const targetBooking = bookings.find((b: any) => b.id === bookingId);
    const city =
      targetBooking?.addressSnapshot?.city ||
      targetBooking?.customerAddress?.city ||
      targetBooking?.city ||
      undefined;
    const serviceId =
      targetBooking?.serviceId ||
      targetBooking?.service?.id ||
      undefined;

    try {
      const res = await getPurohitsAPI(
        1,
        100,
        undefined,
        "APPROVED",
        undefined,
        city,
        serviceId
      );
      if (res.success) {
        setPurohitsList(res.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch purohits:", error);
      showSnackbar("Failed to fetch purohits", "error");
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await getAllBookingsByAdminAPI(
        page + 1,
        rowsPerPage,
        statusFilter,
        searchValue
      );
      if (res.success) {
        setBookings(res.data.bookings || []);
        setTotalBookings(res.data.pagination?.total || res.data.total || 0);
      } else {
        showSnackbar(res.message || "Failed to fetch bookings", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error fetching bookings",
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

  const handleAssignPurohit = async () => {
    if (assignTarget && selectedPurohit) {
      try {
        setIsLoading(true);
        const res = await assignBookingAPI(assignTarget, selectedPurohit);
        if (res.success) {
          showSnackbar("Purohit assigned successfully", "success");
          setAssignTarget(null);
          setSelectedPurohit("");
          fetchBookings();
        } else {
          showSnackbar(res.message || "Failed to assign purohit", "error");
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || "Error assigning purohit",
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "BOOKING ID",
      render: (booking) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#FF6200",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          B-{booking.id}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "CUSTOMER DETAILS",
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
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {customerName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: "var(--font-outfit), sans-serif",
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
      id: "service",
      label: "SERVICE",
      render: (booking) => (
        <Typography
          sx={{
            color: "#1e293b",
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 500,
          }}
        >
          {booking.service?.name || "-"}
        </Typography>
      ),
    },
    {
      id: "purohit",
      label: "PUROHIT",
      render: (booking) => {
        const technicianName = booking.purohit?.user?.firstName
          ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ""}`
          : "Unassigned";
        if (technicianName === "Unassigned") {
          return (
            <Typography
              sx={{
                color: "#f59e0b",
                fontStyle: "italic",
                fontFamily: "var(--font-outfit), sans-serif",
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
                fontFamily: "var(--font-outfit), sans-serif",
              }}
            >
              {technicianName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "0.8rem",
              }}
            >
              {booking.purohit?.user?.phone || "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "date",
      label: "BOOKING DATE",
      render: (booking) => (
        <Typography
          sx={{
            color: "#64748b",
            fontFamily: "var(--font-outfit), sans-serif",
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
      render: (booking) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          {booking.finalAmount ? `₹${booking.finalAmount}` : "-"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (booking) =>
        booking.status === "PENDING" ? (
          <AdminStatusSelect
            value={booking.status}
            options={[
              { value: "PENDING", label: "Pending" },
              { value: "CANCELLED", label: "Cancel Booking" },
            ]}
            onChange={(newStatus) =>
              setConfirmStatusChange({ id: booking.id, status: newStatus })
            }
          />
        ) : (
          <AdminStatusSelect value={booking.status} readOnly />
        ),
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "center",
      render: (booking) => {
        const technicianName = booking.purohit?.user?.firstName
          ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ""}`
          : "Unassigned";
        return (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <IconButton
              component={NextLink}
              href={`/admin/bookings/${booking.id}`}
              sx={{
                color: "#FF6200",
                bgcolor: "#fff7ed",
                "&:hover": { color: "#E65800", bgcolor: "#ffedd5" },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            {technicianName === "Unassigned" && booking.status === "PENDING" && (
              <IconButton
                onClick={() => handleOpenAssignModal(booking.id)}
                title="Assign Purohit"
                sx={{
                  color: "#2563eb",
                  bgcolor: "#eff6ff",
                  "&:hover": { color: "#1d4ed8", bgcolor: "#dbeafe" },
                }}
              >
                <PersonAddIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Bookings"
        subtitle="Manage all service bookings"
        searchPlaceholder="Search by ID, Customer..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Add Booking"
        actionButtonHref="/admin/bookings/add"
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
      />

      {/* Assign Purohit Modal */}
      <Dialog
        open={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        sx={{ "& .MuiDialog-paper": { borderRadius: "16px", p: 1, minWidth: 400 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          Assign Purohit
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <Autocomplete
              options={purohitsList}
              isOptionEqualToValue={(option: any, val: any) =>
                option?.id === val?.id
              }
              getOptionLabel={(option: any) => {
                if (!option) return "";
                const fName =
                  option.firstName || option.user?.firstName || "";
                const lName =
                  option.lastName || option.user?.lastName || "";
                const phone =
                  option.phone || option.user?.phone || "";
                const name = `${fName} ${lName}`.trim() || `Purohit #${option.id}`;
                return phone ? `${name} (${phone})` : name;
              }}
              renderOption={(props, option: any) => {
                const fName =
                  option.firstName || option.user?.firstName || "";
                const lName =
                  option.lastName || option.user?.lastName || "";
                const phone =
                  option.phone || option.user?.phone || "";
                const name = `${fName} ${lName}`.trim() || `Purohit #${option.id}`;
                const label = phone ? `${name} (${phone})` : name;
                return (
                  <li {...props} key={option.id}>
                    {label}
                  </li>
                );
              }}
              value={purohitsList.find((p) => p.id === selectedPurohit) || null}
              onChange={(_, newValue) => {
                setSelectedPurohit(newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Purohit"
                  sx={{ fontFamily: "var(--font-outfit), sans-serif" }}
                />
              )}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setAssignTarget(null)}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              if (!selectedPurohit || isLoading) {
                e.preventDefault();
                return;
              }
              handleAssignPurohit();
            }}
            variant="contained"
            sx={{
              background: "#FF6200",
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { background: "#E65800" },
            }}
          >
            Assign & Accept
          </Button>
        </DialogActions>
      </Dialog>

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
