"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface FeaturedBlogSectionProps {
  blog: any;
}

export default function FeaturedBlogSection({ blog }: FeaturedBlogSectionProps) {
  if (!blog) return null;

  const title = blog.title || blog.heading || blog.name || "Featured Sacred Article";
  const rawText = blog.excerpt || blog.content || blog.body || blog.description || "";
  const text = rawText.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  const snippet = text.length > 280 ? text.slice(0, 280) + "..." : text;

  const categoryTag = (
    typeof blog.category === "string"
      ? blog.category
      : typeof blog.category === "object" && blog.category
      ? blog.category.name || blog.category.title
      : blog.categoryName || "RITUALS & TRADITIONS"
  ).toUpperCase();

  const authorName =
    blog.authorName ||
    (typeof blog.author === "string"
      ? blog.author
      : typeof blog.author === "object" && blog.author
      ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim() ||
        blog.author.username ||
        blog.author.name
      : "Pandit Ji");

  const formattedDate = blog.publishedAt || blog.createdAt
    ? new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "October 2026";

  const readTime = blog.readTime || 5;
  const cover =
    blog.coverImage ||
    blog.imageUrl ||
    blog.downloadUrl ||
    "/images/home/hero/heroSectionHome.webp";

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 4, md: 6 },
        bgcolor: "#FFFDF9",
      }}
    >
      <Container maxWidth="lg">
        {/* Top Badge: ★ FEATURED ARTICLE */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor: COLORS.PRIMARY,
              color: "white",
              px: 2,
              py: 0.75,
              borderRadius: "4px",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: FONTS.THEME_DEFAULT,
              boxShadow: `0 2px 8px ${COLORS.PRIMARY_SHADOW}`,
            }}
          >
            <StarIcon sx={{ fontSize: 14, color: "white" }} />
            FEATURED ARTICLE
          </Box>
        </Box>

        {/* Main Featured Content Grid (Matches attached user screenshot) */}
        <Grid container spacing={{ xs: 3, md: 6 }} sx={{ alignItems: "center" }}>
          {/* Left Column: Image Box */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component={NextLink}
              href={`/blogs/${blog.id}`}
              sx={{
                display: "block",
                textDecoration: "none",
                borderRadius: "16px",
                overflow: "hidden",
                bgcolor: "white",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                border: "1px solid #EFEAE0",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 14px 32px rgba(0,0,0,0.1)",
                  "& .featured-img": { transform: "scale(1.03)" },
                },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 260, sm: 360, md: 400 },
                  overflow: "hidden",
                  bgcolor: "#f8fafc",
                }}
              >
                <Box
                  component="img"
                  className="featured-img"
                  src={cover}
                  alt={title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
              </Box>
              {/* Subtle orange accent line at bottom of image box */}
              <Box sx={{ height: 5, bgcolor: COLORS.PRIMARY, width: "35%" }} />
            </Box>
          </Grid>

          {/* Right Column: Article Meta & Details */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Category Tag */}
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  letterSpacing: "0.12em",
                  color: COLORS.PRIMARY,
                  textTransform: "uppercase",
                }}
              >
                {categoryTag}
              </Typography>

              {/* Title */}
              <Typography
                component={NextLink}
                href={`/blogs/${blog.id}`}
                variant="h3"
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontWeight: 700,
                  fontSize: { xs: "1.65rem", sm: "2.1rem", md: "2.4rem" },
                  lineHeight: 1.25,
                  color: "#0F172A",
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                  transition: "color 0.2s ease",
                  "&:hover": { color: COLORS.PRIMARY },
                }}
              >
                {title}
              </Typography>

              {/* Meta Row: Author, Date, Read Time */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 2, sm: 2.5 },
                  flexWrap: "wrap",
                  color: COLORS.SLATE_MUTED,
                  fontSize: "0.85rem",
                  fontFamily: FONTS.PRIMARY,
                  my: 0.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <PersonOutlinedIcon sx={{ fontSize: 17, color: "#94A3B8" }} />
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#334155",
                    }}
                  >
                    {authorName}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: 15, color: "#94A3B8" }} />
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    {formattedDate}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
                  <Typography
                    sx={{
                      fontFamily: FONTS.PRIMARY,
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    {readTime} min read
                  </Typography>
                </Box>
              </Box>

              {/* Excerpt Paragraph */}
              <Typography
                sx={{
                  fontFamily: FONTS.PRIMARY,
                  fontSize: "1rem",
                  color: "#475569",
                  lineHeight: 1.75,
                }}
              >
                {snippet}
              </Typography>

              {/* Read Full Article Button Link */}
              <Box sx={{ pt: 1 }}>
                <Button
                  component={NextLink}
                  href={`/blogs/${blog.id}`}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: COLORS.PRIMARY,
                    fontFamily: FONTS.PRIMARY,
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    p: 0,
                    minWidth: "auto",
                    bgcolor: "transparent",
                    "&:hover": {
                      bgcolor: "transparent",
                      color: COLORS.PRIMARY_HOVER,
                      "& .MuiSvgIcon-root": { transform: "translateX(4px)" },
                    },
                    "& .MuiSvgIcon-root": {
                      transition: "transform 0.2s ease",
                    },
                  }}
                >
                  READ THE FULL ARTICLE
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
