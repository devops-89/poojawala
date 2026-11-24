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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
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
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { getProductInitials } from "@/utils/helpers";

function CartDrawerItemMedia({
  src,
  title,
}: {
  src?: string;
  title?: string;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = getProductInitials(title || "");
  const isLogo = !src || src.includes("1Poojalogo") || src.includes("logo");

  if (isLogo || imgError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #FFF0E6 0%, #FFE2D1 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: "15px",
            color: COLORS.PRIMARY,
            letterSpacing: "0.5px",
          }}
        >
          {initials}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={src}
      alt={title}
      onError={() => setImgError(true)}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        p: 0.5,
      }}
    />
  );
}

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
    itemId?: string | number;
    itemTitle?: string;
  }>({
    open: false,
    type: "remove",
  });

  const handleQuantityChange = async (itemId: string | number, newQty: number) => {
    if (newQty <= 0) {
      const targetItem = items.find((i) => String(i.id) === String(itemId));
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

  const promptRemoveItem = (itemId: string | number, title?: string) => {
    setConfirmModal({
      open: true,
      type: "remove",
      itemId,
      itemTitle: title || "this product",
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
    if (isOpen) {
      fetchCartFromApi();
    }
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
            maxWidth: "100vw",
            bgcolor: "#FAF7F4",
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
          p: { xs: 2, sm: 2.5 },
          px: { xs: 2.25, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #EFE6D5",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "12px",
              bgcolor: "#FFF0E6",
              border: "1px solid #FFD4BC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.PRIMARY,
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#2C1810",
                fontSize: { xs: "17px", sm: "18px" },
                lineHeight: 1.2,
              }}
            >
              Your Pooja Cart
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#7C6A60",
                fontSize: "12px",
                fontWeight: 500,
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
            borderRadius: "10px",
            "&:hover": { bgcolor: "#FAF7F4", color: COLORS.PRIMARY },
          }}
        >
          <CloseIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Cart Content */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: { xs: 2, sm: 2.5 },
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
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#FFF0E6",
                border: "1.5px dashed #FF6200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.PRIMARY,
                mb: 2,
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 38 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#2C1810",
                fontSize: "18px",
                mb: 1,
              }}
            >
              Your cart is empty
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#7C6A60",
                fontSize: "13.5px",
                maxWidth: 260,
                mb: 3,
                lineHeight: 1.5,
              }}
            >
              Explore our pooja samagri and sacred ritual items to add them to your ceremony.
            </Typography>
            <Button
              onClick={handleProceedToBooking}
              variant="contained"
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "white",
                borderRadius: "30px",
                px: 3.5,
                py: 1.1,
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "13.5px",
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
              }}
            >
              Browse Pooja Samagri
            </Button>
          </Box>
        ) : (
          /* Cart Items List */
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
            {items.map((item) => (
              <Paper
                key={item.id}
                elevation={0}
                sx={{
                  p: { xs: 1.75, sm: 2 },
                  bgcolor: "#FFFFFF",
                  border: "1.5px solid #EFE6D5",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#FFD4BC",
                    boxShadow: "0 4px 16px rgba(44, 24, 16, 0.06)",
                  },
                }}
              >
                {/* Top Section: Thumbnail + Title & Unit Price + Delete Button */}
                <Box sx={{ display: "flex", gap: 1.75, alignItems: "flex-start" }}>
                  {/* Product Thumbnail */}
                  <Box
                    sx={{
                      width: { xs: 64, sm: 70 },
                      height: { xs: 64, sm: 70 },
                      borderRadius: "12px",
                      bgcolor: "#FAF7F4",
                      border: "1px solid #EFE6D5",
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CartDrawerItemMedia src={item.image} title={item.title} />
                  </Box>

                  {/* Title & Unit Price */}
                  <Box sx={{ flexGrow: 1, minWidth: 0, pr: 0.5 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        color: "#2C1810",
                        fontSize: { xs: "14px", sm: "14.5px" },
                        lineHeight: 1.35,
                        mb: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        color: COLORS.PRIMARY,
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 0.5,
                      }}
                    >
                      ₹{item.price}
                      <Typography
                        component="span"
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "11.5px",
                          color: "#8A7A70",
                          fontWeight: 500,
                        }}
                      >
                        • {(() => {
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
                  </Box>

                  {/* Delete button */}
                  <IconButton
                    size="small"
                    onClick={() =>
                      promptRemoveItem(
                        item.id,
                        item.title || item.name || "this item",
                      )
                    }
                    sx={{
                      color: "#B4A59D",
                      p: 0.75,
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#E11D48",
                        bgcolor: "#FFF1F2",
                      },
                    }}
                    title="Remove Item"
                  >
                    <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Bottom Row: Stepper (Left) & Total Price (Right) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pt: 1.25,
                    borderTop: "1px dashed #EFE6D5",
                  }}
                >
                  {/* Quantity Stepper */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      bgcolor: "#FAF7F4",
                      border: "1px solid #EADCCF",
                      borderRadius: "20px",
                      px: 0.5,
                      py: 0.25,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      sx={{
                        p: 0.5,
                        color: "#64534A",
                        borderRadius: "50%",
                        "&:hover": { bgcolor: "#EFE6D5" },
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                    <Typography
                      sx={{
                        px: 1.25,
                        fontWeight: 800,
                        fontSize: "13px",
                        color: "#2C1810",
                        fontFamily: FONTS.OUTFIT,
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      sx={{
                        p: 0.5,
                        color: COLORS.PRIMARY,
                        borderRadius: "50%",
                        "&:hover": { bgcolor: "#FFE2D1" },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>

                  {/* Item Total Price */}
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 800,
                        color: "#2C1810",
                        fontSize: { xs: "15px", sm: "16px" },
                        lineHeight: 1.2,
                      }}
                    >
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}

            {/* Clear Cart Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 1,
                px: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "12px",
                  color: "#8A7A70",
                  fontWeight: 500,
                }}
              >
                {items.length} {items.length === 1 ? "product" : "products"} in cart
              </Typography>
              <Button
                size="small"
                onClick={promptClearCart}
                startIcon={<DeleteOutlinedIcon sx={{ fontSize: "14px !important" }} />}
                sx={{
                  color: "#A8968D",
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "none",
                  py: 0.4,
                  px: 1,
                  borderRadius: "8px",
                  "&:hover": { color: "#E11D48", bgcolor: "#FFF1F2" },
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
            p: { xs: 2.25, sm: 2.75 },
            borderTop: "1px solid #EFE6D5",
            bgcolor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              mb: 1.75,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  color: "#2C1810",
                  fontSize: "16px",
                  lineHeight: 1.2,
                }}
              >
                Subtotal
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "11.5px",
                  color: "#8A7A70",
                  mt: 0.25,
                }}
              >
                Taxes & discounts calculated at checkout
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: COLORS.PRIMARY,
                fontSize: { xs: "22px", sm: "24px" },
              }}
            >
              ₹{totalPrice.toLocaleString("en-IN")}
            </Typography>
          </Box>

          <Button
            fullWidth
            onClick={handleProceedToBooking}
            variant="contained"
            endIcon={<ArrowForwardIcon sx={{ fontSize: "18px !important" }} />}
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "white",
              py: 1.3,
              borderRadius: "30px",
              fontWeight: 700,
              fontSize: "15px",
              fontFamily: FONTS.OUTFIT,
              textTransform: "none",
              boxShadow: "0 6px 20px rgba(255, 98, 0, 0.28)",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_DARK,
                boxShadow: "0 8px 24px rgba(255, 98, 0, 0.35)",
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
              borderRadius: "20px",
              p: 1.5,
              maxWidth: 400,
              width: "92%",
              border: "1.5px solid #EFE6D5",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            color: "#2C1810",
            fontSize: "19px",
            pb: 1,
          }}
        >
          {confirmModal.type === "clear"
            ? "Clear Entire Cart?"
            : "Remove Product?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            component="div"
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64534A",
              fontSize: "14px",
              lineHeight: 1.5,
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
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "13.5px",
              textTransform: "none",
              borderRadius: "20px",
              px: 2.5,
              "&:hover": { bgcolor: "#FAF7F4" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            sx={{
              bgcolor: "#E11D48",
              color: "white",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "13.5px",
              textTransform: "none",
              borderRadius: "20px",
              px: 2.75,
              boxShadow: "0 4px 14px rgba(225, 29, 72, 0.25)",
              "&:hover": { bgcolor: "#BE123C" },
            }}
          >
            {confirmModal.type === "clear" ? "Clear Cart" : "Remove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
}
