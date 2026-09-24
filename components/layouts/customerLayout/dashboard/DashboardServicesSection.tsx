"use client";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CelebrationIcon from "@mui/icons-material/Celebration";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

interface DashboardServicesSectionProps {
  services: any[];
  loadingServices: boolean;
  userLocation: { city: string; state: string };
}

export default function DashboardServicesSection({
  services,
  loadingServices,
  userLocation,
}: DashboardServicesSectionProps) {
  const router = useRouter();

  // Max 3 services on dashboard
  const displayServices = services.slice(0, 3);
  const count = displayServices.length;

  return (
    <Box sx={{ mb: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--font-outfit), sans-serif",
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            Sacred Pooja Services
          </Typography>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}
          >
            <LocationOnIcon sx={{ color: "#FF6200", fontSize: 16 }} />
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#64748b",
                fontSize: "13.5px",
                fontWeight: 600,
              }}
            >
              Available in {userLocation.city}, {userLocation.state}
            </Typography>
          </Box>
        </Box>

        <Button
          component={NextLink}
          href="/customer/services"
          endIcon={<ArrowForwardIcon />}
          sx={{ color: "#FF6200", textTransform: "none", fontWeight: 700 }}
        >
          View All Services
        </Button>
      </Box>

      {loadingServices ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
              <Skeleton
                variant="rectangular"
                height={280}
                sx={{ borderRadius: "16px" }}
              />
            </Grid>
          ))}
        </Grid>
      ) : count === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FFF6F0 0%, #FFECE0 100%)",
            border: "1px solid #FFD4BC",
            boxShadow: "0 6px 20px rgba(255, 98, 0, 0.06)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "16px",
                bgcolor: "#FF6200",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.3)",
                flexShrink: 0,
              }}
            >
              <NotificationsActiveOutlinedIcon sx={{ fontSize: 26 }} />
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 0.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    fontWeight: 800,
                    color: "#2C1810",
                    fontSize: "18px",
                  }}
                >
                  No Services Listed in {userLocation.city} Yet
                </Typography>
                <Chip
                  label="Notice"
                  size="small"
                  sx={{
                    bgcolor: "#FF6200",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "11px",
                    height: "22px",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  maxWidth: 680,
                }}
              >
                We are actively onboarding verified purohits in{" "}
                {userLocation.city}, {userLocation.state}. In the meantime, you
                can explore available services across regions or request custom
                pooja arrangements!
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={() => router.push("/customer/services")}
            variant="contained"
            sx={{
              bgcolor: "#FF6200",
              color: "white",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "14px",
              px: 3,
              py: 1.2,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
              "&:hover": { bgcolor: "#e05600" },
            }}
          >
            Explore All Services
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {displayServices.map((item) => {
            const isSingle = count === 1;
            const minP = item.minPrice || item.price || item.basePrice || 0;
            const maxP = item.maxPrice;
            const priceDisplay =
              maxP && Number(maxP) > Number(minP)
                ? `₹${Number(minP).toLocaleString("en-IN")} - ₹${Number(maxP).toLocaleString("en-IN")}`
                : `₹${Number(minP).toLocaleString("en-IN")}`;

            const imageSrc =
              item.iconDownloadurl ||
              item.iconUrl ||
              item.imageUrl ||
              item.image ||
              item.bannerImage ||
              "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80";
            const durationText = item.durationMinutes
              ? `${item.durationMinutes} mins`
              : null;
            const languagesList = Array.isArray(item.languages)
              ? item.languages
                  .map((l: any) => (typeof l === "string" ? l : l.name))
                  .filter(Boolean)
              : [];

            const gridSpan = isSingle
              ? { xs: 12, md: 12 }
              : count === 2
                ? { xs: 12, sm: 6, md: 6 }
                : { xs: 12, sm: 6, md: 4 };

            return (
              <Grid size={gridSpan} key={item.id}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    bgcolor: "white",
                    borderColor: "#e2e8f0",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: isSingle
                      ? { xs: "column", md: "row" }
                      : "column",
                    height: "100%",
                    position: "relative",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: isSingle ? { xs: "100%", md: "360px" } : "100%",
                      minWidth: isSingle ? { md: "360px" } : undefined,
                      flexShrink: 0,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={imageSrc}
                      alt={item.name}
                      sx={{
                        objectFit: "cover",
                        height: isSingle ? { xs: 220, md: "100%" } : 160,
                        minHeight: isSingle ? { md: 220 } : undefined,
                      }}
                    />
                    {item.isUpcomingFestival && (
                      <Chip
                        icon={
                          <CelebrationIcon
                            sx={{
                              fontSize: "14px !important",
                              color: "#fff !important",
                            }}
                          />
                        }
                        label="Festival Special"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          bgcolor: "rgba(234, 88, 12, 0.95)",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "11px",
                          backdropFilter: "blur(4px)",
                        }}
                      />
                    )}
                  </Box>

                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 800,
                          color: "#1e293b",
                          fontSize: isSingle
                            ? { xs: "1.2rem", md: "1.35rem" }
                            : "1.1rem",
                          mb: 1,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: '"DM Sans", sans-serif',
                          color: "#64748b",
                          fontSize: "14px",
                          lineHeight: 1.6,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: isSingle ? 3 : 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.description ||
                          "Authentic Vedic pooja ritual performed by verified purohits."}
                      </Typography>

                      {/* Info badges */}
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{ flexWrap: "wrap", mb: 2 }}
                      >
                        {durationText && (
                          <Chip
                            icon={
                              <AccessTimeIcon
                                sx={{ fontSize: "13px !important" }}
                              />
                            }
                            label={durationText}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#475569",
                              borderColor: "#cbd5e1",
                            }}
                          />
                        )}
                        {languagesList.map((lang: string, i: number) => (
                          <Chip
                            key={i}
                            icon={
                              <TranslateIcon
                                sx={{ fontSize: "12px !important" }}
                              />
                            }
                            label={lang}
                            size="small"
                            sx={{
                              fontSize: "11px",
                              fontWeight: 600,
                              bgcolor: "#f1f5f9",
                              color: "#334155",
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        pt: 2,
                        borderTop: "1px dashed #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: "11px",
                            color: "#94a3b8",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          PRICE
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "var(--font-outfit), sans-serif",
                            fontWeight: 800,
                            fontSize: isSingle ? "1.35rem" : "1.15rem",
                            color: "#FF6200",
                          }}
                        >
                          {priceDisplay}
                        </Typography>
                      </Box>

                      <Button
                        onClick={() =>
                          router.push(`/customer/services/${item.id}`)
                        }
                        variant="contained"
                        size={isSingle ? "medium" : "small"}
                        sx={{
                          bgcolor: "#FF6200",
                          color: "white",
                          borderRadius: "10px",
                          textTransform: "none",
                          fontWeight: 700,
                          fontSize: "14px",
                          px: isSingle ? 3 : 2,
                          py: 1,
                          boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
                          "&:hover": { bgcolor: "#e05600" },
                        }}
                      >
                        Book Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
