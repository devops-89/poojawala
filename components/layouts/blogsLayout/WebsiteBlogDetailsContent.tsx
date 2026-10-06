"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { getBlogByIdAPI } from "@/api/blogControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";

import RelatedBlogsSection from "./RelatedBlogsSection";
import BlogCtaBanner from "./BlogCtaBanner";

interface WebsiteBlogDetailsContentProps {
  blogId: string | number;
}

export default function WebsiteBlogDetailsContent({ blogId }: WebsiteBlogDetailsContentProps) {
  const { showSnackbar } = useSnackbarStore();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const res = await getBlogByIdAPI(blogId);
        const data = res?.data?.data || res?.data || res?.blog || res;
        setBlog(data);
      } catch (err: any) {
        console.error("Failed to fetch public blog details", err);
        showSnackbar("Failed to load article details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogDetails();
    }
  }, [blogId, showSnackbar]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "65vh",
          bgcolor: "#FFFDF9",
        }}
      >
        <CircularProgress sx={{ color: "#FF6200" }} />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"DM Sans", sans-serif',
            color: "#64748b",
            mb: 3,
          }}
        >
          Article not found or no longer available.
        </Typography>
        <Button
          component={NextLink}
          href="/blogs"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            bgcolor: "#FF6200",
            color: "white",
            borderRadius: "30px",
            textTransform: "none",
            px: 4,
            py: 1.2,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            "&:hover": { bgcolor: "#E65800" },
          }}
        >
          Explore All Articles
        </Button>
      </Container>
    );
  }

  const titleText = blog.title || blog.heading || blog.name || "Untitled Article";
  const contentText = blog.content || blog.body || blog.description || "";
  const coverImg =
    blog.coverImage ||
    blog.imageUrl ||
    blog.image ||
    blog.downloadUrl ||
    "/images/home/hero/heroSectionHome.webp";

  const categoryName = (
    typeof blog.category === "string"
      ? blog.category
      : typeof blog.category === "object" && blog.category
      ? blog.category.name || blog.category.title
      : blog.categoryName || "Puja & Rituals"
  ).toUpperCase();

  const authorName =
    blog.authorName ||
    (typeof blog.author === "string"
      ? blog.author
      : typeof blog.author === "object" && blog.author
      ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim() ||
        blog.author.username ||
        blog.author.name
      : "Editorial Team");

  const sectionsList = Array.isArray(blog.sections) ? blog.sections : [];

  const formattedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "October 5, 2026";

  const readTime = blog.readTime || 4;

  // Highlight title with orange accent if possible
  const renderHighlightedTitle = (rawTitle: string) => {
    const parts = rawTitle.split(":");
    if (parts.length > 1) {
      return (
        <>
          <span style={{ fontStyle: "italic", color: "#FF6200" }}>{parts[0]}:</span>{" "}
          {parts.slice(1).join(":")}
        </>
      );
    }
    return rawTitle;
  };

  return (
    <Box sx={{ bgcolor: "#FFFDF9", minHeight: "100vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        {/* Back Link */}
        <Button
          component={NextLink}
          href="/blogs"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#64748B",
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 700,
            fontSize: "0.875rem",
            textTransform: "none",
            mb: 4,
            "&:hover": { color: "#FF6200", bgcolor: "#FFF0E6" },
          }}
        >
          Back to Articles
        </Button>

        {/* HERO SECTION: 2-Column Side-by-Side Layout (Top Aligned) */}
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "flex-start", mb: 6 }}>
          {/* Left Column: Text & Author Info */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Category Pill Tag */}
              <Box>
                <Chip
                  icon={<CategoryOutlinedIcon sx={{ fontSize: 16, color: "#FF6200 !important" }} />}
                  label={categoryName}
                  sx={{
                    fontWeight: 800,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "0.75rem",
                    bgcolor: "#FFF0E6",
                    color: "#FF6200",
                    borderRadius: "6px",
                    px: 0.5,
                  }}
                />
              </Box>

              {/* Main Title */}
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontFamily: '"Georgia", serif',
                  fontWeight: 700,
                  color: "#0F172A",
                  fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.8rem" },
                  lineHeight: 1.25,
                  letterSpacing: "-0.015em",
                }}
              >
                {renderHighlightedTitle(titleText)}
              </Typography>

              <Divider sx={{ my: 1.5, borderColor: "#E5DEC9" }} />

              {/* Author Meta Box at Bottom Left */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: "#FFF0E6",
                    color: "#FF6200",
                    fontWeight: 700,
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: "1.1rem",
                    border: "2.5px solid #FF6200",
                    boxShadow: "0 2px 8px rgba(255, 98, 0, 0.2)",
                  }}
                >
                  {authorName.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Georgia", serif',
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "#0F172A",
                    }}
                  >
                    {authorName}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: "0.825rem",
                      color: "#64748B",
                      fontWeight: 500,
                    }}
                  >
                    {formattedDate} &bull; {readTime} min read
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Hero Cover Image */}
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Box
              sx={{
                width: "100%",
                borderRadius: "24px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                border: "1px solid #EFEAE0",
                bgcolor: "#f8fafc",
                height: { xs: 300, sm: 380, md: 420 },
              }}
            >
              <Box
                component="img"
                src={coverImg}
                alt={titleText}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        {/* FULL ARTICLE BODY */}
        {contentText && (
          <Box sx={{ mb: 6 }}>
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: "1.1rem",
                color: "#334155",
                lineHeight: 1.9,
                whiteSpace: "pre-line",
                letterSpacing: "0.01em",
              }}
            >
              {contentText}
            </Typography>
          </Box>
        )}

        {/* SECTIONS LIST (With #FF6200 Section Titles) */}
        {sectionsList.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sectionsList.map((sec: any, idx: number) => {
              const secTitle = sec.title || sec.heading || `Section ${idx + 1}`;
              const secDesc = sec.description || sec.content || sec.body || "";
              return (
                <Box key={idx} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: '"Georgia", serif',
                      fontWeight: 700,
                      color: "#FF6200",
                      fontSize: { xs: "1.35rem", sm: "1.6rem" },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {secTitle}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: "1.05rem",
                      color: "#475569",
                      lineHeight: 1.85,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {secDesc}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Related Blogs Section: More Sacred Wisdom */}
        <RelatedBlogsSection currentBlogId={blogId} />
      </Container>

      {/* Full-width CTA Banner right above footer */}
      <BlogCtaBanner />
    </Box>
  );
}
