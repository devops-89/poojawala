"use client";

import {
  Box,
  Card,
  CardActionArea,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { getAllBlogsAPI } from "@/api/blogControllers";

const getCategoryTag = (blog: any) => {
  const cat = blog.category || blog.categoryName;
  if (!cat) return "RITUALS";
  if (typeof cat === "string") return cat.toUpperCase();
  if (typeof cat === "object") return (cat.name || cat.title || "RITUALS").toUpperCase();
  return "RITUALS";
};

const getAuthorName = (blog: any) => {
  if (blog.authorName) return blog.authorName;
  const authorData = blog.author || blog.user || blog.createdBy;
  if (!authorData) return "Pandit Ji";
  if (typeof authorData === "string") return authorData;
  if (typeof authorData === "object") {
    const name = `${authorData.firstName || ""} ${authorData.lastName || ""}`.trim();
    if (name) return name;
    if (authorData.username) return authorData.username;
    if (authorData.name) return authorData.name;
  }
  return "Pandit Ji";
};

const getBlogTitle = (blog: any) => {
  return blog.title || blog.heading || blog.name || "Untitled Article";
};

const getBlogContentSnippet = (blog: any) => {
  const rawText = blog.excerpt || blog.content || blog.body || blog.description || "";
  if (!rawText) return "Explore sacred insights, Vedic procedures, and authentic Samagri guidelines for your puja.";
  const text = rawText.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 140 ? text.slice(0, 140) + "..." : text;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "October 2026";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "October 2026";
  }
};

interface BlogCardGridProps {
  blogs?: any[];
  loading?: boolean;
}

