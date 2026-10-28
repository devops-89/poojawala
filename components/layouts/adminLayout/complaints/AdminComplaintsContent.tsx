"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import {
  deleteComplaintAPI,
  getAllComplaintsAPI,
  getComplaintByIdAPI,
  updateComplaintStatusAPI,
} from "@/api/complaintControllers";
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
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

export enum COMPLAINT_STATUS {
  OPEN = "OPEN",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED",
}

const STATUS_TABS = [
  { id: "All", label: "All" },
  { id: COMPLAINT_STATUS.OPEN, label: "Open" },
  { id: COMPLAINT_STATUS.UNDER_REVIEW, label: "Under Review" },
  { id: COMPLAINT_STATUS.RESOLVED, label: "Resolved" },
  { id: COMPLAINT_STATUS.REJECTED, label: "Rejected" },
  { id: COMPLAINT_STATUS.CLOSED, label: "Closed" },
];

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminComplaintsContent() {
  const initialPagination = getTablePaginationState("admin_complaints_state", {
    defaultStatus: "All",
    defaultLimit: 10,
  });
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const [complaints, setComplaints] = useState<any[]>([]);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(null);
  const [statusUpdateTarget, setStatusUpdateTarget] = useState<{
    id: string | number;
    newStatus: string;
  } | null>(null);
  const [adminRemark, setAdminRemark] = useState("");
  const [remarkTouched, setRemarkTouched] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useSnackbarStore();

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllComplaintsAPI(page + 1, rowsPerPage, statusFilter);
      if (res.success && res.data?.data) {
        setComplaints(res.data.data);
        setTotalCount(res.data.meta?.total || res.data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    syncTablePagination(
      "admin_complaints_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All", defaultLimit: 10 }
    );
  }, [page, rowsPerPage, statusFilter]);

  const confirmStatusChange = async () => {
    if (!statusUpdateTarget) return;

    if (
      (statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED ||
        statusUpdateTarget.newStatus === COMPLAINT_STATUS.RESOLVED) &&
      !adminRemark.trim()
    ) {
      setRemarkTouched(true);
      const notesLabel =
        statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED
          ? "Rejection notes"
          : "Resolution notes";
      showSnackbar(
        `${notesLabel} are required when marking a complaint as ${statusUpdateTarget.newStatus.replace(/_/g, " ")}`,
        "error"
      );
      return;
    }

    try {
      setIsUpdatingStatus(true);
      const res = await updateComplaintStatusAPI(
        statusUpdateTarget.id,
        statusUpdateTarget.newStatus,
        adminRemark
      );
      if (res.success) {
        showSnackbar("Complaint status updated", "success");
        fetchComplaints();
        setStatusUpdateTarget(null);
        setAdminRemark("");
        setRemarkTouched(false);
      } else {
        showSnackbar(res.message || "Failed to update status", "error");
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || "Error updating status", "error");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewDetails = async (id: string | number) => {
    try {
      const res = await getComplaintByIdAPI(id);
      if (res.success && res.data) {
        setSelectedComplaint(res.data);
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || "Error fetching details", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteComplaintAPI(deleteTarget);
      if (res.success) {
        showSnackbar("Complaint deleted successfully", "success");
        fetchComplaints();
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || "Error deleting complaint", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "COMPLAINT ID",
      render: (item) => (
        <Typography sx={{ fontWeight: 700, color: "#ef4444", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
          C-{item.id}
        </Typography>
      ),
    },
    {
      id: "category",
      label: "CATEGORY",
      render: (item) => (
        <Typography sx={{ color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.85rem", fontWeight: 600 }}>
          {item.category?.replace(/_/g, " ")}
        </Typography>
      ),
    },
    {
      id: "user",
      label: "USER",
      render: (item) => {
        const userObj = item.raisedBy;
        const userName = userObj ? `${userObj.firstName} ${userObj.lastName || ""}` : "Unknown";
        const userRole = userObj?.role || "UNKNOWN";
        return (
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT, fontSize: "0.9rem" }}>
              {userName}
            </Typography>
            <Box sx={{ bgcolor: userRole === "CUSTOMER" ? "#dbeafe" : "#f3e8ff", color: userRole === "CUSTOMER" ? "#2563eb" : "#9333ea", fontSize: "0.65rem", fontWeight: 700, px: 0.8, py: 0.2, borderRadius: "4px", display: "inline-block", mt: 0.5, fontFamily: FONTS.OUTFIT }}>
              {userRole}
            </Box>
          </Box>
        );
      },
    },
    {
      id: "createdAt",
      label: "CREATED ON",
      render: (item) => (
        <Typography sx={{ color: "#64748b", fontFamily: FONTS.OUTFIT, fontSize: "0.85rem" }}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (item) => {
        const isFinal =
          item.status === COMPLAINT_STATUS.REJECTED ||
          item.status === COMPLAINT_STATUS.CLOSED ||
          item.status === COMPLAINT_STATUS.RESOLVED;

        const availableStatuses = Object.values(COMPLAINT_STATUS).filter((s) => {
          // If complaint is currently UNDER_REVIEW, OPEN is not an allowed transition
          if (item.status === COMPLAINT_STATUS.UNDER_REVIEW && s === COMPLAINT_STATUS.OPEN) {
            return false;
          }
          return true;
        });

        return (
          <AdminStatusSelect
            value={item.status}
            readOnly={isFinal}
            options={availableStatuses.map((s) => ({
              value: s,
              label: s.replace(/_/g, " "),
            }))}
            onChange={(newStatus) => {
              if (newStatus === item.status) return;
              setStatusUpdateTarget({ id: item.id, newStatus });
              setAdminRemark("");
              setRemarkTouched(false);
            }}
          />
        );
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "right",
      render: (item) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                onClick: () => handleViewDetails(item.id),
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setDeleteTarget(item.id),
                color: "#ef4444",
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
        title="Complaints"
        subtitle="Track and resolve customer & purohit issues"
      />

      <AdminDataTable
        columns={columns}
        data={complaints}
        isLoading={loading}
        totalCount={totalCount}
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
        emptyMessage="No complaints found matching your criteria."
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Complaint Deletion"
        itemName={deleteTarget ? `Complaint C-${deleteTarget}` : undefined}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmStatusDialog
        open={Boolean(statusUpdateTarget)}
        title={
          statusUpdateTarget?.newStatus === COMPLAINT_STATUS.REJECTED
            ? "Reject Complaint"
            : statusUpdateTarget?.newStatus === COMPLAINT_STATUS.RESOLVED
            ? "Resolve Complaint"
            : "Update Complaint Status"
        }
        itemName={statusUpdateTarget ? `Complaint C-${statusUpdateTarget.id}` : undefined}
        newStatus={statusUpdateTarget?.newStatus.replace(/_/g, " ")}
        loading={isUpdatingStatus}
        customMessage={
          statusUpdateTarget?.newStatus === COMPLAINT_STATUS.REJECTED ||
          statusUpdateTarget?.newStatus === COMPLAINT_STATUS.RESOLVED ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
              <Typography sx={{ color: "#475569", fontFamily: FONTS.OUTFIT }}>
                {statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED ? (
                  <>
                    Rejection notes are required when marking status as <strong>REJECTED</strong>:
                  </>
                ) : (
                  <>
                    Resolution notes are required when marking status as <strong>RESOLVED</strong>:
                  </>
                )}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={
                  statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED
                    ? "Rejection Notes (Required) *"
                    : "Resolution Notes (Required) *"
                }
                placeholder={
                  statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED
                    ? "Enter reason for rejection..."
                    : "Enter resolution details..."
                }
                variant="outlined"
                value={adminRemark}
                onChange={(e) => {
                  setAdminRemark(e.target.value);
                  if (remarkTouched && e.target.value.trim() !== "") {
                    setRemarkTouched(false);
                  }
                }}
                error={remarkTouched && adminRemark.trim() === ""}
                helperText={
                  remarkTouched && adminRemark.trim() === ""
                    ? statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED
                      ? "Notes are required to reject."
                      : "Notes are required to resolve."
                    : ""
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>
          ) : undefined
        }
        onClose={() => {
          if (isUpdatingStatus) return;
          setStatusUpdateTarget(null);
          setRemarkTouched(false);
          setAdminRemark("");
        }}
        onConfirm={confirmStatusChange}
      />

      <Dialog open={Boolean(selectedComplaint)} onClose={() => setSelectedComplaint(null)} maxWidth="md" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px", p: 1 } }}>
        {selectedComplaint && (
          <>
            <DialogTitle sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Complaint C-{selectedComplaint.id}</span>
              <IconButton onClick={() => setSelectedComplaint(null)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>Category</Typography>
                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT }}>{selectedComplaint.category?.replace(/_/g, " ")}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>Status</Typography>
                  <Chip label={selectedComplaint.status?.replace(/_/g, " ")} sx={{ fontWeight: 700, fontFamily: FONTS.OUTFIT }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mt: 1 }}>Description</Typography>
                  <Typography sx={{ color: "#334155", fontFamily: FONTS.OUTFIT, mt: 0.5, whiteSpace: "pre-wrap" }}>{selectedComplaint.description || "No description provided."}</Typography>
                </Grid>
                {selectedComplaint.adminRemark && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mt: 1 }}>
                      {selectedComplaint.status === COMPLAINT_STATUS.REJECTED ? "Admin Rejection Notes" : "Admin Resolution Notes"}
                    </Typography>
                    <Typography
                      sx={{
                        color: selectedComplaint.status === COMPLAINT_STATUS.REJECTED ? "#dc2626" : "#059669",
                        fontWeight: 600,
                        fontFamily: FONTS.OUTFIT,
                        mt: 0.5,
                      }}
                    >
                      {selectedComplaint.adminRemark}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedComplaint(null)} variant="contained" sx={{ bgcolor: COLORS.PRIMARY, color: "white", borderRadius: "8px", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: COLORS.PRIMARY_DARK } }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
