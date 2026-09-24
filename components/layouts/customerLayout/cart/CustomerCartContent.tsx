"use client";
import CheckCircleIconComponent from "@mui/icons-material/CheckCircle";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  checkoutCartAPI,
  clearCartAPI,
  deleteCartItemAPI,
  updateCartItemQuantityAPI,
} from "@/api/cartControllers";
import { getCustomerAddressesAPI } from "@/api/userControllers";
import { useCartStore } from "@/stores/cartStore";
import { useSnackbarStore } from "@/stores/snackbarStore";

import AddAddressModal from "@/components/widgets/AddAddressModal";
import CartBottomFeatureStrip from "./CartBottomFeatureStrip";
import CartHeader from "./CartHeader";
import CartItemsList from "./CartItemsList";
import CartOrderSummary from "./CartOrderSummary";
import CartPaymentSection from "./CartPaymentSection";
import SavedAddressesSection from "./SavedAddressesSection";

export interface CustomerAddress {
  id: string | number;
  addressLabel: string;
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  venueType?: string;
  latitude?: string;
  longitude?: string;
  isDefault?: boolean;
}

export default function CustomerCartContent() {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const items = useCartStore((state) => state.items);
  const setCartFromApi = useCartStore((state) => state.setCartFromApi);
  const fetchCartFromApi = useCartStore((state) => state.fetchCartFromApi);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // Address state
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number>(
    "",
  );
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    type: "remove" | "clear";
    itemId?: string;
    itemTitle?: string;
  }>({
    open: false,
    type: "remove",
  });

  // Payment method selection: razorpay or cod
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
    "razorpay",
  );
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    setAddressLoading(true);
    try {
      const res = await getCustomerAddressesAPI();
      let rawAddresses: any[] = [];

      if (res) {
        if (res.data) {
          if (Array.isArray(res.data.data)) {
            rawAddresses = res.data.data;
          } else if (Array.isArray(res.data)) {
            rawAddresses = res.data;
          } else if (res.data.addresses && Array.isArray(res.data.addresses)) {
            rawAddresses = res.data.addresses;
          }
        } else if (Array.isArray(res)) {
          rawAddresses = res;
        }
      }

      if (rawAddresses && rawAddresses.length > 0) {
        const formatted: CustomerAddress[] = rawAddresses.map(
          (a: any, idx: number) => ({
            id: a.id || idx + 1,
            addressLabel: a.addressLabel || a.venueType || "Address",
            fullAddress:
              a.fullAddress ||
              a.addressLine1 ||
              a.street ||
              `${a.city || ""}, ${a.state || ""}`,
            city: a.city || "",
            state: a.state || "",
            pincode: a.pincode || a.zipCode || "",
            venueType: a.venueType || "HOME",
            latitude: a.latitude || "0",
            longitude: a.longitude || "0",
            isDefault: Boolean(a.isDefault),
          }),
        );

        setAddresses(formatted);
        const defaultAddr = formatted.find((a) => a.isDefault) || formatted[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } else {
        setAddresses([]);
        setSelectedAddressId("");
      }
    } catch (err) {
      console.error("Failed to fetch customer addresses:", err);
      // Fallback in dev if unauthenticated
      const fallbackAddresses: CustomerAddress[] = [
        {
          id: 27,
          addressLabel: "Office",
          fullAddress:
            "Chijarsi, Noida, Dadri, Gautam Buddha Nagar, Uttar Pradesh, 201014, India",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201014",
          isDefault: true,
        },
        {
          id: 10,
          addressLabel: "Home",
          fullAddress: "Shri Kashi Vishwanath Temple, Lahori Tola, Varanasi",
          city: "Varanasi",
          state: "Uttar Pradesh",
          pincode: "221001",
          isDefault: false,
        },
      ];
      setAddresses(fallbackAddresses);
      setSelectedAddressId(fallbackAddresses[0].id);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    fetchCartFromApi();
    fetchAddresses();
  }, [fetchCartFromApi]);

  const rawSubtotal = getTotalPrice();
  const totalItemsCount = getTotalItems();
  const finalTotal = rawSubtotal;

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
      console.error("Failed to update cart quantity:", err);
      fetchCartFromApi();
      showSnackbar("Failed to update quantity", "error");
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
        console.error("Failed to delete cart item:", err);
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
        console.error("Failed to clear cart:", err);
        fetchCartFromApi();
        showSnackbar("Failed to clear cart", "error");
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      showSnackbar("Your cart is empty", "error");
      return;
    }

    if (!selectedAddressId) {
      showSnackbar("Please select a delivery address", "error");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const res = await checkoutCartAPI(selectedAddressId);
      
      const checkoutData = res?.data?.data || res?.data || res;
      const paymentUrl = checkoutData?.paymentUrl;

      if (paymentUrl) {
        showSnackbar("Checkout initiated! Redirecting to payment...", "success");
        window.location.href = paymentUrl;
      } else {
        showSnackbar(res?.message || "Checkout initiated successfully", "success");
        clearCart();
        setOrderSuccessOpen(true);
      }
    } catch (err: any) {
      console.error("Cart checkout failed:", err);
      showSnackbar(
        err?.response?.data?.message || err?.message || "Failed to initiate checkout. Please try again.",
        "error"
      );
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FAF4EE",
        color: "#2C1810",
        m: { xs: -2, sm: -3, md: -5 },
        mt: { xs: -2, sm: -3, md: -5 },
        mb: { xs: -2, sm: -3, md: -5 },
        pt: { xs: 4, md: 5 },
        pb: 0,
        px: { xs: 2, sm: 4, md: 6 },
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto" }}>
        {/* Header Section */}
        <CartHeader />

        {/* Saved Addresses Section */}
        <SavedAddressesSection
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={(id) => setSelectedAddressId(id)}
          onOpenAddModal={() => setAddressModalOpen(true)}
          loading={addressLoading}
        />

        {/* Content Body Grid */}
        {items.length === 0 ? (
          /* Empty Cart State */
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 8 },
              bgcolor: "white",
              border: "1px solid #EADCCF",
              borderRadius: "24px",
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
              my: 4,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "#FAF4EE",
                border: "2px dashed #C84B16",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C84B16",
                mx: "auto",
                mb: 3,
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 50 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 700,
                color: "#2C1810",
                mb: 1.5,
              }}
            >
              Your Sacred Cart is Empty
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: "15px",
                maxWidth: 400,
                mx: "auto",
                mb: 4,
              }}
            >
              Add authentic pooja samagri, brass diyas, and sacred ritual kits
              to prepare for your ceremony.
            </Typography>
            <Button
              onClick={() => router.push("/customer/products")}
              variant="contained"
              sx={{
                bgcolor: "#FF6200",
                color: "white",
                borderRadius: "30px",
                px: 4,
                py: 1.5,
                fontWeight: 700,
                fontSize: "15px",
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(255, 98, 0, 0.3)",
                "&:hover": { bgcolor: "#E05600" },
              }}
            >
              Explore Pooja Products
            </Button>
          </Paper>
        ) : (
          /* Main 2-Column Cart & Checkout View */
          <Grid container spacing={4}>
            {/* LEFT COLUMN: Items List */}
            <Grid size={{ xs: 12, lg: 7.5 }}>
              <CartItemsList
                items={items}
                totalItemsCount={totalItemsCount}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={promptRemoveItem}
                onPromptClearCart={promptClearCart}
              />
            </Grid>

            {/* RIGHT COLUMN: Order Summary & Payment */}
            <Grid size={{ xs: 12, lg: 4.5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  position: { lg: "sticky" },
                  top: { lg: 100 },
                }}
              >
                <CartOrderSummary
                  totalItemsCount={totalItemsCount}
                  rawSubtotal={rawSubtotal}
                  finalTotal={finalTotal}
                />

                <CartPaymentSection
                  paymentMethod={paymentMethod}
                  onChangePaymentMethod={setPaymentMethod}
                  onPlaceOrder={handlePlaceOrder}
                  isSubmittingOrder={isSubmittingOrder}
                  isCartEmpty={items.length === 0}
                  finalTotal={finalTotal}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* BOTTOM FEATURE STRIP BANNER */}
      <CartBottomFeatureStrip />

      {/* REUSABLE ADD ADDRESS MODAL */}
      <AddAddressModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSuccess={() => fetchAddresses()}
      />

      {/* Confirmation Dialog for Remove / Clear */}
      <Dialog
        open={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
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
            component="div"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "14px",
            }}
          >
            {confirmModal.type === "clear"
              ? "Are you sure you want to clear all sacred items from your cart?"
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

      {/* Order Placed Success Modal */}
      <Dialog
        open={orderSuccessOpen}
        onClose={() => {
          setOrderSuccessOpen(false);
          router.push("/customer/products");
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "24px",
              p: 3,
              maxWidth: 460,
              textAlign: "center",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "#E8F5E9",
            color: "#2E7D32",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <CheckCircleIconComponent sx={{ fontSize: 50 }} />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontWeight: 800,
            color: "#2C1810",
            mb: 1,
          }}
        >
          Sacred Order Placed!
        </Typography>

        <Typography
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: "#64534A",
            fontSize: "14px",
            mb: 3,
          }}
        >
          May divine blessings be with you! Your order has been placed
          successfully and your sacred pooja samagri is being packed with utmost
          purity.
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            setOrderSuccessOpen(false);
            router.push("/customer/products");
          }}
          sx={{
            bgcolor: "#FF6200",
            color: "white",
            py: 1.5,
            borderRadius: "12px",
            fontWeight: 700,
            fontSize: "15px",
            textTransform: "none",
            "&:hover": { bgcolor: "#E05600" },
          }}
        >
          Back to Pooja Samagri
        </Button>
      </Dialog>
    </Box>
  );
}
