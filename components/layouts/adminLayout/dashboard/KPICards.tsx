"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface KPICardsProps {
  stats: any;
  loading: boolean;
}

export default function KPICards({ stats, loading }: KPICardsProps) {
  const router = useRouter();

  const formatCurrency = (val: any) => {
    if (val === undefined || val === null || val === "") return "₹0";
    const num = Number(val);
    if (isNaN(num)) return "₹0";
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const formatCount = (val: any) => {
    if (val === undefined || val === null || val === "") return "0";
    const num = Number(val);
    if (isNaN(num)) return "0";
    return Math.round(num).toLocaleString("en-IN");
  };

  const revenueKPIs = [
    {
      title: "Total Revenue",
      subtitle: "Grand Total Earnings",
      value: formatCurrency(stats?.totalRevenue),
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 26, color: COLORS.PRIMARY }} />,
    },
    {
      title: "Total Booking Revenue",
      subtitle: "Pooja & Services",
      route: "/admin/finance/bookings",
      value: formatCurrency(stats?.totalBookingRevenue),
      icon: <BookOnlineIcon sx={{ fontSize: 26, color: COLORS.PRIMARY }} />,
    },
    {
      title: "Total Order Revenue",
      subtitle: "Pooja Samagri Items",
      route: "/admin/orders",
      value: formatCurrency(stats?.totalOrderRevenue),
      icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 26, color: COLORS.PRIMARY }} />,
    },
  ];

  const countKPIs = [
    {
      title: "Total Bookings",
      route: "/admin/bookings",
      value: formatCount(stats?.totalBookingCount),
      icon: <CalendarMonthOutlinedIcon sx={{ fontSize: 22, color: COLORS.PRIMARY }} />,
    },
    {
      title: "Total Orders",
      route: "/admin/orders",
      value: formatCount(stats?.totalOrderCount),
      icon: <Inventory2OutlinedIcon sx={{ fontSize: 22, color: COLORS.PRIMARY }} />,
    },
    {
      title: "Active Purohits",
      route: "/admin/purohits",
      value: formatCount(stats?.activePurohits),
      icon: <SupervisorAccountIcon sx={{ fontSize: 22, color: COLORS.PRIMARY }} />,
    },
    {
      title: "Active Customers",
      route: "/admin/users",
      value: formatCount(stats?.activeCustomers),
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 22, color: COLORS.PRIMARY }} />,
    },
  ];

  return (
    <Box sx={{ mb: { xs: 2.5, sm: 3.5 } }}>
      {/* 1. REVENUE CARDS SECTION (TOP 3 CARDS) */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }} sx={{ mb: { xs: 1.5, sm: 2, md: 2.5 } }}>
        {revenueKPIs.map((kpi, idx) => (
          <Grid size={{ xs: 12, sm: 4, md: 4 }} key={idx}>
            <Paper
              elevation={0}
              onClick={() => kpi.route && router.push(kpi.route)}
              sx={{
                p: { xs: 2, sm: 2.2, md: 2.6 },
                borderRadius: { xs: "16px", sm: "20px" },
                bgcolor: "#FFFFFF",
                border: "1.5px solid #EFEAE3",
                boxShadow: "0 4px 18px rgba(44, 24, 16, 0.03)",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.25s ease-in-out",
                position: "relative",
                overflow: "hidden",
                cursor: kpi.route ? "pointer" : "default",
                "&:hover": {
                  transform: kpi.route ? "translateY(-3px)" : "none",
                  boxShadow: kpi.route ? "0 10px 24px rgba(255, 98, 0, 0.08)" : "0 4px 18px rgba(44, 24, 16, 0.03)",
                  borderColor: kpi.route ? "#FFD8BE" : "#EFEAE3",
                },
                "&:active": {
                  transform: kpi.route ? "scale(0.99)" : "none",
                },
              }}
            >
              {/* Header: Icon on Left, Title + Subtitle on Right */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.5, sm: 1.8 },
                  mb: { xs: 1.8, sm: 2.2 },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 44, sm: 48 },
                    height: { xs: 44, sm: 48 },
                    borderRadius: { xs: "12px", sm: "14px" },
                    bgcolor: "#FFF0E6",
                    border: "1px solid #FFE0D0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {kpi.icon}
                </Box>

                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      color: "#1E293B",
                      fontSize: { xs: "13px", sm: "14px" },
                      fontWeight: 700,
                      lineHeight: 1.25,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {kpi.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      color: "#94A3B8",
                      fontSize: { xs: "11px", sm: "12px" },
                      fontWeight: 500,
                      lineHeight: 1.2,
                      mt: 0.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {kpi.subtitle}
                  </Typography>
                </Box>
              </Box>

              {/* Big Value below */}
              {loading ? (
                <Skeleton width="60%" height={38} />
              ) : (
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: "#0F172A",
                    fontSize: { xs: "22px", sm: "26px", md: "28px" },
                    lineHeight: 1.15,
                    letterSpacing: "-0.4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {kpi.value}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 2. ACTIVITY & USERS CARDS SECTION (BOTTOM 4 CARDS: 2x2 ON MOBILE, 1x4 ON DESKTOP) */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
        {countKPIs.map((kpi, idx) => (
          <Grid size={{ xs: 6, sm: 6, md: 3 }} key={idx}>
            <Paper
              elevation={0}
              onClick={() => kpi.route && router.push(kpi.route)}
              sx={{
                p: { xs: 1.8, sm: 2, md: 2.2 },
                borderRadius: { xs: "14px", sm: "18px" },
                bgcolor: "#FFFFFF",
                border: "1.5px solid #EFEAE3",
                boxShadow: "0 4px 14px rgba(44, 24, 16, 0.03)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                gap: { xs: 1.2, sm: 1.8 },
                transition: "all 0.25s ease-in-out",
                cursor: kpi.route ? "pointer" : "default",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 24px rgba(255, 98, 0, 0.07)",
                  borderColor: "#FFD8BE",
                },
                "&:active": {
                  transform: kpi.route ? "scale(0.97)" : "none",
                },
              }}
            >
              <Box
                sx={{
                  width: { xs: 40, sm: 46 },
                  height: { xs: 40, sm: 46 },
                  borderRadius: { xs: "11px", sm: "13px" },
                  bgcolor: "#FFF0E6",
                  border: "1px solid #FFE0D0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {kpi.icon}
              </Box>

              <Box sx={{ flexGrow: 1, minWidth: 0, width: "100%" }}>
                <Typography
                  sx={{
                    fontFamily: FONTS.PRIMARY,
                    color: "#64748B",
                    fontSize: { xs: "11px", sm: "12px", md: "12.5px" },
                    fontWeight: 600,
                    lineHeight: 1.3,
                    mb: 0.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {kpi.title}
                </Typography>

                {loading ? (
                  <Skeleton width="60%" height={26} />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      fontWeight: 800,
                      color: "#0F172A",
                      fontSize: { xs: "18px", sm: "21px", md: "23px" },
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
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
