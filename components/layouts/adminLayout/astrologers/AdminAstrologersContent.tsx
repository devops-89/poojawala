"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams } from "next/navigation";
import {
  getAstrologersAPI,
  updatePurohitVerificationAPI,
} from "@/api/userControllers";
import AdminDataTable from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { formatPhoneNumber } from "@/utils/helpers";
import { parseList } from "./EditAstrologerForm";
import { AstrologyCommissionBanner } from "./AstrologyCommissionBanner";
import { getAstrologerTableColumns } from "./getAstrologerTableColumns";
import { AstrologerStatusDialog } from "./AstrologerStatusDialog";

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

export default function AdminAstrologersContent() {
  const initialPagination = getTablePaginationState("admin_astrologers_state", {
    defaultStatus: "All",
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [platformCommission, setPlatformCommission] = useState<string>("");
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  useEffect(() => {
    syncTablePagination(
      "admin_astrologers_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All", defaultLimit: 10 }
    );
  }, [statusFilter, page, rowsPerPage]);

  const fetchAstrologers = useCallback(async () => {
    try {
      setLoading(true);
      let backendFilterStatus: string | undefined = undefined;
      if (statusFilter === "Approved") backendFilterStatus = "APPROVED";
      else if (statusFilter === "Pending Approval")
        backendFilterStatus = "PENDING";
      else if (statusFilter === "Rejected") backendFilterStatus = "REJECTED";

      const res = await getAstrologersAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        backendFilterStatus
      );
      if (res.success) {
        const usersArray = res.data?.data || [];
        const pagination = res.data?.pagination || {};

        const mapped = usersArray.map((u: any) => {
          const profile = u.astrologerProfile || u.profile || {};
          let uiStatus = "No Profile";
          const verificationStatus =
            profile.verificationStatus || u.verificationStatus || u.status;

          if (
            verificationStatus === "APPROVED" ||
            verificationStatus === "ACTIVE"
          )
            uiStatus = "Approved";
          else if (verificationStatus === "PENDING")
            uiStatus = "Pending Approval";
          else if (verificationStatus === "REJECTED") uiStatus = "Rejected";

          const rawSpecs = profile.specializations || profile.specialization;
          const specializations = parseList(rawSpecs).join(", ") || "-";

          return {
            id: u.id,
            name:
              `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
            email: u.email || "-",
            city: profile.city || "-",
            specializations,
            ratePerMinute: profile.astrologyPrice
              ? `₹${profile.astrologyPrice}`
              : profile.ratePerMinute
              ? `₹${profile.ratePerMinute}`
              : "-",
            commissionPrice: profile.commissionPercentage
              ? `${profile.commissionPercentage}%`
              : u.commissionPercentage
              ? `${u.commissionPercentage}%`
              : profile.commissionPrice
              ? `₹${profile.commissionPrice}`
              : u.commissionPrice
              ? `₹${u.commissionPrice}`
              : platformCommission
              ? `${platformCommission}%`
              : "-",
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
        setAstrologers(mapped);
        setTotalCount(pagination.total || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter, platformCommission]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAstrologers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAstrologers]);

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
        statusChangeTarget.astrologer.id,
        backendStatus,
        reason
      );
      if (res.success) {
        showSnackbar("Astrologer status updated successfully", "success");
        fetchAstrologers();
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

  const columns = useMemo(
    () =>
      getAstrologerTableColumns({
        onStatusChange: (astrologer, newStatus) => {
          setRejectionReason("");
          setStatusChangeTarget({ astrologer, newStatus });
        },
      }),
    []
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AstrologyCommissionBanner
        onCommissionLoaded={(val) => setPlatformCommission(val)}
        onCommissionUpdated={(val) => {
          setPlatformCommission(val);
          fetchAstrologers();
        }}
      />

      <AdminPageHeader
        title="Astrologers"
        subtitle="Manage, verify, and view all registered astrologers for 1Pooja"
        searchPlaceholder="Search astrologers by name, email, phone..."
        searchValue={searchValue}
        onSearchChange={(val: string) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Add Astrologer"
        actionButtonHref="/admin/astrologers/add"
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable
        minWidth={850}
        columns={columns}
        data={astrologers}
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
        keyExtractor={(astrologer) => astrologer.id}
        emptyMessage="No astrologers found matching your criteria."
      />

      <AstrologerStatusDialog
        target={statusChangeTarget}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
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
