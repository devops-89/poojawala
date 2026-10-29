"use client";
import React, { useEffect, useState } from "react";
import { COLORS } from "@/utils/enums";
import { FONTS } from "@/utils/fonts";
import { inputSx, labelSx } from "@/utils/templeFormUtils";
import { getServiceCategoriesAPI } from "@/api/serviceControllers";
import { ALL_INDIAN_LANGUAGES } from "@/utils/serviceDetailsUtils";
import { convertImageToWebP } from "@/utils/imageHelper";

import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TranslateIcon from "@mui/icons-material/Translate";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

export interface TempleServicePlanFeature {
  title: string;
  type?: "NORMAL" | "PRICE";
  value?: string;
}

export interface TempleServiceItem {
  id?: number | string;
  name: string;
  categoryId?: string | number;
  description: string;
  languages?: Array<{ name: string; code?: string }>;
  iconFile?: File | null;
  iconPreview?: string | null;
  durationMinutes: number | string;
  commissionPercentage: number | string;
  tokenPercentage: number | string;
  requiresVenue: boolean;
  isOnline: boolean;
  isOffline: boolean;
  plans: {
    basic: {
      price: number | string;
      features: TempleServicePlanFeature[];
    };
    standard?: {
      price: number | string;
      features: TempleServicePlanFeature[];
    };
  };
}

export const createEmptyTempleService = (): TempleServiceItem => ({
  name: "",
  categoryId: "",
  description: "",
  languages: [],
  iconFile: null,
  iconPreview: null,
  durationMinutes: "",
  commissionPercentage: "",
  tokenPercentage: "",
  requiresVenue: true,
  isOnline: false,
  isOffline: true,
  plans: {
    basic: {
      price: "",
      features: [],
    },
    standard: {
      price: "",
      features: [],
    },
  },
});

interface TempleServicesSectionProps {
  services: TempleServiceItem[];
  onAddService: () => void;
  onRemoveService: (index: number) => void;
  onUpdateService: (index: number, updated: TempleServiceItem) => void;
}

