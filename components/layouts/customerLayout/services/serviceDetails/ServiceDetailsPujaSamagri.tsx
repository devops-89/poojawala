"use client";
import { addToCartAPI, deleteCartItemAPI } from "@/api/cartControllers";
import { getAllProductsAPI } from "@/api/productControllers";
import { useCartStore } from "@/stores/cartStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  serviceName?: string;
  maxItems?: number;
  title?: string;
  subtitle?: string;
  showSummaryBar?: boolean;
}

interface SamagriItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  unitString?: string;
}

export default function ServiceDetailsPujaSamagri({
  serviceName,
  maxItems = 6,
  title,
  subtitle,
  showSummaryBar = true,
}: Props) {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const openCart = useCartStore((state) => state.openCart);
  const setCartFromApi = useCartStore((state) => state.setCartFromApi);
  const [items, setItems] = useState<SamagriItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync selectedItems with cartStore items using productId
  const selectedItems = cartItems.map((i) => i.productId || i.id);

  // Display maximum items specified by maxItems prop (default 6)
  const displayItems = items.slice(0, maxItems);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProductsAPI(1, 20, "", undefined, true);
        let rawList: any[] = [];

        if (res) {
          if (Array.isArray(res)) {
            rawList = res;
          } else if (res.data) {
            if (Array.isArray(res.data)) {
              rawList = res.data;
            } else if (res.data.data && Array.isArray(res.data.data)) {
              rawList = res.data.data;
            } else if (res.data.products && Array.isArray(res.data.products)) {
              rawList = res.data.products;
            }
          }
        }

        if (rawList && rawList.length > 0) {
          const formatted: SamagriItem[] = rawList.map(
            (p: any, idx: number) => {
              const img =
                p.imageUrl ||
                p.imageDownloadurl ||
                p.image ||
                p.bannerUrl ||
                p.bannerDownloadurl ||
                (Array.isArray(p.images) && p.images[0]) ||
                "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80";

              const pQty = p.quantity || p.packQuantity || p.qty;
              const pUnit = p.pricingUnit || p.unit;

              let formattedUnit = "";
              if (pQty && pUnit) {
                formattedUnit = `${pQty} ${pUnit}`.toUpperCase();
              } else if (pUnit) {
                formattedUnit = `${pUnit}`.toUpperCase();
              } else if (pQty) {
                formattedUnit = `${pQty} PACK`;
              }

              return {
                id: String(p.id || idx + 1),
                title: p.name || p.title || `Puja Item ${idx + 1}`,
                description:
                  p.description ||
                  p.shortDescription ||
                  p.category ||
                  "Essential pooja item for sacred ritual offerings.",
                price: Number(
                  p.salePrice || p.price || p.basePrice || p.minPrice || 0,
                ),
                image: img,
                unitString: formattedUnit,
              };
            },
          );
          setItems(formatted);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch products for pooja samagri:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleItem = async (item: SamagriItem) => {
    const isSelected = selectedItems.includes(item.id);
    if (isSelected) {
      const existingCartItem = cartItems.find(
        (i) => (i.productId ? i.productId === item.id : i.id === item.id)
      );
      const targetId = existingCartItem ? existingCartItem.id : item.id;
      removeItem(targetId);
      try {
        const res = await deleteCartItemAPI(targetId);
        setCartFromApi(res);
      } catch (err) {
        console.error("Failed to remove item from backend cart:", err);
      }
      showSnackbar(`Removed ${item.title} from your cart`, "info");
    } else {
      try {
        const res = await addToCartAPI(item.id, 1);
        setCartFromApi(res);
      } catch (err) {
        console.error("Failed to add item to backend cart:", err);
        addItem({
          id: item.id,
          productId: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          unitString: item.unitString,
          description: item.description,
        });
      }
      showSnackbar(
        `Added ${item.title} (₹${item.price}) to your cart`,
        "success",
      );
      openCart();
    }
  };

  const totalSelectedPrice = items
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const displayServiceName = serviceName || "Hanuman Jayanti";

  return (
    <Box id="puja-samagri-section" sx={{ py: 4, mb: 6 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "flex-end" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "#C84B16",
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            POOJA SAMAGRI
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "28px", sm: "34px", md: "38px" },
              lineHeight: 1.25,
              mb: 1.5,
            }}
          >
            {title || "Add pooja items to your booking"}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: 680,
            }}
          >
            {subtitle ||
              `These items are commonly needed for ${displayServiceName} pooja. Add what you need — we'll arrange delivery before the ceremony.`}
          </Typography>
        </Box>

        <Button
          onClick={() => router.push("/customer/products")}
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderColor: "#C84B16",
            color: "#C84B16",
            fontWeight: 700,
            fontSize: "14px",
            borderRadius: "10px",
            px: 2.5,
            py: 1,
            textTransform: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
            "&:hover": {
              borderColor: "#FF6200",
              bgcolor: "#FFF0E6",
              color: "#FF6200",
            },
          }}
        >
          View All Products
        </Button>
      </Box>

      {/* Loading State Skeleton Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#FAF4EE",
                  border: "1px solid #EADCCF",
                  borderRadius: "18px",
                  overflow: "hidden",
                  p: 0,
                }}
              >
                <Skeleton variant="rectangular" height={210} animation="wave" />
                <Box sx={{ p: 3 }}>
                  <Skeleton
                    variant="text"
                    height={28}
                    width="70%"
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    height={20}
                    width="90%"
                    animation="wave"
                  />
                  <Skeleton
                    variant="text"
                    height={20}
                    width="60%"
                    animation="wave"
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 3,
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={28}
                      width={60}
                      animation="wave"
                    />
                    <Skeleton
                      variant="rectangular"
                      height={36}
                      width={90}
                      sx={{ borderRadius: "8px" }}
                      animation="wave"
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : displayItems.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            bgcolor: "#FAF4EE",
            border: "1px dashed #EADCCF",
            borderRadius: "20px",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "#FFF0E6",
              color: "#C84B16",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Georgia", serif',
              fontWeight: 700,
              color: "#2C1810",
              mb: 1,
            }}
          >
            No Pooja Samagri Available
          </Typography>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "14px",
              maxWidth: 450,
              mx: "auto",
            }}
          >
            Currently there are no pooja samagri items available. Please check back later!
          </Typography>
        </Paper>
      ) : (
        /* Grid of Puja Samagri Cards (Max 6) */
        <Grid container spacing={3}>
          {displayItems.map((item) => {
            const isAdded = selectedItems.includes(item.id);
            const count = displayItems.length;
            const isSingle = count === 1;
            const gridSpan = isSingle
              ? { xs: 12, md: 12 }
              : count === 2
              ? { xs: 12, sm: 6, md: 6 }
              : { xs: 12, sm: 6, md: 4 };

            return (
              <Grid size={gridSpan} key={item.id}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#FAF4EE",
                    border: isAdded
                      ? "1.5px solid #C84B16"
                      : "1px solid #EADCCF",
                    borderRadius: "18px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: isSingle ? { xs: "column", md: "row" } : "column",
                    transition: "all 0.25s ease-in-out",
                    boxShadow: isAdded
                      ? "0 8px 24px rgba(200, 75, 22, 0.12)"
                      : "none",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 10px 28px rgba(44, 24, 16, 0.08)",
                    },
                  }}
                >
                  {/* Image Container */}
                  <Box
                    sx={{
                      position: "relative",
                      width: isSingle ? { xs: "100%", md: "340px" } : "100%",
                      height: isSingle ? { xs: 210, md: "auto" } : 210,
                      minHeight: isSingle ? { md: 210 } : undefined,
                      flexShrink: 0,
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.title}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    {isAdded && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: "#C84B16",
                          color: "white",
                          borderRadius: "20px",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "12px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 14 }} /> Added
                      </Box>
                    )}
                  </Box>

                  {/* Card Content */}
                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: '"Georgia", "Times New Roman", serif',
                          fontWeight: 700,
                          color: "#2C1810",
                          fontSize: "19px",
                          lineHeight: 1.3,
                          mb: 1,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#64534A",
                          fontSize: "13.5px",
                          lineHeight: 1.6,
                          mb: 2.5,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    {/* Card Footer: Price & Add Button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: '"Georgia", "Times New Roman", serif',
                          fontWeight: 800,
                          fontSize: "21px",
                          color: "#2C1810",
                        }}
                      >
                        ₹{item.price}
                        {item.unitString && (
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#8C786D",
                              ml: 0.5,
                            }}
                          >
                            / {item.unitString}
                          </Typography>
                        )}
                      </Typography>

                      <Button
                        onClick={() => toggleItem(item)}
                        variant="contained"
                        startIcon={
                          isAdded ? <CheckIcon fontSize="small" /> : undefined
                        }
                        sx={{
                          bgcolor: isAdded ? "#2C1810" : "#C84B16",
                          color: "white",
                          borderRadius: "8px",
                          px: 2.5,
                          py: 0.8,
                          fontWeight: 700,
                          fontSize: "14px",
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: isAdded ? "#1E100B" : "#FF6200",
                            boxShadow: "0 4px 14px rgba(200, 75, 22, 0.3)",
                          },
                        }}
                      >
                        {isAdded ? "Added" : "+ Add"}
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Floating/Bottom Summary Bar when items are selected */}
      {showSummaryBar && selectedItems.length > 0 && (
        <Paper
          elevation={4}
          sx={{
            mt: 4,
            p: { xs: 2, sm: 3 },
            bgcolor: "#2C1810",
            color: "white",
            borderRadius: "16px",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            boxShadow: "0 10px 30px rgba(44, 24, 16, 0.25)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                bgcolor: "rgba(200, 75, 22, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FF8A65",
              }}
            >
              <ShoppingBagOutlinedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
                {selectedItems.length} Samagri Item
                {selectedItems.length > 1 ? "s" : ""} Added
              </Typography>
              <Typography sx={{ color: "#E0D6D0", fontSize: "13px" }}>
                Total Add-on Price: ₹{totalSelectedPrice}
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={() => {
              const el = document.getElementById("booking-form-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            variant="contained"
            sx={{
              bgcolor: "#C84B16",
              color: "white",
              fontWeight: 700,
              borderRadius: "10px",
              px: 3,
              py: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "#FF6200" },
            }}
          >
            Proceed to Booking
          </Button>
        </Paper>
      )}
    </Box>
  );
}
