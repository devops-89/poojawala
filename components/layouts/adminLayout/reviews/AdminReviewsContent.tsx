"use client";

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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "All", label: "All Reviews" },
  { id: "Published", label: "Published" },
  { id: "Draft", label: "Draft" },
];

export default function AdminReviewsContent() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  useEffect(() => {
    fetchReviews(statusFilter);
  }, [statusFilter]);

  const fetchReviews = async (status: string) => {
    try {
      setLoading(true);
      const response = await getAllReviewsAPI(status);
      if (response?.success && response?.data?.data) {
        setReviews(
          response.data.data.map((r: any) => ({
            ...r,
            id: `B-${r.bookingId}`,
            bookingId: r.bookingId,
            customer: r.customer
              ? `${r.customer.firstName || ""} ${r.customer.lastName || ""}`.trim()
              : "Unknown",
            service: r.service?.name || "Unknown",
            purohit: r.purohit
              ? `${r.purohit.firstName || ""} ${r.purohit.lastName || ""}`.trim()
              : "Unknown",
            status: r.reviewStatus
              ? r.reviewStatus.toLowerCase() === "published"
                ? "Published"
                : "Draft"
              : "Draft",
            customerRating: parseFloat(r.customerRating) || 0,
            customerComment: r.customerReview || "",
            purohitRating: parseFloat(r.purohitRating) || 0,
            purohitComment: r.purohitReview || "",
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      showSnackbar("Failed to fetch reviews", "error");
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
          customer: r.customer ? `${r.customer.firstName || ""} ${r.customer.lastName || ""}`.trim() : "Unknown",
          service: r.service?.name || "Unknown",
          purohit: r.purohit ? `${r.purohit.firstName || ""} ${r.purohit.lastName || ""}`.trim() : "Unknown",
          status: r.reviewStatus ? (r.reviewStatus.toLowerCase() === "published" ? "Published" : "Draft") : "Draft",
          customerRating: parseFloat(r.customerRating) || 0,
          customerComment: r.customerReview || "No review left",
          purohitRating: parseFloat(r.purohitRating) || 0,
          purohitComment: r.purohitReview || "No review left",
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

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "BOOKING ID",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.9rem" }}>
          {item.id}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "CUSTOMER",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.9rem" }}>
          {item.customer}
        </Typography>
      ),
    },
    {
      id: "service",
      label: "SERVICE",
      render: (item) => (
        <Typography sx={{ color: "#64748b", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.85rem" }}>
          {item.service}
        </Typography>
      ),
    },
    {
      id: "purohit",
      label: "PUROHIT",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.9rem" }}>
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
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton onClick={() => handleViewReview(item)} sx={{ color: "#10b981", "&:hover": { bgcolor: "#d1fae5" } }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => setReviewToDelete(item)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fee2e2" } }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const paginatedData = filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Service Reviews"
        subtitle="Manage feedback, ratings, and publication status for completed bookings"
      />

      <AdminDataTable
        columns={columns}
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
        emptyMessage="No reviews found matching your criteria."
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

      <Dialog open={Boolean(selectedReview) || isModalLoading} onClose={() => setSelectedReview(null)} maxWidth="md" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px", p: 1 } }}>
        {isModalLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: "#FF6200" }} />
          </Box>
        ) : selectedReview ? (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Review Details ({selectedReview.id})</span>
              <IconButton onClick={() => setSelectedReview(null)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif", mb: 1 }}>
                    Customer Review ({selectedReview.customer})
                  </Typography>
                  <Rating value={selectedReview.customerRating} readOnly precision={0.5} />
                  <Typography sx={{ color: "#334155", fontFamily: "var(--font-outfit), sans-serif", mt: 1, whiteSpace: "pre-wrap" }}>
                    &quot;{selectedReview.customerComment || "No comment provided."}&quot;
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif", mb: 1 }}>
                    Purohit Review ({selectedReview.purohit})
                  </Typography>
                  <Rating value={selectedReview.purohitRating} readOnly precision={0.5} />
                  <Typography sx={{ color: "#334155", fontFamily: "var(--font-outfit), sans-serif", mt: 1, whiteSpace: "pre-wrap" }}>
                    &quot;{selectedReview.purohitComment || "No comment provided."}&quot;
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedReview(null)} variant="contained" sx={{ bgcolor: "#FF6200", color: "white", borderRadius: "8px", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#E65800" } }}>Close</Button>
            </DialogActions>
          </>
        ) : null}
      </Dialog>
    </Box>
  );
}