export default function TempleServicesSection({
  services,
  onAddService,
  onRemoveService,
  onUpdateService,
}: TempleServicesSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [categories, setCategories] = useState<Array<{ id: number | string; name: string }>>([]);

  // Load active service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getServiceCategoriesAPI(1, 100, "", true, "SERVICE");
        let list: any[] = [];
        if (res) {
          if (Array.isArray(res)) list = res;
          else if (res.data) {
            if (Array.isArray(res.data.data)) list = res.data.data;
            else if (Array.isArray(res.data)) list = res.data;
            else if (Array.isArray(res.data.categories)) list = res.data.categories;
          } else if (res.categories && Array.isArray(res.categories)) {
            list = res.categories;
          }
        }
        const active = list.filter((c: any) => c && c.isActive !== false);
        setCategories(active);
      } catch (err) {
        console.warn("Failed to load service categories for temple form:", err);
      }
    };
    fetchCategories();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: "18px",
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              bgcolor: "#FFF7ED",
              color: "#EA580C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 0.3,
            }}
          >
            <MiscellaneousServicesIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#1E293B",
              }}
            >
              4. Temple Services Offered (Pooja / Seva)
            </Typography>
            <Typography
              sx={{
                fontFamily: FONTS.OUTFIT,
                color: "#64748B",
                fontSize: "0.85rem",
                mt: 0.25,
              }}
            >
              Configure ritual offerings available at this temple with online / offline modes, packages, and pricing.
            </Typography>
          </Box>
        </Box>

        <Button
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => {
            onAddService();
            setExpandedIndex(services.length);
          }}
          sx={{
            bgcolor: "#FFF7ED",
            color: "#EA580C",
            border: "1px solid #FED7AA",
            fontFamily: FONTS.OUTFIT,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: "10px",
            px: 2,
            py: 0.75,
            fontSize: "13.5px",
            "&:hover": { bgcolor: "#FFEDD5", borderColor: "#FB923C" },
          }}
        >
          Add Service
        </Button>
      </Box>

      <Divider sx={{ my: 0.5 }} />

      {/* Services List */}
      {services.length === 0 ? (
        <Box
          sx={{
            p: 3,
            borderRadius: "14px",
            border: "1.5px dashed #CBD5E1",
            bgcolor: "#F8FAFC",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MiscellaneousServicesIcon sx={{ color: "#94A3B8", fontSize: 36 }} />
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 600,
              fontSize: "0.95rem",
              color: "#475569",
            }}
          >
            No services added for this temple yet
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: "0.825rem", maxWidth: 460 }}>
            Click &quot;+ Add Service&quot; above to create rituals, aartis, or havans (e.g. Somnath Maha Rudrabhishek) offered directly at this temple.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {services.map((service, index) => {
            const isExpanded = expandedIndex === index;

            const updateField = (field: keyof TempleServiceItem, val: any) => {
              onUpdateService(index, { ...service, [field]: val });
            };

            const handleModeChange = (mode: "online" | "offline") => {
              if (mode === "online") {
                onUpdateService(index, {
                  ...service,
                  isOnline: true,
                  isOffline: false,
                  requiresVenue: false,
                });
              } else {
                onUpdateService(index, {
                  ...service,
                  isOnline: false,
                  isOffline: true,
                  requiresVenue: true,
                  plans: {
                    ...service.plans,
                    standard:
                      service.plans.standard || {
                        price: "",
                        features: [],
                      },
                  },
                });
              }
            };

            const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                try {
                  const webpFile = await convertImageToWebP(file);
                  onUpdateService(index, {
                    ...service,
                    iconFile: webpFile,
                    iconPreview: URL.createObjectURL(webpFile),
                  });
                } catch {
                  onUpdateService(index, {
                    ...service,
                    iconFile: file,
                    iconPreview: URL.createObjectURL(file),
                  });
                }
                e.target.value = "";
              }
            };

            const handleRemoveIcon = () => {
              onUpdateService(index, {
                ...service,
                iconFile: null,
                iconPreview: null,
              });
            };

            const updateBasicPrice = (price: string) => {
              onUpdateService(index, {
                ...service,
                plans: {
                  ...service.plans,
                  basic: { ...service.plans.basic, price },
                },
              });
            };

            const updateStandardPrice = (price: string) => {
              onUpdateService(index, {
                ...service,
                plans: {
                  ...service.plans,
                  standard: {
                    ...(service.plans.standard || { features: [] }),
                    price,
                  },
                },
              });
            };

            const addFeature = (planType: "basic" | "standard") => {
              const currentFeatures =
                planType === "basic"
                  ? service.plans.basic.features || []
                  : service.plans.standard?.features || [];

              const updatedFeatures = [
                ...currentFeatures,
                { title: "", type: "NORMAL" as const, value: "true" },
              ];

              onUpdateService(index, {
                ...service,
                plans: {
                  ...service.plans,
                  [planType]: {
                    ...service.plans[planType],
                    features: updatedFeatures,
                  },
                },
              });
            };

            const updateFeature = (
              planType: "basic" | "standard",
              fIndex: number,
              key: keyof TempleServicePlanFeature,
              val: any
            ) => {
              const currentFeatures =
                planType === "basic"
                  ? [...(service.plans.basic.features || [])]
                  : [...(service.plans.standard?.features || [])];

              currentFeatures[fIndex] = {
                ...currentFeatures[fIndex],
                [key]: val,
              };

              onUpdateService(index, {
                ...service,
                plans: {
                  ...service.plans,
                  [planType]: {
                    ...service.plans[planType],
                    features: currentFeatures,
                  },
                },
              });
            };

            const removeFeature = (
              planType: "basic" | "standard",
              fIndex: number
            ) => {
              const currentFeatures =
                planType === "basic"
                  ? service.plans.basic.features || []
                  : service.plans.standard?.features || [];

              const updatedFeatures = currentFeatures.filter((_, i) => i !== fIndex);

              onUpdateService(index, {
                ...service,
                plans: {
                  ...service.plans,
                  [planType]: {
                    ...service.plans[planType],
                    features: updatedFeatures,
                  },
                },
              });
            };

            return (
              <Box
                key={index}
                sx={{
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "14px",
                  bgcolor: "#FAFAFA",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  "&:hover": { borderColor: "#CBD5E1" },
                }}
              >
                {/* Header bar of the service */}
                <Box
                  sx={{
                    px: 2.5,
                    py: 1.75,
                    bgcolor: isExpanded ? "#FFFDF9" : "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    borderBottom: isExpanded ? "1px solid #E2E8F0" : "none",
                  }}
                  onClick={() => toggleExpand(index)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "8px",
                        bgcolor: service.isOnline ? "#EFF6FF" : "#FFF7ED",
                        color: service.isOnline ? "#2563EB" : "#EA580C",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "13px",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography
                      noWrap
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "#1E293B",
                      }}
                    >
                      {service.name.trim() || `Service ${index + 1} (Click to configure)`}
                    </Typography>
                    <Chip
                      icon={
                        service.isOnline ? (
                          <VideocamOutlinedIcon sx={{ fontSize: "14px !important" }} />
                        ) : (
                          <PlaceOutlinedIcon sx={{ fontSize: "14px !important" }} />
                        )
                      }
                      label={service.isOnline ? "Online (Live Stream)" : "Offline (In-Person)"}
                      size="small"
                      sx={{
                        fontFamily: FONTS.OUTFIT,
                        fontWeight: 600,
                        fontSize: "11px",
                        bgcolor: service.isOnline ? "#EFF6FF" : "#FFF7ED",
                        color: service.isOnline ? "#1D4ED8" : "#C2410C",
                        border: "1px solid",
                        borderColor: service.isOnline ? "#BFDBFE" : "#FFEDD5",
                      }}
                    />
                    {service.plans.basic.price && (
                      <Typography
                        sx={{
                          fontFamily: FONTS.OUTFIT,
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          color: "#059669",
                          display: { xs: "none", sm: "block" },
                        }}
                      >
                        ₹{service.plans.basic.price}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveService(index)}
                      sx={{
                        color: "#94A3B8",
                        "&:hover": { color: "#DC2626", bgcolor: "#FEE2E2" },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => toggleExpand(index)}>
                      {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Collapsible Form Body (Single page inline) */}
                {isExpanded && (
                  <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.5, bgcolor: "#FFFFFF" }}>
                    {/* Row 1: Mode Switch & Service Image Upload */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: "#F8FAFC",
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      {/* Service Mode */}
                      <Box>
                        <Typography sx={labelSx}>SERVICE MODE *</Typography>
                        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                          <Button
                            variant={service.isOffline ? "contained" : "outlined"}
                            size="small"
                            onClick={() => handleModeChange("offline")}
                            startIcon={<PlaceOutlinedIcon fontSize="small" />}
                            sx={{
                              flex: 1,
                              borderRadius: "10px",
                              py: 1,
                              textTransform: "none",
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 700,
                              fontSize: "13px",
                              bgcolor: service.isOffline ? "#EA580C" : "#FFFFFF",
                              borderColor: service.isOffline ? "#EA580C" : "#CBD5E1",
                              color: service.isOffline ? "#FFFFFF" : "#475569",
                              "&:hover": {
                                bgcolor: service.isOffline ? "#C2410C" : "#FFF7ED",
                                borderColor: "#EA580C",
                              },
                            }}
                          >
                            Offline (In-Person)
                          </Button>
                          <Button
                            variant={service.isOnline ? "contained" : "outlined"}
                            size="small"
                            onClick={() => handleModeChange("online")}
                            startIcon={<VideocamOutlinedIcon fontSize="small" />}
                            sx={{
                              flex: 1,
                              borderRadius: "10px",
                              py: 1,
                              textTransform: "none",
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 700,
                              fontSize: "13px",
                              bgcolor: service.isOnline ? "#2563EB" : "#FFFFFF",
                              borderColor: service.isOnline ? "#2563EB" : "#CBD5E1",
                              color: service.isOnline ? "#FFFFFF" : "#475569",
                              "&:hover": {
                                bgcolor: service.isOnline ? "#1D4ED8" : "#EFF6FF",
                                borderColor: "#2563EB",
                              },
                            }}
                          >
                            Online (Live Stream)
                          </Button>
                        </Box>
                      </Box>

                      {/* Service Icon / Cover Image */}
                      <Box>
                        <Typography sx={labelSx}>SERVICE IMAGE / ICON</Typography>
                        {service.iconPreview ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 1,
                              px: 1.5,
                              borderRadius: "10px",
                              border: "1px solid #CBD5E1",
                              bgcolor: "#FFFFFF",
                              gap: 1.5,
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                              <Box
                                component="img"
                                src={service.iconPreview}
                                alt="Service Icon"
                                sx={{
                                  width: 38,
                                  height: 38,
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                  border: "1px solid #E2E8F0",
                                }}
                              />
                              <Typography noWrap sx={{ fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                                {service.iconFile ? service.iconFile.name : "Service Image"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Button
                                component="label"
                                size="small"
                                sx={{
                                  textTransform: "none",
                                  fontFamily: FONTS.OUTFIT,
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  color: COLORS.PRIMARY,
                                  minWidth: "auto",
                                  p: 0.5,
                                }}
                              >
                                Change
                                <input type="file" hidden accept="image/*" onChange={handleIconChange} />
                              </Button>
                              <IconButton size="small" color="error" onClick={handleRemoveIcon}>
                                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Box>
                          </Box>
                        ) : (
                          <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            startIcon={<AddPhotoAlternateOutlinedIcon sx={{ color: "#EA580C" }} />}
                            sx={{
                              borderStyle: "dashed",
                              borderColor: "#CBD5E1",
                              borderRadius: "10px",
                              py: 0.9,
                              textTransform: "none",
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 600,
                              fontSize: "12.5px",
                              color: "#475569",
                              bgcolor: "#FFFFFF",
                              "&:hover": { borderColor: COLORS.PRIMARY, bgcolor: "#FFF7ED" },
                            }}
                          >
                            Upload Service Image
                            <input type="file" hidden accept="image/*" onChange={handleIconChange} />
                          </Button>
                        )}
                      </Box>
                    </Box>

                    {/* Row 2: Service Name & Category */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "2fr 1.5fr" },
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography sx={labelSx}>SERVICE NAME *</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="e.g. Somnath Maha Rudrabhishek"
                          value={service.name}
                          onChange={(e) => updateField("name", e.target.value)}
                          sx={inputSx}
                        />
                      </Box>

                      <Box>
                        <Typography sx={labelSx}>SERVICE CATEGORY</Typography>
                        <FormControl fullWidth size="small" sx={inputSx}>
                          <Select
                            value={service.categoryId || ""}
                            onChange={(e) => updateField("categoryId", e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em style={{ color: "#94A3B8", fontStyle: "normal" }}>Select Category</em>
                            </MenuItem>
                            {categories.map((c) => (
                              <MenuItem key={c.id} value={c.id}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>

                    {/* Row 3: Description */}
                    <Box>
                      <Typography sx={labelSx}>SERVICE DESCRIPTION *</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Complete Vedic Rudrabhishek performed at the temple sanctum with authentic rituals..."
                        value={service.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        sx={inputSx}
                      />
                    </Box>

                    {/* Row 4: Languages & Parameters */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr 1fr" },
                        gap: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      {/* Supported Languages */}
                      <Box>
                        <Typography sx={labelSx}>SUPPORTED LANGUAGES</Typography>
                        <Autocomplete
                          multiple
                          size="small"
                          options={ALL_INDIAN_LANGUAGES}
                          value={(service.languages || []).map((l) => l.name)}
                          onChange={(_, newValues: string[]) =>
                            updateField(
                              "languages",
                              (newValues || []).map((name) => ({ name }))
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                (service.languages || []).length === 0
                                  ? "Select languages"
                                  : ""
                              }
                              sx={inputSx}
                            />
                          )}
                        />
                      </Box>

                      {/* Duration */}
                      <Box>
                        <Typography sx={labelSx}>DURATION (MINS)</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="e.g. 60"
                          value={service.durationMinutes}
                          onChange={(e) => updateField("durationMinutes", e.target.value)}
                          sx={inputSx}
                        />
                      </Box>

                      {/* Commission % */}
                      <Box>
                        <Typography sx={labelSx}>COMMISSION (%)</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="10"
                          value={service.commissionPercentage}
                          onChange={(e) => updateField("commissionPercentage", e.target.value)}
                          sx={inputSx}
                        />
                      </Box>

                      {/* Token % */}
                      <Box>
                        <Typography sx={labelSx}>TOKEN ADVANCE (%)</Typography>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          placeholder="30"
                          value={service.tokenPercentage}
                          onChange={(e) => updateField("tokenPercentage", e.target.value)}
                          sx={inputSx}
                        />
                      </Box>
                    </Box>

                    {/* Venue Switch (Only when Offline) */}
                    {service.isOffline && (
                      <Box sx={{ pt: 0.5 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={service.requiresVenue}
                              onChange={(e) => updateField("requiresVenue", e.target.checked)}
                              color="primary"
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                fontFamily: FONTS.OUTFIT,
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#334155",
                              }}
                            >
                              Requires Temple Venue Visit (Devotee visits temple)
                            </Typography>
                          }
                        />
                      </Box>
                    )}

                    <Divider sx={{ my: 0.5 }} />

                    {/* Plans Configuration matching user's exact design */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                      {/* Offline Mode: Basic and Standard Plans */}
                      {service.isOffline ? (
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                            gap: 2.5,
                          }}
                        >
                          {/* Basic Plan Box */}
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: "14px",
                              border: "1px solid #FED7AA",
                              bgcolor: "#FFFDF9",
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography
                                sx={{
                                  fontFamily: FONTS.OUTFIT,
                                  fontWeight: 800,
                                  fontSize: "15px",
                                  color: "#9A3412",
                                }}
                              >
                                Basic Plan Package Configuration
                              </Typography>
                              <Chip
                                label="Required"
                                size="small"
                                sx={{ fontSize: "10.5px", height: "20px", fontWeight: 700 }}
                              />
                            </Box>

                            <Box>
                              <Typography sx={labelSx}>BASIC PLAN PRICE (₹) *</Typography>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                placeholder="e.g. 2100"
                                value={service.plans.basic.price}
                                onChange={(e) => updateBasicPrice(e.target.value)}
                                sx={inputSx}
                              />
                            </Box>

                            {/* Features Container */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 0.5 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: "13px", color: "#1E293B" }}>
                                  Basic Plan Features & Inclusions
                                </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<AddIcon sx={{ fontSize: "15px !important" }} />}
                                  onClick={() => addFeature("basic")}
                                  sx={{
                                    borderRadius: "8px",
                                    borderColor: "#EA580C",
                                    color: "#EA580C",
                                    textTransform: "none",
                                    fontFamily: FONTS.OUTFIT,
                                    fontWeight: 700,
                                    fontSize: "12px",
                                    px: 1.5,
                                    py: 0.35,
                                    "&:hover": { borderColor: "#C2410C", bgcolor: "#FFF7ED" },
                                  }}
                                >
                                  Add Feature
                                </Button>
                              </Box>

                              {(service.plans.basic.features || []).length === 0 && (
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "#94A3B8",
                                    fontStyle: "italic",
                                    py: 1.5,
                                    textAlign: "center",
                                    bgcolor: "#F8FAFC",
                                    borderRadius: "8px",
                                    border: "1px dashed #E2E8F0",
                                  }}
                                >
                                  No features added yet. Click &quot;+ Add Feature&quot; to add inclusions.
                                </Typography>
                              )}

                              {(service.plans.basic.features || []).map((feat, fIdx) => (
                                <Box key={fIdx} sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="e.g. Live Sankalp via Video Call"
                                    value={feat.title}
                                    onChange={(e) => updateFeature("basic", fIdx, "title", e.target.value)}
                                    sx={{ flex: 3, ...inputSx }}
                                  />
                                  <FormControl size="small" sx={{ minWidth: 110, ...inputSx }}>
                                    <InputLabel id={`type-basic-${fIdx}`}>Type</InputLabel>
                                    <Select
                                      labelId={`type-basic-${fIdx}`}
                                      label="Type"
                                      value={feat.type || "NORMAL"}
                                      onChange={(e) => updateFeature("basic", fIdx, "type", e.target.value)}
                                    >
                                      <MenuItem value="NORMAL">NORMAL</MenuItem>
                                      <MenuItem value="PRICE">PRICE</MenuItem>
                                    </Select>
                                  </FormControl>
                                  {feat.type === "PRICE" && (
                                    <TextField
                                      size="small"
                                      placeholder="₹ Value"
                                      value={feat.value || ""}
                                      onChange={(e) => updateFeature("basic", fIdx, "value", e.target.value)}
                                      sx={{ width: 95, ...inputSx }}
                                    />
                                  )}
                                  <IconButton
                                    size="small"
                                    onClick={() => removeFeature("basic", fIdx)}
                                    sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEE2E2" } }}
                                  >
                                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Box>
                              ))}
                            </Box>
                          </Box>

                          {/* Standard Plan Box */}
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: "14px",
                              border: "1px solid #FED7AA",
                              bgcolor: "#FFFDF9",
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography
                                sx={{
                                  fontFamily: FONTS.OUTFIT,
                                  fontWeight: 800,
                                  fontSize: "15px",
                                  color: "#9A3412",
                                }}
                              >
                                Standard Plan Package Configuration
                              </Typography>
                              <Chip
                                label="Offline Standard"
                                size="small"
                                sx={{ fontSize: "10.5px", height: "20px", fontWeight: 700, bgcolor: "#FFF7ED", color: "#C2410C" }}
                              />
                            </Box>

                            <Box>
                              <Typography sx={labelSx}>STANDARD PLAN PRICE (₹)</Typography>
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                placeholder="e.g. 5100"
                                value={service.plans.standard?.price || ""}
                                onChange={(e) => updateStandardPrice(e.target.value)}
                                sx={inputSx}
                              />
                            </Box>

                            {/* Features Container */}
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 0.5 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: "13px", color: "#1E293B" }}>
                                  Standard Plan Features & Inclusions
                                </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<AddIcon sx={{ fontSize: "15px !important" }} />}
                                  onClick={() => addFeature("standard")}
                                  sx={{
                                    borderRadius: "8px",
                                    borderColor: "#EA580C",
                                    color: "#EA580C",
                                    textTransform: "none",
                                    fontFamily: FONTS.OUTFIT,
                                    fontWeight: 700,
                                    fontSize: "12px",
                                    px: 1.5,
                                    py: 0.35,
                                    "&:hover": { borderColor: "#C2410C", bgcolor: "#FFF7ED" },
                                  }}
                                >
                                  Add Feature
                                </Button>
                              </Box>

                              {(service.plans.standard?.features || []).length === 0 && (
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "#94A3B8",
                                    fontStyle: "italic",
                                    py: 1.5,
                                    textAlign: "center",
                                    bgcolor: "#F8FAFC",
                                    borderRadius: "8px",
                                    border: "1px dashed #E2E8F0",
                                  }}
                                >
                                  No features added yet. Click &quot;+ Add Feature&quot; to add inclusions.
                                </Typography>
                              )}

                              {(service.plans.standard?.features || []).map((feat, fIdx) => (
                                <Box key={fIdx} sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="e.g. Special Havan & Purnahuti"
                                    value={feat.title}
                                    onChange={(e) => updateFeature("standard", fIdx, "title", e.target.value)}
                                    sx={{ flex: 3, ...inputSx }}
                                  />
                                  <FormControl size="small" sx={{ minWidth: 110, ...inputSx }}>
                                    <InputLabel id={`type-std-${fIdx}`}>Type</InputLabel>
                                    <Select
                                      labelId={`type-std-${fIdx}`}
                                      label="Type"
                                      value={feat.type || "NORMAL"}
                                      onChange={(e) => updateFeature("standard", fIdx, "type", e.target.value)}
                                    >
                                      <MenuItem value="NORMAL">NORMAL</MenuItem>
                                      <MenuItem value="PRICE">PRICE</MenuItem>
                                    </Select>
                                  </FormControl>
                                  {feat.type === "PRICE" && (
                                    <TextField
                                      size="small"
                                      placeholder="₹ Value"
                                      value={feat.value || ""}
                                      onChange={(e) => updateFeature("standard", fIdx, "value", e.target.value)}
                                      sx={{ width: 95, ...inputSx }}
                                    />
                                  )}
                                  <IconButton
                                    size="small"
                                    onClick={() => removeFeature("standard", fIdx)}
                                    sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEE2E2" } }}
                                  >
                                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        /* Online Mode: Online Pooja Package (Basic Plan Only) - Exact Match to Screenshot */
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: "14px",
                            border: "1px solid #FED7AA",
                            bgcolor: "#FFFDF9",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: FONTS.OUTFIT,
                              fontWeight: 800,
                              fontSize: "15px",
                              color: "#9A3412",
                            }}
                          >
                            Online Pooja Package Configuration
                          </Typography>

                          <Box>
                            <Typography sx={labelSx}>ONLINE POOJA PRICE (₹) *</Typography>
                            <TextField
                              fullWidth
                              size="small"
                              type="number"
                              placeholder="e.g. 1499"
                              value={service.plans.basic.price}
                              onChange={(e) => updateBasicPrice(e.target.value)}
                              sx={inputSx}
                            />
                          </Box>

                          {/* Online Features */}
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 0.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, fontSize: "13px", color: "#1E293B" }}>
                                Online Pooja Features & Inclusions
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AddIcon sx={{ fontSize: "15px !important" }} />}
                                onClick={() => addFeature("basic")}
                                sx={{
                                  borderRadius: "8px",
                                  borderColor: "#EA580C",
                                  color: "#EA580C",
                                  textTransform: "none",
                                  fontFamily: FONTS.OUTFIT,
                                  fontWeight: 700,
                                  fontSize: "12px",
                                  px: 1.5,
                                  py: 0.35,
                                  "&:hover": { borderColor: "#C2410C", bgcolor: "#FFF7ED" },
                                }}
                              >
                                Add Feature
                              </Button>
                            </Box>

                            {(service.plans.basic.features || []).length === 0 && (
                              <Typography
                                sx={{
                                  fontSize: "12px",
                                  color: "#94A3B8",
                                  fontStyle: "italic",
                                  py: 1.5,
                                  textAlign: "center",
                                  bgcolor: "#F8FAFC",
                                  borderRadius: "8px",
                                  border: "1px dashed #E2E8F0",
                                }}
                              >
                                No features added yet. Click &quot;+ Add Feature&quot; to add inclusions.
                              </Typography>
                            )}

                            {(service.plans.basic.features || []).map((feat, fIdx) => (
                              <Box key={fIdx} sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="e.g. Live Sankalp via Video Call"
                                  value={feat.title}
                                  onChange={(e) => updateFeature("basic", fIdx, "title", e.target.value)}
                                  sx={{ flex: 3, ...inputSx }}
                                />
                                <FormControl size="small" sx={{ minWidth: 110, ...inputSx }}>
                                  <InputLabel id={`type-online-${fIdx}`}>Type</InputLabel>
                                  <Select
                                    labelId={`type-online-${fIdx}`}
                                    label="Type"
                                    value={feat.type || "NORMAL"}
                                    onChange={(e) => updateFeature("basic", fIdx, "type", e.target.value)}
                                  >
                                    <MenuItem value="NORMAL">NORMAL</MenuItem>
                                    <MenuItem value="PRICE">PRICE</MenuItem>
                                  </Select>
                                </FormControl>
                                {feat.type === "PRICE" && (
                                  <TextField
                                    size="small"
                                    placeholder="₹ Value"
                                    value={feat.value || ""}
                                    onChange={(e) => updateFeature("basic", fIdx, "value", e.target.value)}
                                    sx={{ width: 95, ...inputSx }}
                                  />
                                )}
                                <IconButton
                                  size="small"
                                  onClick={() => removeFeature("basic", fIdx)}
                                  sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEE2E2" } }}
                                >
                                  <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}
