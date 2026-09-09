"use client";
import { Box, Button, Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  // Removed anchorEl state as we use CSS hover now

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

  return (
    <Box sx={{ borderBottom: "1px solid #eee", bgcolor: "#fff", py: 2 }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ color: "#D32F2F", fontWeight: 700 }}
        >
          Poojawala
        </Typography>

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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={NextLink}
            href="/sign-in"
            variant="contained"
            sx={{
              background: "#FF6200",
              color: "white",
              borderRadius: "30px",
              textTransform: "none",
              px: 3,
              "&:hover": { background: "#F05A00" },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
