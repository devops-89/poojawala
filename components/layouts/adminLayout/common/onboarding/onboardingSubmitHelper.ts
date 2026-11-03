import { convertImageToWebP } from "@/utils/imageHelper";
import { cleanItem } from "../../astrologers/EditAstrologerForm";
import { USER_ROLE } from "@/utils/enums";

export interface OnboardSubmitOptions {
  values: any;
  role: USER_ROLE.PUROHIT | USER_ROLE.ASTROLOGER;
  createApi: (payload: any) => Promise<any>;
}

export async function executePartnerOnboarding({
  values,
  role,
  createApi,
}: OnboardSubmitOptions) {
  const isAstrologer = role === USER_ROLE.ASTROLOGER;

  const firstName =
    values.firstName?.trim() ||
    values.fullName?.trim().split(/\s+/)[0] ||
    "";
  const lastName =
    values.lastName?.trim() ||
    values.fullName?.trim().split(/\s+/).slice(1).join(" ") ||
    ".";

  // Build FormData matching the exact registration payload format
  const fd = new FormData();

  // 1. Basic Details
  fd.append("firstName", firstName);
  fd.append("lastName", lastName);
  if (values.mobileNumber) fd.append("phone", values.mobileNumber.trim());
  if (values.countryCode) fd.append("countryCode", values.countryCode || "+91");
  if (values.email) fd.append("email", values.email.trim());
  if (values.password) fd.append("password", values.password);
  if (values.confirmPassword) fd.append("confirmPassword", values.confirmPassword);
  if (values.dob) fd.append("dob", values.dob);

  // Note: Do NOT append "role". Backend handles role automatically based on endpoint (/add-purohit vs /add-astrologer)

  // 2. Profile Details
  if (values.bio) fd.append("bio", values.bio);
  if (values.qualification) {
    fd.append("qualification", cleanItem(values.qualification));
  }
  if (values.experienceYears !== undefined && values.experienceYears !== "") {
    fd.append("experienceYears", values.experienceYears.toString());
  }
  if (values.aadhaarNumber) fd.append("aadhaarNumber", values.aadhaarNumber);
  if (values.state) fd.append("state", values.state);
  if (values.city) fd.append("city", values.city);

  // Languages
  const cleanLangs = Array.from(
    new Set((values.languages || []).map(cleanItem).filter(Boolean))
  );
  cleanLangs.forEach((l) => fd.append("languages", l as never));

  // Specializations
  const cleanSpecs = Array.from(
    new Set((values.specializations || []).map(cleanItem).filter(Boolean))
  );
  cleanSpecs.forEach((s) => fd.append("specializations", s as never));

  // Availability
  fd.append(
    "isOnlineAvailable",
    values.isOnlineAvailable ? "true" : "false"
  );
  fd.append(
    "isOfflineAvailable",
    values.isOfflineAvailable ? "true" : "false"
  );

  // 3. Astrologer Pricing
  if (isAstrologer) {
    const priceVal = values.astrologyPrice || values.ratePerMinute;
    if (priceVal !== undefined && priceVal !== "") {
      fd.append("astrologyPrice", priceVal.toString());
      fd.append("ratePerMinute", priceVal.toString());
    }
  }

  // 4. Payment & Bank Details
  if (values.paymentMethod) {
    fd.append("paymentMethod", values.paymentMethod);
    if (values.paymentMethod === "UPI") {
      if (values.upiId) fd.append("upiId", values.upiId.trim());
    } else {
      const accHolder =
        values.accountName?.trim() || `${firstName} ${lastName}`.trim();
      if (accHolder) fd.append("accountHolderName", accHolder);
      if (values.accountNumber) fd.append("accountNumber", values.accountNumber.trim());
      if (values.ifscCode) fd.append("ifscCode", values.ifscCode.trim().toUpperCase());
      if (values.bankName) fd.append("bankName", values.bankName.trim());
    }
  }

  // 5. Documents (converted to WebP as in registration)
  if (values.documents?.identityDoc) {
    const docField =
      values.identityDocType === "pan" ? "panDoc" : "aadhaarDoc";
    fd.append(
      docField,
      await convertImageToWebP(values.documents.identityDoc)
    );
  }
  if (values.documents?.certificate) {
    fd.append(
      "certificate",
      await convertImageToWebP(values.documents.certificate)
    );
  }
  if (values.documents?.templeAffiliationProof) {
    fd.append(
      "templeAffiliationProof",
      await convertImageToWebP(values.documents.templeAffiliationProof)
    );
  }
  if (values.documents?.profilePhoto) {
    fd.append(
      "profileImage",
      await convertImageToWebP(values.documents.profilePhoto)
    );
  }

  // 6. Service Area (for Purohit)
  if (!isAstrologer) {
    const sa = values.serviceArea || {};
    const serviceAreaObj = {
      addressLabel: sa.addressLabel || "Primary Service Area",
      streetName: sa.streetName || "",
      fullAddress: sa.fullAddress || "",
      city: sa.city || values.city || "",
      state: sa.state || values.state || "",
      pincode: sa.pincode || "",
      latitude: Number(sa.latitude) || 0,
      longitude: Number(sa.longitude) || 0,
      serviceRadiusKm: Number(sa.serviceRadiusKm || 15),
    };

    fd.append("serviceArea", JSON.stringify(serviceAreaObj));
    fd.append("serviceRadiusKm", serviceAreaObj.serviceRadiusKm.toString());
  }

  // Execute single create partner API with exact FormData payload
  const response = await createApi(fd);

  if (!response?.success && !response?.data && !response?.user) {
    throw new Error(
      response?.message ||
        `Failed to create ${isAstrologer ? "astrologer" : "purohit"} account`
    );
  }

  return response;
}
