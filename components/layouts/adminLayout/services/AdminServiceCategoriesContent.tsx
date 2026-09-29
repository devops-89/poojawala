"use client";

import {
  deleteServiceCategoryAPI,
  getServiceCategoriesAPI,
  getServiceCategoryByIdAPI,
  updateServiceCategoryAPI,
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
import CategoryIcon from "@mui/icons-material/Category";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import CategoryModal, { CategoryModalMode } from "./categories/CategoryModal";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='8' fill='%23e2e8f0'/%3E%3Cpath d='M16 30 Q24 18 32 30' stroke='%2394a3b8' stroke-width='2' fill='none'/%3E%3Ccircle cx='20' cy='22' r='3' fill='%2394a3b8'/%3E%3C/svg%3E";

const STATUS_TABS = [
  { id: "All Status", label: "All" },
  { id: "Active", label: "Active" },
  { id: "Inactive", label: "Inactive" },
];

export default function AdminServiceCategoriesContent() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);

  // Reusable Single Modal state
  const [modalState, setModalState] = useState<{
    open: boolean;
    mode: CategoryModalMode;
    category?: any;
    loading?: boolean;
  }>({
    open: false,
    mode: "add",
    category: null,
    loading: false,
  });

  const { showSnackbar } = useSnackbarStore();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const isActiveParam =
        statusFilter === "Active"
          ? true
          : statusFilter === "Inactive"
            ? false
            : undefined;

      const res = await getServiceCategoriesAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        isActiveParam,
      );
      let catList: any[] = [];
      let count = 0;

      if (res) {
        if (Array.isArray(res)) {
          catList = res;
          count = res.length;
        } else if (res.data) {
          if (Array.isArray(res.data.data)) {
            catList = res.data.data;
            count = res.data.pagination?.total || res.data.data.length;
          } else if (Array.isArray(res.data)) {
            catList = res.data;
            count = res.pagination?.total || res.data.length;
          } else if (Array.isArray(res.data.categories)) {
            catList = res.data.categories;
            count = res.data.pagination?.total || res.data.categories.length;
          }
        } else if (res.categories && Array.isArray(res.categories)) {
          catList = res.categories;
          count = res.categories.length;
        }
      }

      setCategories(catList);
      setTotalCount(count || catList.length);
    } catch (err) {
      console.error("Failed to fetch service categories", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  const handleOpenAddModal = () => {
    setModalState({ open: true, mode: "add", category: null });
  };

  const handleOpenEditModal = (category: any) => {
    setModalState({ open: true, mode: "edit", category });
  };

  const handleOpenViewModal = async (category: any) => {
    setModalState({ open: true, mode: "view", category, loading: true });
    try {
      const targetId = category.id || category._id;
      const res = await getServiceCategoryByIdAPI(targetId);
      const catObj = res?.data?.data || res?.data || res;
      if (catObj && (catObj.id || catObj.name)) {
        setModalState({ open: true, mode: "view", category: catObj, loading: false });
      } else {
        setModalState({ open: true, mode: "view", category, loading: false });
      }
    } catch (err) {
      console.error("Error fetching category by id", err);
      setModalState({ open: true, mode: "view", category, loading: false });
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  const confirmStatusChange = async () => {
    if (!statusChangeTarget) return;
    try {
      const targetId =
        statusChangeTarget.category.id || statusChangeTarget.category._id;
      const res = await updateServiceCategoryAPI(targetId, {
        isActive: statusChangeTarget.isActive,
      });
      if (res?.success || res?.status === "success" || res) {
        showSnackbar("Category status updated successfully", "success");
        setCategories(
          categories.map((c) => {
            const cId = c.id || c._id;
            return cId === targetId
              ? { ...c, isActive: statusChangeTarget.isActive }
              : c;
          }),
        );
      } else {
        showSnackbar(res?.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Error updating status", "error");
    }
    setStatusChangeTarget(null);
  };

  const confirmDelete = async () => {
    if (deleteTarget) {
      const targetId = deleteTarget.id || deleteTarget._id;
      try {
        const res = await deleteServiceCategoryAPI(targetId);
        if (res?.success || res?.status === "success" || res) {
          showSnackbar("Service category deleted successfully", "success");
          setCategories(categories.filter((c) => (c.id || c._id) !== targetId));
        } else {
          showSnackbar(res?.message || "Failed to delete category", "error");
        }
      } catch (error: any) {
        showSnackbar(
          error.response?.data?.message || "Error deleting category",
          "error",
        );
      }
    }
    setDeleteTarget(null);
  };

  const columns: Column<any>[] = [
    {
      id: "categoryId",
      label: "CATEGORY ID",
      render: (category) => {
        const catId = category.id || category._id || "";
        return (
          <Typography
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#FF6200",
              bgcolor: "#FFF0E6",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              display: "inline-block",
            }}
          >
            C-{catId}
          </Typography>
        );
      },
    },
    {
      id: "categoryDetails",
      label: "CATEGORY NAME",
      render: (category) => {
        const title = category.name || category.title || "Untitled Category";
        const imageSrc =
          category.iconDownloadurl ||
          category.iconUrl ||
          category.image ||
          category.imageUrl ||
          PLACEHOLDER;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                overflow: "hidden",
                bgcolor: "#fff0e6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                border: "1px solid #fed7aa",
              }}
            >
              {imageSrc && imageSrc !== PLACEHOLDER ? (
                <Image
                  src={imageSrc}
                  alt={title}
                  fill
                  sizes="44px"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
              ) : (
                <CategoryIcon sx={{ color: "#FF6200" }} />
              )}
            </Box>
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
          </Box>
        );
      },
    },
    {
      id: "status",
      label: "STATUS",
      render: (category) => {
        const isAct = category.isActive ?? true;
        return (
          <AdminStatusSelect
            value={isAct ? "Active" : "Inactive"}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
            onChange={(val) =>
              setStatusChangeTarget({
                category,
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
      render: (category) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <IconButton
            onClick={() => handleOpenViewModal(category)}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#0ea5e9", bgcolor: "#e0f2fe" },
            }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleOpenEditModal(category)}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#FF6200", bgcolor: "#FFF0E6" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setDeleteTarget(category)}
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
        title="Service Categories"
        subtitle="Manage service categories and icons"
        searchPlaceholder="Search categories..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Add Category"
        onActionButtonClick={handleOpenAddModal}
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable
        columns={columns}
        data={categories}
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
        keyExtractor={(category, index) => category.id || category._id || index}
        emptyMessage="No service categories found matching your criteria."
      />

      {/* Unified Reusable Category Modal */}
      <CategoryModal
        open={modalState.open}
        mode={modalState.mode}
        category={modalState.category}
        loading={modalState.loading}
        onClose={closeModal}
        onSuccess={fetchCategories}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Category Deletion"
        itemName={deleteTarget?.name || deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      {/* Confirm Status Dialog */}
      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Change Category Status"
        itemName={
          statusChangeTarget?.category?.name ||
          statusChangeTarget?.category?.title
        }
        newStatus={statusChangeTarget?.isActive ? "Active" : "Inactive"}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={confirmStatusChange}
      />
    </Box>
  );
}
