import CustomerProductsContent from "@/components/layouts/customerLayout/products/CustomerProductsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pooja Products | Poojawala",
  description: "Browse and order authentic sacred pooja samagri, diyas, dhoop, and complete puja kits with devotion.",
};

export default function CustomerProductsPage() {
  return <CustomerProductsContent />;
}
