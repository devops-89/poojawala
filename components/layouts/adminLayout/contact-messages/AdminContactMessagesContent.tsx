"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import NextLink from "next/link";
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
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

const STATUS_TABS = [
  { id: "ALL", label: "All Messages" },
  { id: "DRAFT", label: "Unread (Draft)" },
  { id: "READ", label: "Read" },
];

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminContactMessagesContent() {
  const initialPagination = getTablePaginationState("admin_contact_messages_state", {
    defaultStatus: "ALL",
    defaultLimit: 10,
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
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

  useEffect(() => {
    syncTablePagination(
      "admin_contact_messages_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "ALL", defaultLimit: 10 }
    );
  }, [page, rowsPerPage, statusFilter]);

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
      width: "12%",
      minWidth: 80,
      render: (msg) => (
        <Typography sx={{ fontWeight: 700, color: COLORS.PRIMARY, fontFamily: FONTS.OUTFIT }}>
          CM-{msg.id}
        </Typography>
      ),
    },
    {
      id: "date",
      label: "DATE",
      width: "18%",
      minWidth: 120,
      render: (msg) => (
        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "0.85rem" }}>
          {moment(msg.createdAt).format("MMM DD, YYYY")}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "NAME",
      width: "25%",
      minWidth: 150,
      render: (msg) => (
        <Typography sx={{ fontWeight: 700, color: "#1e293b", fontFamily: FONTS.OUTFIT }}>
          {msg.name}
        </Typography>
      ),
    },
    {
      id: "email",
      label: "EMAIL",
      width: "25%",
      minWidth: 180,
      render: (msg) => (
        <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "0.9rem" }}>
          {msg.email}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      width: "12%",
      minWidth: 120,
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
      width: "8%",
      minWidth: 80,
      align: "right",
      render: (msg) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Message",
                icon: <VisibilityIcon fontSize="small" />,
                onClick: () => fetchMessageById(msg.id),
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setMessageToDelete(msg.id),
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

      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              maxWidth: 720,
              width: "100%",
              m: { xs: 2, sm: "auto" },
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.12)",
            },
          },
        }}
      >
        {selectedMessage && (
          <>
            <DialogTitle
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1e293b",
                borderBottom: "1px solid #f1f5f9",
                px: { xs: 2.5, sm: 3.5 },
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, fontSize: "1.25rem", color: "#1e293b" }}>
                  Enquiry Details
                </Typography>
                <Chip
                  label={`CM-${selectedMessage.id}`}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    bgcolor: "rgba(255, 98, 0, 0.08)",
                    color: COLORS.PRIMARY,
                    borderRadius: "6px"
                  }}
                />
              </Box>
              <IconButton
                onClick={() => setViewModalOpen(false)}
                size="small"
                sx={{
                  color: "#94a3b8",
                  "&:hover": { color: "#1e293b", bgcolor: "#f1f5f9" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* 1. Associated Service Box if present */}
              {selectedMessage.service && (
                <Box
                  sx={{
                    p: 2.2,
                    background: "linear-gradient(135deg, #FFFBF8 0%, #FFFFFF 100%)",
                    border: "1px solid #FFD9C4",
                    borderRadius: "16px",
                    boxShadow: "0 2px 10px rgba(255, 98, 0, 0.04)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: COLORS.PRIMARY,
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 800,
                          color: COLORS.PRIMARY,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                        }}
                      >
                        Associated Service
                      </Typography>
                    </Box>

                    <NextLink
                      href={`/admin/services/${selectedMessage.service.id || selectedMessage.serviceId}`}
                      target="_blank"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        color: COLORS.PRIMARY,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontFamily: FONTS.OUTFIT,
                        padding: "4px 10px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(255, 98, 0, 0.08)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span>View Service</span>
                      <OpenInNewIcon sx={{ fontSize: 14 }} />
                    </NextLink>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {selectedMessage.service.iconUrl && (
                        <Box
                          component="img"
                          src={selectedMessage.service.iconUrl}
                          alt={selectedMessage.service.name}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "12px",
                            objectFit: "cover",
                            border: "1px solid #fed7aa",
                            bgcolor: "#FAF4EE",
                          }}
                        />
                      )}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 800,
                            color: "#1e293b",
                            fontSize: "1.08rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {selectedMessage.service.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            color: "#64748b",
                            fontSize: "0.78rem",
                            mt: 0.2,
                          }}
                        >
                          Service ID: {selectedMessage.service.id || selectedMessage.serviceId}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Mode Tabs / Badges */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                      {selectedMessage.service.isOffline && (
                        <Chip
                          label="Offline"
                          size="small"
                          sx={{
                            bgcolor: "#fef3c7",
                            color: "#92400e",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            borderRadius: "8px",
                            px: 0.5,
                          }}
                        />
                      )}
                      {selectedMessage.service.isOnline && (
                        <Chip
                          label="Online"
                          size="small"
                          sx={{
                            bgcolor: "#e0f2fe",
                            color: "#0369a1",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            borderRadius: "8px",
                            px: 0.5,
                          }}
                        />
                      )}
                      {selectedMessage.service.isGlobal && (
                        <Chip
                          label="Global"
                          size="small"
                          sx={{
                            bgcolor: "#dcfce7",
                            color: "#166534",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            borderRadius: "8px",
                            px: 0.5,
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Service Cities Covered */}
                  {Array.isArray(selectedMessage.service.cities) && selectedMessage.service.cities.length > 0 && (
                    <Box sx={{ mt: 1.8, pt: 1.4, borderTop: "1px dashed #fed7aa" }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "0.76rem",
                          fontWeight: 700,
                          color: "#64748b",
                          mb: 0.8,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.6,
                        }}
                      >
                        <LocationCityIcon sx={{ fontSize: 16, color: COLORS.PRIMARY }} />
                        Service Covered Locations:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                        {selectedMessage.service.cities.map((c: any, idx: number) => {
                          const label =
                            typeof c === "string"
                              ? c
                              : [c?.name, c?.state].filter(Boolean).join(", ");
                          return (
                            <Chip
                              key={idx}
                              label={label}
                              size="small"
                              sx={{
                                fontFamily: FONTS.OUTFIT,
                                fontSize: "0.76rem",
                                fontWeight: 600,
                                bgcolor: "#ffffff",
                                border: "1px solid #fed7aa",
                                color: "#334155",
                                borderRadius: "8px",
                              }}
                            />
                          );
                        })}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* 2. Key Details Grid (Customer, Date/Status, Preferred Date, Address) */}
              <Grid container spacing={2}>
                {/* Customer Details */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.6 }}>
                      From Customer
                    </Typography>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>
                      {selectedMessage.name}
                    </Typography>
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "0.85rem", mt: 0.2 }}>
                      {selectedMessage.email}
                    </Typography>
                  </Box>
                </Grid>

                {/* Received Date & Status */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.6 }}>
                      Received Date & Status
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
                      <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                        {moment(selectedMessage.createdAt).format("MMM DD, YYYY · hh:mm A")}
                      </Typography>
                      <Chip
                        label={selectedMessage.status || "DRAFT"}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                          bgcolor: selectedMessage.status === "READ" ? "#dcfce7" : "#fef3c7",
                          color: selectedMessage.status === "READ" ? "#166534" : "#92400e",
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Preferred Date & Time (if present) */}
                {selectedMessage.preferredDateTime && (
                  <Grid size={{ xs: 12, sm: selectedMessage.address ? 6 : 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        height: "100%",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "10px",
                          bgcolor: "rgba(255, 98, 0, 0.08)",
                          color: COLORS.PRIMARY,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CalendarMonthIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.3 }}>
                          Preferred Date & Time
                        </Typography>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                          {moment(selectedMessage.preferredDateTime).format("MMM DD, YYYY · hh:mm A")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Service Address / Location (if present) */}
                {selectedMessage.address && (
                  <Grid size={{ xs: 12, sm: selectedMessage.preferredDateTime ? 6 : 12 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: "14px",
                        height: "100%",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "10px",
                          bgcolor: "rgba(255, 98, 0, 0.08)",
                          color: COLORS.PRIMARY,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LocationOnIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.3 }}>
                          Service Address / Location
                        </Typography>
                        <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 600, color: "#1e293b", fontSize: "0.92rem", lineHeight: 1.4 }}>
                          {selectedMessage.address}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* 3. Subject and Message */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
                <Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.5 }}>
                    Subject
                  </Typography>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#1e293b", fontSize: "1.02rem" }}>
                    {selectedMessage.subject}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 0.6 }}>
                    Enquiry Message
                  </Typography>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.2,
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px"
                    }}
                  >
                    <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: "0.92rem" }}>
                      {selectedMessage.message}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: { xs: 2.5, sm: 3.5 }, pb: 2.5, pt: 1, borderTop: "1px solid #f1f5f9" }}>
              <Button
                onClick={() => setViewModalOpen(false)}
                variant="contained"
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  px: 3.5,
                  py: 1,
                  boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
                  "&:hover": {
                    bgcolor: COLORS.PRIMARY_DARK,
                    boxShadow: "0 6px 16px rgba(255, 98, 0, 0.35)",
                  }
                }}
              >
                Close
              </Button>
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
        <DialogTitle sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 800, color: "#1e293b", borderBottom: "1px solid #e2e8f0", pb: 2 }}>
          {statusToChange?.status === "READ" ? "Update Message Status to READ" : "Change Status"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {statusToChange?.messageObj && (
            <Box sx={{ mb: 2.5, p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}>
                {statusToChange.messageObj.name} ({statusToChange.messageObj.email})
              </Typography>
              {statusToChange.messageObj.service && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.8, flexWrap: "wrap" }}>
                  <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "0.85rem" }}>
                    <b>Service:</b> {statusToChange.messageObj.service.name}
                  </Typography>
                  {statusToChange.messageObj.service.isOnline && (
                    <Chip
                      label="Online"
                      size="small"
                      sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 700 }}
                    />
                  )}
                  {statusToChange.messageObj.service.isOffline && (
                    <Chip
                      label="Offline"
                      size="small"
                      sx={{ height: 20, fontSize: "0.65rem", bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700 }}
                    />
                  )}
                </Box>
              )}
              {statusToChange.messageObj.preferredDateTime && (
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "0.85rem", mt: 0.5 }}>
                  <b>Preferred Date:</b> {moment(statusToChange.messageObj.preferredDateTime).format("MMM DD, YYYY · hh:mm A")}
                </Typography>
              )}
              {statusToChange.messageObj.address && (
                <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "0.85rem", mt: 0.5 }}>
                  <b>Address:</b> {statusToChange.messageObj.address}
                </Typography>
              )}
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b", fontSize: "0.85rem", mt: 0.5 }}>
                <b>Subject:</b> {statusToChange.messageObj.subject}
              </Typography>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#475569", fontSize: "0.85rem", mt: 1, whiteSpace: "pre-wrap" }}>
                &quot;{statusToChange.messageObj.message}&quot;
              </Typography>
            </Box>
          )}

          {statusToChange?.status === "READ" ? (
            <Box>
              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#1e293b", mb: 1, fontSize: "0.9rem" }}>
                Reply / Note Message
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Write reply or note message here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", fontFamily: FONTS.OUTFIT } }}
              />
            </Box>
          ) : (
            <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748b" }}>
              Are you sure you want to change the status of this message to <b>{statusToChange?.status}</b>?
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setStatusModalOpen(false)} sx={{ color: "#64748b", fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleStatusChange} disabled={statusUpdating} variant="contained" sx={{ bgcolor: COLORS.PRIMARY, color: "white", "&:hover": { bgcolor: COLORS.PRIMARY_DARK }, boxShadow: "none", borderRadius: "8px", px: 3 }}>
            {statusUpdating ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
