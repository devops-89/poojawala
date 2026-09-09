import ServicesLayout from "@/components/layouts/servicesLayout/ServicesLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Poojawala",
  description: "Discover and book verified Pandits and Purohits for a wide range of religious ceremonies.",
};

export default function ServicesPage() {
  return <ServicesLayout />;
}
