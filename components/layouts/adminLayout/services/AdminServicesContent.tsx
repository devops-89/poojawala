"use client";

import {
  deleteServiceAPI,
  getServicesAPI,
  updateServiceStatusAPI,
} from "@/api/serviceControllers";
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
import Image from "next/image";
import NextLink from "next/link";
import { useCallback, useEffect, useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

const STATUS_TABS = [
  { id: "All Status", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Inactive", label: "Inactive" },
];

export default function AdminServicesContent() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const { showSnackbar } = useSnackbarStore();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const isActiveParam =
        statusFilter === "Active"
          ? true
          : statusFilter === "Inactive"
            ? false
            : undefined;
      const res = await getServicesAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        undefined,
        undefined,
        undefined,
        isActiveParam
      );
      if (res.success && res.data?.data) {
        setServices(res.data.data);
        setTotalCount(res.data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchServices]);

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    try {
      const res = await updateServiceStatusAPI(
        statusChangeTarget.service.id,
        statusChangeTarget.isActive
      );
      if (res.success) {
        showSnackbar("Status updated successfully", "success");
        setServices(
          services.map((s) =>
            s.id === statusChangeTarget.service.id
              ? { ...s, isActive: statusChangeTarget.isActive }
              : s
          )
        );
      } else {
        showSnackbar(res.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Error updating status", "error");
    }
    setStatusChangeTarget(null);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        const res = await deleteServiceAPI(deleteTarget);
        if (res.success) {
          showSnackbar("Service deleted successfully", "success");
          setServices(services.filter((s) => s.id !== deleteTarget));
        } else {
          showSnackbar(res.message || "Failed to delete service", "error");
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || "Error deleting service",
          "error"
        );
      }
    }
    setDeleteTarget(null);
  };

  const columns: Column<any>[] = [
    {
      id: "details",
      label: "SERVICE DETAILS",
      render: (service) => {
        const title = service.name || "Untitled Service";
        const catName =
          service.category?.name ||
          (typeof service.category === "string" ? service.category : "Puja");
        const imageSrc =
          service.iconDownloadurl ||
          service.iconDownloadUrl ||
          service.iconUrl ||
          service.image ||
          service.imageUrl ||
          PLACEHOLDER;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "8px",
                overflow: "hidden",
                bgcolor: "#f1f5f9",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Image
                src={imageSrc}
                alt={title}
                fill
                sizes="48px"
                style={{ objectFit: "cover" }}
                unoptimized
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#1e293b",
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                Category: {catName}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: "price",
      label: "PRICE",
      render: (service) => (
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#1e293b",
          }}
        >
          ₹{service.minPrice ?? 0} - ₹{service.maxPrice ?? 0}
        </Typography>
      ),
    },
    {
      id: "bookings",
      label: "BOOKINGS",
      render: (service) => (
        <Typography
          sx={{
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          {service.totalBookings || service._count?.bookings || 0} Bookings
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (service) => {
        const isAct = service.isActive ?? true;
        return (
          <AdminStatusSelect
            value={isAct ? "Active" : "Inactive"}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
            onChange={(val) =>
              setStatusChangeTarget({
                service,
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
      render: (service) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton
            component={NextLink}
            href={`/admin/services/${service.id}`}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#0ea5e9", bgcolor: "#e0f2fe" },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={NextLink}
            href={`/admin/services/edit/${service.id}`}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#FF6200", bgcolor: "#FFF0E6" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setDeleteTarget(service.id)}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <AdminPageHeader
        title="Services"
        subtitle="Manage categories and services"
        searchPlaceholder="Search services..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Create Service"
        actionButtonHref="/admin/services/add"
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable
        columns={columns}
        data={services}
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
        keyExtractor={(service) => service.id}
        emptyMessage="No services found matching your criteria."
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Service Deletion"
        itemName={services.find((s) => s.id === deleteTarget)?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Change Service Status"
        itemName={statusChangeTarget?.service?.name}
        newStatus={statusChangeTarget?.isActive ? "Active" : "Inactive"}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={confirmStatusChange}
      />
    </Box>
  );
}
