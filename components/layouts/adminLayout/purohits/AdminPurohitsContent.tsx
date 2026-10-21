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
import AdminTableActionMenu from "../common/AdminTableActionMenu";

const STATUS_TABS = [
  { id: "All", label: "All" },
  { id: "Approved", label: "Approved" },
  { id: "Pending Approval", label: "Pending Approval" },
  { id: "Rejected", label: "Rejected" },
];

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminPurohitsContent() {
  const initialPagination = getTablePaginationState("admin_purohits_state", {
    defaultStatus: "All",
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [purohits, setPurohits] = useState<any[]>([]);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    syncTablePagination(
      "admin_purohits_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All", defaultLimit: 10 }
    );
  }, [statusFilter, page, rowsPerPage]);

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
            isAdminCreated: Boolean(
              u.isAdminCreated ??
              u.is_admin_created ??
              u.isadmincreated ??
              profile.isAdminCreated ??
              profile.is_admin_created
            ),
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
      render: (purohit) => {
        const isAdminCreated = Boolean(
          purohit?.isAdminCreated ||
            purohit?.is_admin_created ||
            purohit?.isadmincreated
        );

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdminTableActionMenu
              actions={[
                {
                  label: "View Details",
                  icon: <VisibilityIcon fontSize="small" />,
                  href: `/admin/purohits/${purohit.id}`,
                },
                !isAdminCreated && {
                  label: "Edit Profile",
                  icon: <EditIcon fontSize="small" />,
                  href: `/admin/purohits/edit/${purohit.id}`,
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
