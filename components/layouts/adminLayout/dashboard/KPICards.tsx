"use client";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { Box, Chip, Grid, Paper, Skeleton, Typography } from "@mui/material";

interface KPICardsProps {
  stats: any;
  loading: boolean;
}

export default function KPICards({ stats, loading }: KPICardsProps) {
  const revenueKPIs = [
    {
      title: "Total Revenue",
      subtitle: "Grand Total Earnings",
      value:
        typeof stats?.totalRevenue === "number"
          ? `₹${stats.totalRevenue.toLocaleString("en-IN")}`
          : stats?.totalRevenue
            ? `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`
            : "₹0",
      icon: (
        <AccountBalanceWalletIcon sx={{ fontSize: 32, color: "#2E7D32" }} />
      ),
      bgcolor: "#E8F5E9",
      borderColor: "#C8E6C9",
      valueColor: "#1B5E20",
      badgeText: "All Revenue",
      badgeColor: "#2E7D32",
      badgeBg: "#DCEDC8",
    },
    {
      title: "Total Booking Revenue",
      subtitle: "Pooja & Services",
      value:
        typeof stats?.totalBookingRevenue === "number"
          ? `₹${stats.totalBookingRevenue.toLocaleString("en-IN")}`
          : stats?.totalBookingRevenue
            ? `₹${Number(stats.totalBookingRevenue).toLocaleString("en-IN")}`
            : "₹0",
      icon: <BookOnlineIcon sx={{ fontSize: 32, color: "#C84B16" }} />,
      bgcolor: "#FFF0E6",
      borderColor: "#FFE0D0",
      valueColor: "#9C330B",
      badgeText: "Bookings",
      badgeColor: "#C84B16",
      badgeBg: "#FFDBC8",
    },
    {
      title: "Total Order Revenue",
      subtitle: "Pooja Samagri Items",
      value:
        typeof stats?.totalOrderRevenue === "number"
          ? `₹${stats.totalOrderRevenue.toLocaleString("en-IN")}`
          : stats?.totalOrderRevenue
            ? `₹${Number(stats.totalOrderRevenue).toLocaleString("en-IN")}`
            : "₹0",
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: "#00838F" }} />,
      bgcolor: "#E0F7FA",
      borderColor: "#B2EBF2",
      valueColor: "#006064",
      badgeText: "Orders",
      badgeColor: "#00838F",
      badgeBg: "#B2EBF2",
    },
  ];

  const countKPIs = [
    {
      title: "Total Bookings",
      value:
        stats?.totalBookingCount !== undefined &&
        stats?.totalBookingCount !== null
          ? Number(stats.totalBookingCount).toLocaleString("en-IN")
          : "0",
      icon: (
        <CalendarMonthOutlinedIcon sx={{ fontSize: 26, color: "#7B1FA2" }} />
      ),
      bgcolor: "#F3E5F5",
      borderColor: "#E1BEE7",
      valueColor: "#4A148C",
    },
    {
      title: "Total Orders",
      value:
        stats?.totalOrderCount !== undefined && stats?.totalOrderCount !== null
          ? Number(stats.totalOrderCount).toLocaleString("en-IN")
          : "0",
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 26, color: "#3F51B5" }} />,
      bgcolor: "#E8EAF6",
      borderColor: "#C5CAE9",
      valueColor: "#1A237E",
    },
    {
      title: "Active Purohits",
      value:
        stats?.activePurohits !== undefined && stats?.activePurohits !== null
          ? Number(stats.activePurohits).toLocaleString("en-IN")
          : "0",
      icon: <SupervisorAccountIcon sx={{ fontSize: 26, color: "#ED6C02" }} />,
      bgcolor: "#FFF8E1",
      borderColor: "#FFE082",
      valueColor: "#E65100",
    },
    {
      title: "Active Customers",
      value:
        stats?.activeCustomers !== undefined && stats?.activeCustomers !== null
          ? Number(stats.activeCustomers).toLocaleString("en-IN")
          : "0",
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 26, color: "#C2185B" }} />,
      bgcolor: "#FCE4EC",
      borderColor: "#F8BBD0",
      valueColor: "#880E4F",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      {/* 1. REVENUE CARDS SECTION (TOP 3 CARDS) */}
      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {revenueKPIs.map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: "20px",
                bgcolor: "#FFFBF7",
                border: `1px solid ${kpi.borderColor}`,
                boxShadow: "0 4px 18px rgba(44, 24, 16, 0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.25s ease-in-out",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(44, 24, 16, 0.08)",
                  borderColor: kpi.badgeColor,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: "16px",
                    bgcolor: kpi.bgcolor,
                    border: `1px solid ${kpi.borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {kpi.icon}
                </Box>
                <Chip
                  label={kpi.badgeText}
                  size="small"
                  sx={{
                    bgcolor: kpi.badgeBg,
                    color: kpi.badgeColor,
                    fontWeight: 800,
                    fontSize: "11px",
                    fontFamily: '"DM Sans", sans-serif',
                    height: 22,
                    borderRadius: "12px",
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#8C7A70",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    mb: 0.3,
                  }}
                >
                  {kpi.title}
                </Typography>

                {loading ? (
                  <Skeleton width="70%" height={40} />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontWeight: 800,
                      color: kpi.valueColor,
                      fontSize: { xs: "24px", sm: "28px" },
                      lineHeight: 1.1,
                      mb: 0.5,
                    }}
                  >
                    {kpi.value}
                  </Typography>
                )}

                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#64534A",
                    fontSize: "12px",
                    fontWeight: 500,
                  }}
                >
                  {kpi.subtitle}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 2. ACTIVITY & USERS CARDS SECTION (BOTTOM 4 CARDS) */}
      <Grid container spacing={2.5}>
        {countKPIs.map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                px: 2.5,
                borderRadius: "18px",
                bgcolor: "#FFFBF7",
                border: `1px solid ${kpi.borderColor}`,
                boxShadow: "0 4px 14px rgba(44, 24, 16, 0.03)",
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.25s ease-in-out",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 24px rgba(44, 24, 16, 0.07)",
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  bgcolor: kpi.bgcolor,
                  border: `1px solid ${kpi.borderColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {kpi.icon}
              </Box>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: "#8C7A70",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {kpi.title}
                </Typography>

                {loading ? (
                  <Skeleton width="60%" height={30} />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontWeight: 800,
                      color: kpi.valueColor,
                      fontSize: { xs: "20px", sm: "23px" },
                      lineHeight: 1.2,
                      mt: 0.2,
                    }}
                  >
                    {kpi.value}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
