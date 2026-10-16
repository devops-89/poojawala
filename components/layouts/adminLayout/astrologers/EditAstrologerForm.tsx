"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS } from "@/utils/enums";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { City, State } from "country-state-city";
import { Box, Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { getPurohitByIdAPI, updateUserByAdminAPI } from "@/api/userControllers";
import { convertImageToWebP } from "@/utils/imageHelper";
import { BasicDetailsSection } from "../purohits/BasicDetailsSection";
import { VerificationDocsSection } from "../purohits/VerificationDocsSection";
import { PlatformCommissionCard } from "../common/PlatformCommissionCard";
import { AstrologerProfileSection, ASTROLOGY_SPECIALIZATIONS, cleanItem, parseList } from "./AstrologerProfileSection";

export { ASTROLOGY_SPECIALIZATIONS, cleanItem, parseList };

interface EditAstrologerFormProps {
  id: string | number;
}

const today = new Date();
const twentyYearsAgo = new Date(
  today.getFullYear() - 20,
  today.getMonth(),
  today.getDate()
);

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .trim()
    .required("Full Name is required")
    .min(2, "Full Name must be at least 2 characters")
    .matches(/^[a-zA-Z\s.]+$/, "Full Name should only contain letters and spaces"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Mobile Number is required")
    .matches(
      /^[6-9][0-9]{9}$/,
      "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
    )
    .trim(),
  dob: Yup.string()
    .required("Date of Birth is required")
    .test(
      "is-20-years-old",
      "Astrologer must be at least 20 years old",
      (val) => {
        if (!val) return false;
        const selectedDate = new Date(val);
        return !isNaN(selectedDate.getTime()) && selectedDate <= twentyYearsAgo;
      }
    ),
  commissionPrice: Yup.number()
    .typeError("Commission price must be a valid number")
    .min(0, "Commission price cannot be negative")
    .required("Commission price is required"),
  ratePerMinute: Yup.number()
    .typeError("Rate per minute must be a valid number")
    .min(0, "Rate cannot be negative")
    .required("Rate per minute is required"),
  bio: Yup.string()
    .trim()
    .required("Bio is required")
    .min(10, "Bio must be at least 10 characters"),
  qualification: Yup.string().required("Qualification is required"),
  experienceYears: Yup.number()
    .typeError("Experience Years must be a number")
    .min(0, "Experience must be at least 0 years")
    .max(99, "Experience cannot exceed 99 years")
    .required("Experience Years is required"),
  aadhaarNumber: Yup.string()
    .required("Aadhaar Number is required")
    .matches(/^\d{12}$/, "Aadhaar number must be exactly 12 digits"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
});

export default function EditAstrologerForm({ id }: EditAstrologerFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<{
    profilePhoto: File | null;
    identityDoc: File | null;
    certificate: File | null;
  }>({
    profilePhoto: null,
    identityDoc: null,
    certificate: null,
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      countryCode: "+91",
      dob: "",
      commissionPrice: "",
      ratePerMinute: "",
      bio: "",
      qualification: "",
      experienceYears: "",
      languages: [] as string[],
      specializations: [] as string[],
      aadhaarNumber: "",
      city: "",
      state: "",
      profilePhotoUrl: "",
      identityDocUrl: "",
      certificateUrl: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const nameParts = (values.fullName || "").trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const hasSelectedFiles = Boolean(
          selectedFiles.profilePhoto ||
          selectedFiles.identityDoc ||
          selectedFiles.certificate
        );

        const cleanedLanguages = Array.from(
          new Set((values.languages || []).map(cleanItem).filter(Boolean))
        );
        const cleanedSpecializations = Array.from(
          new Set((values.specializations || []).map(cleanItem).filter(Boolean))
        );
        const cleanedQualification = cleanItem(values.qualification);

        const profileObj: any = {
          bio: values.bio,
          qualification: cleanedQualification ? [cleanedQualification] : [],
          experienceYears: Number(values.experienceYears || 0),
          languages: cleanedLanguages.join(","),
          specializations: cleanedSpecializations.join(","),
          aadhaarNumber: values.aadhaarNumber,
          city: values.city,
          state: values.state,
          commissionPrice: values.commissionPrice
            ? Number(values.commissionPrice)
            : 0,
          ratePerMinute: values.ratePerMinute
            ? Number(values.ratePerMinute)
            : 0,
          aadhaarDocUrl:
            values.identityDocUrl && !values.identityDocUrl.startsWith("blob:")
              ? values.identityDocUrl
              : null,
          certificateUrl:
            values.certificateUrl && !values.certificateUrl.startsWith("blob:")
              ? values.certificateUrl
              : null,
        };

        if (hasSelectedFiles) {
          const fd = new FormData();
          fd.append("firstName", firstName);
          fd.append("lastName", lastName);
          if (values.email) fd.append("email", values.email);
          if (values.phone) fd.append("phone", values.phone);
          if (values.countryCode)
            fd.append("countryCode", values.countryCode || "+91");
          if (values.dob) fd.append("dob", values.dob);

          fd.append("profile", JSON.stringify(profileObj));

          // Scalar fields for backend compatibility
          fd.append("bio", values.bio);
          if (cleanedQualification)
            fd.append("qualification", cleanedQualification);
          fd.append("experienceYears", String(values.experienceYears || 0));
          if (cleanedLanguages.length > 0) {
            fd.append("languages", cleanedLanguages.join(","));
          }
          if (cleanedSpecializations.length > 0) {
            fd.append("specializations", cleanedSpecializations.join(","));
          }
          if (values.aadhaarNumber)
            fd.append("aadhaarNumber", values.aadhaarNumber);
          if (values.city) fd.append("city", values.city);
          if (values.state) fd.append("state", values.state);
          if (values.commissionPrice !== "" && values.commissionPrice !== undefined) {
            fd.append("commissionPrice", String(values.commissionPrice));
          }
          if (values.ratePerMinute)
            fd.append("ratePerMinute", String(values.ratePerMinute));

          if (selectedFiles.profilePhoto) {
            const webpFile = await convertImageToWebP(
              selectedFiles.profilePhoto
            );
            fd.append("profileImage", webpFile);
          }
          if (selectedFiles.identityDoc) {
            const webpFile = await convertImageToWebP(
              selectedFiles.identityDoc
            );
            fd.append("aadhaarDoc", webpFile);
          }
          if (selectedFiles.certificate) {
            const webpFile = await convertImageToWebP(
              selectedFiles.certificate
            );
            fd.append("certificate", webpFile);
          }

          await updateUserByAdminAPI(id, fd);
        } else {
          const updatePayload: any = {
            firstName,
            lastName,
            email: values.email,
            phone: values.phone,
            countryCode: values.countryCode || "+91",
            dob: values.dob,
            commissionPrice: values.commissionPrice
              ? Number(values.commissionPrice)
              : 0,
            profileImage:
              values.profilePhotoUrl &&
                !values.profilePhotoUrl.startsWith("blob:")
                ? values.profilePhotoUrl
                : null,
            profile: profileObj,
          };
          await updateUserByAdminAPI(id, updatePayload);
        }

        showSnackbar("Astrologer details updated successfully!", "success");
        router.push("/admin/astrologers");
      } catch (error: any) {
        console.error("Error updating astrologer:", error);
        showSnackbar(
          error.response?.data?.message ||
          error.message ||
          "Failed to update astrologer details",
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    formik;

  // State Options
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry("IN") || [];
    return states.map((s) => s.name).sort((a, b) => a.localeCompare(b));
  }, []);

  // City Options based on selected State
  const cityOptions = useMemo(() => {
    if (!values.state) return [];
    const states = State.getStatesOfCountry("IN") || [];
    const selectedStateObj = states.find(
      (s) =>
        s?.name?.toLowerCase().trim() ===
        (values.state || "").toLowerCase().trim()
    );
    if (selectedStateObj && selectedStateObj.isoCode) {
      const cities =
        City.getCitiesOfState("IN", selectedStateObj.isoCode) || [];
      return Array.from(new Set(cities.map((c) => c.name))).sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return [];
  }, [values.state]);

  useEffect(() => {
    if (id) {
      loadAstrologerDetails();
    }
  }, [id]);

  const loadAstrologerDetails = async () => {
    try {
      setLoading(true);
      const res = await getPurohitByIdAPI(id);
      if (res.success || res.data) {
        let raw = res.data || res;
        if (
          raw &&
          typeof raw === "object" &&
          "data" in raw &&
          raw.data &&
          !raw.firstName
        ) {
          raw = raw.data;
        }
        const u = raw?.user || raw;
        if (u?.isAdminCreated || u?.is_admin_created || u?.isadmincreated) {
          showSnackbar("Admin created astrologers cannot be edited", "warning");
          router.push("/admin/astrologers");
          return;
        }
        const profile = u.astrologerProfile || u.profile || {};

        const parsedLangs = parseList(profile.languages);
        const parsedSpecs = parseList(profile.specializations);

        let qual = "";
        if (Array.isArray(profile.qualification)) {
          qual = cleanItem(profile.qualification[0] || "");
        } else if (profile.qualification) {
          qual = cleanItem(profile.qualification);
        }

        const combinedName = `${u.firstName || ""} ${u.lastName || ""}`.trim();

        const cleanUrl = (url?: string) => {
          if (!url || typeof url !== "string" || url.startsWith("blob:"))
            return "";
          return url;
        };

        const rate =
          profile.ratePerMinute !== undefined && profile.ratePerMinute !== null
            ? String(profile.ratePerMinute)
            : "";

        const commission =
          profile.commissionPrice !== undefined && profile.commissionPrice !== null
            ? String(profile.commissionPrice)
            : u.commissionPrice !== undefined && u.commissionPrice !== null
              ? String(u.commissionPrice)
              : "";

        formik.resetForm({
          values: {
            fullName: combinedName,
            email: u.email || "",
            phone: u.phone || "",
            countryCode: u.countryCode || "+91",
            dob: u.dob ? u.dob.split("T")[0] : "",
            commissionPrice: commission,
            ratePerMinute: rate,
            bio: profile.bio || "",
            qualification: qual,
            experienceYears:
              profile.experienceYears !== undefined &&
                profile.experienceYears !== null
                ? String(profile.experienceYears)
                : "",
            languages: parsedLangs,
            specializations: parsedSpecs,
            aadhaarNumber: profile.aadhaarNumber || "",
            city: profile.city || u.city || "",
            state: profile.state || "",
            profilePhotoUrl: cleanUrl(u.profileImage || profile.profileImage),
            identityDocUrl: cleanUrl(
              profile.aadhaarDocUrl ||
              profile.aadhaarDocDownloadUrl ||
              profile.panDocUrl
            ),
            certificateUrl: cleanUrl(
              profile.certificateUrl || profile.certificateDownloadUrl
            ),
          },
        });
      }
    } catch (error) {
      console.error("Error fetching astrologer details:", error);
      showSnackbar("Failed to load astrologer details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (
    key: keyof typeof selectedFiles,
    urlKey: string,
    file: File | null
  ) => {
    setSelectedFiles((prev) => ({ ...prev, [key]: file }));
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setFieldValue(urlKey, tempUrl);
    } else {
      setFieldValue(urlKey, "");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 6 }}>
      {/* Header & Breadcrumbs */}
      <Box>
        <AppBreadcrumbs
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Astrologers", href: "/admin/astrologers" },
            { label: `Edit Astrologer AST-${id}` },
          ]}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 1.5,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: FONTS.OUTFIT,
                fontWeight: 800,
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <EditIcon sx={{ color: COLORS.PRIMARY, fontSize: 32 }} />
              Edit Astrologer Profile
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontFamily: FONTS.OUTFIT, mt: 0.5 }}
            >
              Manage all registration details, consultation rate, and
              credentials for AST-{id}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Form Container */}
      <Paper
        component="form"
        onSubmit={formik.handleSubmit}
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* TOP: Admin Platform Commission Price Card */}
        <PlatformCommissionCard
          value={values.commissionPrice}
          error={errors.commissionPrice as string}
          touched={touched.commissionPrice}
          onChange={(val) => setFieldValue("commissionPrice", val)}
          onBlur={handleBlur}
          title="Platform Commission Price (₹)"
          subtitle="Set or modify the platform commission price charged for this astrologer."
        />

        {/* SECTION 1: Basic Details */}
        <BasicDetailsSection
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
        />

        <Divider />

        {/* SECTION 2: Astrologer Profile & Credentials */}
        <AstrologerProfileSection
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          handleBlur={handleBlur}
          setFieldValue={setFieldValue}
          stateOptions={stateOptions}
          cityOptions={cityOptions}
        />

        <Divider />

        {/* SECTION 3: Document Upload */}
        <VerificationDocsSection
          values={values}
          selectedFiles={selectedFiles}
          handleFileUpload={handleFileUpload}
          isAstrologer={true}
        />

        {/* Form Footer Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            pt: 2,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => router.push("/admin/astrologers")}
            sx={{
              borderRadius: "12px",
              px: 3,
              py: 1.2,
              textTransform: "none",
              color: "#64748b",
              borderColor: "#cbd5e1",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            onClick={() => {
              if (Object.keys(errors).length > 0) {
                const firstErrKey = Object.keys(errors)[0];
                const firstErrMsg = errors[firstErrKey as keyof typeof errors];
                showSnackbar(
                  `Validation error in ${firstErrKey}: ${firstErrMsg}`,
                  "error"
                );
              }
            }}
            startIcon={
              isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
            sx={{
              bgcolor: COLORS.PRIMARY,
              "&:hover": { bgcolor: "#e05600" },
              borderRadius: "12px",
              px: 4,
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(255, 98, 0, 0.3)",
            }}
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
