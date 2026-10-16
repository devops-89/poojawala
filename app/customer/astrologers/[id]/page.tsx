import { Metadata } from "next";
import { CustomerAstrologerDetailsContent } from "@/components/layouts/customerLayout/astrologers";

export default function AstrologerDetailsPage() {
  return <CustomerAstrologerDetailsContent />;
}

export const metadata: Metadata = {
  title: "Astrologer Details | Poojawala",
  description: "View verified astrologer profile and book consultation on Poojawala.",
};
