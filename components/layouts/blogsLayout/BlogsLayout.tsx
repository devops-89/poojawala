"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllBlogsAPI } from "@/api/blogControllers";
import BlogCardGrid from "./BlogCardGrid";
import FeaturedBlogSection from "./FeaturedBlogSection";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

export default function BlogsLayout() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await getAllBlogsAPI(1, 50, "", "PUBLISHED");
        let rawList: any[] = [];
        if (Array.isArray(res)) rawList = res;
        else if (Array.isArray(res?.data)) rawList = res.data;
        else if (Array.isArray(res?.data?.data)) rawList = res.data.data;
        else if (Array.isArray(res?.blogs)) rawList = res.blogs;

        const activeBlogs = rawList.filter((b: any) => b.isActive !== false);
        setBlogs(activeBlogs);
      } catch (err) {
        console.error("Failed to fetch public blogs", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Find featured blog (where isFeatured === true)
  const featuredBlog = blogs.find((b) => b.isFeatured === true);
  
  // Remaining blogs for grid display
  const otherBlogs = featuredBlog
    ? blogs.filter((b) => b.id !== featuredBlog.id)
    : blogs;

  return (
    <Box
      sx={{
        bgcolor: COLORS.CREAM_ULTRA_LIGHT,
        minHeight: "100vh",
        pb: 10,
        position: "relative",
      }}
    >
      {/* Hero Section matching Homepage & Services page size & styling */}
      <Box
        sx={{
          width: "100%",
          height: { xs: "auto", md: "calc(100vh - 80px)" },
          minHeight: { xs: "380px", sm: "460px", md: "calc(100vh - 80px)" },
          maxHeight: { md: "calc(100vh - 80px)" },
          backgroundImage: {
            xs: "linear-gradient(180deg, rgba(12, 6, 2, 0.78) 0%, rgba(12, 6, 2, 0.52) 60%, rgba(12, 6, 2, 0.18) 100%), url(/images/home/hero/heroSectionHome.webp)",
            sm: "linear-gradient(90deg, rgba(12, 6, 2, 0.82) 0%, rgba(12, 6, 2, 0.55) 55%, rgba(12, 6, 2, 0.12) 80%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, rgba(12, 6, 2, 0.84) 0%, rgba(12, 6, 2, 0.55) 42%, rgba(12, 6, 2, 0.15) 68%, transparent 85%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: { xs: "top right", md: "center" },
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 3.5, sm: 4, md: 4 },
          pb: { xs: 4, sm: 5, md: 6 },
          mb: { xs: 4, md: 6 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Content */}
          <Box sx={{ maxWidth: { xs: "100%", md: "620px" }, mt: "auto", mb: "auto", position: "relative", zIndex: 2 }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: FONTS.DM_SANS,
                fontWeight: 800,
                color: "#FFFFFF",
                mb: { xs: 1.5, md: 3 },
                fontSize: { xs: "1.85rem", sm: "2.4rem", md: "48px" },
                lineHeight: { xs: 1.2, md: 1.22 },
                letterSpacing: "-0.03em",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.85), 0 4px 20px rgba(0, 0, 0, 0.7)",
              }}
            >
              Explore Our Articles &{" "}
              <Box
                component="span"
                sx={{
                  display: { xs: "inline", sm: "block" },
                  fontWeight: 800,
                  color: "#FFB300",
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 179, 0, 0.5)",
                }}
              >
                Vedic Wisdom
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: FONTS.DM_SANS,
                color: "#F1F5F9",
                fontWeight: 500,
                fontSize: { xs: "14.5px", sm: "15px", md: "16px" },
                lineHeight: 1.6,
                maxWidth: "520px",
                letterSpacing: "0em",
                textShadow: "0 1px 4px rgba(0, 0, 0, 0.9)",
              }}
            >
              Discover step-by-step Puja Vidhis, festival guides, mantra meanings, and sacred insights written by verified Vedic Pandits and Acharyas.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Featured Blog Section (Rendered if isFeatured === true) */}
      {featuredBlog && <FeaturedBlogSection blog={featuredBlog} />}

      {/* Public Blog Cards Grid (No filter/search bar) */}
      {(!featuredBlog || otherBlogs.length > 0 || loading) && (
        <BlogCardGrid
          blogs={otherBlogs}
          loading={loading}
          hasFeatured={Boolean(featuredBlog)}
        />
      )}
    </Box>
  );
}
