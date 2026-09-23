"use client";
import { addToCartAPI, deleteCartItemAPI } from "@/api/cartControllers";
import { getAllProductsAPI } from "@/api/productControllers";
import { useCartStore } from "@/stores/cartStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import CheckIcon from "@mui/icons-material/Check";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomerProductsFeatures from "./CustomerProductsFeatures";
import CustomerProductsHero from "./CustomerProductsHero";

interface ProductItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  unitString?: string;
}

export default function CustomerProductsContent() {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const cartItems = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const openCart = useCartStore((state) => state.openCart);
  const setCartFromApi = useCartStore((state) => state.setCartFromApi);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedItemIds = cartItems.map((i) => i.productId || i.id);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProductsAPI(1, 100, searchTerm, undefined, true);
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
          const formatted: ProductItem[] = rawList.map((p: any, idx: number) => {
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
              title: p.name || p.title || `Sacred Product ${idx + 1}`,
              description:
                p.description ||
                p.shortDescription ||
                p.category ||
                "Pure authentic pooja item sourced directly with devotion.",
              price: Number(
                p.salePrice || p.price || p.basePrice || p.minPrice || 0
              ),
              image: img,
              unitString: formattedUnit,
            };
          });
          setProducts(formatted);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleItem = async (item: ProductItem) => {
    const isSelected = selectedItemIds.includes(item.id);
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
        console.error("Failed to remove product from backend cart:", err);
      }
      showSnackbar(`Removed ${item.title} from your cart`, "info");
    } else {
      try {
        const res = await addToCartAPI(item.id, 1);
        setCartFromApi(res);
      } catch (err) {
        console.error("Failed to add product to backend cart:", err);
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
      showSnackbar(`Added ${item.title} (₹${item.price}) to your cart`, "success");
      openCart();
    }
  };

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Section */}
      <CustomerProductsHero />

      {/* Filter / Search Header */}
      <Box
        id="customer-products-grid"
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "24px", sm: "28px" },
              mb: 0.5,
            }}
          >
            Sacred Pooja Items
          </Typography>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "14px",
            }}
          >
            Sourced directly, tested for purity, delivered to your doorstep.
          </Typography>
        </Box>

        <TextField
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#8C786D" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: { xs: "100%", sm: 280 },
            bgcolor: "#FAF4EE",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              borderColor: "#EADCCF",
            },
          }}
        />
      </Box>

      {/* Loading Skeleton */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#FAF4EE",
                  border: "1px solid #EADCCF",
                  borderRadius: "18px",
                  overflow: "hidden",
                }}
              >
                <Skeleton variant="rectangular" height={210} animation="wave" />
                <Box sx={{ p: 3 }}>
                  <Skeleton variant="text" height={28} width="70%" animation="wave" />
                  <Skeleton variant="text" height={20} width="90%" animation="wave" />
                  <Skeleton variant="text" height={20} width="60%" animation="wave" />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            bgcolor: "#FAF4EE",
            border: "1px dashed #EADCCF",
            borderRadius: "20px",
            my: 2,
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
            No Products Available
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
            {searchTerm
              ? `No products matched "${searchTerm}". Try searching for another item.`
              : "Currently there are no pooja products available. Please check back later!"}
          </Typography>
        </Paper>
      ) : (
        /* Products Grid */
        <Grid container spacing={3}>
          {products.map((item) => {
            const isAdded = selectedItemIds.includes(item.id);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#FAF4EE",
                    border: isAdded ? "1.5px solid #C84B16" : "1px solid #EADCCF",
                    borderRadius: "18px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                  {/* Image Area */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 210,
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

                  {/* Content */}
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

                    {/* Footer: Price & Button */}
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

      {/* Features / Promises Banner */}
      <CustomerProductsFeatures />
    </Box>
  );
}
