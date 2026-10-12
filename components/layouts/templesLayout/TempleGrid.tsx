"use client";

import { getTemplesAPI } from "@/api/templeControllers";
import EmptyStateCard from "@/components/widgets/EmptyStateCard";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import TempleHinduIcon from "@mui/icons-material/TempleHindu";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TempleCard from "./TempleCard";
import { TempleItem } from "@/utils/types";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface TempleGridProps {
  searchQuery: string;
  onClearSearch?: () => void;
}

export default function TempleGrid({
  searchQuery,
  onClearSearch,
}: TempleGridProps) {
  const [temples, setTemples] = useState<TempleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 6;

  const gridTopRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

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

  return (
    <Box ref={gridTopRef}>
      {/* Header Row */}
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
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
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
          <Typography
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontSize: "13.5px",
              color: "#666",
              fontWeight: 500,
            }}
          >
            {loading ? "Searching..." : `${totalCount || temples.length} temples available`}
          </Typography>
        </Box>

        {searchQuery && (
          <Button
            size="small"
            onClick={onClearSearch}
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: COLORS.PRIMARY,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Clear Search Filter
          </Button>
        )}
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
      {!loading && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages}
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
