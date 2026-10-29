"use client";

import { getAllServicesAPI } from "@/api/serviceControllers";
import EmptyStateCard from "@/components/widgets/EmptyStateCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { formatServicePriceRange, stripHtml } from "@/utils/helpers";

const DEFAULT_PACKAGES = [
  {
    id: "annaprashan-puja",
    slug: "annaprashan-puja",
    title: "Annaprashan Puja",
    description: "Sacred first rice-feeding ritual for the baby, seeking good health and long life with Vedic blessings.",
    duration: "2-3 hrs",
    price: "₹2,100 - ₹5,100",
    unit: "/ ceremony",
    image: "/images/home/poojaPackages/satyanarayan.webp",
    isOnline: true,
    isOffline: true,
  },
  {
    id: "bhoomi-puja",
    slug: "bhoomi-puja",
    title: "Bhoomi Puja",
    description: "Vedic ceremony performed before beginning construction on a plot to appease Bhoomi Devi and remove Vastu defects.",
    duration: "2-3 hrs",
    price: "₹3,500 - ₹7,500",
    unit: "/ ceremony",
    image: "/images/home/poojaPackages/satyanarayan.webp",
    isOnline: false,
    isOffline: true,
  },
  {
    id: "brihaspati-vrat-udayapan-puja",
    slug: "brihaspati-vrat-udayapan-puja",
    title: "Brihaspati Vrat Udayapan Puja",
    description: "Auspicious concluding rituals for the Thursday Vrat dedicated to Lord Brihaspati for wisdom, health and prosperity.",
    duration: "2-3 hrs",
    price: "₹2,500 - ₹5,100",
    unit: "/ ceremony",
    image: "/images/home/poojaPackages/satyanarayan.webp",
    isOnline: true,
    isOffline: true,
  },
  {
    id: "durga-puja",
    slug: "durga-puja",
    title: "Durga Puja & Chandi Havan",
    description: "Divine ceremony dedicated to Goddess Durga for victory over obstacles, protection, wealth and peace.",
    duration: "3-4 hrs",
    price: "₹4,100 - ₹9,500",
    unit: "/ ceremony",
    image: "/images/home/poojaPackages/satyanarayan.webp",
    isOnline: true,
    isOffline: true,
  },
];

const formatDuration = (mins: number) => {
  if (!mins) return "2-3 hrs";
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    if (mins % 60 === 0) return `${hrs} hrs`;
    return `${hrs}-${hrs + 1} hrs`;
  }
  return `${mins} mins`;
};

