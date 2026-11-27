"use client";
import CategoryIcon from "@mui/icons-material/Category";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmailIcon from "@mui/icons-material/Email";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ArticleIcon from "@mui/icons-material/Article";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import {
  Box,
  Collapse,
  Drawer,
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
import React, { useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 288;

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/admin/dashboard" },
    {
      text: "Bookings",
      icon: <EventNoteIcon fontSize="small" />,
      path: "/admin/bookings",
      children: [
        { text: "Pooja Bookings", path: "/admin/bookings" },
        { text: "Astrology Bookings", path: "/admin/astrology-bookings" },
      ],
    },
    {
      text: "Partners",
      icon: <SupervisorAccountIcon fontSize="small" />,
      path: "/admin/partners",
      children: [
        { text: "Purohits", path: "/admin/purohits" },
        { text: "Astrologers", path: "/admin/astrologers" },
      ],
    },
    { text: "Customers", icon: <GroupsIcon fontSize="small" />, path: "/admin/users" },
    {
      text: "Categories",
      icon: <CategoryIcon fontSize="small" />,
      path: "/admin/service-categories",
    },
    { text: "Services", icon: <BookOnlineIcon fontSize="small" />, path: "/admin/services" },
    { text: "Temples", icon: <TempleHinduIcon fontSize="small" />, path: "/admin/temples" },
    { text: "Products", icon: <ShoppingBagIcon fontSize="small" />, path: "/admin/products" },
    { text: "Product Orders", icon: <LocalShippingIcon fontSize="small" />, path: "/admin/orders" },
    { text: "Blogs", icon: <ArticleIcon fontSize="small" />, path: "/admin/blogs" },
    {
      text: "Finance",
      icon: <LocalAtmIcon fontSize="small" />,
      path: "/admin/finance",
      children: [
        { text: "Payments", path: "/admin/finance/payments" },
        { text: "Booking Settlements", path: "/admin/finance/bookings" },
        { text: "Partner Payouts", path: "/admin/finance/payouts" },
      ],
    },
    { text: "Reviews", icon: <StarBorderIcon fontSize="small" />, path: "/admin/reviews" },
    {
      text: "Complaints",
      icon: <ReportProblemIcon fontSize="small" />,
      path: "/admin/complaints",
    },
    {
      text: "Contact Enquiries",
      icon: <EmailIcon fontSize="small" />,
      path: "/admin/contact-messages",
    },
  ];

  React.useEffect(() => {
    menuItems.forEach((item: any) => {
      if (
        item.children &&
        (pathname === item.path ||
          pathname.startsWith(item.path) ||
          item.children.some((c: any) => pathname === c.path || pathname.startsWith(c.path)))
      ) {
        setExpandedItems((prev) => ({ ...prev, [item.path]: true }));
      }
    });
  }, [pathname]);

  const toggleExpand = (path: string) => {
    setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 2,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <List
          sx={{
            p: 0,
            "& .MuiListItemButton-root": { mb: 0.75, borderRadius: "12px" },
          }}
        >
          {menuItems.map((item: any) => {
            const hasChildren = !!item.children && item.children.length > 0;
            const isExactActive = pathname === item.path && !hasChildren;
            const isChildActive =
              hasChildren &&
              (pathname.startsWith(item.path) ||
                item.children.some((c: any) => pathname === c.path || pathname.startsWith(c.path)));
            const active = isExactActive || isChildActive;
            const isExpanded = !!expandedItems[item.path];

            return (
              <Box key={item.path}>
                {hasChildren ? (
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => toggleExpand(item.path)}
                      sx={{
                        py: 1.2,
                        px: 2,
                        backgroundColor: active ? "#FFF0E6" : "transparent",
                        color: active ? COLORS.PRIMARY : "#475569",
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                          backgroundColor: active ? "#FFF0E6" : "#f8fafc",
                          color: active ? COLORS.PRIMARY : "#1e293b",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 38, color: "inherit", display: "flex", alignItems: "center" }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT_ONLY,
                              fontWeight: active ? 700 : 500,
                              fontSize: "0.95rem",
                              lineHeight: 1.2,
                            }}
                          >
                            {item.text}
                          </Typography>
                        }
                      />
                      {isExpanded ? (
                        <ExpandMoreIcon fontSize="small" />
                      ) : (
                        <ChevronRightIcon fontSize="small" />
                      )}
                    </ListItemButton>
                  </ListItem>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={NextLink}
                      href={item.path}
                      onClick={onLinkClick}
                      sx={{
                        py: 1.2,
                        px: 2,
                        backgroundColor: active ? "#FFF0E6" : "transparent",
                        color: active ? COLORS.PRIMARY : COLORS.SLATE_MUTED,
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                          backgroundColor: active ? "#FFF0E6" : "#f8fafc",
                          color: active ? COLORS.PRIMARY : COLORS.SLATE_DARK,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 38, color: "inherit", display: "flex", alignItems: "center" }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT_ONLY,
                              fontWeight: active ? 700 : 500,
                              fontSize: "0.95rem",
                              lineHeight: 1.2,
                            }}
                          >
                            {item.text}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                )}

                {hasChildren && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List
                      component="div"
                      disablePadding
                      sx={{ pl: 2, mt: 0.5, mb: 1 }}
                    >
                      <Box sx={{ borderLeft: "2px solid #FFF0E6", pl: 1 }}>
                        {item.children?.map((child: any) => {
                          const childActive = pathname === child.path;
                          return (
                            <ListItem key={child.path} disablePadding>
                              <ListItemButton
                                component={NextLink}
                                href={child.path}
                                onClick={onLinkClick}
                                sx={{
                                  borderRadius: "8px",
                                  py: 1,
                                  px: 2,
                                  mb: 0.5,
                                  backgroundColor: childActive
                                    ? COLORS.PRIMARY
                                    : "transparent",
                                  color: childActive ? "#ffffff" : COLORS.SLATE_MUTED,
                                  boxShadow: childActive
                                    ? "0 4px 14px rgba(255, 98, 0, 0.2)"
                                    : "none",
                                  "&:hover": {
                                    backgroundColor: childActive
                                      ? COLORS.PRIMARY_HOVER
                                      : "#f8fafc",
                                    color: childActive ? "#ffffff" : COLORS.PRIMARY,
                                  },
                                }}
                              >
                                <ListItemText
                                  disableTypography
                                  primary={
                                    <Typography
                                      sx={{
                                        fontFamily: FONTS.OUTFIT_ONLY,
                                        fontWeight: childActive ? 600 : 400,
                                        fontSize: "0.875rem",
                                      }}
                                    >
                                      {child.text}
                                    </Typography>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </Box>
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            zIndex: 1000,
          },
        }}
      >
        <Box
          sx={{
            height: { xs: 64, sm: 80 },
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box
            component="img"
            src="/images/1Poojalogo.webp"
            alt="1Pooja"
            sx={{
              height: { xs: "28px", sm: "36px" },
              maxWidth: "180px",
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
        </Box>
        <SidebarContent />
      </Drawer>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={isOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          zIndex: 1300,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: 290, sm: 300 },
            maxWidth: "85vw",
            backgroundColor: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            borderRight: "none",
          },
        }}
      >
        <Box
          sx={{
            height: { xs: 64, sm: 80 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2, sm: 3 },
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box
            component="img"
            src="/images/1Poojalogo.webp"
            alt="1Pooja"
            sx={{
              height: { xs: "32px", sm: "36px" },
              maxWidth: "160px",
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
          <IconButton
            onClick={onClose}
            aria-label="Close navigation"
            sx={{
              color: "#64748b",
              width: 36,
              height: 36,
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#FFF0E6", color: COLORS.PRIMARY },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
        <SidebarContent onLinkClick={onClose} />
      </Drawer>
    </>
  );
}
