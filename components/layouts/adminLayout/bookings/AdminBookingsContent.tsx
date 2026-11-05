"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { sanitizeAdminSearchTerm } from "@/utils/helpers";

import {
  assignBookingAPI,
  getAllBookingsByAdminAPI,
  updateBookingStatusAPI,
} from "@/api/bookingControllers";
import { getPurohitsAPI } from "@/api/userControllers";
import { formatScheduledDateTime } from "@/utils/helpers";
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
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import AdminTableActionMenu from "../common/AdminTableActionMenu";
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

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminBookingsContent() {
  const searchParams = useSearchParams();
  const initialPagination = getTablePaginationState("admin_bookings_state", {
    defaultStatus: "All Bookings",
    defaultLimit: 10,
    searchParams,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);

  const modeFromUrl = searchParams.get("mode")?.toUpperCase();
  const [bookingMode, setBookingMode] = useState<"OFFLINE" | "ONLINE">(
    modeFromUrl === "ONLINE" || modeFromUrl === "OFFLINE" ? modeFromUrl : "OFFLINE"
  );

  // Sync booking mode if URL search param changes
  useEffect(() => {
    if (
      modeFromUrl &&
      (modeFromUrl === "ONLINE" || modeFromUrl === "OFFLINE") &&
      modeFromUrl !== bookingMode
    ) {
      setBookingMode(modeFromUrl);
      setPage(0);
    }
  }, [modeFromUrl]);

  const handleBookingModeChange = (
    _event: React.SyntheticEvent,
    newMode: "OFFLINE" | "ONLINE"
  ) => {
    if (newMode && newMode !== bookingMode) {
      setBookingMode(newMode);
      setPage(0);
    }
  };

  // Sync status filter if URL search param changes
  const statusFromUrl = searchParams.get("status");
  useEffect(() => {
    if (statusFromUrl && statusFromUrl !== statusFilter) {
      setStatusFilter(statusFromUrl);
      setPage(0);
    }
  }, [statusFromUrl]);

  const [assignTarget, setAssignTarget] = useState<string | number | null>(null);
  const [selectedPurohit, setSelectedPurohit] = useState<string | number>("");

  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);

  useEffect(() => {
    syncTablePagination(
      "admin_bookings_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All Bookings", defaultLimit: 10 }
    );
  }, [statusFilter, page, rowsPerPage]);

  const [bookings, setBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    id: string | number;
    status: string;
  } | null>(null);
  const [purohitsList, setPurohitsList] = useState<any[]>([]);
  const [isFetchingPurohits, setIsFetchingPurohits] = useState(false);
  const [assignTargetBooking, setAssignTargetBooking] = useState<any>(null);
  const { showSnackbar } = useSnackbarStore();
  const refreshTrigger = useSocketStore((state) => state.refreshTrigger);

  const handleOpenAssignModal = async (bookingId: string | number) => {
    setAssignTarget(bookingId);
    const targetBooking = bookings.find((b: any) => b.id === bookingId);
    setAssignTargetBooking(targetBooking || null);
    setSelectedPurohit("");
    setPurohitsList([]);
    setIsFetchingPurohits(true);

    const isOnline =
      targetBooking?.bookingMode === "ONLINE" ||
      bookingMode === "ONLINE" ||
      Boolean(targetBooking?.service?.isOnline);

    const isOffline = !isOnline;

    const city = isOffline
      ? targetBooking?.addressSnapshot?.city ||
        targetBooking?.customerAddress?.city ||
        targetBooking?.city ||
        undefined
      : undefined;

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
        serviceId,
        isOnline ? true : undefined,
        isOffline ? true : undefined
      );
      if (res.success) {
        let list = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];

        if (isOnline) {
          list = list.filter((p: any) => {
            const prof = p.profile || p;
            if (prof.isOnlineAvailable !== undefined) {
              return Boolean(prof.isOnlineAvailable);
            }
            return true;
          });
        } else if (isOffline) {
          list = list.filter((p: any) => {
            const prof = p.profile || p;
            if (prof.isOfflineAvailable !== undefined) {
              return Boolean(prof.isOfflineAvailable);
            }
            return true;
          });
        }

        setPurohitsList(list);
      } else {
        setPurohitsList([]);
      }
    } catch (error) {
      console.error("Failed to fetch purohits:", error);
      showSnackbar("Failed to fetch purohits", "error");
      setPurohitsList([]);
    } finally {
      setIsFetchingPurohits(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const cleanedSearch = sanitizeAdminSearchTerm(searchValue);
      const res = await getAllBookingsByAdminAPI(
        page + 1,
        rowsPerPage,
        statusFilter,
        cleanedSearch,
        "POOJA",
        bookingMode
      );
      if (res.success) {
        let list = res.data.bookings || [];
        let total = res.data.pagination?.total || res.data.total || 0;

        if (cleanedSearch) {
          const q = cleanedSearch.toLowerCase();
          const filtered = list.filter((b: any) => {
            const idStr = String(b.id ?? "");
            const formattedId = `b-${idStr}`.toLowerCase();
            const custName = String(
              b.customer?.name ||
              b.customerName ||
              (b.user ? `${b.user.firstName || ""} ${b.user.lastName || ""}` : "") ||
              ""
            ).toLowerCase();
            const phone = String(
              b.customer?.phone || b.customerPhone || b.user?.phone || ""
            );
            const serviceName = String(b.service?.name || b.serviceName || "").toLowerCase();
            return (
              idStr.includes(q) ||
              formattedId.includes(q) ||
              custName.includes(q) ||
              phone.includes(q) ||
              serviceName.includes(q)
            );
          });
          if (filtered.length < list.length) {
            list = filtered;
            total = filtered.length;
          }
        }

        setBookings(list);
        setTotalBookings(total);
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
  }, [page, rowsPerPage, statusFilter, searchValue, bookingMode, refreshTrigger]);

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
    if (!assignTarget) return;

    if (!selectedPurohit) {
      showSnackbar("Please select a Purohit to assign", "error");
      return;
    }

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
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "BOOKING ID",
      width: "11%",
      minWidth: 100,
      render: (booking) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          B-{booking.id}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "CUSTOMER DETAILS",
      width: "18%",
      minWidth: 160,
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
      id: "service",
      label: "SERVICE",
      width: "20%",
      minWidth: 180,
      render: (booking) => (
        <Typography
          sx={{
            color: "#1e293b",
            fontFamily: FONTS.OUTFIT,
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
      width: "14%",
      minWidth: 130,
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
              {booking.purohit?.user?.phone || "-"}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "date",
      label: "BOOKING DATE",
      width: "16%",
      minWidth: 150,
      render: (booking) => (
        <Typography
          sx={{
            color: "#64748b",
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.9rem",
          }}
        >
          {booking.scheduledAt
            ? formatScheduledDateTime(booking.scheduledAt)
            : booking.createdAt
            ? new Date(booking.createdAt).toLocaleDateString()
            : "-"}
        </Typography>
      ),
    },
    {
      id: "amount",
      label: "AMOUNT",
      width: "9%",
      minWidth: 90,
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
      minWidth: 120,
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
      width: "8%",
      minWidth: 70,
      align: "center",
      render: (booking) => {
        const technicianName = booking.purohit?.user?.firstName
          ? `${booking.purohit.user.firstName} ${booking.purohit.user.lastName || ""}`
          : "Unassigned";
        const canAssign =
          technicianName === "Unassigned" && booking.status === "PENDING";

        return (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <AdminTableActionMenu
              actions={[
                {
                  label: "View Details",
                  icon: <VisibilityIcon fontSize="small" />,
                  href: `/admin/bookings/${booking.id}`,
                },
                canAssign && {
                  label: "Assign Purohit",
                  icon: <PersonAddIcon fontSize="small" />,
                  onClick: () => handleOpenAssignModal(booking.id),
                  color: "#2563eb",
                },
              ]}
            />
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

      <Box sx={{ borderBottom: "1px solid #E2E8F0" }}>
        <Tabs
          value={bookingMode}
          onChange={handleBookingModeChange}
          sx={{
            minHeight: "48px",
            "& .MuiTab-root": {
              fontFamily: FONTS.PRIMARY,
              fontWeight: 600,
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
          <Tab value="OFFLINE" label="Offline Bookings" />
          <Tab value="ONLINE" label="Online Bookings" />
        </Tabs>
      </Box>

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
        getRowHref={(booking) => `/admin/bookings/${booking.id}`}
        emptyMessage={
          bookingMode === "OFFLINE"
            ? "No offline bookings found matching your criteria."
            : "No online bookings found matching your criteria."
        }
      />

      {/* Assign Purohit Modal */}
      <Dialog
        open={Boolean(assignTarget)}
        onClose={() => {
          setAssignTarget(null);
          setAssignTargetBooking(null);
          setSelectedPurohit("");
          setPurohitsList([]);
        }}
        sx={{ "& .MuiDialog-paper": { borderRadius: "16px", p: 1, minWidth: { xs: "90%", sm: 420 }, maxWidth: 480 } }}
      >
        <DialogTitle
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#1e293b",
            pb: 0.5,
          }}
        >
          Assign Purohit
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
            <Autocomplete
              loading={isFetchingPurohits}
              loadingText="Loading available approved purohits..."
              noOptionsText="No approved purohits found"
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
                const prof = option.profile || option;
                const isOnlineAvail = Boolean(prof.isOnlineAvailable);
                const isOfflineAvail = Boolean(prof.isOfflineAvailable);
                const cityStr = prof.city || option.city || "";

                return (
                  <li {...props} key={option.id}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", py: 0.5 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#1e293b", fontFamily: FONTS.OUTFIT }}>
                          {name}
                        </Typography>
                        {phone && (
                          <Typography sx={{ fontSize: "12px", color: "#64748b", fontFamily: FONTS.OUTFIT }}>
                            {phone}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, mt: 0.3, alignItems: "center" }}>
                        {cityStr && (
                          <Typography sx={{ fontSize: "11px", color: "#94a3b8", fontFamily: FONTS.OUTFIT }}>
                            {cityStr}
                          </Typography>
                        )}
                        {isOnlineAvail && (
                          <Box component="span" sx={{ fontSize: "10px", bgcolor: "#E0F2FE", color: "#0369A1", px: 0.8, py: 0.1, borderRadius: "4px", fontWeight: 600 }}>
                            Online
                          </Box>
                        )}
                        {isOfflineAvail && (
                          <Box component="span" sx={{ fontSize: "10px", bgcolor: "#FEF3C7", color: "#92400E", px: 0.8, py: 0.1, borderRadius: "4px", fontWeight: 600 }}>
                            Offline
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </li>
                );
              }}
              value={purohitsList.find((p) => p.id === selectedPurohit) || null}
              onChange={(_, newValue) => {
                setSelectedPurohit(newValue ? newValue.id : "");
              }}
              disabled={isFetchingPurohits}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Purohit *"
                  sx={{ fontFamily: FONTS.OUTFIT }}
                />
              )}
            />
          </FormControl>

          {!isFetchingPurohits && purohitsList.length === 0 && (
            <Alert
              severity="warning"
              icon={<InfoOutlinedIcon fontSize="small" />}
              sx={{
                mt: 2,
                borderRadius: "10px",
                fontSize: "0.825rem",
                fontFamily: FONTS.OUTFIT,
                bgcolor: "#FFFBEB",
                color: "#92400E",
                border: "1px solid #FDE68A",
                "& .MuiAlert-icon": { color: "#D97706" },
              }}
            >
              No approved purohits are currently registered or available for{" "}
              {assignTargetBooking?.bookingMode === "ONLINE" || bookingMode === "ONLINE"
                ? "online bookings"
                : `offline bookings${
                    assignTargetBooking?.addressSnapshot?.city ||
                    assignTargetBooking?.customerAddress?.city ||
                    assignTargetBooking?.city
                      ? ` in ${
                          assignTargetBooking?.addressSnapshot?.city ||
                          assignTargetBooking?.customerAddress?.city ||
                          assignTargetBooking?.city
                        }`
                      : ""
                  }`}
              .
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => {
              setAssignTarget(null);
              setAssignTargetBooking(null);
              setSelectedPurohit("");
              setPurohitsList([]);
            }}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignPurohit}
            disabled={isLoading || isFetchingPurohits || !selectedPurohit}
            variant="contained"
            sx={{
              background: COLORS.PRIMARY,
              color: "white",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "none",
              "&:hover": { background: COLORS.PRIMARY_DARK },
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