export default function PopularPackages() {
  const router = useRouter();
  const [packages, setPackages] = useState<any[]>(DEFAULT_PACKAGES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServicesAPI(
          1,
          4,
          "",
          true,
          undefined,
          undefined,
          undefined,
          undefined,
          false,
          undefined,
          true,
        );
        const items =
          response?.data?.data && Array.isArray(response.data.data)
            ? response.data.data
            : response?.data && Array.isArray(response.data)
              ? response.data
              : Array.isArray(response)
                ? response
                : [];
        const activeOnly = items.filter((item: any) => item.isActive !== false);
        const apiPackages = activeOnly.map((item: any) => {
          const priceStr = formatServicePriceRange(item);

          if (typeof window !== "undefined" && item.id && item.slug) {
            const s = String(item.slug).toLowerCase();
            localStorage.setItem(`slug_to_id_${s}`, String(item.id));
            sessionStorage.setItem(`slug_to_id_${s}`, String(item.id));
          }

          return {
            id: item.id,
            slug: item.slug,
            title: item.name,
            description:
              item.description ||
              item.shortDescription ||
              "Traditional Vedic pooja performed by an experienced Purohit.",
            duration: formatDuration(item.durationMinutes),
            price: priceStr,
            unit: "/ ceremony",
            image:
              item.iconDownloadurl ||
              item.iconUrl ||
              "/images/home/poojaPackages/satyanarayan.webp",
            isOnline: item.isOnline,
            isOffline: item.isOffline,
          };
        });
        setPackages(apiPackages.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch popular packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => fetchServices(), { timeout: 4000 });
    } else {
      const timer = setTimeout(fetchServices, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Box id="popular-packages" sx={{ py: { xs: 6, md: 9 }, bgcolor: "#FFF", scrollMarginTop: "90px" }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "36px", md: "44px" },
              color: "#1A1A1A",
              mb: 1.5,
            }}
          >
            Popular Pooja Packages
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
            <Image
              src="/images/home/poojaPackages/dhanush.webp"
              alt="Decorative Arch"
              width={650}
              height={40}
              loading="lazy"
              style={{
                width: "90%",
                maxWidth: "650px",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          {packages.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                right: 0,
                bottom: 10,
                display: { xs: "none", md: "block" },
              }}
            >
              <Button
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("home_restore_section", "popular-packages");
                  }
                  router.push("/services");
                }}
                sx={{
                  color: "#D32F2F",
                  background: "transparent",
                  borderRadius: "31px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: COLORS.PRIMARY,
                    color: "#FFFFFF",
                  },
                }}
              >
                View all
              </Button>
            </Box>
          )}
        </Box>

        {/* Mobile View All Link */}
        {packages.length > 0 && (
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "flex-end",
              mb: 3,
            }}
          >
            <Button
              endIcon={<ArrowForwardIcon fontSize="small" />}
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("home_restore_section", "popular-packages");
                }
                router.push("/services");
              }}
              sx={{
                color: "#D32F2F",
                background: "transparent",
                borderRadius: "31px",
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                "&:hover": {
                  background: COLORS.PRIMARY,
                  color: "#FFFFFF",
                },
              }}
            >
              View all
            </Button>
          </Box>
        )}

        {/* Packages Grid / Loading / Empty Notification State */}
        {loading ? (
          <Grid container spacing={{ xs: 3, sm: 3, md: 3.5 }} sx={{ justifyContent: "center" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ bgcolor: "#FFFFFF", borderRadius: "24px", border: "1.5px solid #EFE6D5", p: 2, height: "320px", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ bgcolor: "#FAF4EE", borderRadius: "14px", height: "160px" }} />
                  <Box sx={{ bgcolor: "#F5EFE6", borderRadius: "4px", height: "20px", width: "70%", mx: "auto" }} />
                  <Box sx={{ bgcolor: "#FAF4EE", borderRadius: "4px", height: "14px", width: "50%", mx: "auto", mt: "auto" }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : packages.length === 0 ? (
          <EmptyStateCard
            icon={<AutoAwesomeOutlinedIcon sx={{ fontSize: 32 }} />}
            title="No Pooja Packages Available"
            description="Currently, there are no active pooja packages available. Check back soon or request a custom ceremony!"
            actionText="Request Custom Pooja"
            actionHref="/sign-in"
          />
        ) : (
          <Grid
            container
            spacing={{ xs: 3, sm: 3, md: 3.5 }}
            sx={{ justifyContent: "center", alignItems: "stretch" }}
          >
            {packages.map((pkg) => (
              <Grid
                key={pkg.id}
                size={{ xs: 12, sm: 6, md: packages.length === 3 ? 4 : 3 }}
                sx={{ display: "flex" }}
              >
                <Card
                  elevation={0}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("home_restore_section", "popular-packages");
                    }
                    router.push(`/services/${pkg.slug || pkg.id}`);
                  }}
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "24px",
                    border: "1.5px solid #EFE6D5",
                    bgcolor: "#FFFFFF",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition:
                      "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 12px 32px rgba(184, 134, 11, 0.12)",
                      borderColor: "#D4B076",
                    },
                  }}
                >
                  {/* Card Header Section */}
                  <Box
                    sx={{
                      bgcolor: "#FAF4E8",
                      p: { xs: 2, sm: 2.5 },
                      borderBottom: "1px solid #EFE6D5",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: "160px",
                        borderRadius: "14px",
                        overflow: "hidden",
                        mb: 1.5,
                        bgcolor: "#FAF4EE",
                      }}
                    >
                      <Image
                        src={pkg.image}
                        alt={pkg.title}
                        fill
                        unoptimized={typeof pkg.image === "string" && pkg.image.startsWith("http")}
                        sizes="(max-width: 600px) 380px, (max-width: 960px) 45vw, 280px"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        fontSize: { xs: "16px", sm: "17px" },
                        color: "#2C1810",
                        textAlign: "center",
                        lineHeight: 1.3,
                        height: "44px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        alignContent: "center",
                      }}
                    >
                      {pkg.title}
                    </Typography>
                  </Box>

                  {/* Card Body Section */}
                  <Box
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      bgcolor: "#FFFDF9",
                    }}
                  >
                    <Box>
                      {/* Starting From Label */}
                      <Typography
                        sx={{
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "#B8860B",
                          textTransform: "uppercase",
                          mb: 0.5,
                        }}
                      >
                        {pkg.price.includes("-")
                          ? "PRICE RANGE"
                          : "STARTING FROM"}
                      </Typography>

                      {/* Price Display */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "baseline",
                          flexWrap: "nowrap",
                          gap: 0.5,
                          mb: 1.5,
                          height: "26px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 800,
                            fontSize:
                              pkg.price.length > 13
                                ? { xs: "15px", sm: "16.5px" }
                                : pkg.price.length > 9
                                  ? { xs: "17px", sm: "18.5px" }
                                  : { xs: "20px", sm: "22px" },
                            color: "#2C1810",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {pkg.price.startsWith("₹") ||
                          pkg.price.startsWith("Price")
                            ? pkg.price
                            : `₹${pkg.price}`}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontSize: "11px",
                            fontWeight: 500,
                            color: "#8C6D53",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          {pkg.unit || "/ ceremony"}
                        </Typography>
                      </Box>

                      {/* Service Description truncated to 3 lines with uniform height */}
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "13px",
                          color: "#5C4A40",
                          lineHeight: 1.6,
                          height: "62px",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mb: 2.5,
                        }}
                      >
                        {stripHtml(pkg.description)}
                      </Typography>
                    </Box>

                    {/* Book Now Button */}
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof window !== "undefined") {
                          sessionStorage.setItem("home_restore_section", "popular-packages");
                        }
                        router.push(`/services/${pkg.slug || pkg.id}`);
                      }}
                      sx={{
                        width: "100%",
                        border: "1.5px solid #C88A2E",
                        color: "#B37820",
                        bgcolor: "#FFFBF5",
                        borderRadius: "14px",
                        py: 1.2,
                        fontSize: "15px",
                        fontWeight: 700,
                        fontFamily: FONTS.OUTFIT,
                        textTransform: "none",
                        transition: "all 0.25s ease-in-out",
                        "&:hover": {
                          bgcolor: COLORS.PRIMARY,
                          color: "#FFFFFF",
                          borderColor: COLORS.PRIMARY,
                          boxShadow: "0 6px 18px rgba(255, 98, 0, 0.25)",
                        },
                      }}
                    >
                      Book This Pooja
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
