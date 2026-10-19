import WebsiteTempleDetailsContent from "@/components/layouts/templesLayout/WebsiteTempleDetailsContent";
import { Metadata } from "next";

export default function PublicTempleDetailsPage() {
  return <WebsiteTempleDetailsContent />;
}

export const metadata: Metadata = {
  title: "Temple Details | 1Pooja",
  description:
    "Explore sacred temple details, history, legends, and book authenticated Vedic rituals and poojas on 1Pooja.",
};
