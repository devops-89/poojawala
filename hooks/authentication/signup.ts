import { getMeAPI } from "@/api/authControllers";
import { extractRoleCsrfToken, saveRoleCsrfToken } from "@/api/config";
import {
  registerUserAPI,
  sendOtpAPI,
  verifyOtpAPI,
} from "@/api/userControllers";
import { useSnackbarStore } from "@/stores/snackbarStore";
import { useModal } from "@/stores/useModal";
import { useSignupStore } from "@/stores/useSignupStore";
import { useUserStore } from "@/stores/userStore";
import { extractBackendErrorMessage } from "@/utils/helpers";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useSendOTP = () => {
  const [loading, setLoading] = useState(false);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const sendOtp = async (email: string, role: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await sendOtpAPI({ email, role });
      if (res?.success === false) {
        showSnackbar(res?.message || "Failed to send OTP", "error");
        return false;
      }
      showSnackbar(res?.message || "OTP sent successfully!", "success");
      return true;
    } catch (err) {
      showSnackbar(
        extractBackendErrorMessage(err, "Failed to send OTP"),
        "error",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    sendOtp,
  };
};

export const useVerifyOTP = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const verifyOtp = async (
    email: string,
    otp: string,
    role: string,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await verifyOtpAPI({ email, otp, role });
      const isVerifySuccess = res?.success || res?.statusCode === 200;

      if (!isVerifySuccess || res?.success === false) {
        showSnackbar(res?.message || "Invalid OTP", "error");
        return false;
      }

      const { signupData, clearSignupData } = useSignupStore.getState();
      if (!signupData) {
        showSnackbar("Signup details not found. Please try again.", "error");
        return false;
      }

      const formData = new FormData();
      Object.entries(signupData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === "phoneNumber") {
          formData.append("phone", String(value));
          return;
        }

        if (key === "dob") {
          const parsedDob = moment(String(value), [
            "DD-MMM-YYYY",
            "YYYY-MM-DD",
            moment.ISO_8601,
          ]);
          formData.append(
            "dob",
            parsedDob.isValid() ? parsedDob.format("YYYY-MM-DD") : String(value),
          );
          return;
        }

        formData.append(key, String(value));
      });

      const registerRes = await registerUserAPI(formData);
      if (registerRes?.success === false) {
        showSnackbar(
          registerRes?.message || "Failed to create account",
          "error",
        );
        return false;
      }

      const token =
        registerRes?.tokens?.access?.token ||
        registerRes?.accessToken ||
        registerRes?.token ||
        registerRes?.data?.accessToken ||
        registerRes?.data?.token;

      let userObj =
        registerRes?.user ||
        registerRes?.data?.user ||
        registerRes?.data?.data ||
        registerRes?.data ||
        null;

      const resolvedRole = String(
        userObj?.role ||
          registerRes?.user?.role ||
          registerRes?.role ||
          role ||
          "CUSTOMER",
      ).toUpperCase();

      if (token) {
        try {
          const meResponse = await getMeAPI(token);
          const freshUser =
            meResponse?.user ||
            meResponse?.data?.user ||
            meResponse?.data?.data ||
            meResponse?.data ||
            meResponse;
          if (freshUser && typeof freshUser === "object") {
            userObj = freshUser;
          }
        } catch (e) {
          console.error("Error fetching fresh profile after register:", e);
        }
      }

      if (!userObj || typeof userObj !== "object") {
        const { password: _password, ...safeSignupData } = signupData;
        userObj = { ...safeSignupData, role: resolvedRole };
      } else if (!userObj.role) {
        userObj = { ...userObj, role: resolvedRole };
      }

      if (typeof window !== "undefined") {
        if (token) {
          sessionStorage.setItem("accessToken", token);
        }
        const refreshToken =
          registerRes?.tokens?.refresh?.token ||
          registerRes?.refreshToken ||
          registerRes?.data?.refreshToken;
        if (refreshToken) {
          sessionStorage.setItem("refreshToken", refreshToken);
        }
        sessionStorage.setItem("role", resolvedRole);
        sessionStorage.setItem("activeRole", resolvedRole);
        sessionStorage.setItem("user", JSON.stringify(userObj));
      }

      const csrf =
        registerRes?.poojawalaCustomerCsrfToken ||
        extractRoleCsrfToken(registerRes, resolvedRole) ||
        extractRoleCsrfToken(registerRes?.data, resolvedRole);

      if (csrf) {
        saveRoleCsrfToken(csrf, resolvedRole);
        if (typeof window !== "undefined") {
          localStorage.setItem("csrfToken", csrf);
          localStorage.setItem("customerCsrfToken", csrf);
          localStorage.setItem("customercsrftoken", csrf);
        }
      }

      useUserStore.getState().setProfile(userObj);
      clearSignupData();
      useModal.getState().hideModal();

      showSnackbar(
        registerRes?.message || "Account created successfully!",
        "success",
      );
      router.replace("/customer/dashboard");
      return true;
    } catch (err) {
      showSnackbar(
        extractBackendErrorMessage(err, "OTP verification failed"),
        "error",
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    verifyOtp,
  };
};
