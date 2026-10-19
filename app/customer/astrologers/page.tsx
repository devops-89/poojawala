import { Metadata } from "next";
import { Suspense } from "react";
import CustomerAstrologersContent from "@/components/layouts/customerLayout/astrologers";

export default function CustomerAstrologersPage() {
  return (
    <Suspense fallback={null}>
      <CustomerAstrologersContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "Astrologers | 1Pooja",
  description: "Consult expert and certified Vedic astrologers for Kundali matching, horoscope, vastu, and career guidance.",
};
