"use client";

import { getServicesAPI } from "@/api/serviceControllers";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServicesAPI(
          1,
          10,
          "",
          undefined,
          undefined,
          undefined,
          true,
        );
        if (
          response?.success &&
          response?.data?.data &&
          Array.isArray(response.data.data)
        ) {
          const activeOnly = response.data.data.filter(
            (item: any) => item.isActive !== false,
          );
          const apiPackages = activeOnly.map((item: any) => {
            return {
              id: item.id,
              title: item.name,
              description:
                item.description ||
                item.shortDescription ||
                "Traditional Vedic pooja performed by an experienced Purohit.",
              duration: formatDuration(item.durationMinutes),
              price: item.minPrice
                ? Math.floor(parseFloat(item.minPrice)).toLocaleString("en-IN")
                : "0",
              unit: "/ ceremony",
              image:
                item.iconDownloadurl ||
                item.iconUrl ||
                "/images/home/poojaPackages/satyanarayan.webp",
            };
          });
          setPackages(apiPackages);
        } else {
          setPackages([]);
        }
      } catch (error) {
        console.error("Failed to fetch popular packages:", error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <Box sx={{ py: { xs: 6, md: 9 }, bgcolor: "#FFF" }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "28px", sm: "36px", md: "44px" },
              color: "#1A1A1A",
              mb: 1.5,
            }}
          >
            Popular Pooja Packages
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
            <Box
              component="img"
              src="/images/home/poojaPackages/dhanush.webp"
              alt="Decorative Arch"
              sx={{
                width: { xs: "90%", sm: "80%", md: "650px" },
                height: { xs: "auto", md: "40px" },
                maxWidth: "100%",
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
                onClick={() => router.push("/services")}
                sx={{
                  color: "#D32F2F",
                  background: "transparent",
                  borderRadius: "31px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "#FF6200",
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
              onClick={() => router.push("/services")}
              sx={{
                color: "#D32F2F",
                background: "transparent",
                borderRadius: "31px",
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                "&:hover": {
                  background: "#FF6200",
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
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#FF6200" }} />
          </Box>
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
                  onClick={() => router.push("/services")}
                  sx={{
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
                      p: { xs: 2.5, sm: 3 },
                      borderBottom: "1px solid #EFE6D5",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={pkg.image}
                      alt={pkg.title}
                      sx={{
                        width: "100%",
                        height: "150px",
                        objectFit: "contain",
                        borderRadius: "12px",
                        mb: 2,
                      }}
                    />
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                        fontWeight: 700,
                        fontSize: { xs: "20px", sm: "22px" },
                        color: "#2C1810",
                        textAlign: "center",
                        lineHeight: 1.25,
                      }}
                    >
                      {pkg.title}
                    </Typography>
                  </Box>

                  {/* Card Body Section */}
                  <Box
                    sx={{
                      p: { xs: 2.5, sm: 3 },
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
                        STARTING FROM
                      </Typography>

                      {/* Price Display */}
                      <Box
                        sx={{ display: "flex", alignItems: "baseline", mb: 2 }}
                      >
                        <Typography
                          sx={{
                            fontFamily:
                              'var(--font-outfit), "DM Sans", sans-serif',
                            fontWeight: 800,
                            fontSize: { xs: "26px", sm: "28px" },
                            color: "#2C1810",
                          }}
                        >
                          ₹{pkg.price}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{
                            fontFamily:
                              'var(--font-outfit), "DM Sans", sans-serif',
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#8C6D53",
                            ml: 1,
                          }}
                        >
                          {pkg.unit || "onwards"}
                        </Typography>
                      </Box>

                      {/* Service Description truncated to 3 lines */}
                      <Typography
                        sx={{
                          fontFamily:
                            'var(--font-outfit), "DM Sans", sans-serif',
                          fontSize: "13.5px",
                          color: "#5C4A40",
                          lineHeight: 1.6,
                          mb: 3,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {pkg.description}
                      </Typography>
                    </Box>

                    {/* Book Now Button */}
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/services");
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
                        fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                        textTransform: "none",
                        transition: "all 0.25s ease-in-out",
                        "&:hover": {
                          bgcolor: "#FF6200",
                          color: "#FFFFFF",
                          borderColor: "#FF6200",
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
