"use client";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getServicesAPI } from "@/api/serviceControllers";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { normalizePoojaText } from "@/utils/helpers";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Offline Services", href: "/services?isOffline=true" },
  { name: "Online Services", href: "/services?isOnline=true" },
  { name: "Temples & Dhams", href: "/temples" },
  { name: "Astrologers", href: "/astrologers" },
  { name: "Blogs", href: "/blogs" },
];

// Default fallback services (shown during SSR / initial load before API responds)
const DEFAULT_POPULAR_SERVICES = [
  { name: "Satyanarayan Pooja", href: "/services/satyanaran-katha" },
  { name: "Griha Pravesh", href: "/services/griha-pravesh" },
  { name: "Rudrabhishek Pooja", href: "/services/online-rudrabhishek-puja" },
  { name: "Maha Mrityunjaya Jaap", href: "/services/online-maha-mrityunjaya-jaap" },
  { name: "Navgraha Shanti Pooja", href: "/services/online-navgraha-shanti-puja" },
];

// Social media links
export const socialLinks = [
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/1poojaofc/",
    label: "Facebook",
  },
  {
    icon: XIcon,
    href: "https://x.com/1poojaofc",
    label: "X",
  },
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/1poojaofc",
    label: "Instagram",
  },
  {
    icon: YouTubeIcon,
    href: "https://www.youtube.com/@1poojaofc",
    label: "YouTube",
  },
  {
    icon: LinkedInIcon,
    href: "https://www.linkedin.com/company/1pooja",
    label: "LinkedIn",
  },
];

// Shared link styles
const linkSx = {
  fontFamily: FONTS.OUTFIT,
  color: "#5A5A5A",
  fontSize: "14.5px",
  lineHeight: 1.5,
  letterSpacing: "normal",
  transition: "all 0.2s ease",
  display: "inline-block",
  "&:hover": { color: COLORS.BRAND_ORANGE, transform: "translateX(2px)" },
};

