"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";
import {
  ADDRESS_STRICT_REGEX,
  ADDRESS_STRICT_MESSAGE,
  TITLE_STRICT_REGEX,
  TITLE_STRICT_MESSAGE,
} from "@/utils/helpers";

import {
  createTempleAPI,
  getTempleByIdAPI,
  updateTempleAPI,
} from "@/api/templeControllers";
import FormikValidationSnackbar from "@/components/widgets/FormikValidationSnackbar";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { convertImageToWebP } from "@/utils/imageHelper";
import {
  formatSecondsToTimeInput,
  formatTimeToSeconds,
} from "@/utils/templeFormUtils";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { City, State } from "@/utils/indianLocations";
import { FormikProvider, useFormik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { TempleFormProps } from "@/utils/types";

import TempleProfileSection from "./components/TempleProfileSection";
import TempleTimingsSection, {
  AartiItem,
} from "./components/TempleTimingsSection";
import TempleMediaSection from "./components/TempleMediaSection";
import TempleServicesSection, {
  TempleServiceItem,
  createEmptyTempleService,
} from "./components/TempleServicesSection";
import TempleSeoSection from "./components/TempleSeoSection";

export type { AartiItem };

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Temple name is required")
    .min(3, "Temple name must be at least 3 characters")
    .max(120, "Temple name cannot exceed 120 characters")
    .matches(TITLE_STRICT_REGEX, TITLE_STRICT_MESSAGE),
  primaryDeity: Yup.string()
    .trim()
    .required("Primary Deity is required")
    .min(2, "Primary Deity must be at least 2 characters")
    .max(100, "Primary Deity cannot exceed 100 characters"),
  trustName: Yup.string().trim().optional(),
  contactName: Yup.string()
    .trim()
    .required("Contact person / Trustee name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
    ),
  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .optional(),
  address: Yup.string()
    .trim()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters")
    .matches(ADDRESS_STRICT_REGEX, ADDRESS_STRICT_MESSAGE)
    .test(
      "meaningful-address",
      "Address must contain letters, not just numbers or symbols",
      (val) => {
        if (!val) return false;
        return /[a-zA-Z]/.test(val);
      }
    ),
  state: Yup.string().trim().required("State is required"),
  city: Yup.string().trim().required("City is required"),
  description: Yup.string()
    .required("Description is required")
    .test(
      "meaningful-html",
      "Description must contain meaningful text with letters (at least 10 characters), not just symbols",
      (val) => {
        if (!val) return false;
        const stripped = val.replace(/<[^>]*>/g, "").trim();
        const letters = (stripped.match(/[a-zA-Z]/g) || []).length;
        return stripped.length >= 10 && letters >= 5;
      }
    ),
  openingTime: Yup.string().optional(),
  closingTime: Yup.string().optional(),
  trustRegNo: Yup.string().trim().optional(),
  metaTitle: Yup.string().trim().optional(),
  metaDescription: Yup.string().trim().optional(),
});

