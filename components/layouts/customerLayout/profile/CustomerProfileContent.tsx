"use client";
import React, { useEffect } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { useUserStore } from "@/stores/userStore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HomeIcon from "@mui/icons-material/Home";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import { useRouter } from "next/navigation";

export default function CustomerProfileContent() {
  const { profile, fetchProfile, loading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    fetchProfile(true);
  }, [fetchProfile]);

  if (loading || !profile) {
    return (
      <Box sx={{ pb: { xs: 4, md: 6 } }}>
        {/* Header Skeleton */}
        <Box
          sx={{
            mb: { xs: 2.5, sm: 3.5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1.5,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" width={140} height={20} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={200} height={36} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={260} height={18} />
          </Box>
          <Skeleton
            variant="rounded"
            width={110}
            height={36}
            sx={{ borderRadius: "30px", flexShrink: 0 }}
          />
        </Box>

        {/* Grid Skeleton */}
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: "20px",
                border: "1.5px solid #EFE6D5",
                bgcolor: "#FFFFFF",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2.5,
              }}
            >
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="text" width={140} height={28} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={90} height={20} sx={{ mb: 1.5 }} />
              <Skeleton
                variant="rounded"
                width={80}
                height={24}
                sx={{ borderRadius: "16px" }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, sm: 2.8 },
                borderRadius: "20px",
                border: "1.5px solid #EFE6D5",
                bgcolor: "#FFFFFF",
              }}
            >
              <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
              <Skeleton
                variant="rounded"
                height={46}
                sx={{ borderRadius: "12px", mb: 1.5 }}
              />
              <Skeleton
                variant="rounded"
                height={46}
                sx={{ borderRadius: "12px", mb: 1.5 }}
              />
              <Skeleton
                variant="rounded"
                height={46}
                sx={{ borderRadius: "12px" }}
              />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, sm: 3 },
                borderRadius: "20px",
                border: "1.5px solid #EFE6D5",
                bgcolor: "#FFFFFF",
                mb: 2.5,
              }}
            >
              <Skeleton variant="text" width={130} height={26} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Skeleton
                      variant="rounded"
                      height={68}
                      sx={{ borderRadius: "14px" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.2, sm: 3 },
                borderRadius: "20px",
                border: "1.5px solid #EFE6D5",
                bgcolor: "#FFFFFF",
              }}
            >
              <Skeleton variant="text" width={160} height={26} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid size={{ xs: 6, sm: 4 }} key={i}>
                    <Skeleton
                      variant="rounded"
                      height={58}
                      sx={{ borderRadius: "12px" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const defaultAddress =
    profile.addresses?.find((addr: any) => addr.isDefault) ||
    profile.addresses?.[0];

  const quickLinks = [
    {
      title: "My Bookings",
      description: "View & manage your pooja bookings",
      path: "/customer/bookings",
      icon: <EventNoteIcon sx={{ fontSize: 22 }} />,
      bgColor: "#FFF0E6",
      iconColor: COLORS.PRIMARY,
    },
    {
      title: "My Orders",
      description: "Track orders and delivery status",
      path: "/customer/orders",
      icon: <LocalMallIcon sx={{ fontSize: 22 }} />,
      bgColor: "#EFF6FF",
      iconColor: "#2563EB",
    },
    {
      title: "My Payments",
      description: "View transactions and receipts",
      path: "/customer/payments",
      icon: <PaymentIcon sx={{ fontSize: 22 }} />,
      bgColor: "#F0FDF4",
      iconColor: "#16A34A",
    },
    {
      title: "Get Support",
      description: "Help center & customer support",
      path: "/customer/get-support",
      icon: <SupportAgentIcon sx={{ fontSize: 22 }} />,
      bgColor: "#FAF5FF",
      iconColor: "#9333EA",
    },
  ];

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: { xs: 2.5, sm: 3.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppBreadcrumbs
            items={[
              { label: "Dashboard", href: "/customer/dashboard" },
              { label: "Profile" },
            ]}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "1.45rem", sm: "1.85rem", md: "2.1rem" },
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            My Profile
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#7C6A60",
              fontSize: { xs: "13px", sm: "14px" },
            }}
          >
            View and manage your personal details and addresses.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => router.push("/customer/profile/edit")}
          startIcon={<EditIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderColor: "#FFD4BC",
            bgcolor: "#FFF8F2",
            color: COLORS.PRIMARY,
            fontFamily: FONTS.OUTFIT,
            textTransform: "none",
            borderRadius: "30px",
            fontWeight: 700,
            fontSize: "13px",
            px: { xs: 1.8, sm: 2.5 },
            py: 0.7,
            flexShrink: 0,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(255, 98, 0, 0.06)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: COLORS.PRIMARY,
              bgcolor: COLORS.PRIMARY,
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
            },
          }}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={{ xs: 2.5, md: 3 }}>
        {/* Left Column: Profile Card + Account Details */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Profile Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: "20px",
              border: "1.5px solid #EFE6D5",
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={profile.profileImage || undefined}
              sx={{
                width: { xs: 88, sm: 104 },
                height: { xs: 88, sm: 104 },
                mb: 2,
                bgcolor: COLORS.PRIMARY,
                fontSize: "2.5rem",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                boxShadow: "0 6px 20px rgba(255, 98, 0, 0.22)",
                border: "3px solid #FFFFFF",
              }}
            >
              {!profile.profileImage && (
                <PersonIcon sx={{ fontSize: { xs: 45, sm: 52 }, color: "white" }} />
              )}
            </Avatar>
            <Typography
              variant="h5"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#2C1810",
                fontSize: { xs: "1.2rem", sm: "1.35rem" },
                mb: 0.5,
              }}
            >
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#7C6A60",
                fontSize: "13px",
                mb: 1.5,
              }}
            >
              @{profile.username}
            </Typography>
            <Chip
              icon={<VerifiedUserIcon sx={{ fontSize: 14, color: "#059669 !important" }} />}
              label={profile.status || "ACTIVE"}
              sx={{
                bgcolor: "#ECFDF5",
                color: "#059669",
                border: "1px solid #A7F3D0",
                fontWeight: 700,
                fontFamily: FONTS.OUTFIT,
                fontSize: "11px",
                borderRadius: "20px",
                px: 0.8,
              }}
              size="small"
            />
          </Paper>

          {/* Account Details */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.2, sm: 2.8 },
              borderRadius: "20px",
              border: "1.5px solid #EFE6D5",
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
              mt: { xs: 2.5, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#2C1810",
                fontSize: "16px",
                mb: 2,
              }}
            >
              Account Details
            </Typography>

            {/* Email */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "12px",
                bgcolor: "#FAF7F4",
                border: "1px solid #EFE6D5",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #EFE6D5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: COLORS.PRIMARY,
                }}
              >
                <EmailIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "#8C7A6B",
                    fontFamily: FONTS.OUTFIT,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  EMAIL
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#2C1810",
                    fontFamily: FONTS.OUTFIT,
                    wordBreak: "break-all",
                  }}
                >
                  {profile.email}
                </Typography>
              </Box>
            </Box>

            {/* Phone */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "12px",
                bgcolor: "#FAF7F4",
                border: "1px solid #EFE6D5",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #EFE6D5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: COLORS.PRIMARY,
                }}
              >
                <PhoneIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "#8C7A6B",
                    fontFamily: FONTS.OUTFIT,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  PHONE
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#2C1810",
                    fontFamily: FONTS.OUTFIT,
                  }}
                >
                  {profile.phone || "Not provided"}
                </Typography>
              </Box>
            </Box>

            {/* Joined On */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "12px",
                bgcolor: "#FAF7F4",
                border: "1px solid #EFE6D5",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#FFFFFF",
                  border: "1px solid #EFE6D5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: COLORS.PRIMARY,
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "#8C7A6B",
                    fontFamily: FONTS.OUTFIT,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  JOINED ON
                </Typography>
                <Typography
                  sx={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "#2C1810",
                    fontFamily: FONTS.OUTFIT,
                  }}
                >
                  {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Quick Access + Personal Information + Default Address */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Quick Access Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.2, sm: 3 },
              borderRadius: "20px",
              border: "1.5px solid #EFE6D5",
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
              mb: { xs: 2.5, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#2C1810",
                fontSize: "16px",
                mb: 2,
              }}
            >
              Quick Access
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {quickLinks.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.title}>
                  <Paper
                    elevation={0}
                    onClick={() => router.push(item.path)}
                    sx={{
                      p: { xs: 1.8, sm: 2 },
                      borderRadius: "14px",
                      border: "1.5px solid #EFE6D5",
                      bgcolor: "#FAF7F4",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        borderColor: "#FFD4BC",
                        bgcolor: "#FFFFFF",
                        boxShadow: "0 4px 16px rgba(44, 24, 16, 0.06)",
                        transform: "translateY(-2px)",
                        "& .arrow-icon": {
                          transform: "translateX(4px)",
                          color: item.iconColor,
                        },
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.8, minWidth: 0 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: "12px",
                          bgcolor: item.bgColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: item.iconColor,
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 700,
                            fontSize: "14.5px",
                            color: "#2C1810",
                            lineHeight: 1.25,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "12px",
                            color: "#7C6A60",
                            mt: 0.3,
                            lineHeight: 1.25,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Box>
                    <ChevronRightIcon
                      className="arrow-icon"
                      sx={{
                        color: "#CBD5E1",
                        transition: "all 0.2s ease-in-out",
                        flexShrink: 0,
                        ml: 1,
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Personal Information */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.2, sm: 3 },
              borderRadius: "20px",
              border: "1.5px solid #EFE6D5",
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
              mb: { xs: 2.5, md: 3 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#2C1810",
                fontSize: "16px",
                mb: 2,
              }}
            >
              Personal Information
            </Typography>
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: "#FAF7F4", borderRadius: "12px", border: "1px solid #EFE6D5" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.6 }}>
                    <BadgeIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8C7A6B",
                        fontFamily: FONTS.OUTFIT,
                        letterSpacing: "0.4px",
                      }}
                    >
                      FIRST NAME
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C1810",
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    {profile.firstName || "-"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: "#FAF7F4", borderRadius: "12px", border: "1px solid #EFE6D5" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.6 }}>
                    <BadgeIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8C7A6B",
                        fontFamily: FONTS.OUTFIT,
                        letterSpacing: "0.4px",
                      }}
                    >
                      LAST NAME
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C1810",
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    {profile.lastName || "-"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: "#FAF7F4", borderRadius: "12px", border: "1px solid #EFE6D5" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.6 }}>
                    <CakeIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8C7A6B",
                        fontFamily: FONTS.OUTFIT,
                        letterSpacing: "0.4px",
                      }}
                    >
                      DATE OF BIRTH
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C1810",
                      fontFamily: FONTS.OUTFIT,
                    }}
                  >
                    {profile.dob
                      ? new Date(profile.dob).toLocaleDateString("en-GB")
                      : "-"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: "#FAF7F4", borderRadius: "12px", border: "1px solid #EFE6D5" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.6 }}>
                    <LocationCityIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8C7A6B",
                        fontFamily: FONTS.OUTFIT,
                        letterSpacing: "0.4px",
                      }}
                    >
                      BIRTH PLACE
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C1810",
                      fontFamily: FONTS.OUTFIT,
                      textTransform: "capitalize",
                    }}
                  >
                    {profile.birthPlace || "-"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: "#FAF7F4", borderRadius: "12px", border: "1px solid #EFE6D5" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.6 }}>
                    <AutoAwesomeIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8C7A6B",
                        fontFamily: FONTS.OUTFIT,
                        letterSpacing: "0.4px",
                      }}
                    >
                      RASHI
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C1810",
                      fontFamily: FONTS.OUTFIT,
                      textTransform: "capitalize",
                    }}
                  >
                    {profile.rashi || "-"}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, sm: 6, md: 4 }}>
                <Box sx={{ p: 1.5, bgcolor: "#FAF7F4", borderRadius: "12px", border: "1px solid #EFE6D5" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.6 }}>
                    <SelfImprovementIcon sx={{ fontSize: 15, color: COLORS.PRIMARY }} />
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8C7A6B",
                        fontFamily: FONTS.OUTFIT,
                        letterSpacing: "0.4px",
                      }}
                    >
                      GOTRA
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#2C1810",
                      fontFamily: FONTS.OUTFIT,
                      textTransform: "capitalize",
                    }}
                  >
                    {profile.gotra || "-"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Default Address Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.2, sm: 3 },
              borderRadius: "20px",
              border: "1.5px solid #EFE6D5",
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                color: "#2C1810",
                fontSize: "16px",
                mb: 2,
              }}
            >
              Default Address
            </Typography>

            {defaultAddress ? (
              <Box
                sx={{
                  border: "1.5px solid #EFE6D5",
                  borderRadius: "14px",
                  p: { xs: 2, sm: 2.5 },
                  bgcolor: "#FAF7F4",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <HomeIcon sx={{ color: COLORS.PRIMARY, fontSize: 20 }} />
                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        color: "#2C1810",
                        fontSize: "14.5px",
                      }}
                    >
                      {defaultAddress.addressLabel || "Home"}
                    </Typography>
                  </Box>
                  <Chip
                    label="Default"
                    size="small"
                    sx={{
                      bgcolor: "#FFF0E6",
                      color: COLORS.PRIMARY,
                      fontWeight: 700,
                      fontFamily: FONTS.OUTFIT,
                      fontSize: "11px",
                      border: "1px solid #FFD4BC",
                      borderRadius: "20px",
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#475569",
                    fontSize: "13.5px",
                    mb: 1.5,
                    lineHeight: 1.6,
                  }}
                >
                  {defaultAddress.fullAddress}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, pt: 1, borderTop: "1px dashed #EFE6D5" }}>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      color: "#7C6A60",
                      fontSize: "12.5px",
                    }}
                  >
                    <strong style={{ color: "#2C1810" }}>City:</strong>{" "}
                    <span style={{ textTransform: "capitalize" }}>
                      {defaultAddress.city}
                    </span>
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: FONTS.OUTFIT,
                      color: "#7C6A60",
                      fontSize: "12.5px",
                    }}
                  >
                    <strong style={{ color: "#2C1810" }}>Pincode:</strong> {defaultAddress.pincode}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  p: { xs: 2.5, sm: 3 },
                  textAlign: "center",
                  bgcolor: "#FAF7F4",
                  borderRadius: "14px",
                  border: "1.5px dashed #FFD4BC",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#7C6A60",
                    fontSize: "13.5px",
                    mb: 2,
                  }}
                >
                  No default address added yet.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() =>
                    router.push("/customer/profile/edit?tab=location")
                  }
                  sx={{
                    bgcolor: COLORS.PRIMARY,
                    color: "white",
                    textTransform: "none",
                    px: 3,
                    py: 0.8,
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 700,
                    fontSize: "13px",
                    borderRadius: "20px",
                    boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                    "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                  }}
                >
                  Add Address
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
