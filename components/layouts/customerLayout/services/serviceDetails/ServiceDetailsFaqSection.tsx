"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props {
  serviceName: string;
  faqItems?: Array<{ id: string; question: string; answer: string }>;
}

export default function ServiceDetailsFaqSection({ serviceName, faqItems: customFaqItems }: Props) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const defaultFaqItems = [
    {
      id: "panel1",
      question: "What do I need to arrange before the Purohit arrives?",
      answer:
        "Our Purohit arrives fully prepared with essential pooja samagri. You only need to arrange basic household items like fresh flowers, fruits, clean water, and a comfortable seating arrangement for the rituals.",
    },
    {
      id: "panel2",
      question: "How many family members can participate?",
      answer:
        "All family members can participate in the pooja ceremony. The Purohit will guide everyone through the Sankalp, sacred mantras, Aarti, and Prasad distribution step by step.",
    },
    {
      id: "panel3",
      question: "What is the price range and what does it depend on?",
      answer:
        "The final price depends on the Purohit who accepts your booking request. Once a Purohit accepts, the final amount is confirmed based on ritual scope, duration, and custom requirements.",
    },
    {
      id: "panel4",
      question: "Can the pooja be conducted in English?",
      answer:
        "Yes! Our experienced Purohits are multilingual and can conduct and explain all Vedic rituals in Hindi, Sanskrit, or English as per your family's preference.",
    },
  ];
  const faqList = customFaqItems || defaultFaqItems;

  return (
    <Box sx={{ py: 3, mb: 4 }}>
      <Grid container spacing={5} sx={{ alignItems: "flex-start" }}>
        {/* Left Column: Questions Header */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              color: "#C84B16",
              textTransform: "uppercase",
              mb: 1.5,
            }}
          >
            QUESTIONS
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 800,
              color: "#2C1810",
              fontSize: { xs: "28px", sm: "36px", md: "40px" },
              lineHeight: 1.2,
              mb: 2.5,
            }}
          >
            Before you book
          </Typography>

          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              color: "#64534A",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: 420,
            }}
          >
            Common questions about the {serviceName || "service"} service, answered clearly.
          </Typography>
        </Grid>

        {/* Right Column: Accordion list */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {faqList.map((item) => (
              <Accordion
                key={item.id}
                expanded={expanded === item.id}
                onChange={handleChange(item.id)}
                elevation={0}
                disableGutters
                sx={{
                  bgcolor: "#FFFBF7",
                  border: "1px solid #EADCCF",
                  borderRadius: "14px !important",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                  transition: "all 0.2s ease",
                  boxShadow: expanded === item.id ? "0 4px 16px rgba(44, 24, 16, 0.06)" : "none",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#C84B16", fontSize: 22 }} />}
                  sx={{
                    px: 3,
                    py: 1,
                    "& .MuiAccordionSummary-content": {
                      my: 1.5,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 700,
                      color: "#2C1810",
                      fontSize: { xs: "15px", sm: "16px" },
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      color: "#64534A",
                      fontSize: "14px",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
