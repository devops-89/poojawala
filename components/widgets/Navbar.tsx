"use client";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LogoutIcon from "@mui/icons-material/Logout";
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
    { name: "Home", href: "/" },
    { name: "Offline Services", href: "/services?isOffline=true" },
    { name: "Online Services", href: "/services?isOnline=true" },
    { name: "Temples", href: "/temples" },
    { name: "Astrologers", href: "/astrologers" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Box sx={{ position: "sticky", top: 0, zIndex: 1100, borderBottom: "1px solid #eee", bgcolor: "#fff", py: 2, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
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
                maxHeight: "46px",
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
              gap: 3.5,
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
                    color: isActive ? "#D32F2F" : "#666",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "15px",
                    fontFamily: FONTS.PRIMARY,
                    transition: "color 0.2s",
                    "&:hover": { color: "#D32F2F" },
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
                    fontWeight: 600,
                    px: 2.8,
                    py: 0.8,
                    fontSize: "14px",
                    fontFamily: FONTS.PRIMARY,
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
                    fontFamily: FONTS.PRIMARY,
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
                    fontSize: "14px",
                    fontFamily: FONTS.PRIMARY,
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
                    background: COLORS.PRIMARY,
                    color: "white",
                    borderRadius: "30px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 0.8,
                    fontSize: "14px",
                    fontFamily: FONTS.PRIMARY,
                    "&:hover": { background: COLORS.PRIMARY_DARK },
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
                color: "#1A1A1A",
              }}
            >
              <MenuIcon sx={{ fontSize: 28 }} />
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
            bgcolor: "rgba(0,0,0,0.3)",
          },
          "& .MuiDrawer-paper": {
            width: "280px",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
            borderLeft: "1px solid rgba(255,255,255,0.3)",
          },
        }}
      >
        {/* Drawer Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
            borderBottom: "1px solid #f1f5f9",
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
                maxHeight: "36px",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0.35px 0 0 rgba(211,47,47,0.45)) drop-shadow(-0.35px 0 0 rgba(211,47,47,0.45)) contrast(1.1)",
              }}
            />
          </Link>
          <IconButton onClick={handleDrawerToggle} aria-label="close menu" size="small" sx={{ color: "#64748b" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Nav Links */}
        <List sx={{ px: 1, py: 2 }}>
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            return (
              <ListItem key={link.name} disablePadding>
                <ListItemButton
                  component={NextLink}
                  href={link.href}
                  prefetch={false}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: "12px",
                    mb: 0.5,
                    bgcolor: isActive
                      ? "rgba(211, 47, 47, 0.08)"
                      : "transparent",
                    "&:hover": {
                      bgcolor: "rgba(211, 47, 47, 0.05)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "#D32F2F" : "#333",
                      fontSize: "16px",
                    }}
                  >
                    {link.name}
                  </Typography>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Action Buttons — right below links */}
        <Box sx={{ px: 2, pt: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
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
                  fontWeight: 600,
                  fontSize: "15px",
                  fontFamily: FONTS.PRIMARY,
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
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: "15px",
                  fontFamily: FONTS.PRIMARY,
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
                onClick={handleDrawerToggle}
                sx={{
                  background: COLORS.PRIMARY,
                  color: "white",
                  borderRadius: "30px",
                  textTransform: "none",
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: "15px",
                  fontFamily: FONTS.PRIMARY,
                  "&:hover": { background: COLORS.PRIMARY_DARK },
                }}
              >
                Sign In
              </Button>
              <Button
                component={NextLink}
                href="/partner"
                variant="outlined"
                fullWidth
                onClick={handleDrawerToggle}
                sx={{
                  borderColor: COLORS.PRIMARY,
                  color: COLORS.PRIMARY,
                  borderRadius: "30px",
                  textTransform: "none",
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: FONTS.PRIMARY,
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

