"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { formatPhoneNumber } from "@/utils/helpers";

import {
  getPurohitsAPI,
  updatePurohitVerificationAPI,
} from "@/api/userControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "All", label: "All" },
  { id: "Approved", label: "Approved" },
  { id: "Pending Approval", label: "Pending Approval" },
  { id: "Rejected", label: "Rejected" },
];

export default function AdminPurohitsContent() {
  const searchParams = useSearchParams();

  const getInitialState = () => {
    const paramStatus = searchParams.get("status");
    const paramPage = searchParams.get("page");
    if (paramStatus || paramPage) {
      return {
        status: paramStatus || "All",
        page: paramPage ? Math.max(0, parseInt(paramPage, 10) - 1) : 0,
      };
    }
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("admin_purohits_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            status: parsed.status || "All",
            page: typeof parsed.page === "number" ? parsed.page : 0,
          };
        }
      } catch (e) {}
    }
    return { status: "All", page: 0 };
  };

  const initialState = getInitialState();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialState.status);
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [purohits, setPurohits] = useState<any[]>([]);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "admin_purohits_state",
          JSON.stringify({ status: statusFilter, page })
        );
      } catch (e) {}

      const params = new URLSearchParams(window.location.search);
      let changed = false;

      if (statusFilter !== "All") {
        if (params.get("status") !== statusFilter) {
          params.set("status", statusFilter);
          changed = true;
        }
      } else {
        if (params.has("status")) {
          params.delete("status");
          changed = true;
        }
      }

      if (page > 0) {
        if (params.get("page") !== String(page + 1)) {
          params.set("page", String(page + 1));
          changed = true;
        }
      } else {
        if (params.has("page")) {
          params.delete("page");
          changed = true;
        }
      }

      if (changed) {
        const queryString = params.toString();
        const newUrl = queryString ? `/admin/purohits?${queryString}` : `/admin/purohits`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [statusFilter, page]);

  const fetchPurohits = useCallback(async () => {
    try {
      setLoading(true);
      let backendFilterStatus: string | undefined = undefined;
      if (statusFilter === "Approved") backendFilterStatus = "APPROVED";
      else if (statusFilter === "Pending Approval")
        backendFilterStatus = "PENDING";
      else if (statusFilter === "Rejected") backendFilterStatus = "REJECTED";

      const res = await getPurohitsAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        backendFilterStatus
      );
      if (res.success) {
        const usersArray = res.data?.data || [];
        const pagination = res.data?.pagination || {};

        const mapped = usersArray.map((u: any) => {
          const profile = u.profile || u.purohitProfile || {};
          let uiStatus = "No Profile";
          const verificationStatus = profile.verificationStatus || u.status;

          if (
            verificationStatus === "APPROVED" ||
            verificationStatus === "ACTIVE"
          )
            uiStatus = "Approved";
          else if (verificationStatus === "PENDING")
            uiStatus = "Pending Approval";
          else if (verificationStatus === "REJECTED") uiStatus = "Rejected";

          return {
            id: u.id,
            name:
              `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
            email: u.email || "-",
            city: profile.city || "-",
            status: uiStatus,
            phone: formatPhoneNumber(u.phone, u.countryCode),
            appliedAt: new Date(u.createdAt).toLocaleDateString(),
          };
        });
        setPurohits(mapped);
        setTotalCount(pagination.total || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPurohits();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchPurohits]);

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    setIsSubmitting(true);
    try {
      const backendStatus =
        statusChangeTarget.newStatus === "Approved"
          ? "APPROVED"
          : statusChangeTarget.newStatus === "Rejected"
            ? "REJECTED"
            : "PENDING";
      const reason =
        backendStatus === "REJECTED" ? rejectionReason : undefined;

      const res = await updatePurohitVerificationAPI(
        statusChangeTarget.purohit.id,
        backendStatus,
        reason
      );
      if (res.success) {
        showSnackbar("Purohit status updated successfully", "success");
        fetchPurohits();
      } else {
        showSnackbar(res.message || "Failed to update status", "error");
      }
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Error updating status",
        "error"
      );
    } finally {
      setIsSubmitting(false);
      setStatusChangeTarget(null);
    }
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "PUROHIT ID",
      width: "12%",
      minWidth: 100,
      render: (purohit) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          P-{purohit.id}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "PUROHIT NAME",
      width: "22%",
      minWidth: 180,
      render: (purohit) => (
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {purohit.name}
          </Typography>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "0.85rem",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {purohit.email}
          </Typography>
        </Box>
      ),
    },
    {
      id: "city",
      label: "CITY",
      width: "15%",
      minWidth: 120,
      render: (purohit) => (
        <Typography
          sx={{
            color: "#1e293b",
            fontWeight: 500,
            fontSize: "0.9rem",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          {purohit.city}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      width: "16%",
      minWidth: 140,
      render: (purohit) => {
        const options =
          purohit.status === "Approved"
            ? [
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ]
            : purohit.status === "Rejected"
            ? [
                { value: "Rejected", label: "Rejected" },
                { value: "Approved", label: "Approved" },
              ]
            : [
                { value: "Pending Approval", label: "Pending Approval" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
              ];

        return (
          <AdminStatusSelect
            value={purohit.status}
            options={options}
            onChange={(newStatus) => {
              if (newStatus !== purohit.status) {
                setStatusChangeTarget({ purohit, newStatus });
              }
            }}
          />
        );
      },
    },
    {
      id: "phone",
      label: "PHONE",
      width: "14%",
      minWidth: 120,
      render: (purohit) => (
        <Typography
          sx={{
            color: "#1e293b",
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.85rem",
          }}
        >
          {purohit.phone}
        </Typography>
      ),
    },
    {
      id: "appliedAt",
      label: "APPLIED ON",
      width: "13%",
      minWidth: 110,
      render: (purohit) => (
        <Typography
          sx={{
            color: "#64748b",
            fontSize: "0.85rem",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          {purohit.appliedAt}
        </Typography>
      ),
    },
    {
      id: "actions",
      label: "ACTION",
      width: "8%",
      minWidth: 80,
      align: "center",
      render: (purohit) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
          }}
        >
          <IconButton
            component={NextLink}
            href={`/admin/purohits/${purohit.id}`}
            title="View Details"
            sx={{
              width: 32,
              height: 32,
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#0ea5e9", bgcolor: "#e0f2fe" },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>

          <IconButton
            component={NextLink}
            href={`/admin/purohits/edit/${purohit.id}`}
            title="Edit Profile"
            sx={{
              width: 32,
              height: 32,
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#0ea5e9", bgcolor: "#e0f2fe" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Purohits"
        subtitle="Verify profiles, view documents, and manage approval status"
        searchPlaceholder="Search by name, email or phone..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Add Purohit"
        actionButtonHref="/admin/purohits/add"
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable
        columns={columns}
        data={purohits}
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
        keyExtractor={(purohit) => purohit.id}
        emptyMessage="No purohits found matching your criteria."
      />

      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Change Verification Status"
        itemName={statusChangeTarget?.purohit?.name}
        newStatus={statusChangeTarget?.newStatus}
        customMessage={
          statusChangeTarget?.newStatus === "Rejected" ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
              <Typography sx={{ color: "#475569", fontFamily: FONTS.OUTFIT }}>
                Please provide a rejection reason for <strong>{statusChangeTarget?.purohit?.name}</strong>:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Rejection Reason *"
                placeholder="e.g. Invalid documents uploaded"
                variant="outlined"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Box>
          ) : undefined
        }
        onClose={() => {
          setStatusChangeTarget(null);
          setRejectionReason("");
        }}
        onConfirm={confirmStatusChange}
        loading={isSubmitting}
      />
    </Box>
  );
}
