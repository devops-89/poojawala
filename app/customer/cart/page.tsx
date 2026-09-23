import CustomerCartContent from "@/components/layouts/customerLayout/cart/CustomerCartContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Sacred Cart & Checkout | Poojawala",
  description: "Complete your order for sacred pooja samagri, brass diyas, and authentic puja kits.",
};

export default function CustomerCartPage() {
  return <CustomerCartContent />;
}
