"use client";

import { SERVER_ENDPOINTS } from "@/api/serverConstant";
import { useSocketStore } from "@/stores/socketStore";
import { useUserStore } from "@/stores/userStore";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  Box,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const {
    unreadCount,
    notifications,
    clearNotifications,
    setUnreadCount,
    addNotification,
    incrementUnread,
    triggerRefresh,
  } = useSocketStore();
  const { profile, fetchProfile } = useUserStore();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchProfile().then((res) => {
      if (res) setCurrentUser(res);
    });
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed) setCurrentUser(parsed);
      } catch (e) {}
    }
  }, [fetchProfile]);

  useEffect(() => {
    const userId =
      currentUser?.id || currentUser?._id || profile?.id || profile?._id;
    if (!userId) return;

    const SOCKET_URL = SERVER_ENDPOINTS.SOCKET_URL;
    const socket = io(SOCKET_URL, {
      path: "/socket.io/",
      auth: { userId: userId },
      transports: ["websocket", "polling"],
    });

    const handleOrderNotification = (message: string) => {
      if (!message) return;
      addNotification(message);
      incrementUnread();
      triggerRefresh();
    };

    socket.on("notification:new", (data: any) => {
      const refType = (data?.referenceType || "").toUpperCase();
      const type = (data?.type || "").toUpperCase();
      const msg = data?.message || "";
      const lowerMsg = msg.toLowerCase();

      // STRICT FILTER: Only process order placement and payment notifications
      const isOrderOrPayment =
        refType === "ORDER" ||
        refType === "PAYMENT" ||
        type.includes("ORDER") ||
        type.includes("PAYMENT") ||
        lowerMsg.includes("order") ||
        lowerMsg.includes("payment");

      if (isOrderOrPayment && msg) {
        handleOrderNotification(msg);
      }
    });

    socket.on("notification:unread-count", (count: any) => {
      const numCount =
        typeof count === "object" && count !== null ? count.count : count;
      if (typeof numCount === "number") {
        setUnreadCount(numCount);
      }
    });

    // Dedicated order & payment socket events from backend
    socket.on("order:new", (orderData: any) => {
      console.log("Real-time New Order Received:", orderData);
      const msg =
        orderData?.message ||
        `New customer order ${orderData?.id || orderData?.orderId || ""} received!`;
      handleOrderNotification(msg);
    });

    socket.on("new_order", (data: any) => {
      const msg =
        data?.message ||
        `New customer order #${data?.orderNumber || data?.id || ""} received!`;
      handleOrderNotification(msg);
    });

    socket.on("order_created", (data: any) => {
      const msg =
        data?.message ||
        `Order #${data?.orderNumber || data?.id || ""} has been placed!`;
      handleOrderNotification(msg);
    });

    socket.on("payment_success", (data: any) => {
      const msg =
        data?.message ||
        `Payment completed for Order #${data?.orderNumber || data?.id || ""}!`;
      handleOrderNotification(msg);
    });

    socket.on("payment_completed", (data: any) => {
      const msg =
        data?.message ||
        `Customer completed payment for Order #${data?.orderNumber || data?.id || ""}!`;
      handleOrderNotification(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [
    currentUser?.id,
    profile?.id,
    setUnreadCount,
    addNotification,
    incrementUnread,
    triggerRefresh,
  ]);

  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotif = () => {
    setAnchorEl(null);
    if (unreadCount > 0) {
      clearNotifications();
    }
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        height: { xs: "64px", sm: "80px" },
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 30,
        justifyContent: "space-between",
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #e2e8f0",
        px: { xs: 2, sm: 4 },
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flex: 1,
          minWidth: 0,
        }}
      >
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { lg: "none" },
            color: "#475569",
            borderRadius: "8px",
            p: 1,
            "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Right Action Icons: Notification Icon */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          position: "relative",
        }}
      >
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleOpenNotif}
            sx={{
              color: "#64748b",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              p: 1.2,
              borderRadius: "10px",
              "&:hover": {
                bgcolor: "#fff7ed",
                color: "#FF6200",
                borderColor: "#ffedd5",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              invisible={unreadCount === 0}
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: "#FF6200",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>


        {/* Notifications Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNotif}
          slotProps={{
            paper: {
              sx: {
                width: 340,
                maxHeight: 420,
                mt: 1.5,
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                border: "1px solid #f1f5f9",
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 800,
                fontSize: "16px",
                color: "#0f172a",
              }}
            >
              Notifications
            </Typography>
            {notifications.length > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: "#FF6200",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: "var(--font-outfit), sans-serif",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={clearNotifications}
              >
                Clear All
              </Typography>
            )}
          </Box>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "14px",
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 500,
                }}
              >
                No new notifications
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <MenuItem
                key={notif.id}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderBottom: "1px solid #f8fafc",
                  whiteSpace: "normal",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <ListItemText
                  primary={notif.message}
                  secondary={notif.time}
                  slotProps={{
                    primary: {
                      sx: {
                        fontFamily: "var(--font-outfit), sans-serif",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1e293b",
                      },
                    },
                    secondary: {
                      sx: {
                        fontSize: "12px",
                        mt: 0.5,
                        color: "#94a3b8",
                        fontFamily: "var(--font-outfit), sans-serif",
                      },
                    },
                  }}
                />
              </MenuItem>
            ))
          )}
        </Menu>
      </Box>
    </Box>
  );
}
