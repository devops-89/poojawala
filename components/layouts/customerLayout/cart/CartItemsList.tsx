"use client";
import React from "react";
import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { CartItem } from "@/stores/cartStore";

interface CartItemsListProps {
  items: CartItem[];
  totalItemsCount: number;
  onQuantityChange: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string, title: string) => void;
  onPromptClearCart: () => void;
}

export default function CartItemsList({
  items,
  totalItemsCount,
  onQuantityChange,
  onRemoveItem,
  onPromptClearCart,
}: CartItemsListProps) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "1.2px",
            color: "#2C1810",
            textTransform: "uppercase",
          }}
        >
          YOUR ITEMS ({totalItemsCount})
        </Typography>

        <Button
          size="small"
          onClick={onPromptClearCart}
          startIcon={<DeleteOutlinedIcon fontSize="small" />}
          sx={{
            color: "#8C7A70",
            fontSize: "13px",
            fontFamily: '"DM Sans", sans-serif',
            textTransform: "none",
            "&:hover": { color: "#d32f2f", bgcolor: "transparent" },
          }}
        >
          Clear Cart
        </Button>
      </Box>

      {/* Items Array */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {items.map((item) => {
          const itemTotal = item.price * item.quantity;

          return (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: "white",
                border: "1px solid #EADCCF",
                borderRadius: "20px",
                display: "flex",
                gap: { xs: 2, sm: 3 },
                alignItems: "center",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(44, 24, 16, 0.06)",
                  borderColor: "#D9C3B0",
                },
              }}
            >
              {/* Image Thumbnail */}
              <Box
                sx={{
                  width: { xs: 75, sm: 95 },
                  height: { xs: 75, sm: 95 },
                  borderRadius: "14px",
                  bgcolor: "#FAF4EE",
                  overflow: "hidden",
                  flexShrink: 0,
                  position: "relative",
                  border: "1px solid #F0E2D6",
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Product Content Details */}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontWeight: 700,
                    color: "#2C1810",
                    fontSize: { xs: "16px", sm: "18px" },
                    lineHeight: 1.25,
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#64534A",
                    fontSize: "13px",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.description ||
                    "Handcrafted sacred item for authentic pooja ceremonies."}
                </Typography>

                {/* Quantity Controls & Remove */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      bgcolor: "#FAF4EE",
                      border: "1px solid #EADCCF",
                      borderRadius: "10px",
                      px: 0.8,
                      py: 0.4,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity - 1)
                      }
                      sx={{
                        p: 0.4,
                        color: "#64534A",
                        "&:hover": { bgcolor: "#EADCCF" },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>

                    <Typography
                      sx={{
                        px: 1.5,
                        fontWeight: 800,
                        fontSize: "14px",
                        color: "#2C1810",
                        fontFamily: '"DM Sans", sans-serif',
                        minWidth: 24,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={() =>
                        onQuantityChange(item.id, item.quantity + 1)
                      }
                      sx={{
                        p: 0.4,
                        color: "#FF6200",
                        "&:hover": { bgcolor: "#FFF0E6" },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(item.id, item.title)}
                    sx={{
                      color: "#8C7A70",
                      p: 0.8,
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#d32f2f",
                        bgcolor: "#FFEEEB",
                      },
                    }}
                    title="Remove Item"
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Right Price Column */}
              <Box
                sx={{
                  textAlign: "right",
                  flexShrink: 0,
                  alignSelf: "flex-start",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontWeight: 800,
                    color: "#2C1810",
                    fontSize: { xs: "20px", sm: "24px" },
                    lineHeight: 1.2,
                  }}
                >
                  ₹{itemTotal.toLocaleString("en-IN")}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#8C7A70",
                    fontSize: "12px",
                    mt: 0.5,
                  }}
                >
                  {(() => {
                    const price = item.price;
                    const pUnit = (item.pricingUnit || item.unitString || "").trim();
                    let qtyVal = item.unitQuantity || item.packQuantity;
                    if (!qtyVal) {
                      const upperUnit = pUnit.toUpperCase();
                      if (upperUnit === "GRAM" || upperUnit === "GM" || upperUnit === "G") {
                        qtyVal = 500;
                      } else {
                        qtyVal = 1;
                      }
                    }
                    const cleanUnit = pUnit ? pUnit.toUpperCase() : "PIECE";
                    return `₹${price} per ${qtyVal} ${cleanUnit}`;
                  })()}
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
