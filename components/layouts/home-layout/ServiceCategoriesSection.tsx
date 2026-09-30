"use client";

import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// SwiperImports
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CategoryItem {
  id: number | string;
  name: string;
  description?: string;
  iconUrl?: string;
  iconDownloadurl?: string;
  totalServices?: number;
  isActive?: boolean;
}

const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop";

export default function ServiceCategoriesSection() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await getServiceCategoriesAPI(1, 100, "", true);
        let list: any[] = [];
        if (res) {
          if (Array.isArray(res)) {
            list = res;
          } else if (res.data) {
            if (Array.isArray(res.data.data)) list = res.data.data;
            else if (Array.isArray(res.data)) list = res.data;
            else if (Array.isArray(res.data.categories))
              list = res.data.categories;
          } else if (res.categories && Array.isArray(res.categories)) {
            list = res.categories;
          }
        }

        const activeCategories = list.filter((c: any) => c.isActive !== false);

        setCategories(activeCategories);
      } catch (error) {
        console.error(
          "Failed to fetch service categories for home page:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (cat: CategoryItem) => {
    router.push(
      `/services?categoryId=${cat.id}&category=${encodeURIComponent(cat.name)}`,
    );
  };

  if (!loading && categories.length === 0) {
    return null;
  }

  // Ensure enough slides for seamless loop
  const loopedCategories =
    categories.length > 0 && categories.length < 4
      ? [...categories, ...categories, ...categories, ...categories]
      : categories;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: "#FFF",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section matching Popular Pooja Packages */}
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
            Explore Pooja by Category
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
            Browse our wide range of traditional Vedic pooja's categorized for
            every sacred occasion, festival, and family ritual.
          </Typography>

          {categories.length > 0 && (
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

        {/* Categories Swiper Slider */}
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
                  height={340}
                  sx={{ borderRadius: "20px", flex: 1 }}
                />
              ))}
            </Box>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination]}
              loop={true}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 3500,
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
              {loopedCategories.map((cat, idx) => {
                const imageUrl =
                  cat.iconDownloadurl || cat.iconUrl || FALLBACK_CATEGORY_IMAGE;

                return (
                  <SwiperSlide key={`${cat.id}-${idx}`}>
                    <Box
                      onClick={() => handleCategoryClick(cat)}
                      sx={{
                        position: "relative",
                        height: "340px",
                        borderRadius: "20px",
                        overflow: "hidden",
                        cursor: "pointer",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 18px 36px rgba(255, 98, 0, 0.2)",
                          "& .category-bg": {
                            transform: "scale(1.08)",
                          },
                          "& .category-overlay": {
                            background:
                              "linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.55) 55%, rgba(0, 0, 0, 0.2) 100%)",
                          },
                          "& .cta-arrow": {
                            transform: "translateX(6px)",
                            color: "#FF6200",
                          },
                        },
                      }}
                    >
                      {/* Background Image */}
                      <Box
                        className="category-bg"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `url(${imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          transition:
                            "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />

                      {/* Dark Gradient Overlay */}
                      <Box
                        className="category-overlay"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0.1) 100%)",
                          transition: "background 0.4s ease",
                        }}
                      />

                      {/* Card Content Overlay at Bottom (Name, Desc & Explore Services) */}
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
                            fontFamily:
                              'var(--font-outfit), "DM Sans", sans-serif',
                            fontWeight: 700,
                            fontSize: "22px",
                            color: "#FFFFFF",
                            lineHeight: 1.3,
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                          }}
                        >
                          {cat.name}
                        </Typography>

                        {cat.description && (
                          <Typography
                            sx={{
                              fontFamily:
                                'var(--font-outfit), "DM Sans", sans-serif',
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
                            {cat.description}
                          </Typography>
                        )}

                        {/* Action Row */}
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
                          <span>Explore Services</span>
                          <ArrowForwardIcon
                            className="cta-arrow"
                            sx={{
                              fontSize: 18,
                              transition:
                                "transform 0.3s ease, color 0.3s ease",
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </Box>
      </Container>
    </Box>
  );
}
