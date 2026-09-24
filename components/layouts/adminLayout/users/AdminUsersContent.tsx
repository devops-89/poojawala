"use client";

import { getCustomersListAPI, updateUserStatusAPI } from "@/api/userControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "All", label: "All" },
  { id: "ACTIVE", label: "Active" },
  { id: "BLOCKED", label: "Blocked" },
];

export default function AdminUsersContent() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
            color: "#FF6200",
            fontFamily: "var(--font-outfit), sans-serif",
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
              fontFamily: "var(--font-outfit), sans-serif",
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
              fontFamily: "var(--font-outfit), sans-serif",
            }}
          >
            {row.email || "-"}
          </Typography>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: "0.85rem",
              fontFamily: "var(--font-outfit), sans-serif",
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
