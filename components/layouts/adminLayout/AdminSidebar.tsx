"use client";
import { logoutAPI } from "@/api/authControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EmailIcon from "@mui/icons-material/Email";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LogoutIcon from "@mui/icons-material/Logout";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
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
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DRAWER_WIDTH = 288;

const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const { showSnackbar } = useSnackbarStore();

  const handleLogout = async () => {
    try {
      await logoutAPI();
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("csrfToken");
      showSnackbar("Logout successful", "success");
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (error) {
      console.error("Logout error", error);
      showSnackbar("Logout failed", "error");
    }
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/admin/dashboard" },
    { text: "Bookings", icon: <EventNoteIcon fontSize="small" />, path: "/admin/bookings" },
    {
      text: "Purohits",
      icon: <SupervisorAccountIcon fontSize="small" />,
      path: "/admin/purohits",
    },
    { text: "Customers", icon: <GroupsIcon fontSize="small" />, path: "/admin/users" },
    { text: "Services", icon: <BookOnlineIcon fontSize="small" />, path: "/admin/services" },
    { text: "Products", icon: <ShoppingBagIcon fontSize="small" />, path: "/admin/products" },
    {
      text: "Finance",
      icon: <LocalAtmIcon fontSize="small" />,
      path: "/admin/finance",
      children: [
        { text: "Booking Settlements", path: "/admin/finance/bookings" },
        { text: "Purohit Payouts", path: "/admin/finance/payouts" },
      ],
    },
    { text: "Reviews", icon: <StarBorderIcon fontSize="small" />, path: "/admin/reviews" },
    {
      text: "Complaints",
      icon: <ReportProblemIcon fontSize="small" />,
      path: "/admin/complaints",
    },
    {
      text: "Contact Msgs",
      icon: <EmailIcon fontSize="small" />,
      path: "/admin/contact-messages",
    },
  ];

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

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
            const isExactActive = pathname === item.path;
            const isChildActive = hasChildren && pathname.startsWith(item.path);
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
                        color: active ? "#FF6200" : "#475569",
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                          backgroundColor: active ? "#FFF0E6" : "#f8fafc",
                          color: active ? "#FF6200" : "#1e293b",
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
                              fontFamily: "var(--font-outfit), sans-serif",
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
                        color: active ? "#FF6200" : "#475569",
                        transition: "all 0.15s ease-in-out",
                        "&:hover": {
                          backgroundColor: active ? "#FFF0E6" : "#f8fafc",
                          color: active ? "#FF6200" : "#1e293b",
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
                              fontFamily: "var(--font-outfit), sans-serif",
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
                                    ? "#FF6200"
                                    : "transparent",
                                  color: childActive ? "#ffffff" : "#64748b",
                                  boxShadow: childActive
                                    ? "0 4px 14px rgba(255, 98, 0, 0.2)"
                                    : "none",
                                  "&:hover": {
                                    backgroundColor: childActive
                                      ? "#E65800"
                                      : "#f8fafc",
                                    color: childActive ? "#ffffff" : "#FF6200",
                                  },
                                }}
                              >
                                <ListItemText
                                  disableTypography
                                  primary={
                                    <Typography
                                      sx={{
                                        fontFamily:
                                          "var(--font-outfit), sans-serif",
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

      {/* Profile Section */}
      <Box sx={{ p: 2, borderTop: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
        <Box
          onClick={handleProfileClick}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1.25,
            borderRadius: "12px",
            cursor: "pointer",
            transition: "background-color 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#f8fafc",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#FF6200",
              color: "white",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "0.95rem",
              flexShrink: 0,
              fontFamily: "var(--font-outfit), sans-serif",
              boxShadow: "0 2px 8px rgba(255, 98, 0, 0.25)",
            }}
          >
            SA
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#1e293b",
                lineHeight: 1.2,
              }}
              noWrap
            >
              Super Admin
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "#64748b",
                mt: 0.25,
              }}
            >
              System Control
            </Typography>
          </Box>
          <ChevronRightIcon fontSize="small" sx={{ color: "#94a3b8" }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "12px",
              mt: -1,
              width: anchorEl ? anchorEl.clientWidth : 240,
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              border: "1px solid #e2e8f0",
            },
          }}
        >
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              handleProfileClose();
              handleLogout();
            }}
            sx={{
              color: "#dc2626",
              fontWeight: 500,
              fontSize: "0.95rem",
              fontFamily: "var(--font-outfit), sans-serif",
              display: "flex",
              gap: 1.5,
              py: 1.5,
            }}
          >
            <LogoutIcon fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
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
            src="/images/logo.png"
            alt="Poojawala"
            sx={{
              height: { xs: "36px", sm: "44px" },
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
            width: DRAWER_WIDTH,
            maxWidth: "85vw",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            height: { xs: 64, sm: 80 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <Box
            component="img"
            src="/images/logo.png"
            alt="Poojawala"
            sx={{
              height: { xs: "36px", sm: "44px" },
              maxWidth: "160px",
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{ color: "#FF6200", "&:hover": { backgroundColor: "#FFF0E6" } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <SidebarContent onLinkClick={onClose} />
      </Drawer>
    </>
  );
}
