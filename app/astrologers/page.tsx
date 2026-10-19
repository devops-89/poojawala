import AstrologersLayout from "@/components/layouts/astrologersLayout/AstrologersLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Astrologers | 1Pooja",
  description: "Discover and consult verified Vedic Astrologers for Kundali matching, horoscope, vastu, and personal guidance on 1Pooja.",
};

export default function AstrologersPage() {
  return <AstrologersLayout />;
}
