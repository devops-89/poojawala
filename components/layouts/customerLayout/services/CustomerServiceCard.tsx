"use client";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface CustomerServiceCardProps {
  service: any;
  onBookNow?: (serviceId: number) => void;
}

export default function CustomerServiceCard({
  service,
}: CustomerServiceCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (service?.id) {
      router.push(`/customer/services/${service.id}`);
    }
  };

  const priceDisplay =
    service?.minPrice && service?.maxPrice
      ? `₹${Number(service.minPrice).toLocaleString("en-IN")} - ₹${Number(service.maxPrice).toLocaleString("en-IN")}`
      : service?.minPrice
        ? `₹${Number(service.minPrice).toLocaleString("en-IN")}`
        : service?.price || service?.basePrice
          ? `₹${Number(service.price || service.basePrice).toLocaleString("en-IN")}`
          : "Price on request";

  const serviceTitle =
    service?.title ||
    service?.name ||
    service?.serviceName ||
    "Unknown Service";

  const serviceDesc =
    service?.desc ||
    service?.description ||
    service?.shortDescription ||
    "Special pooja performed with traditional Vedic rituals.";

  const durationText = service?.durationMinutes
    ? service.durationMinutes >= 60
      ? `${Math.floor(service.durationMinutes / 60)} hour${service.durationMinutes >= 120 ? "s" : ""}`
      : `${service.durationMinutes} mins`
    : service?.duration || "120 mins";

  const imageSrc =
    service?.bannerDownloadurl ||
    service?.bannerUrl ||
    service?.iconDownloadurl ||
    service?.iconUrl ||
    "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80";

  return (
    <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex" }}>
      <Paper
        elevation={0}
        onClick={handleCardClick}
        sx={{
          width: "100%",
          p: 2.5,
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2.5,
          alignItems: { xs: "center", sm: "flex-start" },
          cursor: "pointer",
          transition: "all 0.25s ease-in-out",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px -8px rgba(0,0,0,0.08)",
            borderColor: "#cbd5e1",
          },
        }}
      >
        {/* Left: Image with Breathing Space */}
        <Box
          sx={{
            width: { xs: "100%", sm: 160, md: 180 },
            height: { xs: 200, sm: 140 },
            borderRadius: "14px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "#FFF8F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={serviceTitle}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: { xs: "contain", sm: "cover" },
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        </Box>

        {/* Right: Details & Actions */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Header info */}
          <Box sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"DM Sans", var(--font-outfit), sans-serif',
                  fontWeight: 800,
                  color: "#1e293b",
                  fontSize: "1.1rem",
                  lineHeight: 1.25,
                }}
              >
                {serviceTitle}
              </Typography>
              {service?.isUpcomingFestival && (
                <Chip
                  label="Festival"
                  size="small"
                  sx={{
                    bgcolor: "#FFF0E6",
                    color: "#FF6200",
                    fontWeight: 700,
                    fontSize: "11px",
                    height: 22,
                    borderRadius: "6px",
                  }}
                />
              )}
            </Box>

            <Typography
              sx={{
                fontFamily: '"DM Sans", var(--font-outfit), sans-serif',
                color: "#64748b",
                fontSize: "13px",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {serviceDesc}
            </Typography>
          </Box>

          {/* Stats Row & Actions */}
          <Box sx={{ mt: "auto", pt: 1, borderTop: "1px border-dashed #f1f5f9" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 1.5,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                  }}
                >
                  PRICE RANGE
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 800,
                    color: "#FF6200",
                    fontSize: "15px",
                  }}
                >
                  {priceDisplay}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                  }}
                >
                  DURATION
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "14px",
                  }}
                >
                  {durationText}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              sx={{
                background: "#FF6200",
                color: "white",
                textTransform: "none",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "14px",
                py: 0.9,
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  background: "#E65800",
                  boxShadow: "0 6px 18px rgba(255, 98, 0, 0.35)",
                },
              }}
            >
              Book Now
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}
