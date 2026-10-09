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
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

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
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: FONTS.PRIMARY,
            color: COLORS.SLATE_MUTED,
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
            bgcolor: COLORS.PRIMARY,
            color: "white",
            borderRadius: "30px",
            textTransform: "none",
            px: 4,
            py: 1.2,
            fontFamily: FONTS.PRIMARY,
            fontWeight: 700,
            "&:hover": { bgcolor: COLORS.PRIMARY_HOVER },
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
          <span style={{ fontStyle: "italic", color: COLORS.PRIMARY }}>{parts[0]}:</span>{" "}
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
            fontFamily: FONTS.PRIMARY,
            fontWeight: 700,
            fontSize: "0.875rem",
            textTransform: "none",
            mb: 4,
            "&:hover": { color: COLORS.PRIMARY, bgcolor: "#FFF0E6" },
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
                    fontFamily: FONTS.PRIMARY,
                    fontSize: "0.75rem",
                    bgcolor: "#FFF0E6",
                    color: COLORS.PRIMARY,
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
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  color: "#0F172A",
                  fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.8rem" },
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
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
                    color: COLORS.PRIMARY,
                    fontWeight: 700,
                    fontFamily: FONTS.PRIMARY,
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
                      fontFamily: FONTS.PRIMARY,
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
          <Box
            sx={{
              mb: 6,
              fontFamily: FONTS.PRIMARY,
              fontSize: "1.1rem",
              color: "#334155",
              lineHeight: 1.9,
              letterSpacing: "0.01em",
              "& h1": {
                fontSize: "2.1rem",
                fontWeight: 800,
                color: "#0f172a",
                mt: 3,
                mb: 1.5,
                fontFamily: '"Georgia", serif',
              },
              "& h2": {
                fontSize: "1.75rem",
                fontWeight: 700,
                color: COLORS.PRIMARY,
                mt: 3.5,
                mb: 1.5,
                fontFamily: '"Georgia", serif',
              },
              "& h3": {
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#1e293b",
                mt: 3,
                mb: 1,
                fontFamily: '"Georgia", serif',
              },
              "& h4": {
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#334155",
                mt: 2.5,
                mb: 1,
              },
              "& p": {
                mb: 2,
              },
              "& ul, & ol": {
                pl: 3.5,
                mb: 2.5,
              },
              "& li": {
                mb: 0.75,
                lineHeight: 1.8,
              },
              "& blockquote": {
                borderLeft: "4px solid #FF6200",
                pl: 3,
                py: 2,
                my: 3.5,
                fontStyle: "italic",
                color: "#475569",
                bgcolor: "#FFF8F2",
                borderRadius: "0 14px 14px 0",
                fontSize: "1.125rem",
                boxShadow: "0 2px 10px rgba(255, 98, 0, 0.05)",
              },
              "& a": {
                color: COLORS.PRIMARY,
                textDecoration: "underline",
                fontWeight: 600,
                "&:hover": { color: COLORS.PRIMARY_DARK },
              },
              "& strong, & b": {
                fontWeight: 700,
                color: "#0f172a",
              },
              "& code": {
                bgcolor: "#f1f5f9",
                color: "#0f172a",
                px: 0.8,
                py: 0.2,
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "0.9em",
              },
            }}
            dangerouslySetInnerHTML={{ __html: contentText }}
          />
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
                      color: COLORS.PRIMARY,
                      fontSize: { xs: "1.35rem", sm: "1.6rem" },
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {secTitle}
                  </Typography>

                  <Box
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "1.05rem",
                      color: "#475569",
                      lineHeight: 1.85,
                      "& p": { mb: 1.5 },
                      "& ul, & ol": { pl: 3, mb: 1.5 },
                      "& li": { mb: 0.5 },
                      "& blockquote": {
                        borderLeft: "4px solid #FF6200",
                        pl: 2.5,
                        py: 1,
                        my: 2,
                        fontStyle: "italic",
                        bgcolor: "#FFF8F2",
                        borderRadius: "0 8px 8px 0",
                      },
                      "& a": { color: COLORS.PRIMARY, textDecoration: "underline" },
                    }}
                    dangerouslySetInnerHTML={{ __html: secDesc }}
                  />
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
