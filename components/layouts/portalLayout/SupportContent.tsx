"use client";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Grid,
  TablePagination,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ClassIcon from "@mui/icons-material/Class";
import SubjectIcon from "@mui/icons-material/Subject";
import DescriptionIcon from "@mui/icons-material/Description";
import BookIcon from "@mui/icons-material/Book";
import {
  getComplaintsAPI,
  getComplaintByIdAPI,
} from "@/api/bookingControllers";
import { useTicketModalStore } from "@/stores/ticketModalStore";
import { useUserStore } from "@/stores/userStore";
import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export enum COMPLAINT_STATUS {
  OPEN = "OPEN",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED",
}

const FILTER_TABS = [
  { label: "All", value: "ALL" },
  { label: "Open", value: COMPLAINT_STATUS.OPEN },
  { label: "Under Review", value: COMPLAINT_STATUS.UNDER_REVIEW },
  { label: "Resolved", value: COMPLAINT_STATUS.RESOLVED },
  { label: "Closed", value: COMPLAINT_STATUS.CLOSED },
  { label: "Rejected", value: COMPLAINT_STATUS.REJECTED },
];

const renderStatusBadge = (status: string) => {
  const s = status?.toUpperCase() || "OPEN";
  let bgcolor = "#EFF6FF";
  let color = "#1D4ED8";
  let borderColor = "#BFDBFE";

  if (s === "UNDER_REVIEW") {
    bgcolor = "#FEF3C7";
    color = "#B45309";
    borderColor = "#FDE68A";
  } else if (s === "RESOLVED" || s === "CLOSED") {
    bgcolor = "#ECFDF5";
    color = "#047857";
    borderColor = "#A7F3D0";
  } else if (s === "REJECTED") {
    bgcolor = "#FFF1F2";
    color = "#BE123C";
    borderColor = "#FECDD3";
  }

  return (
    <Chip
      label={status?.replace(/_/g, " ") || "OPEN"}
      size="small"
      sx={{
        bgcolor,
        color,
        border: `1px solid ${borderColor}`,
        fontFamily: FONTS.OUTFIT,
        fontWeight: 700,
        fontSize: "11px",
        height: "24px",
        borderRadius: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.4px",
      }}
    />
  );
};

