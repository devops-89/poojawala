"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

export interface ServiceDescriptionCardProps {
  description?: string;
  benefitsList: any[];
}

export default function ServiceDescriptionCard({
  description,
  benefitsList,
}: ServiceDescriptionCardProps) {
  if (!description && benefitsList.length === 0) return null;

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
      {/* Description Section */}
      {description && (
        <Box sx={{ mb: benefitsList.length > 0 ? 4 : 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
              mb: 2,
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
            Description
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#475569",
              fontSize: "1.05rem",
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>
        </Box>
      )}

      {description && benefitsList.length > 0 && <Divider sx={{ my: 3.5 }} />}

      {/* Benefits Points Section */}
      {benefitsList.length > 0 && (
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
              mb: 2.5,
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
            Benefits
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {benefitsList.map((benefit: any, index: number) => (
              <Box
                key={`benefit-point-${index}`}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <Box
                  sx={{
                    color: COLORS.PRIMARY,
                    mt: 0.5,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleOutlinedIcon fontSize="small" />
                </Box>
                <Typography
                  sx={{
                    fontFamily: FONTS.OUTFIT,
                    color: "#334155",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {benefit.title && (
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: "#1e293b", mr: 1 }}
                    >
                      {benefit.title}:
                    </Box>
                  )}
                  {benefit.description || ""}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
}
