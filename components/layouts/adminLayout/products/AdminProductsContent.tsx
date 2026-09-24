"use client";

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
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import NextLink from "next/link";
import { useCallback, useEffect, useState } from "react";

const STATUS_TABS = [
  { id: "All", label: "All Products" },
  { id: "Available", label: "Available" },
  { id: "Unavailable", label: "Unavailable" },
];

export default function AdminProductsContent() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

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
        setProducts((prev) =>
          prev.map((p) =>
            p.id === statusChangeTarget.product.id
              ? { ...p, isActive: statusChangeTarget.isActive }
              : p,
          ),
        );
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
            color: "#FF6200",
            fontFamily: "var(--font-outfit), sans-serif",
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
      render: (product) => {
        const imageSrc =
          product.productImage ||
          product.imageUrl ||
          product.image ||
          "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=100&q=80";
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={imageSrc}
              variant="rounded"
              sx={{
                width: 44,
                height: 44,
                borderRadius: "8px",
                bgcolor: "#fff7ed",
              }}
            />
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "0.95rem",
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontSize: "0.8rem",
                }}
              >
                {product.category?.name || "Samagri Product"}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      id: "price",
      label: "PRICE",
      render: (product) => (
        <Typography
          sx={{
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: "var(--font-outfit), sans-serif",
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
            fontFamily: "var(--font-outfit), sans-serif",
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          {product.stockQuantity ?? product.quantity ?? 1}{" "}
          {product.unit || "item"}
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
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          <IconButton
            component={NextLink}
            href={`/admin/products/${product.id}`}
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
            href={`/admin/products/edit/${product.id}`}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#FF6200", bgcolor: "#FFF0E6" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => setDeleteTarget(product.id)}
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
