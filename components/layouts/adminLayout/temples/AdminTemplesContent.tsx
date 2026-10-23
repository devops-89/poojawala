"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import {
  deleteTempleAPI,
  getTemplesAPI,
  updateTempleStatusAPI,
} from "@/api/templeControllers";
import AdminDataTable, {
  Column,
} from "@/components/layouts/adminLayout/common/AdminDataTable";
import AdminPageHeader from "@/components/layouts/adminLayout/common/AdminPageHeader";
import AdminStatusSelect from "@/components/layouts/adminLayout/common/AdminStatusSelect";
import ConfirmDeleteDialog from "@/components/widgets/ConfirmDeleteDialog";
import ConfirmStatusDialog from "@/components/widgets/ConfirmStatusDialog";
import { useSnackbarStore } from "@/stores/snackbarStore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import { ITemple } from "@/utils/types";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

const STATUS_TABS = [
  { id: "All Status", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Inactive", label: "Inactive" },
];

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminTemplesContent() {
  const initialPagination = getTablePaginationState("admin_temples_state", {
    defaultStatus: "All Status",
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);

  const [temples, setTemples] = useState<ITemple[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(null);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const { showSnackbar } = useSnackbarStore();

  const fetchTemples = useCallback(async () => {
    try {
      setLoading(true);
      const isActiveParam =
        statusFilter === "Active"
          ? true
          : statusFilter === "Inactive"
            ? false
            : undefined;
      const res = await getTemplesAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        isActiveParam
      );
      if (res.success && res.data) {
        const templeList = Array.isArray(res.data) ? res.data : res.data.data || [];
        setTemples(templeList);
        setTotalCount(res.pagination?.total || templeList.length);
      } else {
        setTemples([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error("Failed to fetch temples", err);
      showSnackbar("Error loading temples", "error");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter, showSnackbar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemples();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchTemples]);

  useEffect(() => {
    syncTablePagination(
      "admin_temples_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All Status", defaultLimit: 10 }
    );
  }, [page, rowsPerPage, statusFilter]);

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    try {
      const res = await updateTempleStatusAPI(
        statusChangeTarget.temple.id,
        statusChangeTarget.isActive
      );
      if (res.success) {
        showSnackbar("Temple status updated successfully", "success");
        setTemples(
          temples.map((t) =>
            t.id === statusChangeTarget.temple.id
              ? { ...t, isActive: statusChangeTarget.isActive }
              : t
          )
        );
      } else {
        showSnackbar(res.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Error updating temple status", "error");
    }
    setStatusChangeTarget(null);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        const res = await deleteTempleAPI(deleteTarget);
        if (res.success) {
          showSnackbar("Temple deleted successfully", "success");
          setTemples(temples.filter((t) => t.id !== deleteTarget));
          setTotalCount((prev) => Math.max(0, prev - 1));
        } else {
          showSnackbar(res.message || "Failed to delete temple", "error");
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || "Error deleting temple",
          "error"
        );
      }
    }
    setDeleteTarget(null);
  };

  const columns: Column<ITemple>[] = [
    {
      id: "id",
      label: "ID",
      render: (temple: ITemple) => (
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          T-{temple.id}
        </Typography>
      ),
    },
    {
      id: "name",
      label: "NAME",
      render: (temple: ITemple) => (
        <Typography
          component={NextLink}
          href={`/admin/temples/${temple.id}`}
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#1e293b",
            textDecoration: "none",
            "&:hover": {
              color: COLORS.PRIMARY,
            },
          }}
        >
          {temple.name || "Untitled Temple"}
        </Typography>
      ),
    },
    {
      id: "city",
      label: "LOCATION",
      render: (temple: ITemple) => (
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#475569",
          }}
        >
          {temple.city || "N/A"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (temple: ITemple) => {
        const isAct = temple.isActive ?? true;
        return (
          <AdminStatusSelect
            value={isAct ? "Active" : "Inactive"}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
            onChange={(val) =>
              setStatusChangeTarget({
                temple,
                isActive: val === "Active",
              })
            }
          />
        );
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "right",
      render: (temple: ITemple) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                href: `/admin/temples/${temple.id}`,
              },
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                href: `/admin/temples/edit/${temple.id}`,
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setDeleteTarget(temple.id),
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
        title="Temples"
        subtitle="Manage temples, locations, and details"
        searchPlaceholder="Search temples by name or city..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Add Temple"
        actionButtonHref="/admin/temples/add"
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable<ITemple>
        columns={columns}
        data={temples}
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
        keyExtractor={(temple: ITemple) => temple.id}
        emptyMessage="No temples found matching your criteria."
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Temple Deletion"
        itemName={temples.find((t) => t.id === deleteTarget)?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      {/* Status Change Confirmation Dialog */}
      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Change Temple Status"
        itemName={statusChangeTarget?.temple?.name}
        newStatus={statusChangeTarget?.isActive ? "Active" : "Inactive"}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={confirmStatusChange}
      />
    </Box>
  );
}
