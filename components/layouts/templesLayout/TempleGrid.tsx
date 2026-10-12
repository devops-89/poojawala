"use client";

import { getTemplesAPI } from "@/api/templeControllers";
import EmptyStateCard from "@/components/widgets/EmptyStateCard";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import TempleCard from "./TempleCard";
import { TempleItem } from "@/utils/types";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface TempleGridProps {
  searchQuery: string;
  onSearchChange?: (val: string) => void;
  onClearSearch?: () => void;
}

export default function TempleGrid({
  searchQuery,
  onSearchChange,
  onClearSearch,
}: TempleGridProps) {
  const [temples, setTemples] = useState<TempleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 6;

  const [searchInput, setSearchInput] = useState(searchQuery || "");

  const gridTopRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Sync internal search input with external searchQuery prop
  useEffect(() => {
    setSearchInput(searchQuery || "");
  }, [searchQuery]);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    let isCancelled = false;

    const fetchTemples = async () => {
      try {
        setLoading(true);
        const res = await getTemplesAPI(
          page,
          itemsPerPage,
          searchQuery ? searchQuery.trim() : "",
          true
        );

        if (isCancelled) return;

        let fetchedList: any[] = [];
        if (res) {
          if (Array.isArray(res)) {
            fetchedList = res;
          } else if (res.data) {
            if (Array.isArray(res.data.data)) fetchedList = res.data.data;
            else if (Array.isArray(res.data)) fetchedList = res.data;
            else if (Array.isArray(res.data.temples)) fetchedList = res.data.temples;
          } else if (res.temples && Array.isArray(res.temples)) {
            fetchedList = res.temples;
          }
        }

        const activeTemples = fetchedList.filter((t: any) => t.isActive !== false);
        setTemples(activeTemples);

        const pagination =
          res?.data?.pagination || res?.pagination || res?.data || {};
        const total =
          pagination?.total ||
          pagination?.totalCount ||
          res?.total ||
          activeTemples.length;
        const calcPages =
          pagination?.totalPages ||
          pagination?.pageCount ||
          Math.ceil(total / itemsPerPage) ||
          1;

        setTotalCount(total);
        setTotalPages(calcPages);
      } catch (err) {
        console.error("Failed to fetch temples:", err);
        if (!isCancelled) {
          setTemples([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(
      () => {
        fetchTemples();
      },
      searchQuery ? 350 : 0
    );

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [page, searchQuery]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    if (gridTopRef.current) {
      const y =
        gridTopRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearchChange?.(searchInput.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    onSearchChange?.(val);
  };

  const handleClear = () => {
    setSearchInput("");
    onClearSearch?.();
  };

  return (
    <Box ref={gridTopRef}>
      {/* Header Row: "Top Temples for You" on left, Search Bar on right (k barabar m) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: FONTS.PRIMARY,
            fontWeight: 700,
            color: "#1A1A1A",
            fontSize: { xs: "20px", sm: "24px" },
          }}
        >
          {searchQuery ? "Search Results" : "Top Temples for You"}
        </Typography>

        {/* Search Bar beside Top Temples for you */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#FFFFFF",
            borderRadius: "14px",
            p: "4px 6px 4px 14px",
            border: "1.5px solid #E2E8F0",
            width: { xs: "100%", sm: "360px", md: "400px" },
            transition: "all 0.25s ease",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            "&:focus-within": {
              borderColor: COLORS.PRIMARY,
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.15)",
            },
          }}
        >
          <SearchIcon sx={{ color: "#94a3b8", fontSize: 20, mr: 1 }} />
          <TextField
            variant="standard"
            placeholder="Search temples by name or city..."
            value={searchInput}
            onChange={handleInputChange}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontFamily: FONTS.OUTFIT,
                  fontSize: "14px",
                  color: "#1e293b",
                  "&::placeholder": { color: "#94a3b8" },
                },
                endAdornment: searchInput ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      aria-label="clear search"
                      sx={{ p: 0.5, mr: 0.5 }}
                    >
                      <ClearIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{ flexGrow: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: COLORS.PRIMARY,
              color: "#FFFFFF",
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "13px",
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              py: 0.7,
              boxShadow: "none",
              "&:hover": {
                bgcolor: COLORS.PRIMARY_DARK || "#E05500",
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Loading Skeletons */}
      {loading ? (
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Box
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid #EFE6D5",
                  bgcolor: "#FFFDF9",
                  p: 2,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={220}
                  sx={{ borderRadius: "14px", mb: 2 }}
                />
                <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="rounded" width="100%" height={40} />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : temples.length === 0 ? (
        <EmptyStateCard
          icon={<TempleHinduIcon sx={{ fontSize: 36, color: COLORS.PRIMARY }} />}
          title={searchQuery ? "No Temples Found" : "No Temples Available"}
          description={
            searchQuery
              ? `No temples matched your search "${searchQuery}". Please try searching with a different name or city.`
              : "No temples are currently listed. Please check back later!"
          }
          actionText={searchQuery ? "Clear Search" : undefined}
          onAction={searchQuery ? handleClear : undefined}
          actionHref={searchQuery ? "/temples" : undefined}
        />
      ) : (
        <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
          {temples.map((temple: TempleItem) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={temple.id}
              sx={{ display: "flex" }}
            >
              <TempleCard temple={temple} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {!loading && temples.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: FONTS.PRIMARY,
                fontWeight: 600,
                borderRadius: "8px",
                "&.Mui-selected": {
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
