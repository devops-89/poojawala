import { SIGNUP_DETAILS_PROPS } from "@/utils/types";
import { useState } from "react";

export const useSendOTP = () => {
  const [loading, setLoading] = useState(false);

  const sendOtp = (email: string) => {
    setLoading(true);
    
  };
};
