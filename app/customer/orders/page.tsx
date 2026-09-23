import CustomerOrdersContent from "@/components/layouts/customerLayout/orders/CustomerOrdersContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Poojawala",
  description: "View and track your sacred purchases, puja samagri orders, and reorder with ease.",
};

export default function CustomerOrdersPage() {
  return <CustomerOrdersContent />;
}
