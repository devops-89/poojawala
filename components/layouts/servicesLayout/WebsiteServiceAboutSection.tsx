"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Typography } from "@mui/material";
import React from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

interface WebsiteServiceAboutSectionProps {
  service: any;
}

export default function WebsiteServiceAboutSection({
  service,
}: WebsiteServiceAboutSectionProps) {
  const parseJsonList = (val: any) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const rawBenefits = parseJsonList(service?.benefits);

  const benefitsList = rawBenefits;

  const fullDesc =
    service?.description ||
    service?.desc ||
    (service?.name
      ? `Experience divine blessings with authentic ${service.name} performed by experienced Vedic Acharyas and Purohits.`
      : "");

  // Split description into paragraphs if long enough
  const sentences = fullDesc.split(". ");
  let para1 = fullDesc;
  let para2 = "";

  if (sentences.length > 2) {
    const midIndex = Math.ceil(sentences.length / 2);
    para1 =
      sentences.slice(0, midIndex).join(". ") +
      (sentences.slice(0, midIndex).join(". ").endsWith(".") ? "" : ".");
    para2 = sentences.slice(midIndex).join(". ");
  }

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, borderTop: "1px solid #F3E8DB", maxWidth: "900px" }}>
      {/* Section Heading */}
      <Typography
        variant="h3"
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontWeight: 800,
          fontSize: { xs: "24px", sm: "32px", md: "36px" },
          color: "#1A0B05",
          lineHeight: 1.25,
          mb: 1.5,
        }}
      >
        Sacred Tradition & Scriptural Vidhi
      </Typography>

      {/* Orange Accent Line */}
      <Box
        sx={{
          width: 44,
          height: 3.5,
          bgcolor: COLORS.PRIMARY,
          borderRadius: 2,
          mb: 3.5,
        }}
      />

      {/* Normal Text Description (No Card Container) */}
      <Typography
        sx={{
          fontFamily: FONTS.PRIMARY,
          fontSize: { xs: "15px", sm: "16px" },
          color: "#4A3B32",
          lineHeight: 1.8,
          mb: para2 ? 2.5 : 4,
        }}
      >
        {para1}
      </Typography>

      {para2 && (
        <Typography
          sx={{
            fontFamily: FONTS.PRIMARY,
            fontSize: { xs: "15px", sm: "16px" },
            color: "#4A3B32",
            lineHeight: 1.8,
            mb: 4,
          }}
        >
          {para2}
        </Typography>
      )}

      {/* Key Highlights & Ritual Benefits (Points List, No Cards) */}
      {benefitsList.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.PRIMARY,
              fontWeight: 800,
              fontSize: { xs: "20px", sm: "24px" },
              color: "#1A0B05",
              mb: 3,
            }}
          >
            Key Highlights & Ritual Benefits
          </Typography>

          {/* Vertical Points List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {benefitsList.map((benefit: any, index: number) => {
              const bTitle = typeof benefit === "string" ? benefit : benefit.title || benefit.name;
              const bDesc = typeof benefit === "object" ? benefit.description || benefit.desc : "";

              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#FFF0E6",
                      borderRadius: "50%",
                      p: 0.6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: COLORS.PRIMARY,
                      flexShrink: 0,
                      mt: 0.3,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: FONTS.PRIMARY,
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#1A0B05",
                        mb: 0.4,
                      }}
                    >
                      {bTitle}
                    </Typography>

                    {bDesc && (
                      <Typography
                        sx={{
                          fontFamily: FONTS.PRIMARY,
                          fontSize: "14px",
                          color: "#5C4A40",
                          lineHeight: 1.6,
                        }}
                      >
                        {bDesc}
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
