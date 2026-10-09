"use client";

import { useEffect, useState } from "react";
import {
  addBankAccountAPI,
  addServiceAreaAPI,
  deleteBankAccountAPI,
  deleteServiceAreaAPI,
  updateBankAccountAPI,
  updateProfileAPI,
  updateServiceAreaAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useUserStore } from "@/stores/userStore";
import { convertImageToWebP } from "@/utils/imageHelper";
import { validateBankForm, extractBackendErrorMessage } from "@/utils/helpers";

export function useProfile() {
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { profile, fetchProfile } = useUserStore();

  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("profileActiveTab") || "personal";
    }
    return "personal";
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- Form State ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(true);
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);

  // --- Documents & Registration Info State ---
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarDoc, setAadhaarDoc] = useState<File | null>(null);
  const [aadhaarDocUrl, setAadhaarDocUrl] = useState<string | null>(null);
  const [panDoc, setPanDoc] = useState<File | null>(null);
  const [panDocUrl, setPanDocUrl] = useState<string | null>(null);
  const [certificateDoc, setCertificateDoc] = useState<File | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [templeAffiliationProofDoc, setTempleAffiliationProofDoc] = useState<File | null>(null);
  const [templeAffiliationProofUrl, setTempleAffiliationProofUrl] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  // --- Service Areas State ---
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [addressForm, setAddressForm] = useState<{
    id?: number | null;
    addressLabel: string;
    streetName: string;
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
    latitude: string;
    longitude: string;
    serviceRadiusKm: number;
  }>({
    id: null,
    addressLabel: "",
    streetName: "",
    fullAddress: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
    latitude: "",
    longitude: "",
    serviceRadiusKm: 10,
  });
  const [savingAddress, setSavingAddress] = useState(false);

  // --- Bank Accounts State ---
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [bankDeleteConfirmOpen, setBankDeleteConfirmOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<number | null>(null);
  const [bankForm, setBankForm] = useState({
    paymentMethod: "BANK",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    accountType: "SAVINGS",
    upiId: "",
    isPrimary: false,
  });
  const [savingBank, setSavingBank] = useState(false);

  // Files
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile().finally(() => setLoading(false));
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      const p = profile.profile || profile;
      setBio(p.bio || profile.bio || "");
      setCity(p.city || profile.city || "");
      setState(p.state || profile.state || "");

      const rawLangs = p.languages || profile.languages;
      const parsedLangs = Array.isArray(rawLangs)
        ? rawLangs.map((l: any) => String(l).trim()).filter(Boolean)
        : typeof rawLangs === "string"
        ? rawLangs.split(",").map((l: string) => l.trim()).filter(Boolean)
        : [];
      setLanguages(parsedLangs);

      const rawSpecs = p.specializations || p.specialization || profile.specializations;
      const parsedSpecs = Array.isArray(rawSpecs)
        ? rawSpecs.map((s: any) => String(s).trim()).filter(Boolean)
        : typeof rawSpecs === "string"
        ? rawSpecs.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
      setSpecializations(parsedSpecs);

      setQualification(p.qualification || profile.qualification || "");
      setExperienceYears((p.experienceYears || profile.experienceYears) ? (p.experienceYears || profile.experienceYears).toString() : "");
      setIsOnlineAvailable(p.isOnlineAvailable ?? profile.isOnlineAvailable ?? true);
      setIsOfflineAvailable(p.isOfflineAvailable ?? profile.isOfflineAvailable ?? false);

      setAadhaarNumber(p.aadhaarNumber || profile.aadhaarNumber || "");
      setAadhaarDocUrl(p.aadhaarDocUrl || profile.aadhaarDocUrl || null);
      setPanDocUrl(p.panDocUrl || profile.panDocUrl || null);
      setCertificateUrl(p.certificateUrl || profile.certificateUrl || null);
      setTempleAffiliationProofUrl(p.templeAffiliationProofUrl || profile.templeAffiliationProofUrl || null);
      setVerificationStatus(p.verificationStatus || profile.verificationStatus || null);
      setRejectionReason(p.rejectionReason || profile.rejectionReason || null);

      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setUsername(profile.username || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");

      let formattedDob = "";
      if (profile.dob) {
        try {
          const d = new Date(profile.dob);
          if (!isNaN(d.getTime())) {
            formattedDob = d.toISOString().split("T")[0];
          }
        } catch (e) {
          formattedDob = "";
        }
      }
      setDob(formattedDob);
      setBirthPlace(profile.birthPlace || "");
      setProfileImageUrl(profile.profileImage || null);
      setServiceAreas(profile.serviceAreas || []);
      setBankAccounts(profile.bankAccounts || []);
    }
  }, [profile]);

  const handleLanguageChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setLanguages(typeof value === "string" ? value.split(",") : value);
  };

  const handleRitualsChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setSpecializations(typeof value === "string" ? value.split(",") : value);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      if (dob) formData.append("dob", new Date(dob).toISOString());
      formData.append("bio", bio);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("languages", languages.join(","));
      formData.append("specializations", specializations.join(","));
      formData.append("qualification", qualification);
      formData.append("experienceYears", experienceYears);
      formData.append("aadhaarNumber", aadhaarNumber);

      formData.append("isOnlineAvailable", isOnlineAvailable ? "true" : "false");
      formData.append("isOfflineAvailable", isOfflineAvailable ? "true" : "false");

      if (profileImage) {
        const webpImage = await convertImageToWebP(profileImage);
        formData.append("profileImage", webpImage);
      }
      if (aadhaarDoc) {
        const webpAadhaar = await convertImageToWebP(aadhaarDoc);
        formData.append("aadhaarDoc", webpAadhaar);
      }
      if (panDoc) {
        const webpPan = await convertImageToWebP(panDoc);
        formData.append("panDoc", webpPan);
      }
      if (certificateDoc) {
        const webpCert = await convertImageToWebP(certificateDoc);
        formData.append("certificate", webpCert);
      }
      if (templeAffiliationProofDoc) {
        const webpProof = await convertImageToWebP(templeAffiliationProofDoc);
        formData.append("templeAffiliationProof", webpProof);
      }

      await updateProfileAPI(formData);
      showSnackbar("Profile updated successfully!", "success");

      setAadhaarDoc(null);
      setPanDoc(null);
      setCertificateDoc(null);
      setTempleAffiliationProofDoc(null);

      setLoading(true);
      await fetchProfile(true);
      setLoading(false);
      setSaving(false);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to update profile.", "error");
      setSaving(false);
    }
  };

  const handleSaveAddress = async (overrideData?: any) => {
    const targetData = overrideData || addressForm;
    const missing = [];
    if (!targetData.addressLabel?.trim()) missing.push("Address Label");
    if (!targetData.fullAddress?.trim()) missing.push("Full Address");
    if (!targetData.city?.trim()) missing.push("City");
    if (!targetData.state?.trim()) missing.push("State");
    if (!targetData.pincode?.trim()) missing.push("Pincode");

    const finalStreetName =
      targetData.streetName?.trim() ||
      targetData.addressLabel?.trim() ||
      targetData.fullAddress?.split(",")[0]?.trim() ||
      "Main Area";

    if (finalStreetName.length < 2) {
      missing.push("Street Name / Area");
    }

    if (missing.length > 0) {
      showSnackbar(`Please fill in required fields: ${missing.join(", ")}`, "error");
      return;
    }

    setSavingAddress(true);
    try {
      const payload: any = {
        ...targetData,
        streetName: finalStreetName,
      };
      if (!payload.latitude || payload.latitude === "0" || String(payload.latitude).trim() === "") delete (payload as any).latitude;
      if (!payload.longitude || payload.longitude === "0" || String(payload.longitude).trim() === "") delete (payload as any).longitude;

      if (selectedAddressId) {
        const res = await updateServiceAreaAPI(selectedAddressId, payload);
        if (res.success) {
          showSnackbar("Service area updated successfully", "success");
          const updatedArea = res.data?.data || res.data;
          setServiceAreas(serviceAreas.map((a) => (a.id === selectedAddressId ? updatedArea : a)));
          setAddressModalOpen(false);
          setSelectedAddressId(null);
          setAddressForm({
            id: null,
            addressLabel: "",
            streetName: "",
            fullAddress: "",
            city: "",
            state: "",
            pincode: "",
            isDefault: false,
            latitude: "",
            longitude: "",
            serviceRadiusKm: 10,
          });
        }
      } else {
        const res = await addServiceAreaAPI(payload);
        if (res.success) {
          showSnackbar("Service area added successfully", "success");
          const newArea = res.data?.data || res.data;
          setServiceAreas([...serviceAreas, newArea]);
          setAddressModalOpen(false);
          setAddressForm({
            id: null,
            addressLabel: "",
            streetName: "",
            fullAddress: "",
            city: "",
            state: "",
            pincode: "",
            isDefault: false,
            latitude: "",
            longitude: "",
            serviceRadiusKm: 10,
          });
        }
      }
    } catch (error) {
      console.error(error);
      showSnackbar(`Failed to ${selectedAddressId ? "update" : "add"} service area.`, "error");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditClick = (area: any) => {
    setSelectedAddressId(area.id);
    setAddressForm({
      id: area.id,
      addressLabel: area.addressLabel || "",
      streetName: area.streetName || "",
      fullAddress: area.fullAddress || "",
      city: area.city || "",
      state: area.state || "",
      pincode: area.pincode || "",
      isDefault: area.isDefault || false,
      latitude: area.latitude || "",
      longitude: area.longitude || "",
      serviceRadiusKm: Number(area.serviceRadiusKm) || 10,
    });
    setAddressModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setAddressToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      const res = await deleteServiceAreaAPI(addressToDelete);
      if (res.success) {
        showSnackbar("Service area deleted successfully", "success");
        setServiceAreas(serviceAreas.filter((a) => a.id !== addressToDelete));
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to delete service area.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setAddressToDelete(null);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      showSnackbar("Geolocation is not supported by your browser", "error");
      return;
    }
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toString();
        const lng = position.coords.longitude.toString();

        let addressUpdates: any = { latitude: lat, longitude: lng };

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.state_district ||
                "";
              const state = data.address.state || "";
              const pincode = data.address.postcode || "";
              const streetName = data.address.road || data.address.suburb || "";
              const fullAddress = data.display_name || "";

              addressUpdates = {
                ...addressUpdates,
                city,
                state,
                pincode,
                streetName,
                fullAddress,
              };
            }
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        }

        setAddressForm((prev) => ({
          ...prev,
          ...addressUpdates,
        }));

        showSnackbar("Location data fetched successfully!", "success");
        setIsFetchingLocation(false);
      },
      (error) => {
        console.error(error);
        showSnackbar("Failed to fetch location. Please allow location access.", "error");
        setIsFetchingLocation(false);
      },
    );
  };

  const handleSaveBank = async () => {
    const err = validateBankForm(bankForm);
    if (err) {
      showSnackbar(err, "error");
      return;
    }
    setSavingBank(true);
    try {
      if (selectedBankId) {
        const res = await updateBankAccountAPI(selectedBankId, bankForm);
        if (res.success) {
          showSnackbar("Bank account updated successfully", "success");
          setLoading(true);
          await fetchProfile(true);
          setLoading(false);
          setBankModalOpen(false);
          setSelectedBankId(null);
          setBankForm({
            paymentMethod: "BANK",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            accountType: "SAVINGS",
            upiId: "",
            isPrimary: false,
          });
        }
      } else {
        const res = await addBankAccountAPI(bankForm);
        if (res.success) {
          showSnackbar("Bank account added successfully", "success");
          setLoading(true);
          await fetchProfile(true);
          setLoading(false);
          setBankModalOpen(false);
          setBankForm({
            paymentMethod: "BANK",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
            bankName: "",
            accountType: "SAVINGS",
            upiId: "",
            isPrimary: false,
          });
        }
      }
    } catch (error: any) {
      console.error(error);
      showSnackbar(extractBackendErrorMessage(error, `Failed to ${selectedBankId ? "update" : "add"} bank account.`), "error");
    } finally {
      setSavingBank(false);
    }
  };

  const handleEditBankClick = (bank: any) => {
    setSelectedBankId(bank.id);
    setBankForm({
      paymentMethod: bank.paymentMethod || "BANK",
      accountHolderName: bank.accountHolderName || "",
      accountNumber: bank.accountNumber || "",
      ifscCode: bank.ifscCode || "",
      bankName: bank.bankName || "",
      accountType: bank.accountType || "SAVINGS",
      upiId: bank.upiId || "",
      isPrimary: bank.isPrimary || false,
    });
    setBankModalOpen(true);
  };

  const handleDeleteBankClick = (id: number) => {
    setBankToDelete(id);
    setBankDeleteConfirmOpen(true);
  };

  const confirmBankDelete = async () => {
    if (!bankToDelete) return;
    try {
      const res = await deleteBankAccountAPI(bankToDelete);
      if (res.success) {
        showSnackbar("Bank account deleted successfully", "success");
        setBankAccounts(bankAccounts.filter((b) => b.id !== bankToDelete));
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to delete bank account.", "error");
    } finally {
      setBankDeleteConfirmOpen(false);
      setBankToDelete(null);
    }
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    saving,

    // Personal info
    firstName, setFirstName,
    lastName, setLastName,
    username, setUsername,
    email, setEmail,
    phone, setPhone,
    dob, setDob,
    birthPlace, setBirthPlace,
    bio, setBio,
    city, setCity,
    state, setState,
    languages, setLanguages,
    specializations, setSpecializations,
    qualification, setQualification,
    experienceYears, setExperienceYears,
    isOnlineAvailable, setIsOnlineAvailable,
    isOfflineAvailable, setIsOfflineAvailable,
    profileImage, setProfileImage,
    profileImageUrl,

    // Documents & Registration
    aadhaarNumber, setAadhaarNumber,
    aadhaarDoc, setAadhaarDoc,
    aadhaarDocUrl,
    panDoc, setPanDoc,
    panDocUrl,
    certificateDoc, setCertificateDoc,
    certificateUrl,
    templeAffiliationProofDoc, setTempleAffiliationProofDoc,
    templeAffiliationProofUrl,
    verificationStatus,
    rejectionReason,

    // Service Areas
    serviceAreas,
    addressModalOpen, setAddressModalOpen,
    selectedAddressId, setSelectedAddressId,
    deleteConfirmOpen, setDeleteConfirmOpen,
    isFetchingLocation,
    addressForm, setAddressForm,
    savingAddress,

    // Bank Accounts
    bankAccounts,
    bankModalOpen, setBankModalOpen,
    selectedBankId, setSelectedBankId,
    bankDeleteConfirmOpen, setBankDeleteConfirmOpen,
    bankForm, setBankForm,
    savingBank,

    // Handlers
    handleLanguageChange,
    handleRitualsChange,
    handleSaveProfile,
    handleSaveAddress,
    handleEditClick,
    handleDeleteClick,
    confirmDelete,
    fetchCurrentLocation,
    handleSaveBank,
    handleEditBankClick,
    handleDeleteBankClick,
    confirmBankDelete,
  };
}
