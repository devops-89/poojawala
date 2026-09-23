"use client";
import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, Pagination, Grid, Skeleton } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useRouter } from "next/navigation";
import { getCustomerOrdersAPI } from "@/api/orderControllers";
import { addToCartAPI } from "@/api/cartControllers";
import { useCartStore } from "@/stores/cartStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import CustomerOrdersHero from "./CustomerOrdersHero";
import CustomerOrdersFilterPills, { OrderStatusFilter } from "./CustomerOrdersFilterPills";
import CustomerOrdersCard, { CustomerOrder } from "./CustomerOrdersCard";
import CustomerOrderDetailsModal from "./CustomerOrderDetailsModal";
import CustomerOrdersTrackingSteps from "./CustomerOrdersTrackingSteps";
import CustomerOrdersBannerCTA from "./CustomerOrdersBannerCTA";
import { ORDER_STATUS, ORDER_PAYMENT_METHOD, ORDER_PAYMENT_STATUS } from "@/utils/enums";

const formatApiOrder = (raw: any): CustomerOrder => {
  const items = Array.isArray(raw.items)
    ? raw.items.map((it: any) => ({
        id: String(it.id || it.productId),
        productId: Number(it.productId || it.product?.id || it.id),
        title:
          it.productNameSnapshot ||
          it.product?.name ||
          it.productName ||
          it.name ||
          it.title ||
          "Pooja Item",
        quantity: Number(it.quantity) || 1,
        price:
          Number(
            it.unitPriceSnapshot ||
              it.product?.price ||
              it.unitPrice ||
              it.price ||
              it.totalAmount
          ) || 0,
        image:
          it.productImageSnapshot ||
          it.product?.imageUrl ||
          it.productImage ||
          it.image ||
          it.imageUrl ||
          "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?auto=format&fit=crop&w=400&q=80",
      }))
    : [];

  const rawStatus = (
    raw.orderStatus ||
    raw.status ||
    raw.paymentStatus ||
    ORDER_STATUS.CONFIRMED
  )
    .toString()
    .toUpperCase();

  let status: ORDER_STATUS | string = ORDER_STATUS.CONFIRMED;
  if (Object.values(ORDER_STATUS).includes(rawStatus as ORDER_STATUS)) {
    status = rawStatus as ORDER_STATUS;
  } else if (rawStatus.includes("CANCEL") || rawStatus.includes("FAIL")) {
    status = ORDER_STATUS.CANCELLED;
  } else if (rawStatus.includes("SHIP") || rawStatus.includes("DISPATCH")) {
    status = ORDER_STATUS.SHIPPED;
  } else if (rawStatus.includes("DELIVER")) {
    status = ORDER_STATUS.DELIVERED;
  } else if (rawStatus.includes("CONFIRM")) {
    status = ORDER_STATUS.CONFIRMED;
  } else if (rawStatus.includes("PROCESS")) {
    status = ORDER_STATUS.PROCESSING;
  } else if (rawStatus.includes("PENDING")) {
    status = ORDER_STATUS.PENDING_PAYMENT;
  }

  const addrSnap = raw.shippingAddressSnapshot;
  const deliveryAddress = addrSnap
    ? [
        addrSnap.addressLine1,
        addrSnap.addressLine2,
        addrSnap.city,
        addrSnap.state,
        addrSnap.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : raw.deliveryAddress || "";

  const orderDateObj = raw.createdAt ? new Date(raw.createdAt) : new Date();
  const orderDateFormatted = orderDateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const rawPaymentMethod = (
    raw.paymentMethod ||
    raw.payment?.paymentMethod ||
    raw.payment?.customerPaymentMethod ||
    ""
  )
    .toString()
    .toUpperCase();

  let paymentMethodStr = "Online Payment";
  if (rawPaymentMethod === ORDER_PAYMENT_METHOD.COD) {
    paymentMethodStr = "Cash on Delivery (COD)";
  } else if (rawPaymentMethod === ORDER_PAYMENT_METHOD.ONLINE) {
    paymentMethodStr = "Razorpay Online";
  } else if (rawPaymentMethod) {
    paymentMethodStr = `${rawPaymentMethod} Payment`;
  }

  const rawOrderStatus = (raw.orderStatus || raw.status || ORDER_STATUS.CONFIRMED).toString().toUpperCase();
  const rawPaymentStatus = (raw.paymentStatus || raw.payment?.status || ORDER_PAYMENT_STATUS.PENDING).toString().toUpperCase();

  return {
    id: String(raw.id || raw.orderId || raw.orderNumber),
    orderNumber: raw.orderNumber || `#PW-${raw.id || "20261004"}`,
    orderDate: orderDateFormatted,
    categoryTag: raw.categoryTag || "POOJA SAMAGRI",
    status: rawOrderStatus,
    orderStatus: rawOrderStatus,
    paymentStatus: rawPaymentStatus,
    totalAmount: Number(raw.totalAmount || raw.subtotal || raw.amount) || 0,
    deliveredDate: raw.deliveredDate || (rawOrderStatus === ORDER_STATUS.DELIVERED ? orderDateFormatted : undefined),
    deliveryAddress,
    paymentMethod: paymentMethodStr,
    items,
  };
};

export default function CustomerOrdersContent() {
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const addItemToCart = useCartStore((state) => state.addItem);
  const openCartDrawer = useCartStore((state) => state.openCart);

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [serverTotalPages, setServerTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatusFilter>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const fetchOrders = async (targetPage = page, targetFilter = activeFilter) => {
    setLoading(true);
    try {
      const res = await getCustomerOrdersAPI(
        targetPage,
        itemsPerPage,
        targetFilter !== "ALL" ? targetFilter : undefined
      );

      let rawList: any[] = [];
      let totalCount = 0;
      let totalPg = 1;

      // Extract from deep nested structures in response
      const payload = res?.data?.data || res?.data || res;
      if (payload) {
        if (Array.isArray(payload.orders)) {
          rawList = payload.orders;
          totalCount = typeof payload.total === "number" ? payload.total : rawList.length;
          totalPg = typeof payload.totalPages === "number" ? payload.totalPages : Math.ceil(totalCount / itemsPerPage) || 1;
        } else if (Array.isArray(payload)) {
          rawList = payload;
          totalCount = rawList.length;
          totalPg = Math.ceil(totalCount / itemsPerPage) || 1;
        }
      }

      const formatted = rawList.map(formatApiOrder);
      setOrders(formatted);
      setTotalOrders(totalCount);
      setServerTotalPages(totalPg);
    } catch (err) {
      console.error("Failed to fetch customer orders from API:", err);
      setOrders([]);
      setTotalOrders(0);
      setServerTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1, activeFilter);
  }, []);

  // Compute counts for filter pills
  const counts: Record<string, number> = {
    all: totalOrders || orders.length,
    confirmed: orders.filter((o) => o.orderStatus === ORDER_STATUS.CONFIRMED).length,
    processing: orders.filter((o) => o.orderStatus === ORDER_STATUS.PROCESSING).length,
    shipped: orders.filter((o) => o.orderStatus === ORDER_STATUS.SHIPPED).length,
    out_for_delivery: orders.filter((o) => o.orderStatus === ORDER_STATUS.OUT_FOR_DELIVERY).length,
    delivered: orders.filter((o) => o.orderStatus === ORDER_STATUS.DELIVERED).length,
    cancelled: orders.filter((o) => o.orderStatus === ORDER_STATUS.CANCELLED).length,
  };

  // Filter orders by active status
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "ALL") return true;
    return order.orderStatus === activeFilter;
  });

  const displayOrders =
    orders.length > itemsPerPage
      ? filteredOrders.slice((page - 1) * itemsPerPage, page * itemsPerPage)
      : filteredOrders;

  const totalPagesCount =
    serverTotalPages > 1
      ? serverTotalPages
      : Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  const handleFilterChange = (filter: OrderStatusFilter) => {
    setActiveFilter(filter);
    setPage(1);
    fetchOrders(1, filter);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchOrders(value, activeFilter);
  };

  const handleViewDetails = (order: CustomerOrder) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const handleReorder = async (order: CustomerOrder) => {
    try {
      showSnackbar(`Reordering items from ${order.orderNumber}...`, "info");

      // Execute POST /cart/items API calls sending exact productId and quantity for each item
      await Promise.all(
        order.items.map((item) => {
          const targetProductId = item.productId ?? item.id;
          const targetQty = Number(item.quantity) || 1;
          return addToCartAPI(targetProductId, targetQty);
        })
      );

      // Sync Zustand Cart Store with exact productId and quantity
      order.items.forEach((item) => {
        const targetProductId = item.productId ?? item.id;
        const targetQty = Number(item.quantity) || 1;
        addItemToCart({
          id: String(targetProductId),
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: targetQty,
        });
      });

      showSnackbar(`Successfully reordered ${order.items.length} items from ${order.orderNumber}!`, "success");
      openCartDrawer();
    } catch (err: any) {
      console.error("Failed to reorder items via cart API:", err);
      showSnackbar(
        err?.response?.data?.message || err?.message || "Failed to reorder items. Please try again.",
        "error"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#FFFFFF",
        color: "#2C1810",
        m: { xs: -2, sm: -3, md: -5 },
        mt: { xs: -2, sm: -3, md: -5 },
        mb: { xs: -2, sm: -3, md: -5 },
        pt: { xs: 4, md: 5 },
        pb: 0,
        overflow: "hidden",
      }}
    >
      <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 2, sm: 4, md: 6 } }}>
        {/* 1. HERO HEADER COMPONENT */}
        <CustomerOrdersHero totalOrders={totalOrders || orders.length} />

        {/* 2. FILTER PILLS COMPONENT */}
        <CustomerOrdersFilterPills
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />

        {/* 3. ORDERS LIST / CARDS COMPONENT (MAX 6 PER PAGE) */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Grid size={{ xs: 12, md: 6 }} key={n}>
                <Skeleton
                  variant="rectangular"
                  height={220}
                  sx={{ borderRadius: "20px" }}
                />
              </Grid>
            ))}
          </Grid>
        ) : displayOrders.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              bgcolor: "#FFFBF7",
              border: "1px dashed #EADCCF",
              borderRadius: "24px",
              textAlign: "center",
              my: 4,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#FAF4EE",
                border: "2px dashed #C84B16",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#C84B16",
                mx: "auto",
                mb: 2.5,
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 40 }} />
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
              No orders found {activeFilter !== "ALL" ? `in "${activeFilter.toLowerCase()}"` : ""}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64534A",
                fontSize: "14px",
                mb: 3,
              }}
            >
              Explore our authentic pooja samagri and sacred ritual items to place a new order.
            </Typography>
            <Button
              onClick={() => router.push("/customer/products")}
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
                "&:hover": { bgcolor: "#B84A17" },
              }}
            >
              Explore Pooja Products
            </Button>
          </Paper>
        ) : (
          <>
            <Grid container spacing={3}>
              {displayOrders.map((order) => (
                <Grid size={{ xs: 12, md: 6 }} key={order.id}>
                  <CustomerOrdersCard
                    order={order}
                    onViewDetails={handleViewDetails}
                    onReorder={handleReorder}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination Controls */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 5,
                mb: 3,
                gap: 1.5,
              }}
            >
              <Pagination
                count={totalPagesCount}
                page={page}
                onChange={handlePageChange}
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#64534A",
                    borderRadius: "12px",
                    border: "1px solid #EADCCF",
                    bgcolor: "white",
                    mx: 0.4,
                    "&.Mui-selected": {
                      bgcolor: "#C84B16",
                      color: "white",
                      borderColor: "#C84B16",
                      boxShadow: "0 4px 14px rgba(200, 75, 22, 0.35)",
                      "&:hover": { bgcolor: "#B84A17" },
                    },
                    "&:hover": {
                      bgcolor: "#FAF4EE",
                      borderColor: "#C84B16",
                    },
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#8C7A70",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                Page {page} of {totalPagesCount} ({totalOrders || orders.length} Total Orders)
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* 4. ALWAYS IN THE KNOW TRACKING STEPS COMPONENT (FULL-BLEED) */}
      <CustomerOrdersTrackingSteps />

      {/* 5. NEVER MISS A RITUAL BANNER CTA COMPONENT (FULL-BLEED) */}
      <CustomerOrdersBannerCTA />

      {/* 6. DETAILS MODAL COMPONENT */}
      <CustomerOrderDetailsModal
        open={detailsModalOpen}
        order={selectedOrder}
        onClose={() => setDetailsModalOpen(false)}
        onReorder={handleReorder}
      />
    </Box>
  );
}
