"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { stripHtml } from "@/utils/helpers";

interface WebsiteTempleAboutSectionProps {
  temple: any;
}

export default function WebsiteTempleAboutSection({
  temple,
}: WebsiteTempleAboutSectionProps) {
  const cleanDescription = stripHtml(temple?.description);

  const sentences = cleanDescription ? cleanDescription.split(". ") : [];
  let para1 = cleanDescription;
  let para2 = "";

  if (sentences.length > 2) {
    const midIndex = Math.ceil(sentences.length / 2);
    para1 =
      sentences.slice(0, midIndex).join(". ") +
      (sentences.slice(0, midIndex).join(". ").endsWith(".") ? "" : ".");
    para2 = sentences.slice(midIndex).join(". ");
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, borderTop: "1px solid #F3E8DB" }}>
      {/* Section Heading */}
      <Typography
        variant="h2"
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontWeight: 800,
          fontSize: { xs: "24px", md: "30px" },
          color: "#2C1810",
          mb: 1,
        }}
      >
        About {temple?.name}
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          fontFamily: FONTS.OUTFIT,
          fontSize: "14px",
          color: "#8C7A6B",
          mb: 3,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Divine Legend & Spiritual Heritage
      </Typography>

      {/* Description Paragraphs */}
      {cleanDescription ? (
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontSize: { xs: "14.5px", md: "15.5px" },
              color: "#475569",
              lineHeight: 1.8,
              mb: para2 ? 2 : 0,
            }}
          >
            {para1}
          </Typography>
          {para2 && (
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontSize: { xs: "14.5px", md: "15.5px" },
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              {para2}
            </Typography>
          )}
        </Box>
      ) : (
        <Typography
          sx={{
            fontFamily: FONTS.OUTFIT,
            fontSize: "15px",
            color: "#64748b",
            lineHeight: 1.8,
          }}
        >
          {temple?.name} is a renowned spiritual pilgrimage destination situated in{" "}
          {[temple?.city, temple?.state].filter(Boolean).join(", ") || "India"}.
          Devotees visit this sacred shrine to seek divine blessings, offer special
          poojas, and experience peace and spiritual elevation.
        </Typography>
      )}
    </Box>
  );
}
