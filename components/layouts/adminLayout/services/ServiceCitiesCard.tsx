"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Chip, Paper, Typography } from "@mui/material";
import React from "react";

export interface ServiceCitiesCardProps {
  citiesList: any[];
}

export default function ServiceCitiesCard({
  citiesList,
}: ServiceCitiesCardProps) {
  if (citiesList.length === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        bgcolor: "white",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontWeight: 800,
          color: "#1e293b",
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          component="span"
          sx={{
            width: 8,
            height: 24,
            bgcolor: COLORS.PRIMARY,
            borderRadius: 4,
            display: "inline-block",
          }}
        />
        {citiesList.length === 1 ? "City" : "Cities"}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {citiesList.map((city: any, idx: number) => {
          const label =
            typeof city === "string"
              ? city
              : `${city.name}${city.state ? `, ${city.state}` : ""}`;
          return (
            <Chip
              key={`city-chip-${idx}`}
              icon={
                <LocationOnIcon
                  style={{ color: COLORS.PRIMARY, fontSize: "1.1rem" }}
                />
              }
              label={label}
              sx={{
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontWeight: 600,
                color: "#334155",
                py: 2,
                px: 1,
                fontFamily: FONTS.OUTFIT,
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
}
