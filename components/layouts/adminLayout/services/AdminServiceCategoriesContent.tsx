"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Chip, IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import CategoryModal, { CategoryModalMode } from "./categories/CategoryModal";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

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
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "0.9rem",
              color: COLORS.PRIMARY,
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
        return (
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
        );
      },
    },
    {
      id: "categoryType",
      label: "CATEGORY TYPE",
      render: (category) => {
        const type = category.categoryType || "SERVICE";
        const isService = type === "SERVICE";
        return (
          <Chip
            label={type}
            size="small"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "0.75rem",
              bgcolor: isService ? "#e0f2fe" : "#fef3c7",
              color: isService ? "#0369a1" : "#b45309",
              borderRadius: "6px",
            }}
          />
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
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                onClick: () => handleOpenViewModal(category),
              },
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                onClick: () => handleOpenEditModal(category),
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setDeleteTarget(category),
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
        title="Categories"
        subtitle="Manage service and product categories"
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
        emptyMessage="No categories found matching your criteria."
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
