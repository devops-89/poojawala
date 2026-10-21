import PurohitsLayout from "@/components/layouts/purohitsLayout/PurohitsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Purohits | 1Pooja",
  description: "Discover and book verified Pandits and Purohits for a wide range of religious ceremonies.",
  alternates: {
    canonical: "/purohits",
  },
  openGraph: {
    url: "/purohits",
  },
};

export default function PurohitsPage() {
  return <PurohitsLayout />;
}