export default function TempleForm({ isEdit = false, id }: TempleFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const [loading, setLoading] = useState(isEdit);
  const [numericTempleId, setNumericTempleId] = useState<number | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Main Image (imageUrl)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  // Trust Deed (trustDocUrl)
  const [trustDocFile, setTrustDocFile] = useState<File | null>(null);
  const [trustDocPreview, setTrustDocPreview] = useState<string | null>(null);
  const [trustDocName, setTrustDocName] = useState<string>("");
  const [trustDocRemoved, setTrustDocRemoved] = useState(false);

  // Deity Photo (deityPhotoUrl)
  const [deityPhotoFile, setDeityPhotoFile] = useState<File | null>(null);
  const [deityPhotoPreview, setDeityPhotoPreview] = useState<string | null>(null);
  const [deityPhotoRemoved, setDeityPhotoRemoved] = useState(false);

  // Aartis list
  const [aartis, setAartis] = useState<AartiItem[]>([
    { name: "", time: "", description: "" },
  ]);
  const [deletedAartis, setDeletedAartis] = useState<
    Array<{ id: number | string; isDeleted: boolean }>
  >([]);

  // Services list
  const [services, setServices] = useState<TempleServiceItem[]>([]);

  const initialDataRef = useRef<any>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      primaryDeity: "",
      trustName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
      state: "",
      city: "",
      description: "",
      openingTime: "",
      closingTime: "",
      trustRegNo: "",
      metaTitle: "",
      metaDescription: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!isEdit && !imageFile && !imagePreview) {
        setImageError("Temple main cover image is required");
        showSnackbar("Please upload a temple main cover image", "error");
        return;
      }

      try {
        setIsSubmitting(true);
        const formData = new FormData();

        formData.append("name", values.name.trim());
        formData.append("primaryDeity", values.primaryDeity.trim());
        if (values.trustName && values.trustName.trim()) {
          formData.append("trustName", values.trustName.trim());
        }
        formData.append("contactName", values.contactName.trim());
        formData.append("phone", values.phone.trim());
        if (values.email && values.email.trim()) {
          formData.append("email", values.email.trim());
        }
        formData.append("address", values.address.trim());
        formData.append("city", values.city.trim());
        if (values.state && values.state.trim()) {
          formData.append("state", values.state.trim());
        }
        formData.append("description", values.description.trim());

        if (values.openingTime) {
          formData.append("openingTime", formatTimeToSeconds(values.openingTime));
        }
        if (values.closingTime) {
          formData.append("closingTime", formatTimeToSeconds(values.closingTime));
        }
        if (values.trustRegNo && values.trustRegNo.trim()) {
          formData.append("trustRegNo", values.trustRegNo.trim());
        }

        if (values.metaTitle && values.metaTitle.trim()) {
          formData.append("metaTitle", values.metaTitle.trim());
        } else if (isEdit) {
          formData.append("metaTitle", "");
        }
        if (values.metaDescription && values.metaDescription.trim()) {
          formData.append("metaDescription", values.metaDescription.trim());
        } else if (isEdit) {
          formData.append("metaDescription", "");
        }

        // Aartis Array stringified
        const validAartis = aartis
          .filter((a) => a.name && a.name.trim() !== "")
          .map((a) => {
            const item: any = {
              name: a.name.trim(),
              time: formatTimeToSeconds(a.time),
              description: a.description?.trim() || "",
            };
            if (a.id !== undefined && a.id !== null) {
              item.id = !isNaN(Number(a.id)) ? Number(a.id) : a.id;
            }
            return item;
          });

        const deletedPayload = deletedAartis.map((d) => ({
          id: !isNaN(Number(d.id)) ? Number(d.id) : d.id,
          isDeleted: true,
        }));

        const finalAartis = [...validAartis, ...deletedPayload];
        formData.append("aartis", JSON.stringify(finalAartis));

        // Services Array stringified (Pooja / Seva Offerings)
        const invalidNamedService = services.find(
          (s) =>
            (!s.name || !s.name.trim()) &&
            (Boolean(s.description?.trim()) ||
              (s.plans?.basic?.price !== "" && s.plans?.basic?.price !== undefined))
        );
        if (invalidNamedService) {
          showSnackbar(
            "Please provide a service name for all added services, or remove blank ones",
            "error"
          );
          setIsSubmitting(false);
          return;
        }

        const validServices = services
          .filter((s) => s.name && s.name.trim() !== "")
          .map((s, sIdx) => {
            const basicFeatures = (s.plans?.basic?.features || [])
              .filter((f) => f && f.title && f.title.trim())
              .map((f) => ({
                title: f.title.trim(),
                type: f.type || "NORMAL",
                value:
                  f.type === "PRICE"
                    ? f.value !== undefined && f.value !== ""
                      ? String(f.value).trim()
                      : "0"
                    : "true",
              }));

            const plansPayload: any = {
              basic: {
                price: Number(s.plans?.basic?.price) || 0,
                features: basicFeatures,
              },
            };

            if (s.isOffline && s.plans?.standard) {
              const standardFeatures = (s.plans.standard.features || [])
                .filter((f) => f && f.title && f.title.trim())
                .map((f) => ({
                  title: f.title.trim(),
                  type: f.type || "NORMAL",
                  value:
                    f.type === "PRICE"
                      ? f.value !== undefined && f.value !== ""
                        ? String(f.value).trim()
                        : "0"
                      : "true",
                }));

              plansPayload.standard = {
                price: Number(s.plans.standard.price) || 0,
                features: standardFeatures,
              };
            }

            if (s.iconFile) {
              formData.append(`service_${sIdx}_icon`, s.iconFile);
            }

            return {
              ...(s.id ? { id: s.id } : {}),
              name: s.name.trim(),
              ...(s.categoryId ? { categoryId: s.categoryId } : {}),
              description: s.description?.trim() || "",
              plans: plansPayload,
              commissionPercentage:
                s.commissionPercentage !== "" && !isNaN(Number(s.commissionPercentage))
                  ? Number(s.commissionPercentage)
                  : 0,
              tokenPercentage:
                s.tokenPercentage !== "" && !isNaN(Number(s.tokenPercentage))
                  ? Number(s.tokenPercentage)
                  : 0,
              durationMinutes:
                s.durationMinutes !== "" && !isNaN(Number(s.durationMinutes))
                  ? Number(s.durationMinutes)
                  : 0,
              requiresVenue: Boolean(s.requiresVenue),
              isOnline: Boolean(s.isOnline),
              isOffline: Boolean(s.isOffline),
              ...(s.languages && s.languages.length > 0 ? { languages: s.languages } : {}),
              ...(s.iconPreview && !s.iconPreview.startsWith("blob:") ? { iconUrl: s.iconPreview } : {}),
            };
          });

        if (validServices.length > 0) {
          formData.append("services", JSON.stringify(validServices));
        }

        // 1. Main Cover Image (imageUrl)
        if (imageFile) {
          formData.append("imageUrl", imageFile);
        } else if (imageRemoved) {
          formData.append("imageUrl", "");
        } else if (imagePreview && !imagePreview.startsWith("blob:")) {
          let fileToSend: File | null = null;
          try {
            const imgRes = await fetch(imagePreview);
            if (imgRes.ok) {
              const blob = await imgRes.blob();
              const ext = blob.type?.split("/")[1] || "webp";
              fileToSend = new File([blob], `temple_image.${ext}`, {
                type: blob.type || "image/webp",
              });
            }
          } catch (err) {
            console.error("Could not fetch existing temple image:", err);
          }
          if (fileToSend) {
            formData.append("imageUrl", fileToSend);
          } else {
            formData.append("imageUrl", imagePreview);
          }
        }

        // 2. Trust Deed Document (trustDocUrl)
        if (trustDocFile) {
          formData.append("trustDocUrl", trustDocFile);
        } else if (trustDocRemoved) {
          formData.append("trustDocUrl", "");
        } else if (trustDocPreview && !trustDocPreview.startsWith("blob:")) {
          formData.append("trustDocUrl", trustDocPreview);
        }

        // 3. Deity Photo (deityPhotoUrl)
        if (deityPhotoFile) {
          formData.append("deityPhotoUrl", deityPhotoFile);
        } else if (deityPhotoRemoved) {
          formData.append("deityPhotoUrl", "");
        } else if (deityPhotoPreview && !deityPhotoPreview.startsWith("blob:")) {
          formData.append("deityPhotoUrl", deityPhotoPreview);
        }

        let res;
        if (isEdit && id) {
          res = await updateTempleAPI(numericTempleId || id, formData);
        } else {
          res = await createTempleAPI(formData);
        }

        if (res.success || res.data) {
          showSnackbar(
            isEdit ? "Temple updated successfully" : "Temple created successfully",
            "success"
          );
          router.push("/admin/temples");
        } else {
          showSnackbar(
            res.message || `Failed to ${isEdit ? "update" : "create"} temple`,
            "error"
          );
        }
      } catch (error: any) {
        console.error("Temple submit error:", error);
        showSnackbar(
          error.response?.data?.message ||
            `Error ${isEdit ? "updating" : "creating"} temple. Please try again.`,
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Indian States from country-state-city
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry("IN") || [];
    return states.map((s) => s.name);
  }, []);

  // Filter cities dynamically based on selected state
  const cityOptions = useMemo(() => {
    if (!formik.values.state) return [];
    const states = State.getStatesOfCountry("IN") || [];
    const selectedStateObj = states.find(
      (s) =>
        s?.name?.toLowerCase().trim() ===
        (formik.values.state || "").toLowerCase().trim()
    );
    if (selectedStateObj && selectedStateObj.isoCode) {
      const cities = City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
      return Array.from(new Set(cities.map((c) => c.name))).sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return [];
  }, [formik.values.state]);

  // Fetch details on edit
  useEffect(() => {
    if (isEdit && id) {
      const fetchTemple = async () => {
        try {
          setLoading(true);
          const res = await getTempleByIdAPI(id);
          if (res.success && res.data) {
            const temple = res.data.data || res.data;
            if (temple.id) {
              setNumericTempleId(temple.id);
            }

            formik.setValues({
              name: temple.name || "",
              primaryDeity: temple.primaryDeity || "",
              trustName: temple.trustName || "",
              contactName: temple.contactName || "",
              phone: temple.phone || "",
              email: temple.email || "",
              address: temple.address || "",
              state: temple.state || "",
              city: temple.city || "",
              description: temple.description || "",
              openingTime: formatSecondsToTimeInput(temple.openingTime),
              closingTime: formatSecondsToTimeInput(temple.closingTime),
              trustRegNo: temple.trustRegNo || "",
              metaTitle: temple.metaTitle || "",
              metaDescription: temple.metaDescription || "",
            });

            // Parse Aartis if present
            if (temple.aartis) {
              try {
                const parsed =
                  typeof temple.aartis === "string"
                    ? JSON.parse(temple.aartis)
                    : temple.aartis;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const activeList = parsed.filter((a: any) => !a.isDeleted);
                  if (activeList.length > 0) {
                    setAartis(
                      activeList.map((a: any) => ({
                        id:
                          a.id !== undefined && a.id !== null
                            ? !isNaN(Number(a.id))
                              ? Number(a.id)
                              : a.id
                            : undefined,
                        name: a.name || "",
                        time: formatSecondsToTimeInput(a.time),
                        description: a.description || "",
                      }))
                    );
                  } else {
                    setAartis([{ name: "", time: "", description: "" }]);
                  }
                }
              } catch (e) {
                console.warn("Could not parse existing temple aartis:", e);
              }
            }

            // Parse Services if present
            if (
              temple.services &&
              Array.isArray(temple.services) &&
              temple.services.length > 0
            ) {
              setServices(
                temple.services.map((s: any) => {
                  let sPlans = s.plans;
                  if (typeof sPlans === "string") {
                    try {
                      sPlans = JSON.parse(sPlans);
                    } catch {}
                  }
                  return {
                    id: s.id,
                    name: s.name || "",
                    categoryId: s.categoryId || s.category?.id || "",
                    description: s.description || "",
                    iconPreview: s.downloadUrl || s.icon || s.iconUrl || null,
                    languages: Array.isArray(s.languages)
                      ? s.languages.map((l: any) =>
                          typeof l === "string"
                            ? { name: l }
                            : { name: l.name || l.title || "" }
                        )
                      : [],
                    durationMinutes: s.durationMinutes || 60,
                    commissionPercentage: s.commissionPercentage || 10,
                    tokenPercentage: s.tokenPercentage || 30,
                    requiresVenue: s.requiresVenue ?? true,
                    isOnline: Boolean(s.isOnline),
                    isOffline:
                      s.isOffline !== undefined ? Boolean(s.isOffline) : !s.isOnline,
                    plans: {
                      basic: {
                        price: sPlans?.basic?.price ?? "",
                        features: Array.isArray(sPlans?.basic?.features)
                          ? sPlans.basic.features.map((f: any) => ({
                              title: f.title || f.key || "",
                              type: f.type || "NORMAL",
                              value: f.value ?? "true",
                            }))
                          : [],
                      },
                      standard: {
                        price: sPlans?.standard?.price ?? "",
                        features: Array.isArray(sPlans?.standard?.features)
                          ? sPlans.standard.features.map((f: any) => ({
                              title: f.title || f.key || "",
                              type: f.type || "NORMAL",
                              value: f.value ?? "true",
                            }))
                          : [],
                      },
                    },
                  };
                })
              );
            }

            // Existing media files
            const existingImg = temple.downloadUrl || temple.imageUrl;
            if (existingImg) setImagePreview(existingImg);

            const existingTrustDoc =
              temple.trustDocDownloadUrl || temple.trustDocUrl;
            if (existingTrustDoc) {
              setTrustDocPreview(existingTrustDoc);
              setTrustDocName("Trust Document (Uploaded)");
            }

            const existingDeityPhoto =
              temple.deityPhotoDownloadUrl || temple.deityPhotoUrl;
            if (existingDeityPhoto) setDeityPhotoPreview(existingDeityPhoto);

            initialDataRef.current = temple;
          } else {
            showSnackbar("Temple not found", "error");
            router.push("/admin/temples");
          }
        } catch (err) {
          console.error("Failed to fetch temple details", err);
          showSnackbar("Error fetching temple details", "error");
        } finally {
          setLoading(false);
        }
      };

      fetchTemple();
    }
  }, [isEdit, id]);

  // Main Image Handlers
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const webpFile = await convertImageToWebP(file);
        setImageFile(webpFile);
        setImagePreview(URL.createObjectURL(webpFile));
      } catch (err) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
      setImageRemoved(false);
      setImageError(null);
      e.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageRemoved(true);
    if (!isEdit) setImageError("Temple main cover image is required");
  };

  // Trust Doc Handlers
  const handleTrustDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTrustDocFile(file);
      setTrustDocName(file.name);
      if (file.type.startsWith("image/")) {
        setTrustDocPreview(URL.createObjectURL(file));
      } else {
        setTrustDocPreview(null);
      }
      setTrustDocRemoved(false);
      e.target.value = "";
    }
  };

  const handleRemoveTrustDoc = () => {
    setTrustDocFile(null);
    setTrustDocPreview(null);
    setTrustDocName("");
    setTrustDocRemoved(true);
  };

  // Deity Photo Handlers
  const handleDeityPhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const webpFile = await convertImageToWebP(file);
        setDeityPhotoFile(webpFile);
        setDeityPhotoPreview(URL.createObjectURL(webpFile));
      } catch (err) {
        setDeityPhotoFile(file);
        setDeityPhotoPreview(URL.createObjectURL(file));
      }
      setDeityPhotoRemoved(false);
      e.target.value = "";
    }
  };

  const handleRemoveDeityPhoto = () => {
    setDeityPhotoFile(null);
    setDeityPhotoPreview(null);
    setDeityPhotoRemoved(true);
  };

  // Aarti list functions
  const handleAddAarti = () => {
    setAartis((prev) => [...prev, { name: "", time: "", description: "" }]);
  };

  const handleRemoveAarti = (index: number) => {
    const aartiToRemove = aartis[index];
    if (
      aartiToRemove &&
      aartiToRemove.id !== undefined &&
      aartiToRemove.id !== null
    ) {
      const aartiId = !isNaN(Number(aartiToRemove.id))
        ? Number(aartiToRemove.id)
        : aartiToRemove.id;
      setDeletedAartis((prev) => {
        if (prev.some((d) => d.id === aartiId)) return prev;
        return [...prev, { id: aartiId, isDeleted: true }];
      });
    }
    setAartis((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAartiChange = (
    index: number,
    field: keyof AartiItem,
    value: string
  ) => {
    setAartis((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Service list functions
  const handleAddService = () => {
    setServices((prev) => [...prev, createEmptyTempleService()]);
  };

  const handleRemoveService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateService = (index: number, updated: TempleServiceItem) => {
    setServices((prev) => prev.map((s, i) => (i === index ? updated : s)));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  return (
    <FormikProvider value={formik}>
      <FormikValidationSnackbar />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 6 }}>
        {/* Header & Breadcrumbs */}
        <Box>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 1, color: "#64748b" }}
          >
            <NextLink
              href="/admin/dashboard"
              style={{ textDecoration: "none", color: "#64748b" }}
            >
              Dashboard
            </NextLink>
            <NextLink
              href="/admin/temples"
              style={{ textDecoration: "none", color: "#64748b" }}
            >
              Temples
            </NextLink>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {isEdit ? "Edit Temple" : "Add Temple"}
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            {isEdit ? "Edit Temple" : "Add New Temple"}
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748b",
              mt: 0.5,
            }}
          >
            {isEdit
              ? "Update shrine profile, timings, trust verification, and media."
              : "Register a sacred shrine with trust details, visiting hours, aartis, and photos."}
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            {/* 1. Temple Profile & Location Details */}
            <TempleProfileSection
              formik={formik}
              stateOptions={stateOptions}
              cityOptions={cityOptions}
            />

            {/* 2. Timings & Seva Offerings */}
            <TempleTimingsSection
              formik={formik}
              aartis={aartis}
              onAddAarti={handleAddAarti}
              onRemoveAarti={handleRemoveAarti}
              onAartiChange={handleAartiChange}
            />

            {/* 3. Trust Verification & Media Uploads */}
            <TempleMediaSection
              formik={formik}
              isEdit={isEdit}
              imagePreview={imagePreview}
              imageFile={imageFile}
              imageError={imageError}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              trustDocFile={trustDocFile}
              trustDocPreview={trustDocPreview}
              trustDocName={trustDocName}
              onTrustDocChange={handleTrustDocChange}
              onRemoveTrustDoc={handleRemoveTrustDoc}
              deityPhotoFile={deityPhotoFile}
              deityPhotoPreview={deityPhotoPreview}
              onDeityPhotoChange={handleDeityPhotoChange}
              onRemoveDeityPhoto={handleRemoveDeityPhoto}
            />

            {/* 4. Temple Services Offered (Pooja / Seva) */}
            <TempleServicesSection
              services={services}
              onAddService={handleAddService}
              onRemoveService={handleRemoveService}
              onUpdateService={handleUpdateService}
            />

            {/* 5. SEO & Discoverability */}
            <TempleSeoSection formik={formik} />

            {/* Bottom Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                component={NextLink}
                href="/admin/temples"
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  borderColor: "#CBD5E1",
                  color: "#64748B",
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.2,
                  fontFamily: FONTS.OUTFIT,
                  "&:hover": { borderColor: "#94A3B8", bgcolor: "#F8FAFC" },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  borderRadius: "12px",
                  textTransform: "none",
                  bgcolor: COLORS.PRIMARY,
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  fontFamily: FONTS.OUTFIT,
                  "&:hover": { bgcolor: COLORS.PRIMARY_DARK },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : isEdit ? (
                  "Update Temple"
                ) : (
                  "Save Temple"
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </FormikProvider>
  );
}
