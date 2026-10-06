"use client";

import { Box, Container, Typography } from "@mui/material";
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
      {/* Hero Section matching Homepage & Services page */}
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: "320px", sm: "400px", md: "520px" },
          backgroundImage: {
            xs: "linear-gradient(90deg, rgba(255, 253, 249, 0.95) 0%, rgba(255, 253, 249, 0.82) 45%, rgba(255, 253, 249, 0.1) 80%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
            md: "linear-gradient(90deg, #FFFDF9 0%, rgba(255, 253, 249, 0.85) 35%, rgba(255, 253, 249, 0.1) 65%, transparent 100%), url(/images/home/hero/heroSectionHome.webp)",
          },
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          pt: { xs: 2.5, md: 4 },
          pb: { xs: 3.5, md: 6 },
          mb: { xs: 2, md: 4 },
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
          <Box sx={{ maxWidth: "620px", mt: "auto", mb: "auto" }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                color: "#0f172a",
                mb: 1.5,
                fontSize: { xs: "1.6rem", sm: "2.3rem", md: "48px" },
                letterSpacing: "-0.04em",
              }}
            >
              Explore Our Articles & Vedic Wisdom
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                color: "#0f172a",
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "15px", md: "18px" },
                lineHeight: "1.5",
                maxWidth: "540px",
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
