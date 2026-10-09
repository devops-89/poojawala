"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import { getCustomersListAPI, updateUserStatusAPI } from "@/api/userControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "All", label: "All" },
  { id: "ACTIVE", label: "Active" },
  { id: "BLOCKED", label: "Blocked" },
];

export default function AdminUsersContent() {
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
        const saved = sessionStorage.getItem("admin_users_state");
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
  const [page, setPage] = useState(initialState.page);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialState.status);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "admin_users_state",
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
        const newUrl = queryString ? `/admin/customers?${queryString}` : `/admin/customers`;
        window.history.replaceState(null, "", newUrl);
      }
    }
  }, [statusFilter, page]);

  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSnackbar } = useSnackbarStore();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const backendStatus = statusFilter === "All" ? undefined : statusFilter;
      const response = await getCustomersListAPI(
        page + 1,
        rowsPerPage,
        search,
        backendStatus
      );
      const data = response?.data?.data || response?.data || [];
      const fetchedUsers = Array.isArray(data) ? data : [];
      setUsers(fetchedUsers);

      const backendTotal =
        response?.data?.pagination?.total ||
        response?.data?.total ||
        response?.total ||
        response?.data?.totalItems ||
        fetchedUsers.length;
      setTotalUsers(backendTotal);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, rowsPerPage, search, statusFilter]);

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    setIsSubmitting(true);
    try {
      const res = await updateUserStatusAPI(
        statusChangeTarget.user.userId || statusChangeTarget.user.id,
        statusChangeTarget.newStatus
      );
      if (res.success) {
        showSnackbar(
          `User status updated to ${statusChangeTarget.newStatus} successfully`,
          "success"
        );
        fetchCustomers();
      } else {
        showSnackbar(res.message || "Failed to update user status", "error");
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
      label: "CUSTOMER ID",
      render: (row) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
          }}
        >
          C-{row.userId || row.id}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "CUSTOMER",
      render: (row) => {
        const name =
          `${row.firstName || ""} ${row.lastName || ""}`.trim() ||
          row.username ||
          "Customer";
        return (
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {name}
          </Typography>
        );
      },
    },
    {
      id: "contact",
      label: "CONTACT",
      render: (row) => (
        <Box>
          <Typography
            sx={{
              color: "#1e293b",
              fontWeight: 500,
              fontSize: "0.9rem",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {row.email || "-"}
          </Typography>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "0.85rem",
              fontFamily: FONTS.OUTFIT,
            }}
          >
            {row.phone || row.mobileNumber || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (row) =>
        row.status === "BLOCKED" ? (
          <AdminStatusSelect value="BLOCKED" readOnly />
        ) : (
          <AdminStatusSelect
            value={row.status || "ACTIVE"}
            options={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "BLOCKED", label: "BLOCKED" },
            ]}
            onChange={(newStatus) =>
              setStatusChangeTarget({ user: row, newStatus })
            }
          />
        ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Customer Management"
        searchPlaceholder="Search by name, email, or phone..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(0);
        }}
      />

      <AdminDataTable
        columns={columns}
        data={users}
        isLoading={loading}
        totalCount={totalUsers}
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
        keyExtractor={(user, idx) => user.userId || user.id || idx}
        emptyMessage="No customers found matching your criteria."
      />

      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Confirm Customer Status Change"
        itemName={
          statusChangeTarget?.user?.firstName ||
          statusChangeTarget?.user?.username ||
          "Customer"
        }
        newStatus={statusChangeTarget?.newStatus}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={confirmStatusChange}
        loading={isSubmitting}
      />
    </Box>
  );
}
