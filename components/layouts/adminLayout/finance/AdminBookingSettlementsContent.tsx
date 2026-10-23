"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { getCompletedBookingsAPI } from "@/api/bookingControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminBookingSettlementsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [bookingType, setBookingType] = useState<"POOJA" | "ASTROLOGY">(() => {
    const typeParam = searchParams.get("type")?.toUpperCase();
    if (typeParam === "ASTROLOGY" || typeParam === "POOJA") {
      return typeParam as "POOJA" | "ASTROLOGY";
    }
    if (typeof window !== "undefined") {
      const savedType = sessionStorage.getItem("admin_booking_settlements_type");
      if (savedType === "ASTROLOGY" || savedType === "POOJA") {
        return savedType as "POOJA" | "ASTROLOGY";
      }
    }
    return "POOJA";
  });

  const initialPagination = getTablePaginationState("admin_booking_settlements_state", {
    defaultLimit: 10,
  });

  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);

  const [settlements, setSettlements] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbarStore();

  // Sync bookingType with URL searchParams & sessionStorage
  useEffect(() => {
    const typeParam = searchParams.get("type")?.toUpperCase();
    if (typeParam === "ASTROLOGY" || typeParam === "POOJA") {
      if (typeParam !== bookingType) {
        setBookingType(typeParam as "POOJA" | "ASTROLOGY");
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_booking_settlements_type", typeParam);
      }
    } else if (typeof window !== "undefined") {
      const savedType = sessionStorage.getItem("admin_booking_settlements_type");
      if (savedType === "ASTROLOGY" || savedType === "POOJA") {
        if (savedType !== bookingType) {
          setBookingType(savedType as "POOJA" | "ASTROLOGY");
        }
        const params = new URLSearchParams(window.location.search);
        params.set("type", savedType);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, pathname, router, bookingType]);

  const handleBookingTypeChange = (newType: "POOJA" | "ASTROLOGY") => {
    if (newType === bookingType) return;
    setBookingType(newType);
    setPage(0);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin_booking_settlements_type", newType);
      const params = new URLSearchParams(window.location.search);
      params.set("type", newType);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCompletedBookingsAPI(page + 1, rowsPerPage, bookingType);
      if (res.success && res.data?.bookings) {
        setSettlements(res.data.bookings);
        setTotalCount(
          res.data.meta?.total ||
            res.data.pagination?.total ||
            res.data.bookings.length,
        );
      } else {
        setSettlements([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error("Failed to fetch settlements:", err);
      showSnackbar(
        err.response?.data?.message || "Failed to fetch bookings for payout",
        "error",
      );
      setSettlements([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, bookingType, showSnackbar]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  useEffect(() => {
    syncTablePagination(
      "admin_booking_settlements_state",
      { page, rowsPerPage },
      { defaultLimit: 10 }
    );
  }, [page, rowsPerPage]);

  const getStatusStyle = (
    status: string,
    type: "booking" | "payment" | "payout",
  ) => {
    if (status === "COMPLETED" || status === "Paid" || status === "PAID") {
      return { bg: "#d1fae5", text: "#059669" };
    }
    if (status === "Pending" || status === "PENDING") {
      return { bg: "#fef3c7", text: "#d97706" };
    }
    return { bg: "#f1f5f9", text: "#64748b" };
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Page Header */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#1e293b",
          }}
        >
          Bookings For Payout
        </Typography>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748b",
            mt: 0.5,
          }}
        >
          View completed bookings and process {bookingType === "ASTROLOGY" ? "astrologer" : "purohit"} payouts
        </Typography>
      </Box>

      {/* Booking Type Tabs */}
      <Box sx={{ borderBottom: "1px solid #e2e8f0" }}>
        <Tabs
          value={bookingType}
          onChange={(_, val) => handleBookingTypeChange(val)}
          sx={{
            "& .MuiTab-root": {
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "15px",
              textTransform: "none",
              color: "#64748b",
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
          <Tab value="POOJA" label="Pooja Bookings" />
          <Tab value="ASTROLOGY" label="Astrology Bookings" />
        </Tabs>
      </Box>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          bgcolor: "white",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    py: 2,
                  }}
                >
                  BOOKING ID
                </TableCell>
                <TableCell
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {bookingType === "ASTROLOGY" ? "ASTROLOGER NAME" : "PARTNER NAME"}
                </TableCell>
                {bookingType === "POOJA" && (
                  <TableCell
                    sx={{
                      color: "#64748b",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                    }}
                  >
                    SERVICE NAME
                  </TableCell>
                )}
                <TableCell
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  PAYOUT AMOUNT
                </TableCell>
                <TableCell
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  BOOKING STATUS
                </TableCell>
                <TableCell
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  PAYMENT STATUS
                </TableCell>
                <TableCell
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {bookingType === "ASTROLOGY" ? "PAYOUT STATUS" : "PARTNER PAYOUT STATUS"}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={bookingType === "POOJA" ? 7 : 6}
                    align="center"
                    sx={{ py: 5 }}
                  >
                    <CircularProgress sx={{ color: COLORS.PRIMARY }} />
                  </TableCell>
                </TableRow>
              ) : settlements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={bookingType === "POOJA" ? 7 : 6}
                    align="center"
                    sx={{ py: 5, color: "#64748b" }}
                  >
                    No completed {bookingType === "ASTROLOGY" ? "astrology" : "pooja"} bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                settlements.map((item: any) => {
                  const bookingStyle = getStatusStyle(item.status, "booking");
                  const paymentStyle = getStatusStyle(
                    item.paymentStatus,
                    "payment",
                  );
                  const payoutStatusValue =
                    item.partnerPayoutStatus ||
                    item.purohitPayoutStatus ||
                    item.astrologerPayoutStatus ||
                    item.payoutStatus ||
                    "PENDING";
                  const payoutStyle = getStatusStyle(
                    payoutStatusValue,
                    "payout",
                  );

                  const technicianName =
                    (item.astrologer
                      ? item.astrologer.user
                        ? `${item.astrologer.user.firstName || ""} ${item.astrologer.user.lastName || ""}`.trim()
                        : `${item.astrologer.firstName || item.astrologer.name || ""} ${item.astrologer.lastName || ""}`.trim()
                      : null) ||
                    (item.purohit?.user
                      ? `${item.purohit.user.firstName || ""} ${item.purohit.user.lastName || ""}`.trim()
                      : item.purohit?.firstName
                        ? `${item.purohit.firstName || ""} ${item.purohit.lastName || ""}`.trim()
                        : item.partner?.user
                          ? `${item.partner.user.firstName || ""} ${item.partner.user.lastName || ""}`.trim()
                          : null) ||
                    "Unknown";

                  const rawPayout =
                    (item.partnerPayoutAmount !== null && item.partnerPayoutAmount !== undefined && item.partnerPayoutAmount !== "" && item.partnerPayoutAmount !== "0.00")
                      ? item.partnerPayoutAmount
                      : (item.priceBreakDown?.astrologerPayout !== null && item.priceBreakDown?.astrologerPayout !== undefined)
                        ? item.priceBreakDown.astrologerPayout
                        : (item.astrologerProfile?.astrologerPayout !== null && item.astrologerProfile?.astrologerPayout !== undefined)
                          ? item.astrologerProfile.astrologerPayout
                          : (item.astrologer?.astrologerProfile?.astrologerPayout !== null && item.astrologer?.astrologerProfile?.astrologerPayout !== undefined)
                            ? item.astrologer.astrologerProfile.astrologerPayout
                            : item.purohitPayoutAmount || item.finalAmount || "0.00";

                  const payoutAmount =
                    typeof rawPayout === "number" ? rawPayout.toFixed(2) : rawPayout;

                  return (
                    <TableRow
                      key={item.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { bgcolor: "#f8fafc" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#10b981",
                            fontFamily: FONTS.OUTFIT,
                          }}
                        >
                          B-{item.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1e293b",
                            fontFamily: FONTS.OUTFIT,
                          }}
                        >
                          {technicianName}
                        </Typography>
                      </TableCell>
                      {bookingType === "POOJA" && (
                        <TableCell>
                          <Typography
                            sx={{
                              color: "#64748b",
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 500,
                            }}
                          >
                            {item.service?.name || "Unknown"}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1e293b",
                            fontFamily: FONTS.OUTFIT,
                          }}
                        >
                          ₹{payoutAmount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            bgcolor: bookingStyle.bg,
                            color: bookingStyle.text,
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.paymentStatus || "PENDING"}
                          size="small"
                          sx={{
                            bgcolor: paymentStyle.bg,
                            color: paymentStyle.text,
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payoutStatusValue}
                          size="small"
                          sx={{
                            bgcolor: payoutStyle.bg,
                            color: payoutStyle.text,
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                          <AdminTableActionMenu
                            actions={[
                              {
                                label: "View Booking",
                                icon: <VisibilityIcon fontSize="small" />,
                                href: `/admin/bookings/${item.id}`,
                              },
                            ]}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          slotProps={{
            select: {
              MenuProps: {
                variant: "menu",
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                disableScrollLock: true,
              },
            },
          }}
          sx={{
            borderTop: "1px solid #e2e8f0",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              { fontFamily: FONTS.OUTFIT },
          }}
        />
      </Paper>
    </Box>
  );
}
