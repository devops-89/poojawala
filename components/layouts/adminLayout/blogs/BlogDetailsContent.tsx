"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import EditIcon from "@mui/icons-material/Edit";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Breadcrumbs,
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

import RelatedBlogsSection from "@/components/layouts/blogsLayout/RelatedBlogsSection";
import BlogCtaBanner from "@/components/layouts/blogsLayout/BlogCtaBanner";

interface BlogDetailsContentProps {
  blogId: string | number;
}

export default function BlogDetailsContent({ blogId }: BlogDetailsContentProps) {
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
        console.error("Failed to fetch blog details", err);
        showSnackbar("Failed to load blog details", "error");
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
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: FONTS.OUTFIT,
            color: "#64748b",
            mb: 2,
          }}
        >
          Blog details not found.
        </Typography>
        <Button
          component={NextLink}
          href="/admin/blogs"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            borderColor: COLORS.PRIMARY,
            color: COLORS.PRIMARY,
            borderRadius: "12px",
            textTransform: "none",
            fontFamily: FONTS.OUTFIT,
          }}
        >
          Back to Blogs List
        </Button>
      </Box>
    );
  }

  const titleText = blog.title || blog.heading || blog.name || "Untitled Blog Post";
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

  const statusVal = blog.status || (blog.isActive ? "PUBLISHED" : "DRAFT");
  const isPublished = statusVal === "PUBLISHED";
  const sectionsList = Array.isArray(blog.sections) ? blog.sections : [];

  const formattedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "October 5, 2026";

  const readTime = blog.readTime || 4;

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
    <Box
      sx={{
        maxWidth: 1080,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3.5,
        p: { xs: 2, md: 4 },
      }}
    >
      {/* Top Navigation & Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 0 }}
        >
          <NextLink
            href="/admin/blogs"
            style={{
              textDecoration: "none",
              color: "#64748b",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            Blogs
          </NextLink>
          <Typography
            sx={{
              color: COLORS.PRIMARY,
              fontFamily: FONTS.OUTFIT,
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            Blog Details
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", gap: 1.5 }}>

          <Button
            component={NextLink}
            href={`/admin/blogs/edit/${blog.id || blogId}`}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "white",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              fontFamily: FONTS.OUTFIT,
              px: 3,
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.25)",
              "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
            }}
          >
            Edit Post
          </Button>
        </Box>
      </Box>

      {/* HERO SECTION: 2-Column Side-by-Side Layout (Top Aligned) */}
      <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "flex-start" }}>
        {/* Left Column: Text & Author Info */}
        <Grid size={{ xs: 12, md: 6.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Category Pill Tag & Status */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              <Chip
                label={isPublished ? "PUBLISHED" : "DRAFT"}
                sx={{
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "0.75rem",
                  bgcolor: isPublished ? "#e0f2fe" : "#f1f5f9",
                  color: isPublished ? "#0284c7" : "#64748b",
                  borderRadius: "8px",
                }}
              />

              {blog.isFeatured && (
                <Chip
                  icon={<StarIcon sx={{ fontSize: 16, color: "#d97706 !important" }} />}
                  label="Featured Article"
                  sx={{
                    fontWeight: 700,
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "0.75rem",
                    bgcolor: "#fef3c7",
                    color: "#d97706",
                    borderRadius: "8px",
                  }}
                />
              )}

              <Chip
                icon={<CategoryOutlinedIcon sx={{ fontSize: 16, color: "#FF6200 !important" }} />}
                label={categoryName}
                sx={{
                  fontWeight: 800,
                  fontFamily: FONTS.OUTFIT,
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
                fontFamily: '"Georgia", serif',
                fontWeight: 700,
                color: "#0F172A",
                fontSize: { xs: "1.85rem", sm: "2.3rem", md: "2.7rem" },
                lineHeight: 1.25,
                letterSpacing: "-0.015em",
              }}
            >
              {renderHighlightedTitle(titleText)}
            </Typography>

            <Divider sx={{ my: 1, borderColor: "#E2E8F0" }} />

            {/* Author Meta Box at Bottom Left */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "#FFF0E6",
                  color: COLORS.PRIMARY,
                  fontWeight: 700,
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "1.05rem",
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
                    fontFamily: FONTS.OUTFIT,
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
              height: { xs: 280, sm: 360, md: 400 },
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

      <Divider sx={{ my: 4 }} />

      {/* FULL ARTICLE BODY */}
      {contentText && (
        <Box
          sx={{
            mb: 5,
            fontFamily: FONTS.OUTFIT,
            fontSize: "1.08rem",
            color: "#334155",
            lineHeight: 1.85,
            letterSpacing: "0.01em",
            "& h1": {
              fontSize: "2rem",
              fontWeight: 800,
              color: "#0f172a",
              mt: 3,
              mb: 1.5,
              fontFamily: '"Georgia", serif',
            },
            "& h2": {
              fontSize: "1.65rem",
              fontWeight: 700,
              color: COLORS.PRIMARY,
              mt: 3,
              mb: 1.5,
              fontFamily: '"Georgia", serif',
            },
            "& h3": {
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#1e293b",
              mt: 2.5,
              mb: 1,
              fontFamily: '"Georgia", serif',
            },
            "& h4": {
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#334155",
              mt: 2,
              mb: 1,
            },
            "& p": {
              mb: 2,
            },
            "& ul, & ol": {
              pl: 3,
              mb: 2,
            },
            "& li": {
              mb: 0.75,
              lineHeight: 1.75,
            },
            "& blockquote": {
              borderLeft: "4px solid #FF6200",
              pl: 2.5,
              py: 1.5,
              my: 3,
              fontStyle: "italic",
              color: "#475569",
              bgcolor: "#FFF8F2",
              borderRadius: "0 12px 12px 0",
              fontSize: "1.1rem",
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

      {/* SECTIONS LIST */}
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
                    fontFamily: FONTS.OUTFIT,
                    fontSize: "1.025rem",
                    color: "#475569",
                    lineHeight: 1.8,
                    "& p": { mb: 1.5 },
                    "& ul, & ol": { pl: 3, mb: 1.5 },
                    "& li": { mb: 0.5 },
                    "& blockquote": {
                      borderLeft: "4px solid #FF6200",
                      pl: 2,
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
      <RelatedBlogsSection currentBlogId={blogId} isAdmin={true} />

      {/* Full-width CTA Banner */}
      <BlogCtaBanner />
    </Box>
  );
}
