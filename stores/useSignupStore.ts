import { SIGNUP_DETAILS_PROPS } from "@/utils/types";
import { create } from "zustand";

const initialSignupData: SIGNUP_DETAILS_PROPS = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  countryCode: "",
  email: "",
  dob: "",
  password: "",
};

interface ISIGNUPSTORE {
  signupData: SIGNUP_DETAILS_PROPS | null;
  setSignupData: (data: SIGNUP_DETAILS_PROPS) => void;
  updateSignupData: (data: Partial<SIGNUP_DETAILS_PROPS>) => void;
  clearSignupData: () => void;
}

export const useSignupStore = create<ISIGNUPSTORE>((set) => ({
  signupData: null,
  setSignupData: (data) => set({ signupData: data }),
  updateSignupData: (data) =>
    set((state) => ({
      signupData: { ...(state.signupData ?? initialSignupData), ...data },
    })),
  clearSignupData: () => set({ signupData: null }),
}));