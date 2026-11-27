"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpIcon from "@mui/icons-material/Help";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface PortalSidebarProps {
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PortalSidebar({ setMobileOpen }: PortalSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/partner/dashboard" },
    {
      text: "Pooja Bookings",
      icon: <AssignmentIcon />,
      path: "/partner/bookings",
    },
    {
      text: "Earnings",
      icon: <AccountBalanceWalletIcon />,
      path: "/partner/earnings",
    },
    {
      text: "My Services",
      icon: <LocalOfferIcon />,
      path: "/partner/my-services",
    },
    { text: "Get Support", icon: <HelpIcon />, path: "/partner/support" },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        color: "#1e293b",
        borderRight: "1px solid #e2e8f0",
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          height: { xs: "68px", md: "80px" },
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "space-between", md: "center" },
          px: { xs: 2.5, md: 2 },
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box
          component="img"
          src="/images/1Poojalogo.webp"
          alt="1Pooja"
          sx={{ height: { xs: "32px", md: "38px" }, objectFit: "contain" }}
        />
        <IconButton
          onClick={() => setMobileOpen(false)}
          sx={{
            display: { xs: "flex", md: "none" },
            color: "#64748b",
            p: 0.75,
            borderRadius: "8px",
            bgcolor: "#f8fafc",
            "&:hover": { bgcolor: "#f1f5f9", color: "#1e293b" },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Navigation Links */}
      <List
        sx={{
          flex: 1,
          px: 2,
          py: 2.5,
          overflowY: "auto",
          "& .MuiListItemButton-root": { mb: 0.75, borderRadius: "12px" },
        }}
      >
        {menuItems.map((item: any) => {
          const isActive =
            pathname === item.path ||
            (item.path === "/partner/my-services" &&
              pathname === "/partner/services");
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NextLink}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  backgroundColor: isActive ? "#FFF0E6" : "transparent",
                  color: isActive ? COLORS.PRIMARY : "#475569",
                  py: 1.1,
                  px: 2,
                  transition: "all 0.15s ease",
                  "&:hover": {
                    backgroundColor: isActive ? "#FFF0E6" : "#FAFAFA",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? COLORS.PRIMARY : "inherit",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: isActive ? 700 : 500,
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
