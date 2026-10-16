"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Pagination } from "@mui/material";
import { getAstrologersAPI } from "@/api/userControllers";
import { COLORS } from "@/utils/enums";
import CustomerAstrologersHeader from "./CustomerAstrologersHeader";
import CustomerAstrologersFilters from "./CustomerAstrologersFilters";
import CustomerAstrologerCard from "./CustomerAstrologerCard";
import CustomerAstrologersEmptyState from "./CustomerAstrologersEmptyState";
export { default as CustomerAstrologerDetailsContent } from "./CustomerAstrologerDetailsContent";

export default function CustomerAstrologersContent() {
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchAstrologers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAstrologersAPI(
        page,
        8,
        searchTerm || undefined,
        "APPROVED"
      );

      if (res.success) {
        const usersArray = res.data?.data || res.data?.users || res.data || [];
        const pagination = res.data?.pagination || {};
        setAstrologers(Array.isArray(usersArray) ? usersArray : []);
        setTotalPages(
          pagination.totalPages ||
            Math.ceil((pagination.total || usersArray.length || 1) / 8) ||
            1
        );
      }
    } catch (err) {
      console.error("Error fetching astrologers for customer portal:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAstrologers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchAstrologers]);

  return (
    <Box>
      <CustomerAstrologersHeader />

      <CustomerAstrologersFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: COLORS.PRIMARY }} />
        </Box>
      ) : astrologers.length === 0 ? (
        <CustomerAstrologersEmptyState
          onReset={() => {
            setSearchTerm("");
            setPage(1);
          }}
        />
      ) : (
        <Grid container spacing={3}>
          {astrologers.map((astrologer, idx) => (
            <CustomerAstrologerCard
              key={astrologer.id || idx}
              astrologer={astrologer}
            />
          ))}
        </Grid>
      )}

      {!loading && astrologers.length > 0 && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => {
              setPage(value);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: COLORS.PRIMARY,
                color: "white",
                "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
