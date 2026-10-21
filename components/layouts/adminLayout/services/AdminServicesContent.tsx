"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
import AdminTableActionMenu from "../common/AdminTableActionMenu";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

const STATUS_TABS = [
  { id: "All Status", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Inactive", label: "Inactive" },
  { id: "Temple", label: "Temple" },
];

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminServicesContent() {
  const initialPagination = getTablePaginationState("admin_services_state", {
    defaultStatus: "All Status",
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const { showSnackbar } = useSnackbarStore();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const isTempleTab = statusFilter === "Temple";
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
        isActiveParam,
        undefined,
        undefined,
        undefined,
        undefined,
        isTempleTab ? true : undefined
      );
      if (res.success && res.data?.data) {
        let list = res.data.data;
        let count = res.data.pagination?.total || list.length;

        if (isTempleTab) {
          list = list.filter((s: any) => Boolean(s.templeId || s.temple));
          count = list.length;
        }

        setServices(list);
        setTotalCount(count);
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

  useEffect(() => {
    syncTablePagination(
      "admin_services_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All Status", defaultLimit: 10 }
    );
  }, [page, rowsPerPage, statusFilter]);

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    try {
      const res = await updateServiceStatusAPI(
        statusChangeTarget.service.id,
        statusChangeTarget.isActive,
      );
      if (res.success) {
        showSnackbar("Status updated successfully", "success");
        setServices(
          services.map((s) =>
            s.id === statusChangeTarget.service.id
              ? { ...s, isActive: statusChangeTarget.isActive }
              : s,
          ),
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
          "error",
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
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#1e293b",
                }}
              >
                {title}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: "price",
      label: "PRICE",
      render: (service) => {
        const minP =
          service.plans?.basic?.price ??
          service.priceWithoutSamagri ??
          service.minPrice;
        const maxP =
          service.plans?.standard?.price ??
          service.priceWithSamagri ??
          service.maxPrice;

        let priceDisplay = "₹0";
        if (minP != null && maxP != null && minP !== maxP) {
          priceDisplay = `₹${minP} - ₹${maxP}`;
        } else if (minP != null) {
          priceDisplay = `₹${minP}`;
        } else if (maxP != null) {
          priceDisplay = `₹${maxP}`;
        }

        return (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#1e293b",
            }}
          >
            {priceDisplay}
          </Typography>
        );
      },
    },
    {
      id: "bookings",
      label: "BOOKINGS",
      render: (service) => (
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
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
      id: "temple",
      label: "TEMPLE",
      render: (service) => {
        const templeObj = service.temple;
        const templeName =
          templeObj?.name ||
          (typeof templeObj === "string" ? templeObj : null) ||
          service.templeName;

        if (templeName) {
          return (
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                fontSize: "0.92rem",
                color: "#1e293b",
              }}
            >
              {templeName}
            </Typography>
          );
        }

        return (
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 500,
              fontSize: "0.85rem",
              color: "#94a3b8",
            }}
          >
            No temple associated
          </Typography>
        );
      },
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
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                href: `/admin/services/${service.id}`,
              },
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                href: `/admin/services/edit/${service.id}`,
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setDeleteTarget(service.id),
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
        emptyMessage={
          statusFilter === "Temple"
            ? "No temple-associated services found."
            : "No services found matching your criteria."
        }
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
