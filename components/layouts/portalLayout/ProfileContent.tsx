"use client";
import { FONTS } from "@/utils/fonts";
import { COLORS, USER_ROLE } from "@/utils/enums";
import { useUserStore } from "@/stores/userStore";
import AppBreadcrumbs from "@/components/widgets/AppBreadcrumbs";

import React from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AddressModal } from "./profile/AddressModal";
import { BankDetailsTab } from "./profile/BankDetailsTab";
import { BankModal } from "./profile/BankModal";
import { DocumentsTab } from "./profile/DocumentsTab";
import { PersonalInfoTab } from "./profile/PersonalInfoTab";
import { ServiceAreaTab } from "./profile/ServiceAreaTab";
import { SkillsTab } from "./profile/SkillsTab";
import { useProfile } from "./profile/useProfile";

const AVAILABLE_LANGUAGES = [
  "Hindi",
  "English",
  "Sanskrit",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Bengali",
];
const AVAILABLE_RITUALS = [
  "Astrology",
  "Satyanarayan Katha",
  "Grah Pravesh",
  "Marriage Ceremony",
  "Vastu Shanti",
  "Navagraha Shanti",
  "Maha Mrityunjaya Jaap",
  "Rudrabhishek",
];

const AVAILABLE_ASTROLOGY_SPECIALIZATIONS = [
  "Vedic Astrology",
  "Kundali Matching",
  "Palmistry",
  "Numerology",
  "Vastu Shastra",
  "Tarot Reading",
  "Prashna Kundali",
  "Face Reading",
  "KP Astrology",
  "Gemology",
  "Pooja Anushthan",
  "Karmakand",
];

const TABS = [
  {
    id: "personal",
    label: "Personal Info",
    icon: <PersonIcon sx={{ fontSize: 20 }} />,
  },
  { id: "skills", label: "Skills", icon: <WorkIcon sx={{ fontSize: 20 }} /> },
  {
    id: "documents",
    label: "Documents",
    icon: <DescriptionIcon sx={{ fontSize: 20 }} />,
  },
  {
    id: "location",
    label: "Service Area",
    icon: <LocationOnIcon sx={{ fontSize: 20 }} />,
  },
  {
    id: "bank",
    label: "Bank Details",
    icon: <AccountBalanceIcon sx={{ fontSize: 20 }} />,
  },
];

const maxDobDate = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 20);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
})();

