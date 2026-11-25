"use client";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LanguageIcon from "@mui/icons-material/Language";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useCartStore } from "@/stores/cartStore";
import { useSocketStore } from "@/stores/socketStore";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { logoutAPI } from "@/api/authControllers";
import { clearRoleCsrfToken } from "@/api/config";
import { isCustomerLoggedIn } from "@/utils/helpers";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOffline = searchParams.get("isOffline") === "true";
  const isOnline = searchParams.get("isOnline") === "true";
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile } = useUserStore();
  const { showSnackbar } = useSnackbarStore();
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const role = (profile?.role || "").toUpperCase();
    const hasRole = Boolean(role && ["CUSTOMER", "PUROHIT", "ASTROLOGER", "ADMIN", "SUPER_ADMIN", "SUPERADMIN"].includes(role));
    setIsCustomer(hasRole || isCustomerLoggedIn());
  }, [profile]);

  const dashboardHref =
    (profile?.role || "").toUpperCase() === "ADMIN" ||
    (profile?.role || "").toUpperCase() === "SUPER_ADMIN" ||
    (profile?.role || "").toUpperCase() === "SUPERADMIN"
      ? "/admin/dashboard"
      : (profile?.role || "").toUpperCase() === "PUROHIT" ||
        (profile?.role || "").toUpperCase() === "ASTROLOGER"
      ? "/partner/dashboard"
      : "/customer/dashboard";

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
      useCartStore.getState().resetCart();
      useSocketStore.getState().clearNotifications();
      setIsCustomer(false);
      showSnackbar("Logout successful", "success");
      router.refresh();
    }
  };

  if (
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-otp" ||
    pathname === "/partner" || pathname === "/purohit" ||
    pathname.startsWith("/partner/") || pathname.startsWith("/purohit/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/customer")
  )
    return null;

  const isLinkActive = (href: string) => {
    if (href === "/services?isOffline=true") {
      return pathname === "/services" && isOffline;
    }
    if (href === "/services?isOnline=true") {
      return pathname === "/services" && isOnline;
    }
    return pathname === href;
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <HomeIcon sx={{ fontSize: 20 }} /> },
    { name: "Offline Services", href: "/services?isOffline=true", icon: <StorefrontIcon sx={{ fontSize: 20 }} /> },
    { name: "Online Services", href: "/services?isOnline=true", icon: <LanguageIcon sx={{ fontSize: 20 }} /> },
    { name: "Temples", href: "/temples", icon: <TempleHinduIcon sx={{ fontSize: 20 }} /> },
    { name: "Astrologers", href: "/astrologers", icon: <AutoAwesomeIcon sx={{ fontSize: 20 }} /> },
    { name: "Contact Us", href: "/contact", icon: <SupportAgentIcon sx={{ fontSize: 20 }} /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Box sx={{ position: "sticky", top: 0, zIndex: 1100, borderBottom: "1px solid #eee", bgcolor: "#fff", py: { xs: 1.5, md: 1.8 }, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            component={NextLink}
            href="/"
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src="/images/1Poojalogo.webp"
              alt="1Pooja"
              width={116}
              height={47}
              priority
              style={{
                height: "auto",
                maxHeight: "44px",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0.35px 0 0 rgba(211,47,47,0.45)) drop-shadow(-0.35px 0 0 rgba(211,47,47,0.45)) contrast(1.1)",
                transition: "transform 0.2s ease",
              }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: { md: 1, lg: 1.5 },
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  component={NextLink}
                  href={link.href}
                  prefetch={false}
                  underline="none"
                  sx={{
                    color: isActive ? COLORS.PRIMARY : "#475569",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "14.5px",
                    fontFamily: FONTS.OUTFIT,
                    px: 1.6,
                    py: 0.7,
                    borderRadius: "20px",
                    bgcolor: isActive ? "#FFF3EB" : "transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: COLORS.PRIMARY,
                      bgcolor: isActive ? "#FFF3EB" : "#FAF4EE",
                    },
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </Box>

          {/* Desktop Buttons + Mobile Hamburger */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isCustomer ? (
              <>
                <Button
                  component={NextLink}
                  href={dashboardHref}
                  prefetch={false}
                  variant="contained"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    background: COLORS.PRIMARY,
                    color: "white",
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 2.8,
                    py: 0.8,
                    fontSize: "14px",
                    fontFamily: FONTS.OUTFIT,
                    boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                    "&:hover": { background: COLORS.PRIMARY_DARK },
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  startIcon={<LogoutIcon sx={{ fontSize: 17 }} />}
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    borderColor: "#fed7aa",
                    color: COLORS.PRIMARY,
                    bgcolor: "#fff",
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.2,
                    py: 0.8,
                    fontSize: "14px",
                    fontFamily: FONTS.OUTFIT,
                    "&:hover": {
                      borderColor: "#f87171",
                      bgcolor: "#fef2f2",
                      color: "#dc2626",
                    },
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={NextLink}
                  href="/partner"
                  prefetch={false}
                  variant="outlined"
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    borderColor: COLORS.PRIMARY,
                    color: COLORS.PRIMARY,
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 2.2,
                    py: 0.8,
                    fontSize: "13.5px",
                    fontFamily: FONTS.OUTFIT,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: COLORS.PRIMARY_DARK,
                      bgcolor: "#FFF0E6",
                      color: COLORS.PRIMARY_DARK,
                    },
                  }}
                >
                  Register as Astrologer/Purohit
                </Button>
                <Button
                  component={NextLink}
                  href="/sign-in"
                  prefetch={false}
                  variant="contained"
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                    background: "linear-gradient(135deg, #FF6200 0%, #E55800 100%)",
                    color: "white",
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 3,
                    py: 0.85,
                    fontSize: "14px",
                    fontFamily: FONTS.OUTFIT,
                    boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      background: COLORS.PRIMARY_DARK,
                      boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
                    },
                  }}
                >
                  Sign In
                </Button>
              </>
            )}

            {/* Hamburger Icon — Mobile Only */}
            <IconButton
              aria-label="open navigation menu"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#2C1810",
                p: 0.9,
                bgcolor: "#FAF4EE",
                border: "1px solid #EFE6D5",
                borderRadius: "10px",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "#FFF0E6", color: COLORS.PRIMARY },
              }}
            >
              <MenuIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiBackdrop-root": {
            bgcolor: "rgba(44, 24, 16, 0.35)",
            backdropFilter: "blur(2px)",
          },
          "& .MuiDrawer-paper": {
            width: { xs: "295px", sm: "320px" },
            maxWidth: "86vw",
            bgcolor: "#FFFDFB",
            boxShadow: "-8px 0 32px rgba(44, 24, 16, 0.15)",
            borderLeft: "1px solid #FFE4D6",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.2,
            py: 1.8,
            borderBottom: "1px solid #F1E9DF",
            bgcolor: "#FFFFFF",
          }}
        >
          <Link
            component={NextLink}
            href="/"
            onClick={handleDrawerToggle}
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src="/images/1Poojalogo.webp"
              alt="1Pooja"
              width={116}
              height={47}
              style={{
                height: "auto",
                maxHeight: "34px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Link>
          <IconButton
            onClick={handleDrawerToggle}
            aria-label="close menu"
            size="small"
            sx={{
              width: 32,
              height: 32,
              color: "#64748B",
              bgcolor: "#FAF4EE",
              border: "1px solid #EFE6D5",
              boxShadow: "0 2px 6px rgba(44, 24, 16, 0.05)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#FFF8F2",
                color: COLORS.PRIMARY,
                borderColor: "#FFD4BC",
                transform: "scale(1.05)",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Drawer Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer Nav Links */}
          <List disablePadding sx={{ mb: 1 }}>
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <ListItem key={link.name} disablePadding sx={{ mb: 0.6 }}>
                  <ListItemButton
                    component={NextLink}
                    href={link.href}
                    prefetch={false}
                    onClick={handleDrawerToggle}
                    sx={{
                      borderRadius: "12px",
                      py: 1.1,
                      px: 1.5,
                      bgcolor: isActive ? "#FFF0E6" : "transparent",
                      border: isActive
                        ? "1px solid #FFE4D6"
                        : "1px solid transparent",
                      color: isActive ? COLORS.PRIMARY : "#2C1810",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      "&:hover": {
                        bgcolor: isActive ? "#FFF0E6" : "#FAF4EE",
                        color: COLORS.PRIMARY,
                        "& .menu-icon": { color: COLORS.PRIMARY },
                      },
                    }}
                  >
                    <Box
                      className="menu-icon"
                      sx={{
                        color: isActive ? COLORS.PRIMARY : "#8C7D73",
                        display: "flex",
                        alignItems: "center",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {link.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "15px",
                        lineHeight: 1.2,
                      }}
                    >
                      {link.name}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {/* Action Buttons */}
          <Box
            sx={{
              pt: 2,
              borderTop: "1px dashed #EFE6D5",
              display: "flex",
              flexDirection: "column",
              gap: 1.4,
            }}
          >
            {isCustomer ? (
              <>
                <Button
                  component={NextLink}
                  href={dashboardHref}
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  onClick={handleDrawerToggle}
                  sx={{
                    background: COLORS.PRIMARY,
                    color: "white",
                    borderRadius: "30px",
                    textTransform: "none",
                    py: 1.2,
                    fontWeight: 700,
                    fontSize: "14.5px",
                    fontFamily: FONTS.OUTFIT,
                    boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                    "&:hover": { background: COLORS.PRIMARY_DARK },
                  }}
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LogoutIcon sx={{ fontSize: 18 }} />}
                  onClick={() => {
                    handleDrawerToggle();
                    handleLogout();
                  }}
                  sx={{
                    borderColor: "#fed7aa",
                    color: COLORS.PRIMARY,
                    borderRadius: "30px",
                    textTransform: "none",
                    py: 1.1,
                    fontWeight: 600,
                    fontSize: "14px",
                    fontFamily: FONTS.OUTFIT,
                    "&:hover": {
                      borderColor: "#f87171",
                      bgcolor: "#fef2f2",
                      color: "#dc2626",
                    },
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={NextLink}
                  href="/sign-in"
                  variant="contained"
                  fullWidth
                  startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
                  onClick={handleDrawerToggle}
                  sx={{
                    background: "linear-gradient(135deg, #FF6200 0%, #E55800 100%)",
                    color: "white",
                    borderRadius: "30px",
                    textTransform: "none",
                    py: 1.25,
                    fontWeight: 700,
                    fontSize: "14.5px",
                    fontFamily: FONTS.OUTFIT,
                    boxShadow: "0 6px 18px rgba(255, 98, 0, 0.28)",
                    "&:hover": {
                      background: COLORS.PRIMARY_DARK,
                      boxShadow: "0 8px 22px rgba(255, 98, 0, 0.36)",
                    },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={NextLink}
                  href="/partner"
                  variant="outlined"
                  fullWidth
                  startIcon={<HowToRegIcon sx={{ fontSize: 18 }} />}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderColor: COLORS.PRIMARY,
                    color: COLORS.PRIMARY,
                    bgcolor: "#FFFDFB",
                    borderRadius: "30px",
                    textTransform: "none",
                    py: 1.15,
                    fontWeight: 600,
                    fontSize: "13.5px",
                    fontFamily: FONTS.OUTFIT,
                    "&:hover": {
                      borderColor: COLORS.PRIMARY_DARK,
                      bgcolor: "#FFF0E6",
                      color: COLORS.PRIMARY_DARK,
                    },
                  }}
                >
                  Register as Astrologer/Purohit
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

const NavbarPlaceholder = () => (
  <Box
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 1100,
      borderBottom: "1px solid #eee",
      bgcolor: "#fff",
      height: "79px",
      width: "100%",
    }}
  />
);

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarPlaceholder />}>
      <NavbarContent />
    </Suspense>
  );
}

