import PurohitsLayout from "@/components/layouts/purohitsLayout/PurohitsLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Purohits | Poojawala",
  description: "Discover and book verified Pandits and Purohits for a wide range of religious ceremonies.",
};

export default function PurohitsPage() {
  return <PurohitsLayout />;
}