export default function ProfileContent() {
  const router = useRouter();
  const p = useProfile();
  const { profile: userProfile } = useUserStore();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isAstrologer =
    (p as any)?.role === USER_ROLE.ASTROLOGER ||
    p.isAstrologer ||
    userProfile?.role === USER_ROLE.ASTROLOGER ||
    userProfile?.user?.role === USER_ROLE.ASTROLOGER ||
    (mounted &&
      (sessionStorage.getItem("role") === USER_ROLE.ASTROLOGER ||
        (() => {
          try {
            return JSON.parse(sessionStorage.getItem("user") || "{}")?.role === USER_ROLE.ASTROLOGER;
          } catch (e) {
            return false;
          }
        })()));

  const isRejected =
    p.verificationStatus === "REJECTED" ||
    (p.rejectionReason !== null && p.rejectionReason !== "");

  const canAccessDocuments =
    isRejected ||
    Boolean(p.isAdminCreated) ||
    p.verificationStatus !== "APPROVED";

  const visibleTabs = TABS.filter((tab) => {
    if (isAstrologer && tab.id === "location") {
      return false;
    }
    if (tab.id === "documents") {
      return canAccessDocuments;
    }
    return true;
  }).map((tab) => {
    if (tab.id === "skills" && isAstrologer) {
      return { ...tab, label: "Astrology Details" };
    }
    return tab;
  });

  React.useEffect(() => {
    if (isAstrologer && p.activeTab === "location") {
      p.setActiveTab("personal");
    } else if (!canAccessDocuments && p.activeTab === "documents") {
      p.setActiveTab("personal");
    }
  }, [isAstrologer, canAccessDocuments, p]);

  if (p.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: COLORS.PRIMARY }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <AppBreadcrumbs
          items={[
            {
              label: isAstrologer ? "Astrology Bookings" : "Dashboard",
              href: isAstrologer ? "/partner/astrologybookings" : "/partner/dashboard",
            },
            { label: "Profile", href: "/partner/profile" },
            { label: "Profile & Settings" },
          ]}
        />
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: FONTS.OUTFIT,
              fontWeight: 800,
              color: "#1e293b",
            }}
          >
            My Profile & Settings
          </Typography>
          <Typography
            sx={{
              fontFamily: FONTS.OUTFIT,
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Manage your personal details, skills, service locations and payout accounts.
          </Typography>
        </Box>
      </Box>

      {p.isAdminCreated && p.verificationStatus !== "APPROVED" && !isRejected && (
        <Alert
          severity="warning"
          sx={{
            borderRadius: "14px",
            border: "1px solid #FFE082",
            bgcolor: "#FFF8E1",
            "& .MuiAlert-icon": { color: "#E65100" },
          }}
        >
          <Typography sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700, color: "#E65100", fontSize: "15px" }}>
            Profile Incomplete — Action Required
          </Typography>
          <Typography sx={{ fontFamily: FONTS.OUTFIT, color: "#5D4037", fontSize: "13.5px", mt: 0.5 }}>
            Your account was created by Admin with your basic details prefilled. Please review and complete your professional skills, {isAstrologer ? "astrology specializations, consultation rate" : "rituals, service areas, bank account"}, and upload your identity verification documents to submit your profile for admin verification.
          </Typography>
        </Alert>
      )}

      <Paper
        sx={{
          borderRadius: "16px",
          border: "1px solid #eee",
          boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "#FAFAFA" }}
        >
          <Tabs
            value={p.activeTab}
            onChange={(_, val) => {
              p.setActiveTab(val);
              sessionStorage.setItem("profileActiveTab", val);
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              "& .MuiTab-root": {
                fontFamily: FONTS.OUTFIT,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "15px",
                py: 2,
                minHeight: 56,
              },
              "& .Mui-selected": { color: COLORS.PRIMARY },
              "& .MuiTabs-indicator": { backgroundColor: COLORS.PRIMARY },
            }}
          >
            {visibleTabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2.5, md: 4 } }}>
          {p.activeTab === "personal" && (
            <PersonalInfoTab
              firstName={p.firstName}
              setFirstName={p.setFirstName}
              lastName={p.lastName}
              setLastName={p.setLastName}
              username={p.username}
              setUsername={p.setUsername}
              email={p.email}
              setEmail={p.setEmail}
              phone={p.phone}
              setPhone={p.setPhone}
              dob={p.dob}
              setDob={p.setDob}
              birthPlace={p.birthPlace}
              setBirthPlace={p.setBirthPlace}
              bio={p.bio}
              setBio={p.setBio}
              profileImage={p.profileImage}
              setProfileImage={p.setProfileImage}
              profileImageUrl={p.profileImageUrl}
              saving={p.saving}
              onSave={p.handleSaveProfile}
              maxDobDate={maxDobDate}
            />
          )}

          {p.activeTab === "skills" && (
            <SkillsTab
              city={p.city}
              setCity={p.setCity}
              state={p.state}
              setState={p.setState}
              qualification={p.qualification}
              setQualification={p.setQualification}
              experienceYears={p.experienceYears}
              setExperienceYears={p.setExperienceYears}
              languages={p.languages}
              handleLanguageChange={p.handleLanguageChange}
              setLanguages={p.setLanguages}
              specializations={p.specializations}
              handleRitualsChange={p.handleRitualsChange}
              setSpecializations={p.setSpecializations}
              isOnlineAvailable={p.isOnlineAvailable}
              setIsOnlineAvailable={p.setIsOnlineAvailable}
              isOfflineAvailable={p.isOfflineAvailable}
              setIsOfflineAvailable={p.setIsOfflineAvailable}
              saving={p.saving}
              onSave={p.handleSaveProfile}
              availableLanguages={AVAILABLE_LANGUAGES}
              availableRituals={isAstrologer ? AVAILABLE_ASTROLOGY_SPECIALIZATIONS : AVAILABLE_RITUALS}
              isAstrologer={isAstrologer}
              ratePerMinute={p.ratePerMinute}
              setRatePerMinute={p.setRatePerMinute}
              astrologyPrice={p.astrologyPrice}
              setAstrologyPrice={p.setAstrologyPrice}
            />
          )}

          {p.activeTab === "documents" && (
            <DocumentsTab
              aadhaarNumber={p.aadhaarNumber}
              setAadhaarNumber={p.setAadhaarNumber}
              aadhaarDoc={p.aadhaarDoc}
              setAadhaarDoc={p.setAadhaarDoc}
              aadhaarDocUrl={p.aadhaarDocUrl}
              panDoc={p.panDoc}
              setPanDoc={p.setPanDoc}
              panDocUrl={p.panDocUrl}
              certificateDoc={p.certificateDoc}
              setCertificateDoc={p.setCertificateDoc}
              certificateUrl={p.certificateUrl}
              templeAffiliationProofDoc={p.templeAffiliationProofDoc}
              setTempleAffiliationProofDoc={p.setTempleAffiliationProofDoc}
              templeAffiliationProofUrl={p.templeAffiliationProofUrl}
              verificationStatus={p.verificationStatus}
              rejectionReason={p.rejectionReason}
              saving={p.saving}
              onSave={p.handleSaveProfile}
              isAstrologer={isAstrologer}
            />
          )}

          {p.activeTab === "location" && (
            <ServiceAreaTab
              serviceAreas={p.serviceAreas}
              onAddNew={() => {
                p.setSelectedAddressId(null);
                p.setAddressForm({
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
                p.setAddressModalOpen(true);
              }}
              onEdit={p.handleEditClick}
              onDelete={p.handleDeleteClick}
            />
          )}

          {p.activeTab === "bank" && (
            <BankDetailsTab
              bankAccounts={p.bankAccounts}
              onAddNew={() => {
                p.setSelectedBankId(null);
                p.setBankForm({
                  paymentMethod: "BANK",
                  accountHolderName: "",
                  accountNumber: "",
                  ifscCode: "",
                  bankName: "",
                  accountType: "SAVINGS",
                  upiId: "",
                  isPrimary: false,
                });
                p.setBankModalOpen(true);
              }}
              onEdit={p.handleEditBankClick}
              onDelete={p.handleDeleteBankClick}
            />
          )}
        </Box>
      </Paper>

      {/* Service Area Address Modal */}
      <AddressModal
        open={p.addressModalOpen}
        onClose={() => p.setAddressModalOpen(false)}
        selectedAddressId={p.selectedAddressId}
        addressForm={p.addressForm}
        setAddressForm={p.setAddressForm}
        onSaveAddress={p.handleSaveAddress}
        savingAddress={p.savingAddress}
        onFetchCurrentLocation={p.fetchCurrentLocation}
        isFetchingLocation={p.isFetchingLocation}
      />

      {/* Delete Service Area Confirm Modal */}
      <Dialog
        open={p.deleteConfirmOpen}
        onClose={() => p.setDeleteConfirmOpen(false)}
      >
        <DialogTitle
          sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700 }}
        >
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: FONTS.OUTFIT }}>
            Are you sure you want to delete this service area?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => p.setDeleteConfirmOpen(false)}
            sx={{ color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            onClick={p.confirmDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: "8px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bank Account Modal */}
      <BankModal
        open={p.bankModalOpen}
        onClose={() => p.setBankModalOpen(false)}
        selectedBankId={p.selectedBankId}
        bankForm={p.bankForm}
        setBankForm={p.setBankForm}
        onSaveBank={p.handleSaveBank}
        savingBank={p.savingBank}
      />

      {/* Delete Bank Account Confirm Modal */}
      <Dialog
        open={p.bankDeleteConfirmOpen}
        onClose={() => p.setBankDeleteConfirmOpen(false)}
      >
        <DialogTitle
          sx={{ fontFamily: FONTS.OUTFIT, fontWeight: 700 }}
        >
          Confirm Delete Bank Account
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: FONTS.OUTFIT }}>
            Are you sure you want to delete this bank account?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => p.setBankDeleteConfirmOpen(false)}
            sx={{ color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            onClick={p.confirmBankDelete}
            color="error"
            variant="contained"
            sx={{ borderRadius: "8px" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