export default function BlogCardGrid({ blogs: propsBlogs, loading: propsLoading }: BlogCardGridProps) {
  const [fetchedBlogs, setFetchedBlogs] = useState<any[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);

  useEffect(() => {
    if (propsBlogs !== undefined) return;
    const fetchBlogs = async () => {
      try {
        setInternalLoading(true);
        const res = await getAllBlogsAPI(1, 50, "", "PUBLISHED");
        let rawList: any[] = [];
        if (Array.isArray(res)) rawList = res;
        else if (Array.isArray(res?.data)) rawList = res.data;
        else if (Array.isArray(res?.data?.data)) rawList = res.data.data;
        else if (Array.isArray(res?.blogs)) rawList = res.blogs;

        const activeBlogs = rawList.filter((b: any) => b.isActive !== false);
        setFetchedBlogs(activeBlogs);
      } catch (err) {
        console.error("Failed to fetch public blogs", err);
        setFetchedBlogs([]);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchBlogs();
  }, [propsBlogs]);

  const displayBlogs = propsBlogs !== undefined ? propsBlogs : fetchedBlogs;
  const isLoading = propsLoading !== undefined ? propsLoading : internalLoading;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Loading State */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#FF6200" }} />
        </Box>
      ) : displayBlogs.length === 0 ? (
        /* Empty State */
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 2,
            bgcolor: "#FFFDF9",
            borderRadius: "20px",
            border: "1px dashed #E5DEC9",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              color: "#2D2926",
              mb: 1,
            }}
          >
            No Articles Found
          </Typography>
        </Box>
      ) : (
        /* REPEATING GRID PATTERN: 2 TOP (Wide Left + Vertical Right) -> 3 BOTTOM (3 Column Grid) */
        <Grid container spacing={3.5}>
          {displayBlogs.map((blog, idx) => {
            const positionInCycle = idx % 5;
            const isWideSplitCard = positionInCycle === 0;
            const isVerticalTopCard = positionInCycle === 1;

            const categoryTag = getCategoryTag(blog);
            const author = getAuthorName(blog);
            const title = getBlogTitle(blog);
            const snippet = getBlogContentSnippet(blog);
            const dateText = formatDate(blog.publishedAt || blog.createdAt);
            const readTime = blog.readTime || 5;
            const cover =
              blog.coverImage ||
              blog.imageUrl ||
              blog.downloadUrl ||
              "/images/home/hero/heroSectionHome.webp";

            // 1. WIDE SPLIT CARD (Left half image, right half content) - Grid size 8
            if (isWideSplitCard) {
              return (
                <Grid key={blog.id || idx} size={{ xs: 12, md: 8 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: "16px",
                      bgcolor: "white",
                      border: "1px solid #EFEAE0",
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      overflow: "hidden",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
                        borderColor: "#FFE0CC",
                        "& .blog-image": {
                          transform: "scale(1.04)",
                        },
                      },
                    }}
                  >
                    <CardActionArea
                      component={NextLink}
                      href={`/blogs/${blog.id}`}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "stretch",
                        justifyContent: "space-between",
                        p: 0,
                      }}
                    >
                      {/* Left Image (50% on desktop) */}
                      <Box
                        sx={{
                          width: { xs: "100%", md: "48%" },
                          minHeight: { xs: 240, md: "100%" },
                          overflow: "hidden",
                          position: "relative",
                          bgcolor: "#F8FAF2",
                        }}
                      >
                        <Box
                          component="img"
                          className="blog-image"
                          src={cover}
                          alt={title}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: { md: "absolute" },
                            top: 0,
                            left: 0,
                            transition: "transform 0.4s ease",
                          }}
                        />
                      </Box>

                      {/* Right Content (52% on desktop) */}
                      <Box
                        sx={{
                          width: { xs: "100%", md: "52%" },
                          p: { xs: 3, md: 3.5 },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          {/* Category Tag */}
                          <Typography
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              letterSpacing: "0.1em",
                              color: "#FF6200",
                              mb: 1.5,
                              textTransform: "uppercase",
                            }}
                          >
                            {categoryTag}
                          </Typography>

                          {/* Title */}
                          <Typography
                            variant="h5"
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 700,
                              fontSize: { xs: "1.35rem", md: "1.6rem" },
                              lineHeight: 1.35,
                              color: "#1E293B",
                              mb: 1.75,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {title}
                          </Typography>

                          {/* Content Snippet */}
                          <Typography
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontSize: "0.92rem",
                              color: "#64748B",
                              lineHeight: 1.7,
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {snippet}
                          </Typography>
                        </Box>

                        {/* Footer Metadata */}
                        <Box
                          sx={{
                            borderTop: "1px solid #F1F5F9",
                            pt: 2,
                            mt: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                color: "#1E293B",
                              }}
                            >
                              {author}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: '"DM Sans", sans-serif',
                                fontSize: "0.75rem",
                                color: "#94A3B8",
                              }}
                            >
                              {dateText}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              border: "1px solid #E2E8F0",
                              px: 1.25,
                              py: 0.4,
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              fontFamily: '"DM Sans", sans-serif',
                              color: "#64748B",
                              bgcolor: "#F8FAFC",
                            }}
                          >
                            {readTime} min
                          </Box>
                        </Box>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            }

            // 2. VERTICAL CARDS (Grid size 4 for top right card and 3 bottom cards)
            return (
              <Grid key={blog.id || idx} size={{ xs: 12, sm: isVerticalTopCard ? 12 : 6, md: 4 }}>
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
                      "& .blog-image": {
                        transform: "scale(1.04)",
                      },
                    },
                  }}
                >
                  <CardActionArea
                    component={NextLink}
                    href={`/blogs/${blog.id}`}
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
                          height: 200,
                          overflow: "hidden",
                          position: "relative",
                          bgcolor: "#F8FAF2",
                        }}
                      >
                        <Box
                          component="img"
                          className="blog-image"
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
                      <Box sx={{ p: { xs: 2.5, sm: 3 } }}>
                        {/* Category Tag */}
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 800,
                            fontSize: "0.75rem",
                            letterSpacing: "0.1em",
                            color: "#FF6200",
                            mb: 1.25,
                            textTransform: "uppercase",
                          }}
                        >
                          {categoryTag}
                        </Typography>

                        {/* Title */}
                        <Typography
                          variant="h5"
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            lineHeight: 1.35,
                            color: "#1E293B",
                            mb: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {title}
                        </Typography>

                        {/* Excerpt Content Snippet */}
                        <Typography
                          sx={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: "0.9rem",
                            color: "#64748B",
                            lineHeight: 1.65,
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
                    <Box sx={{ px: { xs: 2.5, sm: 3 }, pb: 3, pt: 0 }}>
                      <Box
                        sx={{
                          borderTop: "1px solid #F1F5F9",
                          pt: 2,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontWeight: 700,
                              fontSize: "0.85rem",
                              color: "#1E293B",
                            }}
                          >
                            {author}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: '"DM Sans", sans-serif',
                              fontSize: "0.75rem",
                              color: "#94A3B8",
                            }}
                          >
                            {dateText}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            border: "1px solid #E2E8F0",
                            px: 1.25,
                            py: 0.4,
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            fontFamily: '"DM Sans", sans-serif',
                            color: "#64748B",
                            bgcolor: "#F8FAFC",
                          }}
                        >
                          {readTime} min
                        </Box>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}
