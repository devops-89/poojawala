"use client";
import {
  clearCartAPI,
  deleteCartItemAPI,
  updateCartItemQuantityAPI,
} from "@/api/cartControllers";
import { useCartStore } from "@/stores/cartStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerCartDrawer() {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const setCartFromApi = useCartStore((state) => state.setCartFromApi);
  const fetchCartFromApi = useCartStore((state) => state.fetchCartFromApi);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "remove" | "clear";
    itemId?: string;
    itemTitle?: string;
  }>({
    open: false,
    type: "remove",
  });

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      const targetItem = items.find((i) => i.id === itemId);
      setConfirmModal({
        open: true,
        type: "remove",
        itemId,
        itemTitle: targetItem?.title || "this product",
      });
      return;
    }

    updateQuantity(itemId, newQty);
    try {
      const res = await updateCartItemQuantityAPI(itemId, newQty);
      setCartFromApi(res);
      showSnackbar("Cart updated successfully", "success");
    } catch (err) {
      console.error("Failed to update cart item quantity via API:", err);
      fetchCartFromApi();
      showSnackbar("Failed to update cart quantity", "error");
    }
  };

  const promptRemoveItem = (itemId: string, title: string) => {
    setConfirmModal({
      open: true,
      type: "remove",
      itemId,
      itemTitle: title,
    });
  };

  const promptClearCart = () => {
    setConfirmModal({
      open: true,
      type: "clear",
    });
  };

  const handleConfirmAction = async () => {
    const { type, itemId, itemTitle } = confirmModal;
    setConfirmModal({ open: false, type: "remove" });

    if (type === "remove" && itemId) {
      removeItem(itemId);
      try {
        const res = await deleteCartItemAPI(itemId);
        setCartFromApi(res);
        showSnackbar(`Removed "${itemTitle || "product"}" from cart`, "info");
      } catch (err) {
        console.error("Failed to delete cart item via API:", err);
        fetchCartFromApi();
        showSnackbar("Failed to remove product from cart", "error");
      }
    } else if (type === "clear") {
      clearCart();
      try {
        const res = await clearCartAPI();
        setCartFromApi(res);
        showSnackbar("Cart cleared successfully", "info");
      } catch (err) {
        console.error("Failed to clear cart via API:", err);
        fetchCartFromApi();
        showSnackbar("Failed to clear cart", "error");
      }
    }
  };

  useEffect(() => {
    fetchCartFromApi();
  }, [isOpen, fetchCartFromApi]);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleProceedToBooking = () => {
    closeCart();
    router.push("/customer/cart");
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            bgcolor: "#FFFBF7",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-8px 0 30px rgba(44, 24, 16, 0.15)",
          },
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #EADCCF",
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "10px",
              bgcolor: "#F5E6D8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#C84B16",
            }}
          >
            <ShoppingBagOutlinedIcon />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 800,
                color: "#2C1810",
                fontSize: "18px",
                lineHeight: 1.2,
              }}
            >
              Your Pooja Cart
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: "12px",
              }}
            >
              {totalItems} {totalItems === 1 ? "item" : "items"} selected
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={closeCart}
          sx={{
            color: "#64534A",
            "&:hover": { bgcolor: "#FAF4EE", color: "#C84B16" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Cart Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {items.length === 0 ? (
          /* Empty Cart View */
          <Box
            sx={{
              my: "auto",
              py: 8,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                bgcolor: "#FAF4EE",
                border: "1px dashed #C84B16",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C84B16",
                mb: 2.5,
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 44 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 700,
                color: "#2C1810",
                mb: 1,
              }}
            >
              Your cart is empty
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: "14px",
                maxWidth: 260,
                mb: 3,
              }}
            >
              Explore our pooja samagri and ritual items to add them to your
              ceremony booking.
            </Typography>
            <Button
              onClick={handleProceedToBooking}
              variant="contained"
              sx={{
                bgcolor: "#C84B16",
                color: "white",
                borderRadius: "30px",
                px: 3.5,
                py: 1.2,
                fontWeight: 700,
                fontSize: "14px",
                textTransform: "none",
                "&:hover": { bgcolor: "#FF6200" },
              }}
            >
              Browse Pooja Samagri
            </Button>
          </Box>
        ) : (
          /* Cart Items List */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {items.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "#FAF4EE",
                  border: "1px solid #EADCCF",
                  borderRadius: "14px",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Product Thumbnail */}
                <CardMedia
                  component="img"
                  image={item.image}
                  alt={item.title}
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "10px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />

                {/* Item Details */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontWeight: 700,
                      color: "#2C1810",
                      fontSize: "15px",
                      lineHeight: 1.25,
                      mb: 0.5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      color: "#C84B16",
                      fontSize: "14px",
                      mb: 1,
                    }}
                  >
                    ₹{item.price}{" "}
                    <Typography
                      component="span"
                      sx={{
                        fontSize: "12px",
                        color: "#64534A",
                        fontWeight: 500,
                        ml: 0.5,
                      }}
                    >
                      {(() => {
                        const pUnit = (
                          item.pricingUnit ||
                          item.unitString ||
                          ""
                        ).trim();
                        let qtyVal = item.unitQuantity || item.packQuantity;
                        if (!qtyVal) {
                          const upperUnit = pUnit.toUpperCase();
                          if (
                            upperUnit === "GRAM" ||
                            upperUnit === "GM" ||
                            upperUnit === "G"
                          ) {
                            qtyVal = 500;
                          } else {
                            qtyVal = 1;
                          }
                        }
                        const cleanUnit = pUnit ? pUnit.toUpperCase() : "PIECE";
                        return `per ${qtyVal} ${cleanUnit}`;
                      })()}
                    </Typography>
                  </Typography>

                  {/* Quantity Controls */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      bgcolor: "white",
                      border: "1px solid #EADCCF",
                      borderRadius: "8px",
                      px: 0.5,
                      py: 0.2,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      sx={{ p: 0.5, color: "#64534A" }}
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Typography
                      sx={{
                        px: 1.5,
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#2C1810",
                        fontFamily: '"DM Sans", sans-serif',
                      }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      sx={{ p: 0.5, color: "#C84B16" }}
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Right side: Item total & Remove button */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    height: 70,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => promptRemoveItem(item.id, item.title)}
                    sx={{ color: "#A8968D", "&:hover": { color: "#d32f2f" } }}
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>

                  <Typography
                    sx={{
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontWeight: 800,
                      color: "#2C1810",
                      fontSize: "16px",
                    }}
                  >
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              </Paper>
            ))}

            {/* Clear Cart Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                size="small"
                onClick={promptClearCart}
                startIcon={<DeleteOutlinedIcon fontSize="small" />}
                sx={{
                  color: "#9E897D",
                  fontSize: "12px",
                  textTransform: "none",
                  "&:hover": { color: "#d32f2f" },
                }}
              >
                Clear Cart
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Drawer Footer Summary */}
      {items.length > 0 && (
        <Box
          sx={{
            p: 3,
            borderTop: "1px solid #EADCCF",
            bgcolor: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              mb: 2.5,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 800,
                color: "#2C1810",
                fontSize: "18px",
              }}
            >
              Subtotal
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 800,
                color: "#C84B16",
                fontSize: "24px",
              }}
            >
              ₹{totalPrice}
            </Typography>
          </Box>

          <Button
            fullWidth
            onClick={handleProceedToBooking}
            variant="contained"
            sx={{
              bgcolor: "#C84B16",
              color: "white",
              py: 1.5,
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "15px",
              textTransform: "none",
              boxShadow: "0 6px 20px rgba(200, 75, 22, 0.3)",
              "&:hover": {
                bgcolor: "#FF6200",
                boxShadow: "0 8px 25px rgba(200, 75, 22, 0.4)",
              },
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}

      {/* Confirmation Modal */}
      <Dialog
        open={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              p: 1,
              maxWidth: 400,
              width: "90%",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontWeight: 800,
            color: "#2C1810",
            fontSize: "20px",
          }}
        >
          {confirmModal.type === "clear"
            ? "Clear Entire Cart?"
            : "Remove Product?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "14px",
            }}
          >
            {confirmModal.type === "clear"
              ? "Are you sure you want to clear all items from your pooja cart?"
              : `Are you sure you want to remove "${confirmModal.itemTitle || "this item"}" from your cart?`}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1, gap: 1 }}>
          <Button
            onClick={() => setConfirmModal({ ...confirmModal, open: false })}
            sx={{
              color: "#64534A",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              bgcolor: "#d32f2f",
              color: "white",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "8px",
              px: 2.5,
              "&:hover": { bgcolor: "#b71c1c" },
            }}
          >
            {confirmModal.type === "clear" ? "Clear Cart" : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
