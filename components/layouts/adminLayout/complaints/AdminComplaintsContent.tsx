"use client";

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

export default function AdminComplaintsContent() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const [complaints, setComplaints] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(null);
  const [statusUpdateTarget, setStatusUpdateTarget] = useState<{
    id: string | number;
    newStatus: string;
  } | null>(null);
  const [adminRemark, setAdminRemark] = useState("");
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

  const confirmStatusChange = async () => {
    if (!statusUpdateTarget) return;

    if (
      (statusUpdateTarget.newStatus === COMPLAINT_STATUS.REJECTED ||
        statusUpdateTarget.newStatus === COMPLAINT_STATUS.RESOLVED) &&
      !adminRemark.trim()
    ) {
      showSnackbar(
        `Resolution notes are required when marking a complaint as ${statusUpdateTarget.newStatus.replace(/_/g, " ")}`,
        "error"
      );
      return;
    }

    try {
      const res = await updateComplaintStatusAPI(
        statusUpdateTarget.id,
        statusUpdateTarget.newStatus,
        adminRemark
      );
      if (res.success) {
        showSnackbar("Complaint status updated", "success");
        fetchComplaints();
      } else {
        showSnackbar(res.message || "Failed to update status", "error");
      }
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || "Error updating status", "error");
    } finally {
      setStatusUpdateTarget(null);
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
        <Typography sx={{ fontWeight: 700, color: "#ef4444", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.9rem" }}>
          C-{item.id}
        </Typography>
      ),
    },
    {
      id: "category",
      label: "CATEGORY",
      render: (item) => (
        <Typography sx={{ color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>
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
            <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.9rem" }}>
              {userName}
            </Typography>
            <Box sx={{ bgcolor: userRole === "CUSTOMER" ? "#dbeafe" : "#f3e8ff", color: userRole === "CUSTOMER" ? "#2563eb" : "#9333ea", fontSize: "0.65rem", fontWeight: 700, px: 0.8, py: 0.2, borderRadius: "4px", display: "inline-block", mt: 0.5, fontFamily: "var(--font-outfit), sans-serif" }}>
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
        <Typography sx={{ color: "#64748b", fontFamily: "var(--font-outfit), sans-serif", fontSize: "0.85rem" }}>
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

        return (
          <AdminStatusSelect
            value={item.status}
            readOnly={isFinal}
            options={Object.values(COMPLAINT_STATUS).map((s) => ({
              value: s,
              label: s.replace(/_/g, " "),
            }))}
            onChange={(newStatus) => {
              setStatusUpdateTarget({ id: item.id, newStatus });
              setAdminRemark("");
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
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton onClick={() => handleViewDetails(item.id)} sx={{ color: "#10b981", "&:hover": { bgcolor: "#d1fae5" } }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => setDeleteTarget(item.id)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fee2e2" } }}>
            <DeleteIcon fontSize="small" />
          </IconButton>
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
        title="Update Complaint Status"
        itemName={statusUpdateTarget ? `Complaint C-${statusUpdateTarget.id}` : undefined}
        newStatus={statusUpdateTarget?.newStatus.replace(/_/g, " ")}
        customMessage={
          statusUpdateTarget?.newStatus === COMPLAINT_STATUS.REJECTED ||
          statusUpdateTarget?.newStatus === COMPLAINT_STATUS.RESOLVED ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
              <Typography sx={{ color: "#475569", fontFamily: "var(--font-outfit), sans-serif" }}>
                Resolution notes are required when marking status as <strong>{statusUpdateTarget?.newStatus.replace(/_/g, " ")}</strong>:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Resolution Notes (Required)"
                variant="outlined"
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                error={adminRemark.trim() === ""}
                helperText={adminRemark.trim() === "" ? "Notes are required to resolve/reject." : ""}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>
          ) : undefined
        }
        onClose={() => setStatusUpdateTarget(null)}
        onConfirm={confirmStatusChange}
      />

      <Dialog open={Boolean(selectedComplaint)} onClose={() => setSelectedComplaint(null)} maxWidth="md" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px", p: 1 } }}>
        {selectedComplaint && (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, color: "#1e293b", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>Complaint C-{selectedComplaint.id}</span>
              <IconButton onClick={() => setSelectedComplaint(null)}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>Category</Typography>
                  <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif" }}>{selectedComplaint.category?.replace(/_/g, " ")}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>Status</Typography>
                  <Chip label={selectedComplaint.status?.replace(/_/g, " ")} sx={{ fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif" }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mt: 1 }}>Description</Typography>
                  <Typography sx={{ color: "#334155", fontFamily: "var(--font-outfit), sans-serif", mt: 0.5, whiteSpace: "pre-wrap" }}>{selectedComplaint.description || "No description provided."}</Typography>
                </Grid>
                {selectedComplaint.adminRemark && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, mt: 1 }}>Admin Resolution Notes</Typography>
                    <Typography sx={{ color: "#059669", fontWeight: 600, fontFamily: "var(--font-outfit), sans-serif", mt: 0.5 }}>{selectedComplaint.adminRemark}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setSelectedComplaint(null)} variant="contained" sx={{ bgcolor: "#FF6200", color: "white", borderRadius: "8px", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#E65800" } }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
