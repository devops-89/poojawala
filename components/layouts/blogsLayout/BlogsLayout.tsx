"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllBlogsAPI } from "@/api/blogControllers";
import BlogCardGrid from "./BlogCardGrid";
import FeaturedBlogSection from "./FeaturedBlogSection";

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
        bgcolor: "#FFFDF9",
        minHeight: "100vh",
        pb: 10,
        position: "relative",
      }}
    >
      {/* Hero Section matching Homepage & Services page size & styling */}
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: "380px", sm: "480px", md: "777px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.88) 0%, rgba(255, 253, 249, 0.6) 35%, rgba(255, 253, 249, 0.05) 70%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, rgba(255, 253, 249, 0.82) 0%, rgba(255, 253, 249, 0.45) 25%, rgba(255, 253, 249, 0.02) 50%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 2.5, md: 4 },
          pb: { xs: 3.5, md: 8 },
          mb: { xs: 4, md: 8 },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Content */}
          <Box sx={{ maxWidth: "600px", mt: "auto", mb: "auto" }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                color: "#0f172a",
                mb: 0.5,
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.04em",
              }}
            >
              Explore Our Articles &
            </Typography>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 800,
                color: "#D32F2F",
                mb: { xs: 1.5, md: 3 },
                fontSize: { xs: "1.5rem", sm: "2.2rem", md: "48px" },
                lineHeight: { xs: 1.15, md: 1.2 },
                letterSpacing: "-0.04em",
              }}
            >
              Vedic Wisdom
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#0f172a",
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                lineHeight: "1.45",
                maxWidth: "500px",
                letterSpacing: "0em",
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
      <BlogCardGrid blogs={otherBlogs} loading={loading} />
    </Box>
  );
}
