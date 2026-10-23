"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface WebsiteServicePlansSectionProps {
  service: any;
}

export default function WebsiteServicePlansSection({
  service,
}: WebsiteServicePlansSectionProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>("standard");

  const isOnlineService = Boolean(service?.isOnline);
  const plans = service?.plans || {};
  const basicPlan = plans?.basic || null;
  const standardPlan =
    !isOnlineService && plans?.standard && Number(plans?.standard?.price || 0) > 0
      ? plans.standard
      : null;
  const isSinglePlan = isOnlineService || !standardPlan;

  // Format camelCase key to Title Case (e.g. "kalashSthapana" -> "Kalash Sthapana")
  const formatKeyName = (key: string) => {
    if (!key) return "";
    const formatMap: Record<string, string> = {
      kalashSthapana: "Kalash Sthapana",
      durgaSaptashatiPath: "Durga Saptashati Path",
      decorativeKalash: "Decorative Kalash",
      specialNaivedyam: "Special Naivedyam",
      additionalMantraChanting: "Additional Mantra Chanting",
      fruits: "Fruits",
      flowers: "Flowers",
      prasad: "Prasad",
      havan: "Havan",
      aarti: "Aarti",
      durgaPuja: "Durga Puja",
      abhishekam: "Abhishekam",
      pujaSamagri: "Puja Samagri",
      durationMinutes: "Duration",
      numberOfPurohits: "Number of Purohits",
    };
    if (formatMap[key]) return formatMap[key];
    if (key.includes(" ")) return key;
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Helper to extract dynamic features directly from plan object keys or plan.features
  const getDynamicPlanFeatures = (plan: any, planKey?: string) => {
    if (!plan || typeof plan !== "object") return [];

    const rawFeatures =
      plan.features ||
      (planKey && service?.serviceFeatures
        ? service.serviceFeatures.filter(
            (sf: any) => sf.plan === planKey.toUpperCase(),
          )
        : null);

    if (Array.isArray(rawFeatures)) {
      return rawFeatures
        .filter((f: any) => f && f.isActive !== false && f.type !== "PRICE")
        .map((f: any) => {
          const title = f.title || f.name || f.key || "";
          return formatKeyName(title);
        })
        .filter(Boolean);
    }

    const targetObj =
      plan.features && typeof plan.features === "object"
        ? plan.features
        : plan;

    const result: string[] = [];

    Object.entries(targetObj).forEach(([key, val]) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey === "price" ||
        lowerKey === "tokenamount" ||
        lowerKey.includes("payout") ||
        lowerKey === "features"
      ) {
        return;
      }

      const valStr = String(val).trim();
      if (valStr === "false" || val === false) return;

      const formattedKey = formatKeyName(key);

      if (valStr === "true" || val === true) {
        result.push(formattedKey);
      }
    });

    return result;
  };

  const basicFeatures = getDynamicPlanFeatures(basicPlan, "basic");
  const standardFeatures = getDynamicPlanFeatures(standardPlan, "standard");

  const handleBookPlan = (planName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetUrl = `/customer/services/${service?.id}`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("post_login_redirect", targetUrl);
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("customercsrftoken");
      const user = sessionStorage.getItem("user");
      if (token || user) {
        router.push(targetUrl);
        return;
      }
    }
    router.push(`/sign-in?redirect=${encodeURIComponent(targetUrl)}`);
  };

  // If no plans exist in API, don't render section
  if (!basicPlan && !standardPlan) return null;

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, borderTop: "1px solid #F3E8DB" }}>
      {isSinglePlan ? (
        /* Single Plan Horizontal Card (Matching Customer Layout for Online / Single-Plan Services) */
        <Box sx={{ maxWidth: "900px", mx: "auto" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: "16px",
              border: "1px solid #EADCCF",
              bgcolor: "#FFFFFF",
              boxShadow: "0 2px 14px rgba(44, 24, 16, 0.05)",
            }}
          >
            {/* Header with Title and Price */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
                pb: 2.5,
                borderBottom: "1px solid #F1E5D8",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: COLORS.PRIMARY,
                    textTransform: "uppercase",
                    mb: 0.5,
                  }}
                >
                  {isOnlineService ? "Online Pooja Package" : "Pooja Package"}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: "#2C1810",
                    fontSize: { xs: "20px", sm: "24px" },
                  }}
                >
                  Package Inclusions & Features
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#8C7A6B",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pooja Offering
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    fontWeight: 800,
                    color: COLORS.PRIMARY,
                    fontSize: { xs: "28px", sm: "32px" },
                    lineHeight: 1.15,
                    my: 0.3,
                  }}
                >
                  ₹{Number(basicPlan?.price || service?.minPrice || 0).toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>

            {/* Feature Points Grid */}
            {basicFeatures.length > 0 && (
              <Box sx={{ pt: 3 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  {basicFeatures.map((feat, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.25,
                      }}
                    >
                      <CheckCircleIcon
                        sx={{
                          color: COLORS.PRIMARY,
                          fontSize: 18,
                          flexShrink: 0,
                          mt: 0.2,
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "14px",
                          color: "#3D2B22",
                          fontWeight: 500,
                          lineHeight: 1.5,
                        }}
                      >
                        {feat}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Book Now Button */}
            <Box
              sx={{
                mt: 3.5,
                pt: 2.5,
                borderTop: "1px solid #F1E5D8",
                display: "flex",
                justifyContent: { xs: "stretch", sm: "flex-end" },
              }}
            >
              <Button
                variant="contained"
                onClick={(e) => handleBookPlan("basic", e)}
                sx={{
                  bgcolor: COLORS.PRIMARY,
                  color: "#FFFFFF",
                  width: { xs: "100%", sm: "auto" },
                  px: 4.5,
                  py: 1.3,
                  borderRadius: "10px",
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 700,
                  fontSize: "15px",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(255, 98, 0, 0.25)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: "#e05600",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(255, 98, 0, 0.35)",
                  },
                }}
              >
                {isOnlineService ? "Book Online Pooja Package" : "Book This Package"}
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : (
        /* Two Plans Comparison (For Offline Services with Multiple Plans) */
        <>
          <Box sx={{ textAlign: "center", maxWidth: "640px", mx: "auto", mb: 5 }}>
            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "1.2px",
                color: COLORS.PRIMARY,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              CHOOSE YOUR PLAN
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontWeight: 800,
                fontSize: { xs: "28px", sm: "36px", md: "40px" },
                color: "#1A0B05",
                mb: 1.5,
              }}
            >
              Pooja Packages
            </Typography>

            <Typography
              sx={{
                fontFamily: FONTS.PRIMARY,
                fontSize: { xs: "14.5px", sm: "16px" },
                color: "#5C4A40",
                lineHeight: 1.6,
              }}
            >
              Both plans include a verified Vedic Pandit — choose the level of samagri and ceremony detail that suits your pooja completion.
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            sx={{ justifyContent: "center", alignItems: "stretch" }}
          >
            {/* Basic Plan Card */}
            {basicPlan && (
              <Grid size={{ xs: 12, md: 6, lg: 5 }}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedPlan("basic")}
                  sx={{
                    p: { xs: 3.5, sm: 4.5 },
                    borderRadius: "24px",
                    border:
                      selectedPlan === "basic"
                        ? "2px solid #FF6200"
                        : "1.5px solid #F3E4D8",
                    bgcolor: "#FFFFFF",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    cursor: "pointer",
                    boxShadow:
                      selectedPlan === "basic"
                        ? "0 14px 40px rgba(255, 98, 0, 0.14)"
                        : "0 4px 16px rgba(0, 0, 0, 0.02)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: COLORS.PRIMARY,
                      transform: "translateY(-4px)",
                      boxShadow: "0 14px 40px rgba(255, 98, 0, 0.14)",
                    },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 800,
                        fontSize: "26px",
                        color: "#1A0B05",
                        mb: 1.5,
                      }}
                    >
                      Basic
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 800,
                        fontSize: { xs: "36px", sm: "42px" },
                        color: COLORS.PRIMARY,
                        lineHeight: 1.1,
                        mb: 3,
                      }}
                    >
                      ₹ {Number(basicPlan.price || 0).toLocaleString("en-IN")}
                    </Typography>

                    <Box sx={{ borderTop: "1px solid #F3E8DB", pt: 3, mb: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {basicFeatures.map((feat, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <CheckIcon
                              sx={{
                                fontSize: 18,
                                color: COLORS.PRIMARY,
                                mt: 0.2,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontSize: "14.5px",
                                color: "#3D2B22",
                                lineHeight: 1.5,
                                fontWeight: 500,
                              }}
                            >
                              {feat}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant={selectedPlan === "basic" ? "contained" : "outlined"}
                    onClick={(e) => handleBookPlan("basic", e)}
                    sx={{
                      bgcolor: selectedPlan === "basic" ? COLORS.PRIMARY : "transparent",
                      borderColor: COLORS.PRIMARY,
                      borderWidth: "1.5px",
                      color: selectedPlan === "basic" ? "#FFFFFF" : COLORS.PRIMARY,
                      width: "100%",
                      py: 1.4,
                      borderRadius: "12px",
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "15px",
                      textTransform: "none",
                      boxShadow:
                        selectedPlan === "basic"
                          ? "0 6px 20px rgba(255, 98, 0, 0.3)"
                          : "none",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: COLORS.PRIMARY_DARK,
                        borderColor: COLORS.PRIMARY_DARK,
                        borderWidth: "1.5px",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    Book Basic Plan
                  </Button>
                </Paper>
              </Grid>
            )}

            {/* Standard Plan Card */}
            {standardPlan && (
              <Grid size={{ xs: 12, md: 6, lg: 5 }}>
                <Paper
                  elevation={0}
                  onClick={() => setSelectedPlan("standard")}
                  sx={{
                    p: { xs: 3.5, sm: 4.5 },
                    borderRadius: "24px",
                    border:
                      selectedPlan === "standard"
                        ? "2px solid #FF6200"
                        : "1.5px solid #F3E4D8",
                    bgcolor: "#FFFFFF",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    cursor: "pointer",
                    boxShadow:
                      selectedPlan === "standard"
                        ? "0 14px 40px rgba(255, 98, 0, 0.16)"
                        : "0 4px 16px rgba(0, 0, 0, 0.02)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: COLORS.PRIMARY,
                      transform: "translateY(-4px)",
                      boxShadow: "0 18px 45px rgba(255, 98, 0, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: selectedPlan === "standard" ? COLORS.PRIMARY : "#E2E8F0",
                      color: selectedPlan === "standard" ? "#FFFFFF" : "#475569",
                      px: 2.5,
                      py: 0.6,
                      borderRadius: "0 22px 0 14px",
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    MOST COMPLETE
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 800,
                        fontSize: "26px",
                        color: "#1A0B05",
                        mb: 1.5,
                      }}
                    >
                      Standard
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 800,
                        fontSize: { xs: "36px", sm: "42px" },
                        color: COLORS.PRIMARY,
                        lineHeight: 1.1,
                        mb: 3,
                      }}
                    >
                      ₹ {Number(standardPlan.price || 0).toLocaleString("en-IN")}
                    </Typography>

                    <Box sx={{ borderTop: "1px solid #F3E8DB", pt: 3, mb: 4 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {standardFeatures.map((feat, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1.5,
                            }}
                          >
                            <CheckIcon
                              sx={{
                                fontSize: 18,
                                color: COLORS.PRIMARY,
                                mt: 0.2,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              sx={{
                                fontFamily: FONTS.PRIMARY,
                                fontSize: "14.5px",
                                color: "#3D2B22",
                                lineHeight: 1.5,
                                fontWeight: 500,
                              }}
                            >
                              {feat}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant={selectedPlan === "standard" ? "contained" : "outlined"}
                    onClick={(e) => handleBookPlan("standard", e)}
                    sx={{
                      bgcolor:
                        selectedPlan === "standard" ? COLORS.PRIMARY : "transparent",
                      borderColor: COLORS.PRIMARY,
                      borderWidth: "1.5px",
                      color: selectedPlan === "standard" ? "#FFFFFF" : COLORS.PRIMARY,
                      width: "100%",
                      py: 1.4,
                      borderRadius: "12px",
                      fontFamily: FONTS.PRIMARY,
                      fontWeight: 700,
                      fontSize: "15px",
                      textTransform: "none",
                      boxShadow:
                        selectedPlan === "standard"
                          ? "0 6px 20px rgba(255, 98, 0, 0.3)"
                          : "none",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: COLORS.PRIMARY_DARK,
                        borderColor: COLORS.PRIMARY_DARK,
                        borderWidth: "1.5px",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    Book Standard Plan
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
}