export default function SupportContent() {
  const initialPagination = getTablePaginationState(
    "portal_support_pagination",
    {
      defaultStatus: "ALL",
      defaultLimit: 10,
    },
  );

  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState(initialPagination.status);
  const [page, setPage] = useState(initialPagination.page + 1);
  const [limit, setLimit] = useState(initialPagination.rowsPerPage);
  const [totalItems, setTotalItems] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { profile } = useUserStore();

  useEffect(() => {
    syncTablePagination(
      "portal_support_pagination",
      { page: page - 1, rowsPerPage: limit, status: statusTab },
      { defaultStatus: "ALL", defaultLimit: 10 },
    );
  }, [page, limit, statusTab]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAstrologer =
    profile?.role === "ASTROLOGER" ||
    profile?.user?.role === "ASTROLOGER" ||
    (mounted &&
      (sessionStorage.getItem("role") === "ASTROLOGER" ||
        sessionStorage.getItem("activeRole") === "ASTROLOGER" ||
        (() => {
          try {
            return (
              JSON.parse(sessionStorage.getItem("user") || "{}")?.role ===
              "ASTROLOGER"
            );
          } catch (e) {
            return false;
          }
        })()));

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { openModal } = useTicketModalStore();

  const handleViewComplaint = async (complaintItem: any) => {
    setSelectedComplaint(complaintItem);
    setModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await getComplaintByIdAPI(complaintItem.id);
      if (res?.data) {
        setSelectedComplaint(res.data?.data || res.data);
      }
    } catch (error) {
      console.error("Failed to load complaint details", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getComplaintsAPI(page, limit, statusTab);

      const list = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.complaints)
            ? res.data.complaints
            : [];
      const total = res?.data?.meta?.total ?? res?.meta?.total ?? list.length;

      setComplaints(list);
      setTotalItems(total);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusTab]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        mx: "auto",
        px: { xs: 0, sm: 1.5, md: 2 },
        pb: { xs: 4, sm: 6 },
      }}
    >
      {/* Breadcrumbs */}
      <Box sx={{ mb: 1 }}>
        <AppBreadcrumbs
          items={[
            {
              label: isAstrologer ? "Astrology Bookings" : "Dashboard",
              href: isAstrologer
                ? "/partner/astrologybookings"
                : "/partner/dashboard",
            },
            { label: "Support" },
          ]}
        />
      </Box>

      {/* Top Header Section: Title & Action */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          mb: { xs: 2, sm: 2.5, md: 3 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#1A1A1A",
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            lineHeight: 1.2,
          }}
        >
          Support Complaints
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: { xs: 17, sm: 19 } }} />}
          onClick={() => openModal(0, undefined, fetchComplaints)}
          sx={{
            backgroundColor: COLORS.PRIMARY,
            color: "#ffffff",
            fontFamily: FONTS.OUTFIT,
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 700,
            fontSize: { xs: "12.5px", sm: "13.5px" },
            px: { xs: 1.8, sm: 2.5 },
            height: { xs: "36px", sm: "40px" },
            boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
            whiteSpace: "nowrap",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: COLORS.PRIMARY_DARK,
            },
          }}
        >
          Raise Ticket
        </Button>
      </Box>

      {/* Status Filter Chips (Sleek horizontal scroll pills) */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: { xs: 2, sm: 2.5 },
          overflowX: "auto",
          pb: 0.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          alignItems: "center",
        }}
      >
        {FILTER_TABS.map((tab) => {
          const isSelected = statusTab === tab.value;
          return (
            <Chip
              key={tab.value}
              label={tab.label}
              clickable
              onClick={() => {
                setStatusTab(tab.value);
                setPage(1);
              }}
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: isSelected ? 700 : 600,
                fontSize: { xs: "12.5px", sm: "13px" },
                height: { xs: "34px", sm: "36px" },
                px: { xs: 1, sm: 1.5 },
                borderRadius: "20px",
                whiteSpace: "nowrap",
                bgcolor: isSelected ? COLORS.PRIMARY : "#FFFDF9",
                color: isSelected ? "#FFFFFF" : "#64748B",
                border: isSelected
                  ? `1px solid ${COLORS.PRIMARY}`
                  : "1px solid #EFE6D5",
                boxShadow: isSelected
                  ? "0 2px 8px rgba(255, 98, 0, 0.25)"
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: isSelected ? COLORS.PRIMARY_DARK : "#F9FAFB",
                },
              }}
            />
          );
        })}
      </Box>

      {/* Main Content Area */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : complaints.length > 0 ? (
        <>
          {/* Desktop Table View (>= md) */}
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #EFE6D5",
              borderRadius: "16px",
              overflow: "hidden",
              display: { xs: "none", md: "block" },
              bgcolor: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
            }}
          >
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#FAF4EE" }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "12.5px",
                        color: "#64748B",
                        fontFamily: FONTS.OUTFIT,
                        borderBottom: "1px solid #EFE6D5",
                      }}
                    >
                      COMPLAINT ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "12.5px",
                        color: "#64748B",
                        fontFamily: FONTS.OUTFIT,
                        borderBottom: "1px solid #EFE6D5",
                      }}
                    >
                      BOOKING ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "12.5px",
                        color: "#64748B",
                        fontFamily: FONTS.OUTFIT,
                        borderBottom: "1px solid #EFE6D5",
                      }}
                    >
                      CATEGORY
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "12.5px",
                        color: "#64748B",
                        fontFamily: FONTS.OUTFIT,
                        borderBottom: "1px solid #EFE6D5",
                      }}
                    >
                      DATE
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        fontSize: "12.5px",
                        color: "#64748B",
                        fontFamily: FONTS.OUTFIT,
                        borderBottom: "1px solid #EFE6D5",
                      }}
                    >
                      STATUS
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                        fontSize: "12.5px",
                        color: "#64748B",
                        fontFamily: FONTS.OUTFIT,
                        borderBottom: "1px solid #EFE6D5",
                      }}
                    >
                      ACTION
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {complaints.map((complaint) => {
                    const dateStr = complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )
                      : "N/A";

                    return (
                      <TableRow
                        key={complaint.id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "#FFFDF9" },
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontSize: "13.5px",
                            fontWeight: 700,
                            color: "#1E293B",
                            fontFamily: FONTS.OUTFIT,
                            borderBottom: "1px solid #F5ECE3",
                          }}
                        >
                          C-{complaint.id}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "13px",
                            color: "#475569",
                            fontFamily: FONTS.OUTFIT,
                            borderBottom: "1px solid #F5ECE3",
                          }}
                        >
                          {complaint.bookingId ? (
                            <Typography
                              sx={{
                                fontSize: "13px",
                                fontWeight: 700,
                                color: COLORS.PRIMARY,
                                fontFamily: FONTS.OUTFIT,
                              }}
                            >
                              B-{complaint.bookingId}
                            </Typography>
                          ) : (
                            <Chip
                              label="General"
                              size="small"
                              sx={{
                                bgcolor: "#F1F5F9",
                                color: "#64748B",
                                fontSize: "11px",
                                fontWeight: 600,
                                height: "22px",
                                fontFamily: FONTS.OUTFIT,
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "13px",
                            fontFamily: FONTS.OUTFIT,
                            borderBottom: "1px solid #F5ECE3",
                          }}
                        >
                          <Chip
                            label={
                              complaint.category?.replace(/_/g, " ") ||
                              "General Query"
                            }
                            size="small"
                            sx={{
                              border: "1px solid #EFE6D5",
                              color: "#334155",
                              fontSize: "11.5px",
                              fontWeight: 600,
                              height: "24px",
                              bgcolor: "#FFFDF9",
                              fontFamily: FONTS.OUTFIT,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "13px",
                            color: "#475569",
                            whiteSpace: "nowrap",
                            fontFamily: FONTS.OUTFIT,
                            borderBottom: "1px solid #F5ECE3",
                          }}
                        >
                          {dateStr}
                        </TableCell>
                        <TableCell sx={{ borderBottom: "1px solid #F5ECE3" }}>
                          {renderStatusBadge(complaint.status)}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderBottom: "1px solid #F5ECE3" }}
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewComplaint(complaint)}
                              sx={{
                                color: COLORS.PRIMARY,
                                bgcolor: "#FFF0E6",
                                border: "1px solid #FFE0CC",
                                "&:hover": { bgcolor: "#FFE0CC" },
                                width: 32,
                                height: 32,
                                borderRadius: "8px",
                              }}
                            >
                              <VisibilityIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Mobile View Cards (< md) */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {complaints.map((complaint) => {
              const dateStr = complaint.createdAt
                ? new Date(complaint.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A";

              return (
                <Paper
                  key={complaint.id}
                  elevation={0}
                  sx={{
                    borderRadius: "14px",
                    p: { xs: 2, sm: 2.5 },
                    bgcolor: "#FFFFFF",
                    border: "1px solid #EFE6D5",
                    boxShadow: "0 4px 16px rgba(44, 24, 16, 0.04)",
                  }}
                >
                  {/* Top Row: ID + Status */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1.2,
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "15px",
                        color: "#1A1A1A",
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      C-{complaint.id}
                    </Typography>
                    {renderStatusBadge(complaint.status)}
                  </Box>

                  {/* Tags Row: Category + Booking */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={
                        complaint.category?.replace(/_/g, " ") ||
                        "General Query"
                      }
                      size="small"
                      sx={{
                        fontSize: "11px",
                        height: "24px",
                        fontWeight: 600,
                        border: "1px solid #EFE6D5",
                        bgcolor: "#FFFDF9",
                        color: "#475569",
                        fontFamily: FONTS.OUTFIT,
                      }}
                    />
                    {complaint.bookingId ? (
                      <Chip
                        label={`B-${complaint.bookingId}`}
                        size="small"
                        sx={{
                          bgcolor: "#FFF0E6",
                          color: COLORS.PRIMARY,
                          border: "1px solid #FFD8BF",
                          fontWeight: 700,
                          fontSize: "11px",
                          height: "24px",
                          fontFamily: FONTS.OUTFIT,
                        }}
                      />
                    ) : (
                      <Chip
                        label="General"
                        size="small"
                        sx={{
                          bgcolor: "#F1F5F9",
                          color: "#64748B",
                          fontSize: "11px",
                          height: "24px",
                          fontWeight: 600,
                          fontFamily: FONTS.OUTFIT,
                        }}
                      />
                    )}
                  </Box>

                  {/* Subject */}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#1A1A1A",
                      fontSize: "14.5px",
                      mb: 0.5,
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    {complaint.subject || "No Subject"}
                  </Typography>

                  {/* Description */}
                  {complaint.description && (
                    <Typography
                      sx={{
                        color: "#64748B",
                        fontSize: "13px",
                        lineHeight: 1.5,
                        mb: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      {complaint.description}
                    </Typography>
                  )}

                  {/* Footer Row: Date & View Details */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1.2,
                      borderTop: "1px dashed #F2E8DC",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#94A3B8",
                        fontWeight: 500,
                        fontFamily: FONTS.OUTFIT,
                      }}
                    >
                      {dateStr}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleViewComplaint(complaint)}
                      startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        color: COLORS.PRIMARY,
                        bgcolor: "#FFF0E6",
                        border: "1px solid #FFE0CC",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "12.5px",
                        px: 1.8,
                        py: 0.4,
                        "&:hover": { bgcolor: "#FFE0CC" },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </Paper>
              );
            })}
          </Box>

          {/* Pagination */}
          {totalItems > 0 && (
            <TablePagination
              component="div"
              count={totalItems}
              page={page - 1}
              onPageChange={(event, newPage) => setPage(newPage + 1)}
              rowsPerPage={limit}
              onRowsPerPageChange={(event) => {
                setLimit(parseInt(event.target.value, 10));
                setPage(1);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
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
                borderTop: "1px solid #EFE6D5",
                p: 1,
                mt: 2,
                "& .MuiTablePagination-toolbar": {
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  gap: { xs: 1, sm: 2 },
                  px: { xs: 1, sm: 2 },
                },
                "& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel":
                  {
                    fontFamily: FONTS.OUTFIT,
                    fontSize: { xs: "12px", sm: "13px" },
                  },
                "& .MuiTablePagination-select": {
                  fontFamily: FONTS.OUTFIT,
                  fontSize: { xs: "12px", sm: "13px" },
                },
              }}
            />
          )}
        </>
      ) : (
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            py: { xs: 4, sm: 6 },
            px: 2,
            border: "1px dashed #EFE6D5",
            borderRadius: "16px",
            bgcolor: "#FFFDF9",
          }}
        >
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: "16px",
              fontWeight: 700,
              color: "#1A1A1A",
              mb: 1,
            }}
          >
            No complaints found
          </Typography>
          <Typography
            sx={{
              color: "#64748B",
              fontSize: "13.5px",
              mb: 2.5,
              fontFamily: FONTS.OUTFIT,
            }}
          >
            You have not raised any complaints under this filter.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => openModal(0, undefined, fetchComplaints)}
            sx={{
              color: COLORS.PRIMARY,
              borderColor: COLORS.PRIMARY,
              textTransform: "none",
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              fontSize: "13.5px",
              borderRadius: "8px",
              bgcolor: "#FFF0E6",
              px: 2.5,
              height: "38px",
              "&:hover": {
                borderColor: COLORS.PRIMARY_DARK,
                bgcolor: "#FFE0CC",
              },
            }}
          >
            Raise a Ticket
          </Button>
        </Paper>
      )}

      {/* Complaint Details Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: { xs: "14px", sm: "18px" },
              border: "1.5px solid #FF9800",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.2)",
              m: { xs: 1.5, sm: "auto" },
              width: { xs: "calc(100% - 24px)", sm: "auto" },
              maxHeight: "calc(100% - 32px)",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#2C1810",
            fontSize: { xs: "17px", sm: "19px" },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: { xs: 1.5, sm: 1.8 },
            px: { xs: 2, sm: 2.5 },
            bgcolor: "#FAF4EE",
            borderBottom: "1px solid #EFE6D5",
          }}
        >
          Complaint Details
          <IconButton
            size="small"
            onClick={() => setModalOpen(false)}
            sx={{
              color: "#7C6A60",
              bgcolor: "#F5ECE3",
              p: 0.6,
              "&:hover": { bgcolor: "#EFE6D5", color: "#2C1810" },
            }}
          >
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: "#FFFFFF" }}>
          {loadingDetails && !selectedComplaint ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress sx={{ color: COLORS.PRIMARY }} />
            </Box>
          ) : selectedComplaint ? (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}
            >
              {/* Header Info */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1.5,
                  bgcolor: "#FFFDF9",
                  p: 1.8,
                  borderRadius: "12px",
                  border: "1px solid #EFE6D5",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94A3B8",
                      fontWeight: 600,
                      display: "block",
                      mb: 0.2,
                      fontFamily: FONTS.OUTFIT,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Complaint Number
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 800,
                      fontSize: { xs: "15px", sm: "17px" },
                      color: "#1A1A1A",
                    }}
                  >
                    {selectedComplaint.complaintNumber ||
                      `CMP-${selectedComplaint.id}`}
                  </Typography>
                </Box>
                {renderStatusBadge(selectedComplaint.status)}
              </Box>

              <Grid container spacing={2}>
                {/* Booking details if present */}
                {selectedComplaint.booking ? (
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#2C1810",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "13.5px",
                      }}
                    >
                      <BookIcon
                        fontSize="small"
                        sx={{ color: COLORS.PRIMARY }}
                      />{" "}
                      Booking Details
                    </Typography>
                    <Box
                      sx={{
                        p: 1.8,
                        bgcolor: "#FFFDF9",
                        border: "1px solid #EFE6D5",
                        borderRadius: "12px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#94A3B8",
                            fontWeight: 600,
                            fontFamily: FONTS.OUTFIT,
                            display: "block",
                            mb: 0.2,
                          }}
                        >
                          BOOKING REF
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: COLORS.PRIMARY,
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "13px",
                          }}
                        >
                          {selectedComplaint.booking.bookingNumber}
                        </Typography>
                      </Box>
                      {selectedComplaint.booking.service && (
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#94A3B8",
                              fontWeight: 600,
                              fontFamily: FONTS.OUTFIT,
                              display: "block",
                              mb: 0.2,
                            }}
                          >
                            SERVICE
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#1E293B",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              fontFamily: FONTS.OUTFIT,
                              fontSize: "13px",
                            }}
                          >
                            {selectedComplaint.booking.service?.iconUrl && (
                              <img
                                src={selectedComplaint.booking.service.iconUrl}
                                alt="icon"
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                            {selectedComplaint.booking.service?.name || "N/A"}
                          </Typography>
                        </Box>
                      )}
                      {selectedComplaint.booking.scheduledAt && (
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#94A3B8",
                              fontWeight: 600,
                              fontFamily: FONTS.OUTFIT,
                              display: "block",
                              mb: 0.2,
                            }}
                          >
                            DATE
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              color: "#1E293B",
                              fontFamily: FONTS.OUTFIT,
                              fontSize: "13px",
                            }}
                          >
                            {new Date(
                              selectedComplaint.booking.scheduledAt,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </Box>
                      )}
                      {selectedComplaint.booking.finalAmount != null && (
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#94A3B8",
                              fontWeight: 600,
                              fontFamily: FONTS.OUTFIT,
                              display: "block",
                              mb: 0.2,
                            }}
                          >
                            AMOUNT
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#1E293B",
                              fontFamily: FONTS.OUTFIT,
                              fontSize: "13px",
                            }}
                          >
                            ₹{selectedComplaint.booking.finalAmount}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ) : (
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#FFFDF9",
                        border: "1px dashed #EFE6D5",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <ClassIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
                      <Typography
                        sx={{
                          color: "#64748B",
                          fontSize: "13px",
                          fontWeight: 500,
                          fontFamily: FONTS.OUTFIT,
                        }}
                      >
                        General Support Ticket — Not associated with a specific
                        booking.
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Complaint details */}
                <Grid size={{ xs: 12 }}>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#2C1810",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "13.5px",
                    }}
                  >
                    <SubjectIcon
                      fontSize="small"
                      sx={{ color: COLORS.PRIMARY }}
                    />{" "}
                    Issue Details
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.8,
                      p: 1.8,
                      bgcolor: "#FFFDF9",
                      border: "1px solid #EFE6D5",
                      borderRadius: "12px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1.5, sm: 3 },
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#94A3B8",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontFamily: FONTS.OUTFIT,
                          }}
                        >
                          <ClassIcon sx={{ fontSize: 14 }} /> CATEGORY
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1E293B",
                            mt: 0.4,
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "13px",
                          }}
                        >
                          {selectedComplaint.category?.replace(/_/g, " ") ||
                            "General Query"}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 2 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#94A3B8",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontFamily: FONTS.OUTFIT,
                          }}
                        >
                          <SubjectIcon sx={{ fontSize: 14 }} /> SUBJECT
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#1E293B",
                            mt: 0.4,
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "13px",
                          }}
                        >
                          {selectedComplaint.subject || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 0.2, borderColor: "#F2E8DC" }} />

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#94A3B8",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 0.8,
                          fontFamily: FONTS.OUTFIT,
                        }}
                      >
                        <DescriptionIcon sx={{ fontSize: 14 }} /> DESCRIPTION
                      </Typography>
                      <Typography
                        sx={{
                          bgcolor: "#FAF4EE",
                          p: 1.5,
                          borderRadius: "8px",
                          color: "#2C1810",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.5,
                          border: "1px solid #EFE6D5",
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "13px",
                        }}
                      >
                        {selectedComplaint.description || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Evidence Attachments */}
                {selectedComplaint.evidenceUrls &&
                  selectedComplaint.evidenceUrls.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#2C1810",
                          mb: 1,
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "13.5px",
                        }}
                      >
                        Evidence Attachments
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                        {selectedComplaint.evidenceUrls.map(
                          (url: string, index: number) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none" }}
                            >
                              <Box
                                component="img"
                                src={url}
                                alt={`Evidence ${index + 1}`}
                                sx={{
                                  width: 72,
                                  height: 72,
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                  border: "1px solid #EFE6D5",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                                  transition: "all 0.2s",
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                                  },
                                }}
                              />
                            </a>
                          ),
                        )}
                      </Box>
                    </Grid>
                  )}

                {/* Resolution Notes */}
                {(selectedComplaint.resolutionNotes ||
                  selectedComplaint.status === "RESOLVED") && (
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        bgcolor: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        borderRadius: "12px",
                        p: 1.8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.8,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#166534",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            fontFamily: FONTS.OUTFIT,
                          }}
                        >
                          Resolution Notes
                        </Typography>
                        {selectedComplaint.resolvedAt && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#15803D",
                              fontWeight: 600,
                              fontFamily: FONTS.OUTFIT,
                            }}
                          >
                            Resolved on:{" "}
                            {new Date(
                              selectedComplaint.resolvedAt,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          color: "#15803D",
                          whiteSpace: "pre-wrap",
                          fontWeight: 500,
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "13px",
                          lineHeight: 1.5,
                        }}
                      >
                        {selectedComplaint.resolutionNotes ||
                          "This issue has been marked resolved by the admin team."}
                      </Typography>
                      {selectedComplaint.resolvedBy && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#166534",
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 500,
                          }}
                        >
                          Resolved By: {selectedComplaint.resolvedBy.firstName}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          ) : (
            <Typography
              sx={{
                textAlign: "center",
                py: 4,
                color: "#94A3B8",
                fontFamily: FONTS.OUTFIT,
              }}
            >
              No details available.
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            px: { xs: 2, sm: 2.5 },
            py: 1.5,
            bgcolor: "#FAF4EE",
            borderTop: "1px solid #EFE6D5",
          }}
        >
          <Button
            onClick={() => setModalOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#D5C3B3",
              color: "#2C1810",
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13.5px",
              borderRadius: "8px",
              px: 3,
              height: "38px",
              "&:hover": {
                borderColor: "#A8927F",
                bgcolor: "#F5ECE3",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
