"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { City, State } from "country-state-city";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { getPurohitByIdAPI, updateUserByAdminAPI } from "@/api/userControllers";
import { convertImageToWebP } from "@/utils/imageHelper";

import { BasicDetailsSection } from "./BasicDetailsSection";
import { PurohitProfileSection } from "./PurohitProfileSection";
import { VerificationDocsSection } from "./VerificationDocsSection";
import { ServiceAreasSection } from "./ServiceAreasSection";
import { BankAccountsSection } from "./BankAccountsSection";

interface EditPurohitFormProps {
  id: string | number;
}

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full Name is required")
    .trim(),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Mobile Number is required").trim(),
  dob: Yup.mixed().required("Date of Birth is required"),
  bio: Yup.string().required("Bio is required"),
  qualification: Yup.string().required("Qualification is required"),
  experienceYears: Yup.number()
    .typeError("Experience Years must be a number")
    .min(0, "Experience must be at least 0 years")
    .max(99, "Experience cannot exceed 99 years")
    .required("Experience Years is required"),
  aadhaarNumber: Yup.string()
    .required("Aadhaar Number is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
});

export default function EditPurohitForm({ id }: EditPurohitFormProps) {
  const router = useRouter();
  const { showSnackbar } = useSnackbarStore();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rawPurohit, setRawPurohit] = useState<any>(null);

  const [bankAccountId, setBankAccountId] = useState<number | null>(null);
  const [upiAccountId, setUpiAccountId] = useState<number | null>(null);

  // Bank Accounts State
  const initialBankAccountsRef = useRef<string>("");
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  // Service Areas State
  const initialServiceAreasRef = useRef<string>("");
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);

  // Local state for file uploads
  const [selectedFiles, setSelectedFiles] = useState<{
    identityDoc: File | null;
    certificate: File | null;
    templeAffiliationProof: File | null;
    profilePhoto: File | null;
  }>({
    identityDoc: null,
    certificate: null,
    templeAffiliationProof: null,
    profilePhoto: null,
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      countryCode: "+91",
      dob: "",
      bio: "",
      qualification: "",
      experienceYears: "",
      languages: [] as string[],
      specializations: [] as string[],
      aadhaarNumber: "",
      isOnlineAvailable: true,
      isOfflineAvailable: true,
      profilePhotoUrl: "",
      identityDocUrl: "",
      certificateUrl: "",
      templeAffiliationProofUrl: "",
      city: "",
      state: "",
      paymentMethod: "BANK",
      upiId: "",
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const isFormikDirty = formik.dirty;
      const hasSelectedFiles = Boolean(
        selectedFiles.profilePhoto ||
          selectedFiles.identityDoc ||
          selectedFiles.certificate ||
          selectedFiles.templeAffiliationProof
      );
      const isServiceAreaModified =
        JSON.stringify(serviceAreas) !== initialServiceAreasRef.current;
      const isBankAccountsModified =
        JSON.stringify(bankAccounts) !== initialBankAccountsRef.current;

      if (
        !isFormikDirty &&
        !hasSelectedFiles &&
        !isServiceAreaModified &&
        !isBankAccountsModified
      ) {
        showSnackbar("No changes detected to save", "info");
        router.push("/admin/purohits");
        return;
      }

      setIsSubmitting(true);
      try {
        const nameParts = (values.fullName || "").trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const isBank = values.paymentMethod === "BANK";
        const selectedPaymentObject = isBank
          ? {
              ...(bankAccountId ? { id: bankAccountId } : {}),
              paymentMethod: "BANK",
              accountHolderName: values.accountHolderName,
              accountNumber: values.accountNumber,
              ifscCode: values.ifscCode,
              bankName: values.bankName,
              isPrimary: true,
            }
          : {
              ...(upiAccountId ? { id: upiAccountId } : {}),
              paymentMethod: "UPI",
              upiId: values.upiId,
              isPrimary: true,
            };

        const formattedServiceAreas = serviceAreas.map((sa) => {
          const areaId = sa.id ?? sa._id;
          return {
            ...(areaId &&
            (typeof areaId === "string" ||
              (typeof areaId === "number" && areaId < 1000000000000))
              ? { id: areaId }
              : {}),
            addressLabel: sa.addressLabel || "Primary Service Area",
            streetName: sa.streetName || sa.addressLabel || "Main Area",
            fullAddress:
              sa.fullAddress ||
              [sa.streetName, sa.city, sa.state, sa.pincode]
                .filter(Boolean)
                .join(", "),
            city: sa.city || values.city,
            state: sa.state || values.state,
            pincode: sa.pincode,
            latitude: sa.latitude ? String(sa.latitude) : undefined,
            longitude: sa.longitude ? String(sa.longitude) : undefined,
            serviceRadiusKm: sa.serviceRadiusKm
              ? String(sa.serviceRadiusKm)
              : "15.00",
            isDefault: sa.isDefault || false,
          };
        });

        const formattedBankAccounts =
          bankAccounts.length > 0 ? bankAccounts : [selectedPaymentObject];

        const updatePayload: any = {
          firstName,
          lastName,
          email: values.email,
          phone: values.phone,
          countryCode: values.countryCode || "+91",
          dob: values.dob,
          ...(values.profilePhotoUrl && !values.profilePhotoUrl.startsWith("blob:")
            ? { profileImage: values.profilePhotoUrl }
            : {}),
          profile: {
            bio: values.bio,
            qualification: values.qualification ? [values.qualification] : [],
            experienceYears: Number(values.experienceYears || 0),
            languages: Array.isArray(values.languages)
              ? values.languages.join(",")
              : values.languages,
            specializations: Array.isArray(values.specializations)
              ? values.specializations.join(",")
              : values.specializations,
            aadhaarNumber: values.aadhaarNumber,
            city: values.city,
            state: values.state,
            isOnlineAvailable: values.isOnlineAvailable,
            isOfflineAvailable: values.isOfflineAvailable,
            ...(values.identityDocUrl && !values.identityDocUrl.startsWith("blob:")
              ? { aadhaarDocUrl: values.identityDocUrl }
              : {}),
            ...(values.certificateUrl && !values.certificateUrl.startsWith("blob:")
              ? { certificateUrl: values.certificateUrl }
              : {}),
            ...(values.templeAffiliationProofUrl && !values.templeAffiliationProofUrl.startsWith("blob:")
              ? { templeAffiliationProofUrl: values.templeAffiliationProofUrl }
              : {}),
          },
          serviceAreas: formattedServiceAreas,
          bankAccounts: formattedBankAccounts,
        };

        const hasSelectedFiles = Boolean(
          selectedFiles.profilePhoto ||
            selectedFiles.identityDoc ||
            selectedFiles.certificate ||
            selectedFiles.templeAffiliationProof
        );

        if (hasSelectedFiles) {
          const fd = new FormData();
          fd.append("firstName", firstName);
          fd.append("lastName", lastName);
          if (values.email) fd.append("email", values.email);
          if (values.phone) fd.append("phone", values.phone);
          if (values.countryCode) fd.append("countryCode", values.countryCode || "+91");
          if (values.dob) fd.append("dob", values.dob);

          const profileObj = {
            bio: values.bio,
            qualification: values.qualification ? [values.qualification] : [],
            experienceYears: Number(values.experienceYears || 0),
            languages: Array.isArray(values.languages)
              ? values.languages.join(",")
              : values.languages,
            specializations: Array.isArray(values.specializations)
              ? values.specializations.join(",")
              : values.specializations,
            aadhaarNumber: values.aadhaarNumber,
            city: values.city,
            state: values.state,
            isOnlineAvailable: values.isOnlineAvailable,
            isOfflineAvailable: values.isOfflineAvailable,
          };

          fd.append("profile", JSON.stringify(profileObj));
          fd.append("serviceAreas", JSON.stringify(formattedServiceAreas));
          fd.append("bankAccounts", JSON.stringify(formattedBankAccounts));

          // Scalar fields for backend compatibility
          fd.append("bio", values.bio);
          if (values.qualification) fd.append("qualification", values.qualification);
          fd.append("experienceYears", String(values.experienceYears || 0));
          if (values.languages) {
            fd.append(
              "languages",
              Array.isArray(values.languages) ? values.languages.join(",") : values.languages
            );
          }
          if (values.specializations) {
            fd.append(
              "specializations",
              Array.isArray(values.specializations) ? values.specializations.join(",") : values.specializations
            );
          }
          if (values.aadhaarNumber) fd.append("aadhaarNumber", values.aadhaarNumber);
          if (values.city) fd.append("city", values.city);
          if (values.state) fd.append("state", values.state);
          fd.append("isOnlineAvailable", values.isOnlineAvailable ? "true" : "false");
          fd.append("isOfflineAvailable", values.isOfflineAvailable ? "true" : "false");

          if (selectedFiles.profilePhoto) {
            const webpFile = await convertImageToWebP(selectedFiles.profilePhoto);
            fd.append("profileImage", webpFile);
          }
          if (selectedFiles.identityDoc) {
            const webpFile = await convertImageToWebP(selectedFiles.identityDoc);
            fd.append("aadhaarDoc", webpFile);
          }
          if (selectedFiles.certificate) {
            const webpFile = await convertImageToWebP(selectedFiles.certificate);
            fd.append("certificate", webpFile);
          }
          if (selectedFiles.templeAffiliationProof) {
            const webpFile = await convertImageToWebP(selectedFiles.templeAffiliationProof);
            fd.append("templeAffiliationProof", webpFile);
          }

          await updateUserByAdminAPI(id, fd);
        } else {
          await updateUserByAdminAPI(id, updatePayload);
        }

        showSnackbar("Purohit details updated successfully!", "success");
        router.push("/admin/purohits");
      } catch (error: any) {
        console.error("Error updating purohit:", error);
        showSnackbar(
          error.response?.data?.message || "Error updating purohit details",
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    formik;

  // Indian States from country-state-city
  const stateOptions = useMemo(() => {
    const states = State.getStatesOfCountry("IN") || [];
    return states.map((s) => s.name);
  }, []);

  // Filter cities dynamically based on selected state
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
      fetchPurohitData(id);
    }
  }, [id]);

  const fetchPurohitData = async (purohitId: string | number) => {
    try {
      setLoading(true);
      const res = await getPurohitByIdAPI(purohitId);
      if (res.success && res.data) {
        const wrapper = res.data.data || res.data;
        const u = wrapper.user || wrapper;
        const profile = u.profile || u.purohitProfile || {};
        const areas =
          u.serviceAreas ||
          wrapper.serviceAreas ||
          res.data.serviceAreas ||
          [];
        const bankAccountsList =
          u.bankAccounts ||
          wrapper.bankAccounts ||
          res.data.bankAccounts ||
          [];
        const bankAcc =
          bankAccountsList.find(
            (b: any) => b.paymentMethod === "BANK" || b.accountNumber
          ) ||
          bankAccountsList[0] ||
          {};
        const upiAcc =
          bankAccountsList.find(
            (b: any) => b.paymentMethod === "UPI" || b.upiId
          ) ||
          bankAccountsList[0] ||
          {};
        const primaryAcc =
          bankAccountsList.find((b: any) => b.isPrimary) ||
          bankAccountsList[0] ||
          {};

        setBankAccountId(bankAcc && bankAcc.id ? bankAcc.id : null);
        setUpiAccountId(upiAcc && upiAcc.id ? upiAcc.id : null);

        setRawPurohit(u);
        setServiceAreas(areas);
        setBankAccounts(bankAccountsList);

        // Process languages string or array
        let parsedLangs: string[] = [];
        if (Array.isArray(profile.languages)) {
          parsedLangs = profile.languages;
        } else if (typeof profile.languages === "string") {
          parsedLangs = profile.languages
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        // Process specializations string or array
        let parsedSpecs: string[] = [];
        if (Array.isArray(profile.specializations)) {
          parsedSpecs = profile.specializations;
        } else if (typeof profile.specializations === "string") {
          parsedSpecs = profile.specializations
            .split(",")
            .map((s: string) => s.trim())
            .filter(Boolean);
        }

        // Process qualification
        let qual = "";
        if (Array.isArray(profile.qualification)) {
          qual = profile.qualification[0] || "";
        } else if (profile.qualification) {
          qual = String(profile.qualification);
        }

        const combinedName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
        initialServiceAreasRef.current = JSON.stringify(areas);
        initialBankAccountsRef.current = JSON.stringify(bankAccountsList);

        const cleanUrl = (url?: string) => {
          if (!url || typeof url !== "string" || url.startsWith("blob:")) return "";
          return url;
        };

        formik.resetForm({
          values: {
            fullName: combinedName,
            email: u.email || "",
            phone: u.phone || "",
            countryCode: u.countryCode || "+91",
            dob: u.dob ? u.dob.split("T")[0] : "",
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
            isOnlineAvailable: profile.isOnlineAvailable ?? true,
            isOfflineAvailable: profile.isOfflineAvailable ?? true,
            profilePhotoUrl: cleanUrl(u.profileImage || profile.profileImage),
            identityDocUrl: cleanUrl(
              profile.aadhaarDocUrl ||
                profile.aadhaarDocDownloadUrl ||
                profile.panDocUrl
            ),
            certificateUrl: cleanUrl(
              profile.certificateUrl || profile.certificateDownloadUrl
            ),
            templeAffiliationProofUrl: cleanUrl(
              profile.templeAffiliationProofUrl ||
                profile.templeAffiliationProofDownloadUrl
            ),
            city: profile.city || u.city || (areas[0] && areas[0].city) || "",
            state: profile.state || (areas[0] && areas[0].state) || "",
            paymentMethod: primaryAcc.paymentMethod || "BANK",
            upiId: upiAcc.upiId || bankAcc.upiId || "",
            bankName: bankAcc.bankName || "",
            accountHolderName: bankAcc.accountHolderName || "",
            accountNumber: bankAcc.accountNumber || "",
            ifscCode: bankAcc.ifscCode || "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching purohit details:", error);
      showSnackbar("Failed to load purohit details", "error");
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
        <CircularProgress sx={{ color: "#FF6200" }} />
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
            { label: "Purohits", href: "/admin/purohits" },
            { label: `Edit Purohit (P-${id})` },
          ]}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1 }}>
          <EditIcon sx={{ color: "#FF6200", fontSize: 32 }} />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 800,
                color: "#1e293b",
              }}
            >
              Edit Purohit Profile
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-outfit), sans-serif",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Manage all registration details, credentials, and service areas for P-{id}
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

        {/* SECTION 2: Purohit Profile & Credentials */}
        <PurohitProfileSection
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
        />

        <Divider />

        {/* SECTION 4: Service Areas */}
        <ServiceAreasSection
          purohitId={id}
          serviceAreas={serviceAreas}
          setServiceAreas={setServiceAreas}
          defaultCity={values.city}
          defaultState={values.state}
        />

        <Divider />

        {/* SECTION 5: Bank Details & Payout Info */}
        <BankAccountsSection
          purohitId={id}
          bankAccounts={bankAccounts}
          setBankAccounts={setBankAccounts}
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
            onClick={() => router.push("/admin/purohits")}
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
                showSnackbar(`Validation error in ${firstErrKey}: ${firstErrMsg}`, "error");
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
              bgcolor: "#FF6200",
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
