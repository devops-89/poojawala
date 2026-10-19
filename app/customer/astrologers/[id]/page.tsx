import { Metadata } from "next";
import { CustomerAstrologerDetailsContent } from "@/components/layouts/customerLayout/astrologers";

export default function AstrologerDetailsPage() {
  return <CustomerAstrologerDetailsContent />;
}

export const metadata: Metadata = {
  title: "Astrologer Details | 1Pooja",
  description: "View verified astrologer profile and book consultation on 1Pooja.",
};
