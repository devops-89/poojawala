"use client";

import { getTemplesAPI } from "@/api/templeControllers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import { Box, Button, Container, Grid, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { TempleItem } from "@/utils/types";

// Swiper Imports
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const FALLBACK_TEMPLE_IMAGE = "/images/home/poojaPackages/satyanarayan.webp";

export default function TemplesSection() {
  const router = useRouter();
  const [temples, setTemples] = useState<TempleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        setLoading(true);
        const res = await getTemplesAPI(1, 30, "", true);
        let list: any[] = [];
        if (res) {
          if (Array.isArray(res)) {
            list = res;
          } else if (res.data) {
            if (Array.isArray(res.data.data)) list = res.data.data;
            else if (Array.isArray(res.data)) list = res.data;
            else if (Array.isArray(res.data.temples)) list = res.data.temples;
          } else if (res.temples && Array.isArray(res.temples)) {
            list = res.temples;
          }
        }

        const activeTemples = list.filter((t: any) => t.isActive !== false);
        setTemples(activeTemples);
      } catch (error) {
        console.error("Failed to fetch temples for home page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemples();
  }, []);

  const handleTempleClick = (temple: TempleItem) => {
    router.push(
      `/services?templeId=${temple.id}&temple=${encodeURIComponent(temple.name)}`
    );
  };

  if (!loading && temples.length === 0) {
    return null;
  }

  const renderTempleCard = (temple: TempleItem) => {
    const imageUrl =
      temple.downloadUrl || temple.imageUrl || FALLBACK_TEMPLE_IMAGE;

    return (
      <Box
        onClick={() => handleTempleClick(temple)}
        sx={{
          position: "relative",
          height: "360px",
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 18px 36px rgba(255, 98, 0, 0.25)",
            "& .temple-bg": {
              transform: "scale(1.08)",
            },
            "& .temple-overlay": {
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.94) 0%, rgba(0, 0, 0, 0.6) 55%, rgba(0, 0, 0, 0.2) 100%)",
            },
            "& .cta-arrow": {
              transform: "translateX(6px)",
              color: "#FF8C38",
            },
          },
        }}
      >
        {/* Background Image */}
        <Box
          className="temple-bg"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Dark Gradient Overlay */}
        <Box
          className="temple-overlay"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.1) 100%)",
            transition: "background 0.4s ease",
          }}
        />

        {/* Top Location Badge */}
        {(temple.city || temple.state) && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(6px)",
              color: "#FFFFFF",
              px: 1.5,
              py: 0.6,
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <LocationOnIcon sx={{ fontSize: 14, color: "#FF8C38" }} />
            <span>
              {[temple.city, temple.state].filter(Boolean).join(", ")}
            </span>
          </Box>
        )}

        {/* Card Content Overlay at Bottom */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 0.8,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: "22px",
              color: "#FFFFFF",
              lineHeight: 1.3,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
            }}
          >
            {temple.name}
          </Typography>

          {temple.description && (
            <Typography
              sx={{
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "13px",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
              }}
            >
              {temple.description}
            </Typography>
          )}

          {/* Action CTA */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 1,
              color: "#FF8C38",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            <span>Book Temple Pooja</span>
            <ArrowForwardIcon
              className="cta-arrow"
              sx={{
                fontSize: 18,
                transition: "transform 0.3s ease, color 0.3s ease",
              }}
            />
          </Box>
        </Box>
      </Box>
    );
  };

  const renderHorizontalTempleCard = (temple: TempleItem) => {
    const imageUrl =
      temple.downloadUrl || temple.imageUrl || FALLBACK_TEMPLE_IMAGE;

    return (
      <Box
        onClick={() => handleTempleClick(temple)}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          bgcolor: "#FFFFFF",
          borderRadius: "24px",
          overflow: "hidden",
          cursor: "pointer",
          border: "1px solid #F0ECE4",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 18px 36px rgba(255, 98, 0, 0.16)",
            borderColor: "#FFD9C2",
            "& .temple-h-img": {
              transform: "scale(1.06)",
            },
            "& .h-cta-btn": {
              bgcolor: "#FF6200",
              color: "#FFFFFF",
            },
          },
        }}
      >
        {/* Left: Image */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", sm: "44%" },
            minHeight: { xs: "220px", sm: "280px", md: "310px" },
            overflow: "hidden",
          }}
        >
          <Box
            className="temple-h-img"
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 60%)",
            }}
          />

          {/* Location Badge */}
          {(temple.city || temple.state) && (
            <Box
              sx={{
                position: "absolute",
                top: 14,
                left: 14,
                zIndex: 2,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(6px)",
                color: "#FFFFFF",
                px: 1.4,
                py: 0.5,
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <LocationOnIcon sx={{ fontSize: 14, color: "#FF8C38" }} />
              <span>
                {[temple.city, temple.state].filter(Boolean).join(", ")}
              </span>
            </Box>
          )}
        </Box>

        {/* Right: Content */}
        <Box
          sx={{
            width: { xs: "100%", sm: "56%" },
            p: { xs: 2.5, sm: 3, md: 3.5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              alignSelf: "flex-start",
              bgcolor: "#FFF0E6",
              color: "#FF6200",
              px: 1.4,
              py: 0.35,
              borderRadius: "10px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
            }}
          >
            <TempleHinduIcon sx={{ fontSize: 14 }} />
            <span>Sacred Temple</span>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: { xs: "20px", sm: "22px", md: "24px" },
              color: "#1A1A1A",
              lineHeight: 1.3,
            }}
          >
            {temple.name}
          </Typography>

          {temple.address && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                color: "#777",
                fontSize: "13px",
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              }}
            >
              <LocationOnIcon sx={{ fontSize: 14, color: "#FF6200" }} />
              <span>{temple.address}</span>
            </Box>
          )}

          {temple.description && (
            <Typography
              sx={{
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                color: "#555",
                fontSize: { xs: "13px", sm: "13.5px", md: "14px" },
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: { xs: 3, sm: 3, md: 4 },
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {temple.description}
            </Typography>
          )}

          <Box sx={{ mt: 1 }}>
            <Button
              className="h-cta-btn"
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: "#FFF0E6",
                color: "#FF6200",
                boxShadow: "none",
                borderRadius: "30px",
                px: 2.8,
                py: 0.8,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "13px",
                fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#FF6200",
                  color: "#FFFFFF",
                  boxShadow: "0 6px 16px rgba(255, 98, 0, 0.25)",
                },
              }}
            >
              Book Temple Pooja
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  // When temples.length >= 3, ensure at least 6 slides so Swiper does not lock with slidesPerView 3
  const swiperTemples =
    temples.length >= 3 && temples.length < 6
      ? [...temples, ...temples]
      : temples;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: "#FFFDF9",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "#FFF0E6",
              color: "#FF6200",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              mb: 1.5,
            }}
          >
            <TempleHinduIcon sx={{ fontSize: 16 }} />
            <span>Divine Pilgrimage & Temples</span>
          </Box>

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
            Explore Sacred Temples & Dhams
          </Typography>

          {/* Decorative Arch Divider */}
          <Box sx={{ display: "flex", justifyContent: "center", pb: 1.5 }}>
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

          <Typography
            sx={{
              fontFamily: 'var(--font-outfit), "DM Sans", sans-serif',
              color: "#666",
              fontSize: { xs: "14px", md: "16px" },
              maxWidth: "640px",
              mx: "auto",
              mt: 0.5,
            }}
          >
            Experience the divine energy of renowned temples across India.
            Book traditional pujas and sankalp rituals performed in sanctified shrines.
          </Typography>

          {temples.length > 0 && (
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

        {/* Temples Slider or Grid */}
        <Box
          sx={{
            "& .swiper": {
              pb: 6,
              pt: 1,
              px: 1,
            },
            "& .swiper-pagination-bullet": {
              bgcolor: "#CCCCCC",
              opacity: 0.7,
              width: "10px",
              height: "10px",
              transition: "all 0.3s ease",
            },
            "& .swiper-pagination-bullet-active": {
              bgcolor: "#FF6200",
              opacity: 1,
              width: "24px",
              borderRadius: "6px",
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", gap: 3 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={360}
                  sx={{ borderRadius: "20px", flex: 1 }}
                />
              ))}
            </Box>
          ) : temples.length >= 3 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              loop={true}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                600: {
                  slidesPerView: 2,
                  spaceBetween: 24,
                },
                960: {
                  slidesPerView: 3,
                  spaceBetween: 28,
                },
              }}
            >
              {swiperTemples.map((temple, idx) => (
                <SwiperSlide key={`${temple.id}-${idx}`}>
                  {renderTempleCard(temple)}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Box
              sx={{
                maxWidth: temples.length === 1 ? "860px" : "100%",
                mx: "auto",
              }}
            >
              <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                {temples.map((temple) => (
                  <Grid
                    size={{
                      xs: 12,
                      lg: temples.length === 1 ? 12 : 6,
                    }}
                    key={temple.id}
                    sx={{ display: "flex" }}
                  >
                    {renderHorizontalTempleCard(temple)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
