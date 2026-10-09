"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import AdminStatusSelect from "../../common/AdminStatusSelect";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React from "react";

interface ProductTableRowProps {
  product: any;
  onStatusSelect: (target: { product: any; isActive: boolean }) => void;
  onDeleteClick: (id: number | string) => void;
}

export default function ProductTableRow({
  product,
  onStatusSelect,
  onDeleteClick,
}: ProductTableRowProps) {
  const price = product.price ?? product.minPrice ?? 0;
  const pricingUnit = product.pricingUnit || "N/A";
  const isActive = product.isActive !== false;

  return (
    <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      {/* Product ID (P-id) */}
      <TableCell>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: COLORS.PRIMARY,
            fontSize: "0.9rem",
          }}
        >
          P-{product.id}
        </Typography>
      </TableCell>

      {/* Name */}
      <TableCell>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
            fontSize: "0.95rem",
          }}
        >
          {product.name || "Untitled Product"}
        </Typography>
      </TableCell>

      {/* Price */}
      <TableCell>
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
            fontSize: "0.95rem",
          }}
        >
          ₹{price}
        </Typography>
      </TableCell>

      {/* Quantity & Unit */}
      <TableCell>
        <Chip
          label={`${product.quantity ?? 1} ${pricingUnit}`}
          size="small"
          sx={{
            bgcolor: "#f1f5f9",
            color: "#334155",
            fontWeight: 700,
            fontFamily: FONTS.OUTFIT,
            borderRadius: "6px",
            px: 0.5,
          }}
        />
      </TableCell>

      {/* Status Dropdown */}
      <TableCell>
        <AdminStatusSelect
          value={isActive ? "AVAILABLE" : "UNAVAILABLE"}
          options={[
            { value: "AVAILABLE", label: "Available" },
            { value: "UNAVAILABLE", label: "Unavailable" },
          ]}
          onChange={(val) =>
            onStatusSelect({
              product,
              isActive: val === "AVAILABLE",
            })
          }
        />
      </TableCell>

      {/* Actions */}
      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <IconButton
            component={NextLink}
            href={`/admin/products/${product.id}`}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#0ea5e9", bgcolor: "#e0f2fe" },
            }}
            title="View Product"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            component={NextLink}
            href={`/admin/products/edit/${product.id}`}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: COLORS.PRIMARY, bgcolor: "#FFF0E6" },
            }}
            title="Edit Product"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => onDeleteClick(product.id)}
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "#64748b",
              bgcolor: "#f8fafc",
              "&:hover": { color: "#ef4444", bgcolor: "#fee2e2" },
            }}
            title="Delete Product"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}
