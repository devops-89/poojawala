"use client";

import {
  Box,
  Card,
  CardActionArea,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { getAllBlogsAPI } from "@/api/blogControllers";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

const getCategoryTag = (blog: any) => {
  const cat = blog.category || blog.categoryName;
  if (!cat) return "POOJA GUIDE";
  if (typeof cat === "string") return cat.toUpperCase();
  if (typeof cat === "object") return (cat.name || cat.title || "POOJA GUIDE").toUpperCase();
  return "POOJA GUIDE";
};

const getBlogTitle = (blog: any) => {
  return blog.title || blog.heading || blog.name || "Untitled Article";
};

const getBlogContentSnippet = (blog: any) => {
  const rawText = blog.excerpt || blog.content || blog.body || blog.description || "";
  if (!rawText) return "Explore sacred insights, Vedic procedures, and authentic Samagri guidelines for your puja.";
  const text = rawText.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 130 ? text.slice(0, 130) + "..." : text;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "Sep 18, 2026";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Sep 18, 2026";
  }
};

interface RelatedBlogsSectionProps {
  currentBlogId: string | number;
  isAdmin?: boolean;
}

export default function RelatedBlogsSection({ currentBlogId, isAdmin = false }: RelatedBlogsSectionProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await getAllBlogsAPI(1, 10, "", "PUBLISHED");
        let rawList: any[] = [];
        if (Array.isArray(res)) rawList = res;
        else if (Array.isArray(res?.data)) rawList = res.data;
        else if (Array.isArray(res?.data?.data)) rawList = res.data.data;
        else if (Array.isArray(res?.blogs)) rawList = res.blogs;

        // Exclude the current blog being read
        const otherBlogs = rawList.filter(
          (b: any) =>
            b.isActive !== false &&
            String(b.id) !== String(currentBlogId)
        );

        setRelatedBlogs(otherBlogs.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch related blogs", err);
        setRelatedBlogs([]);
      }
    };

    if (currentBlogId) {
      fetchRelated();
    }
  }, [currentBlogId]);

  if (relatedBlogs.length === 0) return null;

  const listUrl = isAdmin ? "/admin/blogs" : "/blogs";

  return (
    <Box sx={{ width: "100%", mt: 6, pt: 4, pb: 6 }}>
      <Container maxWidth="lg" disableGutters>
        {/* Header Bar: More Sacred Wisdom | Browse all articles */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              color: COLORS.SLATE_DARK,
              fontSize: { xs: "1.5rem", sm: "1.85rem" },
            }}
          >
            More Sacred Wisdom
          </Typography>

          <Link
            component={NextLink}
            href={listUrl}
            underline="hover"
            sx={{
              color: COLORS.PRIMARY,
              fontFamily: FONTS.PRIMARY,
              fontWeight: 700,
              fontSize: "0.875rem",
              "&:hover": { color: COLORS.PRIMARY_HOVER },
            }}
          >
            Browse all articles
          </Link>
        </Box>

        {/* 3 Related Cards Grid (Matches attached user screenshot) */}
        <Grid container spacing={3.5}>
          {relatedBlogs.map((blog, idx) => {
            const categoryTag = getCategoryTag(blog);
            const title = getBlogTitle(blog);
            const snippet = getBlogContentSnippet(blog);
            const dateText = formatDate(blog.publishedAt || blog.createdAt);
            const readTime = blog.readTime || 6;
            const cover =
              blog.coverImage ||
              blog.imageUrl ||
              blog.downloadUrl ||
              "/images/home/hero/heroSectionHome.webp";
            const detailUrl = isAdmin ? `/admin/blogs/${blog.id}` : `/blogs/${blog.id}`;

            return (
              <Grid key={blog.id || idx} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    bgcolor: "white",
                    border: "1px solid #EFEAE0",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                      borderColor: "#FFE0CC",
                      "& .related-blog-image": {
                        transform: "scale(1.04)",
                      },
                    },
                  }}
                >
                  <CardActionArea
                    component={NextLink}
                    href={detailUrl}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      justifyContent: "space-between",
                      p: 0,
                    }}
                  >
                    <Box>
                      {/* Image Header */}
                      <Box
                        sx={{
                          width: "100%",
                          height: 190,
                          overflow: "hidden",
                          bgcolor: "#F8FAF2",
                        }}
                      >
                        <Box
                          component="img"
                          className="related-blog-image"
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

                      {/* Content Area */}
                      <Box sx={{ p: 3 }}>
                        {/* Category Tag */}
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 800,
                            fontSize: "0.75rem",
                            letterSpacing: "0.1em",
                            color: COLORS.PRIMARY,
                            mb: 1.25,
                            textTransform: "uppercase",
                          }}
                        >
                          {categoryTag}
                        </Typography>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            lineHeight: 1.35,
                            color: COLORS.SLATE_DARK,
                            mb: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {title}
                        </Typography>

                        {/* Excerpt Snippet */}
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "0.875rem",
                            color: COLORS.SLATE_MUTED,
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {snippet}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Bottom Metadata Footer */}
                    <Box sx={{ px: 3, pb: 3, pt: 0 }}>
                      <Box
                        sx={{
                          borderTop: "1px solid #F1F5F9",
                          pt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontSize: "0.78rem",
                            color: "#94A3B8",
                            fontWeight: 500,
                          }}
                        >
                          {dateText} &bull; {readTime} min
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: FONTS.PRIMARY,
                            fontWeight: 800,
                            fontSize: "0.78rem",
                            color: COLORS.PRIMARY,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                          }}
                        >
                          READ MORE
                        </Typography>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
