"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import { formatServicePriceRange } from "@/utils/helpers";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface CustomerServiceCardProps {
  service: any;
  onBookNow?: (serviceId: number) => void;
}

export default function CustomerServiceCard({
  service,
  onBookNow,
}: CustomerServiceCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    const target = service?.slug || service?.id || service?._id;
    if (target) {
      router.push(`/customer/services/${target}`);
    }
  };

  const priceDisplay = formatServicePriceRange(service);

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

  const dMins =
    service?.durationMinutes != null && !isNaN(Number(service.durationMinutes))
      ? Number(service.durationMinutes)
      : null;

  const durationText =
    dMins != null
      ? dMins >= 60
        ? dMins % 60 === 0
          ? `${dMins / 60} hour${dMins >= 120 ? "s" : ""}`
          : `${Math.floor(dMins / 60)} hr ${dMins % 60} mins`
        : `${dMins} mins`
      : service?.duration || "120 mins";

  const imageSrc =
    service?.bannerDownloadurl ||
    service?.bannerUrl ||
    service?.iconDownloadurl ||
    service?.iconUrl ||
    service?.image ||
    "/images/home/poojaPackages/satyanarayan.webp";

  return (
    <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
      <Paper
        elevation={0}
        onClick={handleCardClick}
        sx={{
          width: "100%",
          p: { xs: 2, sm: 2.25 },
          borderRadius: "20px",
          border: "1.5px solid #EFE6D5",
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 2.25 },
          alignItems: { xs: "center", sm: "flex-start" },
          cursor: "pointer",
          transition: "all 0.25s ease-in-out",
          boxShadow: "0 2px 10px rgba(44, 24, 16, 0.04)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 12px 28px -6px rgba(44, 24, 16, 0.10)",
            borderColor: "#FFD4BC",
          },
        }}
      >
        {/* Left: Image Container */}
        <Box
          sx={{
            width: { xs: "100%", sm: 150, md: 165 },
            height: { xs: 180, sm: 165 },
            borderRadius: "16px",
            overflow: "hidden",
            flexShrink: 0,
            bgcolor: "#FAF7F4",
            border: "1px solid #EFE6D5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1.5,
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={serviceTitle}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
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
            minHeight: { sm: 165 },
          }}
        >
          {/* Header Info */}
          <Box sx={{ mb: 1.5 }}>
            {/* Badges Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexWrap: "wrap",
                mb: 1,
              }}
            >
              {(service?.isOnline || service?.isOffline) && (
                <Chip
                  label={
                    service.isOnline && service.isOffline
                      ? "Online & Offline"
                      : service.isOnline
                        ? "Online"
                        : "Offline"
                  }
                  size="small"
                  sx={{
                    bgcolor:
                      service.isOnline && service.isOffline
                        ? "#FAF5FF"
                        : service.isOnline
                          ? "#F0FDF4"
                          : "#F0F9FF",
                    color:
                      service.isOnline && service.isOffline
                        ? "#9333EA"
                        : service.isOnline
                          ? "#16A34A"
                          : "#0284C7",
                    border: `1px solid ${
                      service.isOnline && service.isOffline
                        ? "#E9D5FF"
                        : service.isOnline
                          ? "#BBF7D0"
                          : "#BAE6FD"
                    }`,
                    fontWeight: 700,
                    fontSize: "11px",
                    height: 22,
                    borderRadius: "20px",
                    fontFamily: FONTS.OUTFIT,
                  }}
                />
              )}

              {durationText && (
                <Chip
                  icon={
                    <AccessTimeIcon
                      sx={{ fontSize: "13px !important", color: "#7C6A60 !important" }}
                    />
                  }
                  label={durationText}
                  size="small"
                  sx={{
                    bgcolor: "#FAF4EE",
                    color: "#7C6A60",
                    border: "1px solid #EFE6D5",
                    fontWeight: 600,
                    fontSize: "11px",
                    height: 22,
                    borderRadius: "20px",
                    fontFamily: FONTS.OUTFIT,
                    "& .MuiChip-icon": { ml: 0.75, mr: -0.25 },
                  }}
                />
              )}

              {service?.isUpcomingFestival && (
                <Chip
                  label="Festival"
                  size="small"
                  sx={{
                    bgcolor: "#FFF0E6",
                    color: COLORS.PRIMARY,
                    border: "1px solid #FFD4BC",
                    fontWeight: 700,
                    fontSize: "11px",
                    height: 22,
                    borderRadius: "20px",
                    fontFamily: FONTS.OUTFIT,
                  }}
                />
              )}
            </Box>

            {/* Service Title */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#2C1810",
                fontSize: { xs: "1.05rem", sm: "1.12rem" },
                lineHeight: 1.3,
                mb: 0.75,
              }}
            >
              {serviceTitle}
            </Typography>

            {/* Service Description */}
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#7C6A60",
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
          <Box
            sx={{
              mt: "auto",
              pt: 1.5,
              borderTop: "1px dashed #EFE6D5",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  color: "#8A7A70",
                  textTransform: "uppercase",
                  fontFamily: FONTS.OUTFIT,
                }}
              >
                Price
              </Typography>
              <Typography
                sx={{
                  fontFamily: FONTS.OUTFIT,
                  fontWeight: 800,
                  color: COLORS.PRIMARY,
                  fontSize: { xs: "15px", sm: "17px" },
                  lineHeight: 1.2,
                }}
              >
                {priceDisplay}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                if (onBookNow && service?.id) {
                  onBookNow(service.id);
                } else {
                  handleCardClick();
                }
              }}
              endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
              sx={{
                background: COLORS.PRIMARY,
                color: "white",
                textTransform: "none",
                borderRadius: "20px",
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "13px",
                px: { xs: 2.5, sm: 3 },
                py: 0.8,
                flexShrink: 0,
                boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
                "&:hover": {
                  background: COLORS.PRIMARY_DARK,
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
