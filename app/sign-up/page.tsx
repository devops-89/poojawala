import { Metadata } from "next";
import { Suspense } from "react";
import SignUpContent from "@/components/layouts/userPages/SignUpContent";
import AuthenticationWrapper from "@/components/layouts/authenticationLayout/AuthenticationWrapper";
import RegisterUser from "@/components/layouts/authenticationLayout/SignUp";

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <RegisterUser />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "Sign Up | 1Pooja",
  description:
    "Create a 1Pooja account to easily book experienced Pandits, track your pooja history, and experience hassle-free divine services.",
  alternates: {
    canonical: "/sign-up",
  },
  openGraph: {
    url: "/sign-up",
  },
};
