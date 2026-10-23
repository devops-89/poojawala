"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import AdminStatusSelect from "../../common/AdminStatusSelect";
import AdminTableActionMenu from "../../common/AdminTableActionMenu";

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
          component={NextLink}
          href={`/admin/products/${product.id}`}
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            color: "#1e293b",
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
          }}
        >
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
                onClick: () => onDeleteClick(product.id),
                color: "#ef4444",
              },
            ]}
          />
        </Box>
      </TableCell>
    </TableRow>
  );
}
