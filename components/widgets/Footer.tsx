"use client";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

// Quick Links with their routes
const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Pooja Packages", href: "/services" },
  { name: "Purohits", href: "/purohits" },
  { name: "Help Center", href: "/contact" },
];

// Top Cities (static, no routes)
const citiesColumn1 = ["Mumbai", "Bangalore", "New Delhi", "Pune", "Hyderabad", "Chennai"];
const citiesColumn2 = ["Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore", "View All Cities"];

// Social media links
const socialLinks = [
  {
    icon: FacebookIcon,
    href: "https://facebook.com/poojawala",
    label: "Facebook",
  },
  {
    icon: TwitterIcon,
    href: "https://twitter.com/poojawala",
    label: "Twitter",
  },
  {
    icon: InstagramIcon,
    href: "https://instagram.com/poojawala",
    label: "Instagram",
  },
  {
    icon: LinkedInIcon,
    href: "https://linkedin.com/company/poojawala",
    label: "LinkedIn",
  },
];

// Shared link styles
const linkSx = {
  fontFamily: '"DM Sans", sans-serif',
  color: "#757575",
  fontSize: "14px",
  lineHeight: "15.3px",
  letterSpacing: "0.72px",
  "&:hover": { color: "#CC2E2E" },
};

export default function Footer() {
  const pathname = usePathname();

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

  return (
    <Box component="footer">
      {/* Top Beige Section */}
      <Box sx={{ bgcolor: "#FEEDE2", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand Column */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Link component={NextLink} href="/" underline="none">
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 500,
                    color: "#C82E2E",
                    mb: 1.5,
                    fontSize: { xs: '28px', md: '36px' },
                    lineHeight: "normal",
                    letterSpacing: "0px",
                  }}
                >
                  Poojawala
                </Typography>
              </Link>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#757575",
                  fontSize: "14px",
                  lineHeight: "15.3px",
                  letterSpacing: "0.72px",
                  mb: 3,
                  width: "260px",
                }}
              >
                our trusted partner for divine rituals and sacred ceremonies at
                home.
              </Typography>
              <Box sx={{ display: "flex", gap: 2.5, mt: 1 }}>
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <IconButton
                    key={label}
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      p: 0,
                      color: "#141414",
                      "&:hover": { color: "#C82E2E" },
                    }}
                  >
                    <Icon sx={{ width: "21.55px", height: "21.55px" }} />
                  </IconButton>
                ))}
              </Box>
            </Grid>

            {/* Quick Links Column */}
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  color: "#141414",
                  mb: 3,
                  fontSize: "16px",
                  lineHeight: "15.3px",
                  letterSpacing: "0.72px",
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

            {/* Top Cities Column */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  color: "#141414",
                  mb: 3,
                  fontSize: "16px",
                  lineHeight: "15.3px",
                  letterSpacing: "0.72px",
                }}
              >
                Top Cities
              </Typography>
              <Box sx={{ display: "flex", gap: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    minWidth: "100px",
                  }}
                >
                  {citiesColumn1.map((city) => (
                    <Typography
                      key={city}
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        color: "#757575",
                        fontSize: "14px",
                        lineHeight: "15.3px",
                        letterSpacing: "0.72px",
                      }}
                    >
                      {city}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {citiesColumn2.map((city) => (
                    <Typography
                      key={city}
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        color: "#757575",
                        fontSize: "14px",
                        lineHeight: "15.3px",
                        letterSpacing: "0.72px",
                      }}
                    >
                      {city}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Contact Us Column */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  color: "#141414",
                  mb: 3,
                  fontSize: "16px",
                  lineHeight: "15.3px",
                  letterSpacing: "0.72px",
                }}
              >
                Contact Us
              </Typography>
              <Link
                href="mailto:support@poojawala.com"
                underline="none"
                sx={{
                  ...linkSx,
                  display: "block",
                  mb: 4,
                }}
              >
                support@poojawala.com
              </Link>

              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 600,
                  color: "#141414",
                  mb: 3,
                  fontSize: "16px",
                  lineHeight: "15.3px",
                  letterSpacing: "0.72px",
                }}
              >
                Join Us
              </Typography>
              <Link
                component={NextLink}
                href="/purohit"
                underline="none"
                sx={{
                  ...linkSx,
                  display: "block",
                }}
              >
                Register as Purohit
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
              justifyContent: { xs: 'center', md: 'space-between' },
              alignItems: "center",
              flexDirection: { xs: 'column', md: 'row' },
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#9E9E9E",
                fontSize: "12px",
              }}
            >
              © {new Date().getFullYear()} Poojawala. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Link
                component={NextLink}
                href="/privacy-policy"
                underline="none"
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#9E9E9E",
                  fontSize: "12px",
                  "&:hover": { color: "#CC2E2E" },
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
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#9E9E9E",
                  fontSize: "12px",
                  "&:hover": { color: "#CC2E2E" },
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