export default function Footer() {
  const pathname = usePathname();
  const [servicesList, setServicesList] = useState<Array<{ name: string; href: string }>>(DEFAULT_POPULAR_SERVICES);

  useEffect(() => {
    let isMounted = true;
    const fetchFooterServices = async () => {
      try {
        const response = await getServicesAPI(1, 5, "", undefined, undefined, undefined, true);
        const items =
          response?.data?.data && Array.isArray(response.data.data)
            ? response.data.data
            : response?.data && Array.isArray(response.data)
              ? response.data
              : Array.isArray(response)
                ? response
                : [];

        const activeOnly = (items as Array<{ name?: string; slug?: string; isActive?: boolean }>)
          .filter((item) => item && item.isActive !== false && item.name)
          .slice(0, 5)
          .map((item) => ({
            name: normalizePoojaText(item.name || ""),
            href: item.slug ? `/services/${item.slug}` : `/services?search=${encodeURIComponent(item.name || "")}`,
          }));

        if (isMounted && activeOnly.length > 0) {
          setServicesList(activeOnly);
        }
      } catch (error) {
        console.error("Failed to load dynamic footer services:", error);
      }
    };

    fetchFooterServices();
    return () => {
      isMounted = false;
    };
  }, []);

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

  return (
    <Box component="footer">
      {/* Top Beige Section */}
      <Box sx={{ bgcolor: "#FEEDE2", py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 4 }}>
            {/* Brand Column */}
            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
              <Link
                component={NextLink}
                href="/"
                underline="none"
                sx={{ display: "inline-block", mb: 2 }}
              >
                <Image
                  src="/images/1Poojalogo.webp"
                  alt="1Pooja"
                  width={120}
                  height={48}
                  loading="lazy"
                  style={{
                    height: "auto",
                    width: "120px",
                    objectFit: "contain",
                  }}
                />
              </Link>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: "#5A5A5A",
                  fontSize: "14.5px",
                  lineHeight: 1.6,
                  mb: 3,
                  maxWidth: "280px",
                }}
              >
                Your trusted partner for divine rituals and sacred ceremonies at
                home.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      width: 36,
                      height: 36,
                      p: 0,
                      bgcolor: "rgba(0, 0, 0, 0.05)",
                      color: "#2C1810",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: COLORS.BRAND_ORANGE,
                        color: "#FFFFFF",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: "18px" }} />
                  </IconButton>
                ))}
              </Box>
            </Grid>

            {/* Quick Links Column */}
            <Grid size={{ xs: 6, sm: 6, md: 2.5 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  mb: 2.5,
                  fontSize: "16px",
                  lineHeight: 1.3,
                  display: "inline-block",
                  pb: "6px",
                  borderBottom: `2px solid ${COLORS.BRAND_ORANGE}`,
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    component={NextLink}
                    href={link.href}
                    underline="none"
                    sx={linkSx}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Popular Poojas Column (Dynamic from API - 5 items, single column) */}
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  mb: 2.5,
                  fontSize: "16px",
                  lineHeight: 1.3,
                  display: "inline-block",
                  pb: "6px",
                  borderBottom: `2px solid ${COLORS.BRAND_ORANGE}`,
                }}
              >
                Popular Poojas
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {servicesList.slice(0, 5).map((pooja) => (
                  <Link
                    key={pooja.name}
                    component={NextLink}
                    href={pooja.href}
                    underline="none"
                    sx={linkSx}
                  >
                    {normalizePoojaText(pooja.name)}
                  </Link>
                ))}
              </Box>
            </Grid>

            {/* Contact Us Column */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ mb: 3.5 }}>
                <Typography
                  component={NextLink}
                  href="/contact"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    color: "#1A1A1A",
                    mb: 2,
                    fontSize: "16px",
                    lineHeight: 1.3,
                    display: "inline-block",
                    pb: "6px",
                    borderBottom: `2px solid ${COLORS.BRAND_ORANGE}`,
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                    "&:hover": { color: COLORS.BRAND_ORANGE },
                  }}
                >
                  Contact Us
                </Typography>
                <Link
                  href="mailto:info@1pooja.com"
                  underline="none"
                  sx={{
                    ...linkSx,
                    display: "block",
                  }}
                >
                  info@1pooja.com
                </Link>
              </Box>

              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  color: "#1A1A1A",
                  mb: 2,
                  fontSize: "16px",
                  lineHeight: 1.3,
                  display: "inline-block",
                  pb: "6px",
                  borderBottom: `2px solid ${COLORS.BRAND_ORANGE}`,
                }}
              >
                Join Us
              </Typography>
              <Link
                component={NextLink}
                href="/partner"
                underline="none"
                sx={{
                  ...linkSx,
                  display: "block",
                }}
              >
                Register as Astrologer/Purohit
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bottom White Bar */}
      <Box sx={{ bgcolor: "#ffffff", py: 3 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: "center",
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#757575",
                fontSize: "13px",
              }}
            >
              © {new Date().getFullYear()}{" "}
              <Link
                component={NextLink}
                href="/"
                underline="none"
                sx={{
                  color: COLORS.BRAND_ORANGE,
                  fontWeight: 700,
                  transition: "opacity 0.2s ease",
                  "&:hover": {
                    textDecoration: "underline",
                    opacity: 0.85,
                  },
                }}
              >
                1Pooja
              </Link>
              . All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Link
                component={NextLink}
                href="/privacy-policy"
                underline="none"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: "#9E9E9E",
                  fontSize: "12px",
                  transition: "color 0.2s ease",
                  "&:hover": { color: COLORS.BRAND_ORANGE },
                }}
              >
                Privacy Policy
              </Link>
              <Typography sx={{ color: "#9E9E9E", fontSize: "12px" }}>
                |
              </Typography>
              <Link
                component={NextLink}
                href="/terms-and-conditions"
                underline="none"
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  color: "#9E9E9E",
                  fontSize: "12px",
                  transition: "color 0.2s ease",
                  "&:hover": { color: COLORS.BRAND_ORANGE },
                }}
              >
                Terms & Conditions
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
