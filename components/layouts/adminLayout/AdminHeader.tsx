"use client";

import { logoutAPI } from "@/api/authControllers";
import { clearRoleCsrfToken } from "@/api/config";
import { SERVER_ENDPOINTS } from "@/api/serverConstant";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useSocketStore } from "@/stores/socketStore";
import { useUserStore } from "@/stores/userStore";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import {
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { io } from "socket.io-client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { showSnackbar } = useSnackbarStore();

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

    const handleAstrologyNotification = (message?: string) => {
      const msg = message || 'New Astrology Booking Request';
      addNotification(msg);
      incrementUnread();
      triggerRefresh();
    };

    socket.on("notification:new", (data: any) => {
      const refType = (data?.referenceType || "").toUpperCase();
      const type = (data?.type || "").toUpperCase();
      const bookingType = (data?.bookingType || data?.booking?.bookingType || "").toUpperCase();
      const msg = data?.message || "";
      const lowerMsg = msg.toLowerCase();

      // Check if Astrology notification
      const isAstrology =
        refType === "ASTROLOGY" ||
        type.includes("ASTROLOGY") ||
        bookingType === "ASTROLOGY" ||
        lowerMsg.includes("astrology") ||
        lowerMsg.includes("consultation");

      if (isAstrology) {
        handleAstrologyNotification(msg);
        return;
      }

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
        return;
      }

      if (refType === "BOOKING" || type.includes("BOOKING") || lowerMsg.includes("booking")) {
        handleOrderNotification(msg || "New Booking Notification");
      }
    });

    // Dedicated Astrology booking events for Admin
    socket.on("New Astrology Consultation Scheduled", (data: any) => {
      handleAstrologyNotification(data?.message || "New Astrology Consultation Scheduled");
    });

    socket.on("new_astrology_consultation_scheduled", (data: any) => {
      handleAstrologyNotification(data?.message || "New Astrology Consultation Scheduled");
    });

    socket.on("new_astrology_booking", (data: any) => {
      handleAstrologyNotification(data?.message);
    });

    socket.on("astrology_booking_created", (data: any) => {
      handleAstrologyNotification(data?.message);
    });

    socket.on("astrology_consultation_scheduled", (data: any) => {
      handleAstrologyNotification(data?.message);
    });

    socket.on("astrology:consultation_scheduled", (data: any) => {
      handleAstrologyNotification(data?.message);
    });

    socket.on("astrology:new_booking", (data: any) => {
      handleAstrologyNotification(data?.message);
    });

    socket.on("new_booking", (data: any) => {
      const bookingType = (data?.bookingType || data?.booking?.bookingType || "").toUpperCase();
      if (bookingType === "ASTROLOGY" || data?.astrologerId != null) {
        handleAstrologyNotification(data?.message);
      } else {
        triggerRefresh();
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

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (error: any) {
      console.error("Logout notice:", error);
    } finally {
      clearRoleCsrfToken();
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("activeRole");
        localStorage.removeItem("csrfToken");
      }
      useUserStore.getState().clearProfile();
      showSnackbar("Logout successful", "success");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 300);
    }
  };

  const displayName =
    currentUser?.name ||
    (profile?.firstName ? `${profile.firstName} ${profile.lastName || ""}`.trim() : null) ||
    profile?.name ||
    (currentUser?.email ? currentUser.email.split("@")[0] : "Super Admin");

  const email = currentUser?.email || profile?.email || "admin@poojawala.com";
  const rawRole = String(currentUser?.role || profile?.role || "ADMIN").toUpperCase();
  const roleLabel =
    rawRole === "SUPER_ADMIN" || rawRole === "SUPERADMIN"
      ? "Super Admin"
      : "Administrator";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .filter(Boolean)
    .join("")
    .substring(0, 2)
    .toUpperCase() || "SA";

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
        px: { xs: 2, sm: 2.5, md: 3, lg: 4 },
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          flex: 1,
          minWidth: 0,
        }}
      >
        <IconButton
          onClick={onMenuClick}
          aria-label="Open menu"
          edge="start"
          sx={{
            display: { lg: "none" },
            color: "#475569",
            borderRadius: "8px",
            p: 1,
            ml: { xs: -1, sm: -1 },
            "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Mobile / Tablet Logo (hidden on desktop where sidebar already has the logo) */}
        <Box
          component={NextLink}
          href="/admin/dashboard"
          sx={{
            display: { xs: "flex", lg: "none" },
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src="/images/1Poojalogo.webp"
            alt="1Pooja"
            sx={{
              height: { xs: "28px", sm: "32px" },
              maxWidth: "130px",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>

      {/* Right Action Icons: Notification Icon & Profile Avatar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          position: "relative",
        }}
      >
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleOpenNotif}
            sx={{
              color: COLORS.SLATE_MUTED,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              p: { xs: 0.9, sm: 1.2 },
              borderRadius: "10px",
              "&:hover": {
                bgcolor: "#fff7ed",
                color: COLORS.PRIMARY,
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
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Profile Avatar Circle */}
        <Tooltip title="Admin Account">
          <IconButton
            onClick={(e) => setUserMenuAnchorEl(e.currentTarget)}
            sx={{
              p: 0.5,
              border: "2px solid #FFF0E6",
              transition: "all 0.2s ease",
              "&:hover": {
                border: `2px solid ${COLORS.PRIMARY}`,
                transform: "scale(1.05)",
              },
            }}
          >
            <Avatar
              src={
                currentUser?.profileImage ||
                currentUser?.avatar ||
                profile?.profileImage ||
                profile?.avatar ||
                undefined
              }
              sx={{
                width: { xs: 34, sm: 38 },
                height: { xs: 34, sm: 38 },
                bgcolor: COLORS.PRIMARY,
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                fontFamily: FONTS.OUTFIT_ONLY,
                cursor: "pointer",
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Notifications Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseNotif}
          marginThreshold={12}
          slotProps={{
            paper: {
              sx: {
                width: { xs: "calc(100vw - 32px)", sm: 340 },
                maxWidth: { xs: "calc(100vw - 32px)", sm: 360 },
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
                fontFamily: FONTS.OUTFIT_ONLY,
                fontWeight: 800,
                fontSize: "16px",
                color: COLORS.SLATE_DARK,
              }}
            >
              Notifications
            </Typography>
            {notifications.length > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: COLORS.PRIMARY,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT_ONLY,
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
                  fontFamily: FONTS.OUTFIT_ONLY,
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
                        fontFamily: FONTS.OUTFIT,
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
                        fontFamily: FONTS.OUTFIT,
                      },
                    },
                  }}
                />
              </MenuItem>
            ))
          )}
        </Menu>

        {/* User Profile Dropdown Menu */}
        <Menu
          anchorEl={userMenuAnchorEl}
          open={Boolean(userMenuAnchorEl)}
          onClose={() => setUserMenuAnchorEl(null)}
          marginThreshold={12}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          slotProps={{
            paper: {
              sx: {
                width: { xs: "calc(100vw - 32px)", sm: 260 },
                maxWidth: { xs: "calc(100vw - 32px)", sm: 270 },
                borderRadius: { xs: "14px", sm: "16px" },
                border: "1px solid #EFE6D5",
                boxShadow: "0 16px 40px rgba(44, 24, 16, 0.12)",
                p: 0.5,
                mt: 1.2,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT_ONLY,
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#1e293b",
              }}
              noWrap
            >
              {displayName}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT_ONLY,
                color: "#64748b",
                fontSize: "0.8rem",
                wordBreak: "break-all",
                mt: 0.25,
              }}
              noWrap
            >
              {email}
            </Typography>
            <Chip
              label={roleLabel}
              size="small"
              sx={{
                mt: 1,
                bgcolor: "#FFF0E6",
                color: COLORS.PRIMARY,
                fontWeight: 600,
                fontSize: "11px",
                height: "22px",
                border: "1px solid #FFE0D0",
              }}
            />
          </Box>
          <Divider sx={{ my: 0.5 }} />

          <MenuItem
            onClick={() => {
              setUserMenuAnchorEl(null);
              handleLogout();
            }}
            sx={{
              borderRadius: "8px",
              py: 1.2,
              fontFamily: FONTS.OUTFIT_ONLY,
              fontSize: "14px",
              fontWeight: 600,
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              "&:hover": { bgcolor: "#fef2f2" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18, color: "#dc2626" }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
