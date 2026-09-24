"use client";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

export interface OrderItemsTableProps {
  itemsList: any[];
}

export default function OrderItemsTable({ itemsList }: OrderItemsTableProps) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 3,
          pb: 2,
          borderBottom: "1px dashed #e2e8f0",
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            backgroundColor: "#f0fdf4",
            display: "flex",
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 24, color: "#059669" }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            fontFamily: "var(--font-outfit), sans-serif",
          }}
        >
          Ordered Items ({itemsList.length})
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #f1f5f9", borderRadius: 3 }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#475569",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Product
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: "#475569",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Unit Price
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  color: "#475569",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Quantity
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: "#475569",
                  fontFamily: "var(--font-outfit), sans-serif",
                }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsList.map((item: any, idx: number) => {
              const title =
                item.productNameSnapshot ||
                item.product?.name ||
                item.name ||
                "Puja Product";

              const image =
                item.productImageSnapshot ||
                item.product?.imageUrl ||
                item.image ||
                "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=400&q=80";

              const price = Number(
                item.unitPriceSnapshot ||
                  item.product?.price ||
                  item.price ||
                  0
              );
              const qty = Number(item.quantity || 1);
              const total = Number(item.totalAmount || price * qty);
              const description = item.product?.description;

              return (
                <TableRow key={item.id || idx}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Avatar
                        src={image}
                        variant="rounded"
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: "#fff7ed",
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#0f172a",
                            fontFamily: "var(--font-outfit), sans-serif",
                          }}
                        >
                          {title}
                        </Typography>
                        {description && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#64748b",
                              fontFamily: "var(--font-outfit), sans-serif",
                              fontSize: "0.8rem",
                              maxWidth: 400,
                            }}
                          >
                            {description}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#94a3b8",
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontSize: "0.75rem",
                            mt: 0.25,
                          }}
                        >
                          Product ID: #{item.productId || item.product?.id || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#334155",
                        fontFamily: "var(--font-outfit), sans-serif",
                      }}
                    >
                      ₹{price.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={qty}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: "#f1f5f9",
                        color: "#0f172a",
                        fontFamily: "var(--font-outfit), sans-serif",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#FF6200",
                        fontFamily: "var(--font-outfit), sans-serif",
                      }}
                    >
                      ₹{total.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
