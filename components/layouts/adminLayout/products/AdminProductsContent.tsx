"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import {
  deleteProductAPI,
  getAllProductsAPI,
  updateProductStatusAPI,
} from "@/api/productControllers";
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
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AdminTableActionMenu from "../common/AdminTableActionMenu";

const STATUS_TABS = [
  { id: "All", label: "All Products" },
  { id: "Available", label: "Available" },
  { id: "Unavailable", label: "Unavailable" },
];

import {
  getTablePaginationState,
  syncTablePagination,
} from "@/utils/paginationHelper";

export default function AdminProductsContent() {
  const initialPagination = getTablePaginationState("admin_products_state", {
    defaultStatus: "All",
    defaultLimit: 10,
  });

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialPagination.status);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPagination.page);
  const [rowsPerPage, setRowsPerPage] = useState(initialPagination.rowsPerPage);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    syncTablePagination(
      "admin_products_state",
      { page, rowsPerPage, status: statusFilter },
      { defaultStatus: "All", defaultLimit: 10 }
    );
  }, [statusFilter, page, rowsPerPage]);

  const [statusChangeTarget, setStatusChangeTarget] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | string | null>(
    null,
  );
  const { showSnackbar } = useSnackbarStore();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      let isActiveParam: boolean | undefined = undefined;
      if (statusFilter === "Available") isActiveParam = true;
      if (statusFilter === "Unavailable") isActiveParam = false;

      const res = await getAllProductsAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        undefined,
        isActiveParam,
      );

      let rawList: any[] = [];
      let total = 0;

      if (res) {
        if (Array.isArray(res)) {
          rawList = res;
          total = res.length;
        } else if (res.data) {
          if (Array.isArray(res.data)) {
            rawList = res.data;
            total = res.pagination?.total || res.total || res.data.length;
          } else if (res.data.data && Array.isArray(res.data.data)) {
            rawList = res.data.data;
            total =
              res.data.total ||
              res.data.pagination?.total ||
              res.data.data.length;
          }
        }
      }

      setProducts(rawList);
      setTotalCount(total || rawList.length);
    } catch (err: any) {
      console.error("Failed to fetch products", err);
      showSnackbar(
        err?.response?.data?.message || "Failed to fetch products",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchValue, statusFilter, showSnackbar]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleStatusChangeConfirm = async () => {
    if (!statusChangeTarget) return;
    try {
      const res = await updateProductStatusAPI(
        statusChangeTarget.product.id,
        statusChangeTarget.isActive,
      );
      if (res?.success !== false) {
        showSnackbar("Product status updated successfully", "success");
        if (
          (statusFilter === "Available" && !statusChangeTarget.isActive) ||
          (statusFilter === "Unavailable" && statusChangeTarget.isActive)
        ) {
          setProducts((prev) =>
            prev.filter((p) => p.id !== statusChangeTarget.product.id)
          );
          setTotalCount((prev) => Math.max(0, prev - 1));
          fetchProducts();
        } else {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === statusChangeTarget.product.id
                ? { ...p, isActive: statusChangeTarget.isActive }
                : p,
            ),
          );
        }
      } else {
        showSnackbar(
          res?.message || "Failed to update product status",
          "error",
        );
      }
    } catch (error: any) {
      showSnackbar("Error updating product status", "error");
    } finally {
      setStatusChangeTarget(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteProductAPI(deleteTarget);
      if (res?.success !== false) {
        showSnackbar("Product deleted successfully", "success");
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
        setTotalCount((prev) => Math.max(0, prev - 1));
        fetchProducts();
      } else {
        showSnackbar(res?.message || "Failed to delete product", "error");
      }
    } catch (error: any) {
      showSnackbar("Error deleting product", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns: Column<any>[] = [
    {
      id: "id",
      label: "ID",
      render: (product) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.85rem",
          }}
        >
          P-{product.id}
        </Typography>
      ),
    },
    {
      id: "product",
      label: "PRODUCT",
      render: (product) => (
        <Typography
          component={NextLink}
          href={`/admin/products/${product.id}`}
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: FONTS.OUTFIT,
            fontSize: "0.95rem",
            textDecoration: "none",
            "&:hover": {
              color: COLORS.PRIMARY,
              textDecoration: "underline",
            },
          }}
        >
          {product.name || "Untitled Product"}
        </Typography>
      ),
    },
    {
      id: "price",
      label: "PRICE",
      render: (product) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          ₹{product.price}
        </Typography>
      ),
    },
    {
      id: "stock",
      label: "QUANTITY & UNIT",
      render: (product) => (
        <Typography
          sx={{
            color: "#475569",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          {product.stockQuantity ?? product.quantity ?? 0}{" "}
          {product.pricingUnit || product.unit || "Unit"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "STATUS",
      render: (product) => {
        const isAct = product.isActive !== false;
        return (
          <AdminStatusSelect
            value={isAct ? "Available" : "Unavailable"}
            options={[
              { value: "Available", label: "Available" },
              { value: "Unavailable", label: "Unavailable" },
            ]}
            onChange={(val) =>
              setStatusChangeTarget({
                product,
                isActive: val === "Available",
              })
            }
          />
        );
      },
    },
    {
      id: "actions",
      label: "ACTIONS",
      align: "center",
      render: (product) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <AdminTableActionMenu
            actions={[
              {
                label: "View Details",
                icon: <VisibilityIcon fontSize="small" />,
                href: `/admin/products/${product.id}`,
              },
              {
                label: "Edit",
                icon: <EditIcon fontSize="small" />,
                href: `/admin/products/edit/${product.id}`,
              },
              {
                label: "Delete",
                icon: <DeleteIcon fontSize="small" />,
                onClick: () => setDeleteTarget(product.id),
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
        title="Product Catalog"
        subtitle="Manage sacred items, pooja samagri, and product inventory"
        searchPlaceholder="Search products..."
        searchValue={searchValue}
        onSearchChange={(val) => {
          setSearchValue(val);
          setPage(0);
        }}
        actionButtonText="Add Product"
        actionButtonHref="/admin/products/add"
        actionButtonIcon={<AddIcon />}
      />

      <AdminDataTable
        columns={columns}
        data={products}
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
        keyExtractor={(product) => product.id}
        emptyMessage="No products found matching your criteria."
      />

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title="Confirm Product Deletion"
        itemName={products.find((p) => p.id === deleteTarget)?.name}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmStatusDialog
        open={Boolean(statusChangeTarget)}
        title="Change Product Availability"
        itemName={statusChangeTarget?.product?.name}
        newStatus={statusChangeTarget?.isActive ? "Available" : "Unavailable"}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={handleStatusChangeConfirm}
      />
    </Box>
  );
}
