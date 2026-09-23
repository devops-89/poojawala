"use client";

import {
  deleteProductAPI,
  getAllProductsAPI,
  updateProductStatusAPI,
} from "@/api/productControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ProductDeleteDialog from "./widgets/ProductDeleteDialog";
import ProductFilterHeader from "./widgets/ProductFilterHeader";
import ProductsHeader from "./widgets/ProductsHeader";
import ProductStatusDialog from "./widgets/ProductStatusDialog";
import ProductTableRow from "./widgets/ProductTableRow";

export default function AdminProductsContent() {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
      setErrorMsg(null);

      let isActiveParam: boolean | undefined = undefined;
      if (statusFilter === "Available") isActiveParam = true;
      if (statusFilter === "Unavailable") isActiveParam = false;

      const res = await getAllProductsAPI(
        page + 1,
        rowsPerPage,
        searchValue,
        undefined,
        isActiveParam
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
          } else if (res.data.products && Array.isArray(res.data.products)) {
            rawList = res.data.products;
            total =
              res.data.total ||
              res.data.pagination?.total ||
              res.data.products.length;
          }
        }
      }

      setProducts(rawList);
      setTotalCount(total || rawList.length);
    } catch (err: any) {
      console.error("Failed to fetch products", err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch products list";
      setErrorMsg(apiMessage);
      showSnackbar(apiMessage, "error");
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

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      console.error(error);
      showSnackbar(
        error?.response?.data?.message || "Error updating product status",
        "error",
      );
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
      console.error(error);
      showSnackbar(
        error?.response?.data?.message || "Error deleting product",
        "error",
      );
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredProducts = products.filter((item) => {
    if (statusFilter === "Available" && item.isActive === false) return false;
    if (statusFilter === "Unavailable" && item.isActive !== false) return false;
    if (searchValue.trim() && item.name) {
      return item.name.toLowerCase().includes(searchValue.toLowerCase().trim());
    }
    return true;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* Header */}
      <ProductsHeader />

      {/* Table Container */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          overflow: "hidden",
          bgcolor: "white",
        }}
      >
        {/* Filters & Search Header */}
        <ProductFilterHeader
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />

        {/* Products Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.85rem",
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.85rem",
                  }}
                >
                  Product
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.85rem",
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.85rem",
                  }}
                >
                  Quantity & Unit
                </TableCell>
                <TableCell
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.85rem",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 700,
                    color: "#475569",
                    fontSize: "0.85rem",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <CircularProgress sx={{ color: "#FF6200" }} size={36} />
                      <Typography
                        sx={{
                          color: "#64748b",
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        Loading products data...
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : errorMsg ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                        maxWidth: 500,
                        mx: "auto",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#ef4444",
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        Error Fetching Products
                      </Typography>
                      <Typography
                        sx={{
                          color: "#64748b",
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "0.9rem",
                          textAlign: "center",
                          bgcolor: "#fef2f2",
                          p: 2,
                          borderRadius: "8px",
                          border: "1px solid #fee2e2",
                        }}
                      >
                        {errorMsg}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={fetchProducts}
                        sx={{
                          mt: 1,
                          borderColor: "#FF6200",
                          color: "#FF6200",
                          borderRadius: "8px",
                          fontWeight: 600,
                        }}
                      >
                        Try Refreshing
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <ShoppingBagIcon
                        sx={{ fontSize: 48, color: "#cbd5e1" }}
                      />
                      <Typography
                        sx={{
                          color: "#334155",
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        No Products Found
                      </Typography>
                      <Typography
                        sx={{
                          color: "#64748b",
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontSize: "0.9rem",
                        }}
                      >
                        No product matching your criteria was found.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product: any, idx: number) => (
                  <ProductTableRow
                    key={`product-row-${product.id || idx}`}
                    product={product}
                    onStatusSelect={setStatusChangeTarget}
                    onDeleteClick={setDeleteTarget}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid #e2e8f0",
            fontFamily: "var(--font-outfit), sans-serif",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                fontFamily: "var(--font-outfit), sans-serif",
                color: "#64748b",
              },
          }}
        />
      </Paper>

      {/* Status Change Confirmation Dialog */}
      <ProductStatusDialog
        target={statusChangeTarget}
        onClose={() => setStatusChangeTarget(null)}
        onConfirm={handleStatusChangeConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <ProductDeleteDialog
        targetId={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
