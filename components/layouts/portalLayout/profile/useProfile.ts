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
  const [languages, setLanguages] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [isOnlineAvailable, setIsOnlineAvailable] = useState(true);
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);

  // --- Service Areas State ---
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [addressForm, setAddressForm] = useState({
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
      if (profile.profile) {
        const p = profile.profile;
        setBio(p.bio || "");
        setCity(p.city || "");

        const rawLangs = p.languages;
        const parsedLangs = Array.isArray(rawLangs)
          ? rawLangs.map((l: any) => String(l).trim()).filter(Boolean)
          : typeof rawLangs === "string"
          ? rawLangs.split(",").map((l: string) => l.trim()).filter(Boolean)
          : [];
        setLanguages(parsedLangs);

        const rawSpecs = p.specializations || p.specialization;
        const parsedSpecs = Array.isArray(rawSpecs)
          ? rawSpecs.map((s: any) => String(s).trim()).filter(Boolean)
          : typeof rawSpecs === "string"
          ? rawSpecs.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [];
        setSpecializations(parsedSpecs);

        setQualification(p.qualification || "");
        setExperienceYears(p.experienceYears ? p.experienceYears.toString() : "");
        setIsOnlineAvailable(p.isOnlineAvailable ?? true);
        setIsOfflineAvailable(p.isOfflineAvailable ?? false);
      }
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
      formData.append("birthPlace", birthPlace);
      formData.append("bio", bio);
      formData.append("city", city);
      formData.append("languages", languages.join(","));
      formData.append("specializations", specializations.join(","));
      formData.append("qualification", qualification);
      formData.append("experienceYears", experienceYears);

      formData.append("isOnlineAvailable", isOnlineAvailable ? "true" : "false");
      formData.append("isOfflineAvailable", isOfflineAvailable ? "true" : "false");

      if (profileImage) formData.append("profileImage", profileImage);

      await updateProfileAPI(formData);
      showSnackbar("Profile updated successfully!", "success");

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

  const handleSaveAddress = async () => {
    const missing = [];
    if (!addressForm.addressLabel?.trim()) missing.push("Address Label");
    if (!addressForm.fullAddress?.trim()) missing.push("Full Address");
    if (!addressForm.city?.trim()) missing.push("City");
    if (!addressForm.state?.trim()) missing.push("State");
    if (!addressForm.pincode?.trim()) missing.push("Pincode");

    if (missing.length > 0) {
      showSnackbar(`Please fill in required fields: ${missing.join(", ")}`, "error");
      return;
    }

    setSavingAddress(true);
    try {
      const payload = { ...addressForm };
      if (!payload.latitude) delete (payload as any).latitude;
      if (!payload.longitude) delete (payload as any).longitude;

      if (selectedAddressId) {
        const res = await updateServiceAreaAPI(selectedAddressId, payload);
        if (res.success) {
          showSnackbar("Service area updated successfully", "success");
          const updatedArea = res.data?.data || res.data;
          setServiceAreas(serviceAreas.map((a) => (a.id === selectedAddressId ? updatedArea : a)));
          setAddressModalOpen(false);
          setSelectedAddressId(null);
          setAddressForm({
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
      addressLabel: area.addressLabel || "",
      streetName: area.streetName || "",
      fullAddress: area.fullAddress || "",
      city: area.city || "",
      state: area.state || "",
      pincode: area.pincode || "",
      isDefault: area.isDefault || false,
      latitude: area.latitude || "",
      longitude: area.longitude || "",
      serviceRadiusKm: area.serviceRadiusKm || 10,
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
    } catch (error) {
      console.error(error);
      showSnackbar(`Failed to ${selectedBankId ? "update" : "add"} bank account.`, "error");
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
    languages, setLanguages,
    specializations, setSpecializations,
    qualification, setQualification,
    experienceYears, setExperienceYears,
    isOnlineAvailable, setIsOnlineAvailable,
    isOfflineAvailable, setIsOfflineAvailable,
    profileImage, setProfileImage,
    profileImageUrl,

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
