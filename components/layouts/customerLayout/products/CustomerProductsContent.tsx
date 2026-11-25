"use client";

import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { addToCartAPI, deleteCartItemAPI } from "@/api/cartControllers";
import { getAllProductsAPI } from "@/api/productControllers";
import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import { useCartStore } from "@/stores/cartStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { extractProductImage, getProductInitials } from "@/utils/helpers";
import CheckIcon from "@mui/icons-material/Check";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  ClickAwayListener,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  MenuList,
  Paper,
  Select,
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
  categoryId?: number | string | null;
  categoryName?: string;
}

function ProductCardMedia({
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
          width: { xs: 74, sm: 84 },
          height: { xs: 74, sm: 84 },
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FFF0E6 0%, #FFE2D1 100%)",
          border: "2px solid #FFD4BC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(255, 98, 0, 0.12)",
          userSelect: "none",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontWeight: 800,
            fontSize: { xs: "24px", sm: "28px" },
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
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto",
        height: "auto",
        objectFit: "contain",
        transition: "transform 0.35s ease",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    />
  );
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
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const selectedItemIds = cartItems.map((i) => i.productId || i.id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getServiceCategoriesAPI(1, 100, "", true, "PRODUCT");
        let list: any[] = [];
        if (res) {
          if (Array.isArray(res)) {
            list = res;
          } else if (res.data) {
            if (Array.isArray(res.data)) {
              list = res.data;
            } else if (res.data.categories && Array.isArray(res.data.categories)) {
              list = res.data.categories;
            } else if (res.data.data && Array.isArray(res.data.data)) {
              list = res.data.data;
            }
          } else if (res.categories && Array.isArray(res.categories)) {
            list = res.categories;
          }
        }
        const activeCategories = list.filter((c: any) => c.isActive !== false);
        setCategoriesList(activeCategories);
      } catch (err) {
        console.error("Failed to fetch product categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryIdParam = selectedCategory !== "ALL" ? selectedCategory : undefined;
        const res = await getAllProductsAPI(1, 100, searchTerm, undefined, true, categoryIdParam);
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
          let formatted: ProductItem[] = rawList.map((p: any, idx: number) => {
            const img = extractProductImage(p);

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

            const catObj = p.category;
            const catName =
              typeof catObj === "object" && catObj !== null
                ? catObj.name
                : typeof p.category === "string"
                ? p.category
                : p.categoryName || "";

            const catId =
              p.categoryId ||
              (typeof catObj === "object" && catObj !== null ? catObj.id : null);

            return {
              id: String(p.id || idx + 1),
              title: p.name || p.title || `Sacred Product ${idx + 1}`,
              description:
                p.description ||
                p.shortDescription ||
                "Pure authentic pooja item sourced directly with devotion.",
              price: Number(
                p.salePrice || p.price || p.basePrice || p.minPrice || 0
              ),
              image: img,
              unitString: formattedUnit,
              categoryId: catId,
              categoryName: catName,
            };
          });

          if (selectedCategory !== "ALL") {
            formatted = formatted.filter(
              (item) =>
                String(item.categoryId) === String(selectedCategory) ||
                item.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
            );
          }

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
  }, [searchTerm, selectedCategory]);

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
    <Box sx={{ pb: { xs: 5, md: 8 } }}>
      {/* Hero Section */}
      <CustomerProductsHero />

      {/* Filter / Search Header */}
      <Box
        id="customer-products-grid"
        sx={{
          mb: { xs: 2.5, md: 3.5 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "22px", sm: "26px", md: "30px" },
              mb: 0.5,
            }}
          >
            Sacred Pooja Items
          </Typography>

          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#7C6A60",
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            Sourced directly, tested for purity, delivered to your doorstep.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", md: "auto" },
          }}
        >
          {/* Category Filter Dropdown (Custom Anchored Container) */}
          <ClickAwayListener onClickAway={() => setCategoryDropdownOpen(false)}>
            <Box
              sx={{
                position: "relative",
                width: { xs: "100%", sm: 200 },
                minWidth: { xs: "100%", sm: 200 },
              }}
            >
              <Box
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setCategoryDropdownOpen((prev) => !prev);
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  height: 40,
                  px: 2,
                  bgcolor: "#FFFFFF",
                  borderRadius: "14px",
                  border: `1.5px solid ${categoryDropdownOpen ? COLORS.PRIMARY : "#EFE6D5"}`,
                  cursor: "pointer",
                  userSelect: "none",
                  transition: "all 0.2s ease",
                  "&:hover": { borderColor: "#FFD4BC" },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#2C1810",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    pr: 1,
                  }}
                >
                  {selectedCategory === "ALL"
                    ? "All Categories"
                    : categoriesList.find((c) => String(c.id) === selectedCategory)?.name ||
                      "All Categories"}
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    color: COLORS.PRIMARY,
                    fontSize: 20,
                    transform: categoryDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                    flexShrink: 0,
                  }}
                />
              </Box>

              {/* Dropdown Menu Popup - 100% matched to container */}
              {categoryDropdownOpen && (
                <Paper
                  elevation={0}
                  sx={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    width: "100%",
                    maxHeight: 280,
                    overflowY: "auto",
                    bgcolor: "#FFFFFF",
                    borderRadius: "14px",
                    border: "1px solid #EFE6D5",
                    boxShadow: "0 10px 30px rgba(44, 24, 16, 0.12)",
                    zIndex: 1300,
                    p: 0.75,
                    scrollbarWidth: "thin",
                  }}
                >
                  <MenuList disablePadding>
                    <MenuItem
                      onClick={() => {
                        setSelectedCategory("ALL");
                        setCategoryDropdownOpen(false);
                      }}
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontSize: "13.5px",
                        fontWeight: selectedCategory === "ALL" ? 700 : 500,
                        bgcolor: selectedCategory === "ALL" ? "#FFF0E6" : "transparent",
                        color: selectedCategory === "ALL" ? COLORS.PRIMARY : "#2C1810",
                        borderRadius: "10px",
                        py: 1,
                        px: 1.5,
                        mb: 0.25,
                        "&:hover": {
                          bgcolor: selectedCategory === "ALL" ? "#FFE2D1" : "#FAF7F4",
                        },
                      }}
                    >
                      All Categories
                    </MenuItem>
                    {categoriesList.map((cat: any) => {
                      const isSelected = selectedCategory === String(cat.id);
                      return (
                        <MenuItem
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(String(cat.id));
                            setCategoryDropdownOpen(false);
                          }}
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "13.5px",
                            fontWeight: isSelected ? 700 : 500,
                            bgcolor: isSelected ? "#FFF0E6" : "transparent",
                            color: isSelected ? COLORS.PRIMARY : "#2C1810",
                            borderRadius: "10px",
                            py: 1,
                            px: 1.5,
                            mb: 0.25,
                            "&:hover": {
                              bgcolor: isSelected ? "#FFE2D1" : "#FAF7F4",
                            },
                          }}
                        >
                          {cat.name}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>

          {/* Search Bar */}
          <TextField
            placeholder="Search sacred products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: COLORS.PRIMARY, fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: {
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "13.5px",
                  borderRadius: "14px",
                  bgcolor: "#FFFFFF",
                  "& fieldset": { borderColor: "#EFE6D5" },
                  "&:hover fieldset": { borderColor: "#FFD4BC" },
                  "&.Mui-focused fieldset": { borderColor: `${COLORS.PRIMARY} !important` },
                },
              },
            }}
            sx={{
              width: { xs: "100%", sm: 260 },
            }}
          />
        </Box>
      </Box>

      {/* Loading Skeleton */}
      {loading ? (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
              <Paper
                elevation={0}
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1.5px solid #EFE6D5",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <Skeleton variant="rectangular" height={220} animation="wave" />
                <Box sx={{ p: 2.5 }}>
                  <Skeleton variant="text" height={26} width="70%" animation="wave" />
                  <Skeleton variant="text" height={18} width="95%" animation="wave" />
                  <Skeleton variant="text" height={18} width="60%" animation="wave" />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Skeleton variant="text" height={28} width="35%" animation="wave" />
                    <Skeleton variant="rectangular" height={34} width={80} sx={{ borderRadius: "20px" }} />
                  </Box>
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
            bgcolor: "#FAF7F4",
            border: "1.5px dashed #FFD4BC",
            borderRadius: "20px",
            my: 3,
            maxWidth: 540,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              bgcolor: "#FFF0E6",
              border: "1px solid #FFD4BC",
              color: COLORS.PRIMARY,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 30 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
              mb: 1,
            }}
          >
            No Products Available
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#7C6A60",
              fontSize: "13.5px",
              lineHeight: 1.6,
              maxWidth: 440,
              mx: "auto",
              mb: 2.5,
            }}
          >
            {searchTerm
              ? `No products matched "${searchTerm}". Try resetting your search or category.`
              : "Currently there are no pooja products matching this category. Please check back later!"}
          </Typography>
          {(searchTerm || selectedCategory !== "ALL") && (
            <Button
              variant="contained"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
              }}
              sx={{
                bgcolor: COLORS.PRIMARY,
                color: "#FFFFFF",
                fontFamily: FONTS.OUTFIT,
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13.5px",
                px: 3,
                py: 0.9,
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  bgcolor: COLORS.PRIMARY_DARK,
                },
              }}
            >
              Reset Filters
            </Button>
          )}
        </Paper>
      ) : (
        /* Products Grid */
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {products.map((item) => {
            const isAdded = selectedItemIds.includes(item.id);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#FFFFFF",
                    border: isAdded ? "1.5px solid #FF6200" : "1.5px solid #EFE6D5",
                    borderRadius: "20px",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.25s ease-in-out",
                    boxShadow: isAdded
                      ? "0 8px 24px rgba(255, 98, 0, 0.12)"
                      : "0 2px 10px rgba(44, 24, 16, 0.04)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      borderColor: "#FFD4BC",
                      boxShadow: "0 12px 28px -6px rgba(44, 24, 16, 0.10)",
                    },
                  }}
                >
                  {/* Image Area */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: { xs: 210, sm: 220, md: 240 },
                      bgcolor: "#FAF7F4",
                      borderBottom: "1px solid #EFE6D5",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1.5,
                    }}
                  >
                    <ProductCardMedia src={item.image} title={item.title} />

                    {/* Top Right Badges */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 0.6,
                        zIndex: 2,
                      }}
                    >
                      {item.categoryName ? (
                        <Box
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.95)",
                            backdropFilter: "blur(4px)",
                            border: "1px solid #FFD4BC",
                            color: COLORS.PRIMARY,
                            borderRadius: "20px",
                            px: 1.25,
                            py: 0.3,
                            fontSize: "10.5px",
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                          }}
                        >
                          {item.categoryName}
                        </Box>
                      ) : null}

                      {isAdded && (
                        <Box
                          sx={{
                            bgcolor: "#16A34A",
                            color: "white",
                            borderRadius: "20px",
                            px: 1.25,
                            py: 0.3,
                            fontSize: "11px",
                            fontWeight: 700,
                            fontFamily: FONTS.OUTFIT,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            boxShadow: "0 2px 8px rgba(22, 163, 74, 0.3)",
                          }}
                        >
                          <CheckIcon sx={{ fontSize: 13 }} /> In Cart
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Content Area */}
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.25 },
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: 1,
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 800,
                          color: "#2C1810",
                          fontSize: { xs: "16px", sm: "17px" },
                          lineHeight: 1.3,
                          mb: 0.75,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          color: "#7C6A60",
                          fontSize: "12.5px",
                          lineHeight: 1.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>

                    {/* Footer: Price & Add Button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 1.5,
                        borderTop: "1px dashed #EFE6D5",
                        gap: 1.5,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            color: "#8A7A70",
                            textTransform: "uppercase",
                            fontFamily: FONTS.OUTFIT,
                            lineHeight: 1,
                            mb: 0.25,
                          }}
                        >
                          Price
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 800,
                            fontSize: { xs: "17px", sm: "19px" },
                            color: "#2C1810",
                            lineHeight: 1.2,
                          }}
                        >
                          ₹{item.price}
                          {item.unitString && (
                            <Typography
                              component="span"
                              sx={{
                                fontFamily: FONTS.OUTFIT,
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#8A7A70",
                                ml: 0.5,
                              }}
                            >
                              / {item.unitString}
                            </Typography>
                          )}
                        </Typography>
                      </Box>

                      <Button
                        onClick={() => toggleItem(item)}
                        variant="contained"
                        startIcon={
                          isAdded ? (
                            <CheckIcon sx={{ fontSize: "15px !important" }} />
                          ) : (
                            <ShoppingBagOutlinedIcon sx={{ fontSize: "15px !important" }} />
                          )
                        }
                        sx={{
                          bgcolor: isAdded ? "#16A34A" : COLORS.PRIMARY,
                          color: "white",
                          borderRadius: "20px",
                          px: { xs: 2.25, sm: 2.75 },
                          py: 0.75,
                          fontWeight: 700,
                          fontSize: "13px",
                          fontFamily: FONTS.OUTFIT,
                          textTransform: "none",
                          boxShadow: isAdded
                            ? "0 4px 12px rgba(22, 163, 74, 0.25)"
                            : "0 4px 12px rgba(255, 98, 0, 0.25)",
                          "&:hover": {
                            bgcolor: isAdded ? "#15803D" : COLORS.PRIMARY_DARK,
                            boxShadow: isAdded
                              ? "0 6px 16px rgba(22, 163, 74, 0.35)"
                              : "0 6px 16px rgba(255, 98, 0, 0.35)",
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
