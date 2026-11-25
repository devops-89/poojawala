"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface ServiceAreaTabProps {
  serviceAreas: any[];
  onAddNew: () => void;
  onEdit: (area: any) => void;
  onDelete: (id: number) => void;
}

export const ServiceAreaTab: React.FC<ServiceAreaTabProps> = ({
  serviceAreas,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: { xs: 2.5, sm: 3.5 },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              fontSize: { xs: "18px", sm: "20px" },
              color: "#1A1A1A",
              mb: 0.3,
            }}
          >
            Service Area
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748B",
              fontSize: { xs: "12.5px", sm: "13.5px" },
            }}
          >
            Manage the locations where you are willing to travel for services.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={onAddNew}
          sx={{
            bgcolor: COLORS.PRIMARY,
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: { xs: "13px", sm: "13.5px" },
            px: 2.2,
            height: "38px",
            fontFamily: FONTS.OUTFIT,
            boxShadow: "0 4px 12px rgba(255, 98, 0, 0.25)",
            "&:hover": {
              bgcolor: COLORS.PRIMARY_DARK,
            },
          }}
        >
          Add New Address
        </Button>
      </Box>

      {serviceAreas.length === 0 ? (
        <Card
          elevation={0}
          sx={{ borderRadius: "14px", p: { xs: 3, sm: 4 }, textAlign: "center", border: "1px dashed #EFE6D5", bgcolor: "#FFFDF9" }}
        >
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#64748B", fontSize: "14px" }}>
            No service areas added yet. Click "Add New Address" to add one.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          {serviceAreas.map((area: any) => (
            <Grid size={{ xs: 12, sm: 6 }} key={area.id} sx={{ display: "flex" }}>
              <Card
                elevation={0}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                  borderRadius: "14px",
                  border: "1px solid #EFE6D5",
                  bgcolor: "#FFFDF9",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justify: "space-between",
                    p: 2.5,
                    "&:last-child": { pb: 2.5 },
                  }}
                >
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LocationOnIcon sx={{ color: COLORS.PRIMARY, fontSize: 20 }} />
                        <Typography
                          sx={{
                            fontFamily: FONTS.OUTFIT,
                            fontWeight: 700,
                            fontSize: "16px",
                            color: "#1A1A1A",
                          }}
                        >
                          {area.addressLabel || "Office"}
                        </Typography>
                        {area.isDefault && (
                          <Chip
                            label="Default"
                            size="small"
                            sx={{
                              bgcolor: "#E8F5E9",
                              color: "#2E7D32",
                              fontWeight: 700,
                              fontSize: "11px",
                              height: "22px",
                              borderRadius: "6px",
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(area)}
                            sx={{ color: "#64748b", "&:hover": { color: "#1E293B" } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => onDelete(area.id)}
                            sx={{ color: "#64748b", "&:hover": { color: "#ef4444" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        color: "#64748b",
                        fontSize: "13px",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {area.fullAddress ||
                        [area.streetName, area.city, area.state, area.pincode]
                          .filter(Boolean)
                          .join(", ")}
                    </Typography>
                  </Box>

                  {area.serviceRadiusKm && (
                    <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px dashed #f1f5f9" }}>
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontSize: "12px",
                          fontWeight: 700,
                          color: COLORS.PRIMARY,
                        }}
                      >
                        Radius: {area.serviceRadiusKm} km
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
