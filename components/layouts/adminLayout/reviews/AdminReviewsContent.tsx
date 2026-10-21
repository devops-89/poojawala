"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import {
  deleteReviewAPI,
  getAllReviewsAPI,
  getReviewByBookingIdAPI,
  updateReviewStatusAPI,
} from "@/api/userControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmDeleteDialog from "@/components/widgets/ConfirmDeleteDialog";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Rating,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import AdminTableActionMenu from "../common/AdminTableActionMenu";
import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

const STATUS_TABS = [
  { id: "All", label: "All Reviews" },
  { id: "Published", label: "Published" },
  { id: "Draft", label: "Draft" },
];

export default function AdminReviewsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const initialPagination = getTablePaginationState("admin_reviews_pagination", {
    defaultStatus: "All",
    defaultLimit: 10,
  });

  const [bookingType, setBookingType] = useState<"POOJA" | "ASTROLOGY">("POOJA");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusChangeTarget, setStatusChangeTarget] = useState<{
    reviewId: string;
    bookingId: number;
    newStatus: string;
  } | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync bookingType with URL searchParams & sessionStorage
  useEffect(() => {
    const typeParam = searchParams.get("type")?.toUpperCase();
    if (typeParam === "ASTROLOGY" || typeParam === "POOJA") {
      if (typeParam !== bookingType) {
        setBookingType(typeParam as "POOJA" | "ASTROLOGY");
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("admin_reviews_type", typeParam);
      }
    } else if (typeof window !== "undefined") {
      const savedType = sessionStorage.getItem("admin_reviews_type");
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
      sessionStorage.setItem("admin_reviews_type", newType);
      const params = new URLSearchParams(window.location.search);
      params.set("type", newType);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  useEffect(() => {
    fetchReviews(statusFilter, bookingType);
  }, [statusFilter, bookingType]);

  useEffect(() => {
    syncTablePagination(
      "admin_reviews_pagination",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All", defaultLimit: 10 }
    );
  }, [page, rowsPerPage, statusFilter]);

  const fetchReviews = async (status: string, type: "POOJA" | "ASTROLOGY") => {
    try {
      setLoading(true);
      const response = await getAllReviewsAPI(status, type);
      if (response?.success && response?.data?.data) {
        setReviews(
          response.data.data.map((r: any) => {
            const rawSpecs = r.astrologer?.specializations;
            const specStr = Array.isArray(rawSpecs)
              ? rawSpecs.join(", ")
              : typeof rawSpecs === "string"
              ? rawSpecs
              : "";
            const city = r.astrologer?.city || "";
            const consultationDesc = specStr || city || "Astrology Consultation";

            return {
              ...r,
              id: `B-${r.bookingId}`,
              bookingId: r.bookingId,
              bookingNumber: r.bookingNumber || `PW-${r.bookingId}`,
              bookingType: r.bookingType || type,
              customer: r.customer
                ? `${r.customer.firstName || ""} ${r.customer.lastName || ""}`.trim()
                : "Unknown",
              service: r.service?.name || (type === "ASTROLOGY" ? "Astrology Consultation" : "N/A"),
              purohit: r.purohit
                ? `${r.purohit.firstName || ""} ${r.purohit.lastName || ""}`.trim()
                : "N/A",
              astrologer: r.astrologer
                ? `${r.astrologer.firstName || ""} ${r.astrologer.lastName || ""}`.trim()
                : "N/A",
              specialization: consultationDesc,
              city: city,
              status: r.reviewStatus
                ? r.reviewStatus.toLowerCase() === "published"
                  ? "Published"
                  : "Draft"
                : "Draft",
              customerRating: parseFloat(r.customerRating) || 0,
              customerComment: r.customerReview || "",
              purohitRating: parseFloat(r.purohitRating) || 0,
              purohitComment: r.purohitReview || "",
              astrologerRating: parseFloat(r.astrologerRating) || 0,
              astrologerComment: r.astrologerReview || "",
            };
          })
        );
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      showSnackbar("Failed to fetch reviews", "error");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    setIsUpdatingStatus(true);
    try {
      const response = await updateReviewStatusAPI(
        statusChangeTarget.bookingId,
        statusChangeTarget.newStatus.toUpperCase()
      );
      if (response?.success) {
        showSnackbar(
          `Review status updated to ${statusChangeTarget.newStatus}`,
          "success"
        );
        setReviews((prev) =>
          prev.map((r) =>
            r.id === statusChangeTarget.reviewId
              ? { ...r, status: statusChangeTarget.newStatus }
              : r
          )
        );
      }
    } catch (error) {
      showSnackbar("Error updating review status", "error");
    } finally {
      setIsUpdatingStatus(false);
      setStatusChangeTarget(null);
    }
  };

  const handleViewReview = async (reviewItem: any) => {
    setIsModalLoading(true);
    try {
      const response = await getReviewByBookingIdAPI(reviewItem.bookingId);
      if (response?.success && response?.data) {
        const r = response.data;
        setSelectedReview({
          id: `B-${r.bookingId}`,
          bookingId: r.bookingId,
          bookingNumber: r.bookingNumber || reviewItem.bookingNumber,
          bookingType: r.bookingType || reviewItem.bookingType,
          customer: r.customer ? `${r.customer.firstName || ""} ${r.customer.lastName || ""}`.trim() : "Unknown",
          service: r.service?.name || (bookingType === "ASTROLOGY" ? "Astrology Consultation" : "N/A"),
          purohit: r.purohit ? `${r.purohit.firstName || ""} ${r.purohit.lastName || ""}`.trim() : "N/A",
          astrologer: r.astrologer ? `${r.astrologer.firstName || ""} ${r.astrologer.lastName || ""}`.trim() : "N/A",
          status: r.reviewStatus ? (r.reviewStatus.toLowerCase() === "published" ? "Published" : "Draft") : "Draft",
          customerRating: parseFloat(r.customerRating) || 0,
          customerComment: r.customerReview || "No review left",
          purohitRating: parseFloat(r.purohitRating) || 0,
          purohitComment: r.purohitReview || "No review left",
          astrologerRating: parseFloat(r.astrologerRating) || 0,
          astrologerComment: r.astrologerReview || "No review left",
        });
      } else {
        setSelectedReview(reviewItem);
      }
    } catch (error) {
      setSelectedReview(reviewItem);
    } finally {
      setIsModalLoading(false);
    }
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteReviewAPI(reviewToDelete.bookingId);
      if (response?.success) {
        showSnackbar("Review deleted successfully", "success");
        setReviews((prev) => prev.filter((r) => r.bookingId !== reviewToDelete.bookingId));
      }
    } catch (error: any) {
      showSnackbar(error.response?.data?.message || "Error deleting review", "error");
    } finally {
      setIsDeleting(false);
      setReviewToDelete(null);
    }
  };

  const filteredReviews = reviews.filter((item) => {
    if (statusFilter === "Published") return item.status === "Published";
    if (statusFilter === "Draft") return item.status === "Draft";
    return true;
  });

  const poojaColumns: Column<any>[] = [
    {
      id: "id",
      label: "BOOKING ID",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
          {item.id}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "CUSTOMER",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
          {item.customer}
        </Typography>
      ),
    },
    {
      id: "service",
      label: "SERVICE",
      render: (item) => (
        <Typography sx={{ color: "#64748b", fontFamily: FONTS.OUTFIT, fontSize: "0.85rem" }}>
          {item.service}
        </Typography>
      ),
    },
    {
      id: "purohit",
      label: "PUROHIT",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
          {item.purohit}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (item) => (
        <AdminStatusSelect
          value={item.status}
          options={[
            { value: "Draft", label: "DRAFT" },
            { value: "Published", label: "PUBLISHED" },
          ]}
          onChange={(newStatus) =>
            setStatusChangeTarget({
              reviewId: item.id,
              bookingId: item.bookingId,
              newStatus,
            })
          }
        />
      ),
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "center",
      render: (item) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                onClick: () => handleViewReview(item),
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setReviewToDelete(item),
                color: "#ef4444",
              },
            ]}
          />
        </Box>
      ),
    },
  ];

  const astrologyColumns: Column<any>[] = [
    {
      id: "id",
      label: "BOOKING ID",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
          {item.id}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "CUSTOMER",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
          {item.customer}
        </Typography>
      ),
    },
    {
      id: "astrologer",
      label: "ASTROLOGER",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
          {item.astrologer}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (item) => (
        <AdminStatusSelect
          value={item.status}
          options={[
            { value: "Draft", label: "DRAFT" },
            { value: "Published", label: "PUBLISHED" },
          ]}
          onChange={(newStatus) =>
            setStatusChangeTarget({
              reviewId: item.id,
              bookingId: item.bookingId,
              newStatus,
            })
          }
        />
      ),
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "center",
      render: (item) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                onClick: () => handleViewReview(item),
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setReviewToDelete(item),
                color: "#ef4444",
              },
            ]}
          />
        </Box>
      ),
    },
  ];

  const paginatedData = filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Reviews & Ratings"
        subtitle="Manage feedback, ratings, and publication status for completed bookings"
      />

      {/* Booking Type Tabs: Pooja Reviews vs Astrologer Reviews */}
      <Box sx={{ borderBottom: "1px solid #E2E8F0" }}>
        <Tabs
          value={bookingType}
          onChange={(_, val) => handleBookingTypeChange(val)}
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
          <Tab value="POOJA" label="Pooja Reviews" />
          <Tab value="ASTROLOGY" label="Astrologer Reviews" />
        </Tabs>
      </Box>

      <AdminDataTable
        columns={bookingType === "ASTROLOGY" ? astrologyColumns : poojaColumns}
        data={paginatedData}
        isLoading={loading}
        totalCount={filteredReviews.length}
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
        keyExtractor={(item) => item.id}
        emptyMessage={`No ${bookingType === "ASTROLOGY" ? "astrologer" : "pooja"} reviews found matching your criteria.`}
      />

      <ConfirmDeleteDialog
        open={Boolean(reviewToDelete)}
        title="Confirm Delete Review"
        itemName={reviewToDelete ? `Review for ${reviewToDelete.id}` : undefined}
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDeleteReview}
        loading={isDeleting}
      />

      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Confirm Review Status Change"
        itemName={statusChangeTarget ? `Review for ${statusChangeTarget.reviewId}` : undefined}
        newStatus={statusChangeTarget?.newStatus}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={confirmStatusChange}
        loading={isUpdatingStatus}
      />

      <Dialog
        open={Boolean(selectedReview) || isModalLoading}
        onClose={() => setSelectedReview(null)}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { borderRadius: "16px", p: 1 } }}
      >
        {isModalLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: COLORS.PRIMARY }} />
          </Box>
        ) : selectedReview ? (
          <>
            <DialogTitle
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>Review Details ({selectedReview.id})</span>
              <IconButton onClick={() => setSelectedReview(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, mb: 1 }}
                  >
                    Customer Review ({selectedReview.customer})
                  </Typography>
                  <Rating value={selectedReview.customerRating} readOnly precision={0.5} />
                  <Typography
                    sx={{ color: "#334155", fontFamily: FONTS.OUTFIT, mt: 1, whiteSpace: "pre-wrap" }}
                  >
                    &quot;{selectedReview.customerComment || "No comment provided."}&quot;
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, mb: 1 }}
                  >
                    {selectedReview.bookingType === "ASTROLOGY" || selectedReview.astrologer !== "N/A"
                      ? `Astrologer Review (${selectedReview.astrologer})`
                      : `Purohit Review (${selectedReview.purohit})`}
                  </Typography>
                  <Rating
                    value={
                      selectedReview.bookingType === "ASTROLOGY" || selectedReview.astrologer !== "N/A"
                        ? selectedReview.astrologerRating
                        : selectedReview.purohitRating
                    }
                    readOnly
                    precision={0.5}
                  />
                  <Typography
                    sx={{ color: "#334155", fontFamily: FONTS.OUTFIT, mt: 1, whiteSpace: "pre-wrap" }}
                  >
                    &quot;
                    {(selectedReview.bookingType === "ASTROLOGY" || selectedReview.astrologer !== "N/A"
                      ? selectedReview.astrologerComment
                      : selectedReview.purohitComment) || "No review left"}
                    &quot;
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setSelectedReview(null)}
                variant="contained"
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
}
