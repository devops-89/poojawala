"use client";
import { logoutAPI } from "@/api/authControllers";
import { useCartStore } from "@/stores/cartStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useSocketStore } from "@/stores/socketStore";
import { useUserStore } from "@/stores/userStore";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CustomerHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  const { unreadCount, notifications, clearNotifications } = useSocketStore();
  const openCart = useCartStore((state) => state.openCart);
  const fetchCartFromApi = useCartStore((state) => state.fetchCartFromApi);
  const items = useCartStore((state) => state.items);
  const totalItemsCount = useCartStore((state) => state.totalItemsCount);

  const [mounted, setMounted] = useState(false);

  // Mobile Drawer State
  const [mobileOpen, setMobileOpen] = useState(false);

  // Notifications menu anchor
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  // User profile menu anchor
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);

  const [transientAlert, setTransientAlert] = useState({
    show: false,
    msg: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute reactive badge count
  const rawCartTotalItems =
    totalItemsCount > 0
      ? totalItemsCount
      : items.reduce((total, item) => total + item.quantity, 0);

  const cartTotalItems = mounted ? rawCartTotalItems : 0;
  const displayUnreadCount = mounted ? unreadCount : 0;

  useEffect(() => {
    fetchProfile();
    fetchCartFromApi();
  }, [fetchProfile, fetchCartFromApi]);

  useEffect(() => {
    if (notifications.length > 0) {
      setTransientAlert({ show: true, msg: notifications[0].message });
      const timer = setTimeout(() => {
        setTransientAlert({ show: false, msg: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications[0]?.id]);

  const handleOpenNotif = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleCloseNotif = () => {
    setNotifAnchorEl(null);
    if (unreadCount > 0) {
      clearNotifications();
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logoutAPI();
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("csrfToken");
      showSnackbar("Logout successful", "success");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1000);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const mainNavItems = [
    { label: "Dashboard", path: "/customer/dashboard", icon: <HomeIcon /> },
    { label: "Services", path: "/customer/services", icon: <StorefrontIcon /> },
    { label: "Pooja Products", path: "/customer/products", icon: <ShoppingBagIcon /> },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      suppressHydrationWarning
      sx={{
        width: "100%",
        left: 0,
        top: 0,
        bgcolor: "white",
        borderBottom: "1px solid #e2e8f0",
        height: { xs: "60px", md: "80px" },
        justifyContent: "center",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: "60px !important", md: "80px !important" },
          px: { xs: 2, sm: 3, md: 6 },
        }}
      >
        {/* Left: Mobile Hamburger & Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(true)}
            suppressHydrationWarning
            sx={{
              display: { md: "none" },
              color: "#1e293b",
            }}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>

          <NextLink
            href="/customer/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src="/images/logo.webp"
              alt="Poojawala"
              sx={{
                height: { xs: "34px", sm: "42px", md: "52px" },
                objectFit: "contain",
                cursor: "pointer",
              }}
            />
          </NextLink>
        </Box>

        {/* Center: Desktop Navigation Links (Hidden on Mobile) */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: { sm: 2, md: 3 },
          }}
        >
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Typography
                key={item.path}
                component={NextLink}
                href={item.path}
                sx={{
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  color: isActive ? "#FF6200" : "#475569",
                  textDecoration: "none",
                  px: { xs: 1.2, sm: 2 },
                  py: 0.8,
                  borderRadius: "20px",
                  backgroundColor: isActive ? "#FFF0E6" : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#FF6200",
                    backgroundColor: isActive ? "#FFF0E6" : "#f8fafc",
                  },
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Box>

        {/* Right: Cart, Notifications & User Avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1.5 },
            position: "relative",
          }}
        >
          {/* Cart Icon Button */}
          <Tooltip title="View Cart">
            <IconButton
              onClick={openCart}
              suppressHydrationWarning
              sx={{
                color: "#64748b",
                bgcolor: "#f8fafc",
                p: { xs: 1, sm: 1.2 },
                "&:hover": { bgcolor: "#f1f5f9", color: "#FF6200" },
                transition: "all 0.2s ease",
              }}
            >
              <Badge
                badgeContent={cartTotalItems}
                color="error"
                invisible={cartTotalItems === 0}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#FF6200",
                    color: "white",
                    fontWeight: 700,
                  },
                }}
              >
                <ShoppingCartOutlinedIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Icon Button */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleOpenNotif}
              suppressHydrationWarning
              sx={{
                color: "#64748b",
                bgcolor: "#f8fafc",
                p: { xs: 1, sm: 1.2 },
                "&:hover": { bgcolor: "#f1f5f9", color: "#FF6200" },
              }}
            >
              <Badge
                badgeContent={displayUnreadCount}
                color="error"
                invisible={displayUnreadCount === 0}
                sx={{
                  "& .MuiBadge-badge": { bgcolor: "#FF6200", color: "white" },
                }}
              >
                <NotificationsIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Avatar Circle */}
          <Tooltip title="Account Options">
            <IconButton onClick={handleOpenUserMenu} suppressHydrationWarning sx={{ p: 0.5, ml: { xs: 0, sm: 0.5 } }}>
              <Avatar
                src={profile?.profileImage || profile?.avatar || undefined}
                sx={{
                  width: { xs: 34, sm: 40 },
                  height: { xs: 34, sm: 40 },
                  bgcolor: "#FF6200",
                  boxShadow: "0 2px 8px rgba(255, 98, 0, 0.25)",
                  cursor: "pointer",
                  border: "2px solid #ffffff",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {!profile?.profileImage && !profile?.avatar && (
                  <PersonIcon sx={{ fontSize: { xs: 20, sm: 24 }, color: "white" }} />
                )}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* Transient Alert */}
          {transientAlert.show && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                right: 0,
                mt: 1,
                width: { xs: 260, sm: 300 },
                zIndex: 1200,
              }}
            >
              <Alert
                severity="info"
                onClose={() => setTransientAlert({ show: false, msg: "" })}
                sx={{
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                  borderRadius: "8px",
                }}
              >
                {transientAlert.msg}
              </Alert>
            </Box>
          )}

          {/* Notifications Menu */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleCloseNotif}
            slotProps={{
              paper: {
                sx: {
                  width: { xs: 280, sm: 320 },
                  maxHeight: 400,
                  mt: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
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
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: "16px",
                }}
              >
                Notifications
              </Typography>
              {notifications.length > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: "#FF6200", cursor: "pointer", fontWeight: 600 }}
                  onClick={clearNotifications}
                >
                  Clear All
                </Typography>
              )}
            </Box>
            {notifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    fontFamily: '"DM Sans", sans-serif',
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
                    borderBottom: "1px solid #f8fafc",
                    whiteSpace: "normal",
                  }}
                >
                  <ListItemText
                    primary={notif.message}
                    secondary={notif.time}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: '"DM Sans", sans-serif',
                          fontSize: "14px",
                          color: "#1e293b",
                        },
                      },
                      secondary: { sx: { fontSize: "12px", mt: 0.5 } },
                    }}
                  />
                </MenuItem>
              ))
            )}
          </Menu>

          {/* User Profile Menu */}
          <Menu
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleCloseUserMenu}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            sx={{
              mt: 1,
              "& .MuiPaper-root": {
                width: 230,
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                p: 0.5,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  color: "#1e293b",
                }}
              >
                {profile?.firstName
                  ? `${profile.firstName} ${profile.lastName || ""}`
                  : "Customer"}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                  color: "#64748b",
                  fontSize: "0.78rem",
                }}
              >
                {profile?.email || ""}
              </Typography>
            </Box>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              component={NextLink}
              href="/customer/profile"
              onClick={handleCloseUserMenu}
              sx={{
                borderRadius: "8px",
                py: 1.2,
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                fontSize: "14px",
                fontWeight: 500,
                color: "#334155",
                "&:hover": { bgcolor: "#FFF0E6", color: "#FF6200" },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: "34px" }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              View Profile
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault();
                handleCloseUserMenu();
                handleLogout();
              }}
              sx={{
                borderRadius: "8px",
                py: 1.2,
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                fontSize: "14px",
                fontWeight: 500,
                color: "#334155",
                "&:hover": {
                  bgcolor: "rgba(244, 67, 54, 0.08) !important",
                  color: "#F44336 !important",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: "34px" }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { md: "none" },
          "& .MuiDrawer-paper": {
            width: 260,
            boxSizing: "border-box",
            bgcolor: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Box
            component="img"
            src="/images/logo.webp"
            alt="Poojawala"
            sx={{ height: "36px", objectFit: "contain" }}
          />
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={{ px: 1.5, py: 2 }}>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={NextLink}
                  href={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: "10px",
                    bgcolor: isActive ? "#FFF0E6" : "transparent",
                    color: isActive ? "#FF6200" : "#475569",
                    "&:hover": {
                      bgcolor: isActive ? "#FFF0E6" : "#f8fafc",
                      color: "#FF6200",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? "#FF6200" : "#64748b", minWidth: 38 }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: isActive ? 700 : 500,
                          fontSize: "0.95rem",
                          fontFamily:
                            'var(--font-outfit), "DM Sans", sans-serif',
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </AppBar>
  );
}
