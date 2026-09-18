"use client";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
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
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/verify-otp" ||
    pathname === "/purohit" ||
    pathname.startsWith("/purohit/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/customer")
  )
    return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Purohits", href: "/purohits" },
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
            <Box
              component="img"
              src="/images/logo.png"
              alt="Poojawala"
              sx={{ height: { xs: "40px", md: "60px" }, objectFit: "contain" }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 4,
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  component={NextLink}
                  href={link.href}
                  underline="none"
                  sx={{
                    color: isActive ? "#D32F2F" : "#666",
                    fontWeight: isActive ? 600 : 500,
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
            <Button
              component={NextLink}
              href="/purohit"
              variant="outlined"
              sx={{
                display: { xs: "none", md: "inline-flex" },
                borderColor: "#FF6200",
                color: "#FF6200",
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                py: 0.8,
                fontSize: "14px",
                "&:hover": {
                  borderColor: "#E65800",
                  bgcolor: "#FFF0E6",
                  color: "#E65800",
                },
              }}
            >
              Register as Purohit
            </Button>
            <Button
              component={NextLink}
              href="/sign-in"
              variant="contained"
              sx={{
                display: { xs: "none", md: "inline-flex" },
                background: "#FF6200",
                color: "white",
                borderRadius: "30px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 0.8,
                fontSize: "14px",
                "&:hover": { background: "#F05A00" },
              }}
            >
              Sign In
            </Button>

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
            bgcolor: "rgba(255, 255, 255, 0.85)",
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
            justifyContent: "flex-end",
            px: 2,
            py: 1.5,
          }}
        >
          <IconButton onClick={handleDrawerToggle} aria-label="close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Nav Links */}
        <List sx={{ px: 1, py: 2 }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <ListItem key={link.name} disablePadding>
                <ListItemButton
                  component={NextLink}
                  href={link.href}
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
                      fontFamily: '"DM Sans", sans-serif',
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
          <Button
            component={NextLink}
            href="/sign-in"
            variant="contained"
            fullWidth
            onClick={handleDrawerToggle}
            sx={{
              background: "#FF6200",
              color: "white",
              borderRadius: "30px",
              textTransform: "none",
              py: 1.2,
              fontWeight: 600,
              fontSize: "15px",
              "&:hover": { background: "#F05A00" },
            }}
          >
            Sign In
          </Button>
          <Button
            component={NextLink}
            href="/purohit"
            variant="outlined"
            fullWidth
            onClick={handleDrawerToggle}
            sx={{
              borderColor: "#FF6200",
              color: "#FF6200",
              borderRadius: "30px",
              textTransform: "none",
              py: 1.2,
              fontWeight: 600,
              fontSize: "15px",
              "&:hover": {
                borderColor: "#E65800",
                bgcolor: "#FFF0E6",
                color: "#E65800",
              },
            }}
          >
            Register as Purohit
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
