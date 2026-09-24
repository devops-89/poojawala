"use client";

import {
  deleteContactMessageAPI,
  getContactMessageByIdAPI,
  getContactMessagesAPI,
  updateContactMessageStatusAPI,
} from "@/api/contactControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmDeleteDialog from "@/components/widgets/ConfirmDeleteDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "ALL", label: "All Messages" },
  { id: "DRAFT", label: "Unread (Draft)" },
  { id: "READ", label: "Read" },
];

export default function AdminContactMessagesContent() {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusToChange, setStatusToChange] = useState<{
    id: number;
    status: string;
    messageObj?: any;
  } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [page, rowsPerPage, search, statusFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getContactMessagesAPI(
        page + 1,
        rowsPerPage,
        statusFilter === "ALL" ? undefined : statusFilter,
        search
      );
      if (res.success) {
        const list = res.data?.data || [];
        setMessages(list);
        setTotalCount(res.data?.total || list.length);
      } else {
        showSnackbar(res.message || "Failed to fetch messages", "error");
      }
    } catch (error) {
      showSnackbar("Error fetching messages", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageById = async (id: number) => {
    try {
      const res = await getContactMessageByIdAPI(id);
      if (res.success) {
        setSelectedMessage(res.data?.data || res.data);
        setViewModalOpen(true);
      }
    } catch (error) {
      showSnackbar("Error fetching message details", "error");
    }
  };

  const handleStatusChange = async () => {
    if (!statusToChange) return;
    setStatusUpdating(true);
    try {
      const res = await updateContactMessageStatusAPI(
        statusToChange.id,
        statusToChange.status,
        statusToChange.status === "READ" ? replyText : undefined
      );
      if (res.success) {
        showSnackbar(res.message || "Status updated successfully", "success");
        fetchMessages();
        setStatusModalOpen(false);
        setReplyText("");
      }
    } catch (error: any) {
      showSnackbar("Error updating status", "error");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    try {
      const res = await deleteContactMessageAPI(messageToDelete);
      if (res.success) {
        showSnackbar("Message deleted successfully", "success");
        fetchMessages();
      }
    } catch (error) {
      showSnackbar("Error deleting message", "error");
    }
    setMessageToDelete(null);
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "ID",
      render: (msg) => (
        <Typography sx={{ fontWeight: 700, color: "#FF6200", fontFamily: "var(--font-outfit), sans-serif" }}>
          CM-{msg.id}
        </Typography>
      ),
    },
    {
      id: "date",
      label: "DATE",
      render: (msg) => (
        <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#64748b", fontSize: "0.85rem" }}>
          {moment(msg.createdAt).format("MMM DD, YYYY")}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "NAME",
      render: (msg) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: "var(--font-outfit), sans-serif" }}>
          {msg.name}
        </Typography>
      ),
    },
    {
      id: "email",
      label: "EMAIL",
      render: (msg) => (
        <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#64748b", fontSize: "0.9rem" }}>
          {msg.email}
        </Typography>
      ),
    },
    {
      id: "subject",
      label: "SUBJECT",
      render: (msg) => (
        <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#1e293b", fontWeight: 500 }}>
          {msg.subject}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (msg) => {
        const isRead = msg.status === "READ";
        return (
          <AdminStatusSelect
            value={msg.status || "DRAFT"}
            readOnly={isRead}
            options={[
              { value: "DRAFT", label: "DRAFT" },
              { value: "READ", label: "READ" },
            ]}
            onChange={(newStatus) => {
              setStatusToChange({ id: msg.id, status: newStatus, messageObj: msg });
              setReplyText("");
              setStatusModalOpen(true);
            }}
          />
        );
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "right",
      render: (msg) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <Tooltip title="View Message">
            <IconButton onClick={() => fetchMessageById(msg.id)} sx={{ color: "#3b82f6" }}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => setMessageToDelete(msg.id)} sx={{ color: "#ef4444" }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Contact Messages"
        subtitle="Manage and respond to user inquiries from the contact page."
        searchPlaceholder="Search by name or email..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(0);
        }}
      />

      <AdminDataTable
        columns={columns}
        data={messages}
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
        keyExtractor={(msg) => msg.id}
        emptyMessage="No contact messages found."
      />

      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}>
        {selectedMessage && (
          <>
            <DialogTitle sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, color: "#1e293b", borderBottom: "1px solid #e2e8f0", pb: 2 }}>
              Message Details
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#64748b", fontSize: "0.85rem", mb: 0.5 }}>From</Typography>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 600, color: "#1e293b", mb: 2 }}>
                {selectedMessage.name} ({selectedMessage.email})
              </Typography>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#64748b", fontSize: "0.85rem", mb: 0.5 }}>Subject</Typography>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 600, color: "#1e293b", mb: 2 }}>
                {selectedMessage.subject}
              </Typography>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#64748b", fontSize: "0.85rem", mb: 0.5 }}>Message</Typography>
              <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#334155", whiteSpace: "pre-wrap" }}>
                  {selectedMessage.message}
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button onClick={() => setViewModalOpen(false)} sx={{ color: "#64748b", fontWeight: 600 }}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(messageToDelete)}
        title="Confirm Message Deletion"
        itemName={messageToDelete ? `Message CM-${messageToDelete}` : undefined}
        onClose={() => setMessageToDelete(null)}
        onConfirm={handleDelete}
      />

      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}>
        <DialogTitle sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 800, color: "#1e293b", borderBottom: "1px solid #e2e8f0", pb: 2 }}>
          {statusToChange?.status === "READ" ? "Update Message Status to READ" : "Change Status"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {statusToChange?.messageObj && (
            <Box sx={{ mb: 2.5, p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>
                {statusToChange.messageObj.name} ({statusToChange.messageObj.email})
              </Typography>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#64748b", fontSize: "0.85rem", mt: 0.5 }}>
                <b>Subject:</b> {statusToChange.messageObj.subject}
              </Typography>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#475569", fontSize: "0.85rem", mt: 1, whiteSpace: "pre-wrap" }}>
                &quot;{statusToChange.messageObj.message}&quot;
              </Typography>
            </Box>
          )}

          {statusToChange?.status === "READ" ? (
            <Box>
              <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", fontWeight: 700, color: "#1e293b", mb: 1, fontSize: "0.9rem" }}>
                Reply / Note Message
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Write reply or note message here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: "var(--font-outfit), sans-serif" } }}
              />
            </Box>
          ) : (
            <Typography sx={{ fontFamily: "var(--font-outfit), sans-serif", color: "#64748b" }}>
              Are you sure you want to change the status of this message to <b>{statusToChange?.status}</b>?
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setStatusModalOpen(false)} sx={{ color: "#64748b", fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleStatusChange} disabled={statusUpdating} variant="contained" sx={{ bgcolor: "#FF6200", color: "white", "&:hover": { bgcolor: "#E65800" }, boxShadow: "none", borderRadius: "8px", px: 3 }}>
            {statusUpdating ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
