import { Metadata } from "next";
import { Suspense } from "react";
import AdminPaymentsContent from "@/components/layouts/adminLayout/finance/AdminPaymentsContent";

export const metadata: Metadata = {
  title: "Payments | Admin Portal",
  description: "View and manage all customer payments and transactions.",
};

export default function PaymentsPage() {
  return (
    <Suspense fallback={null}>
      <AdminPaymentsContent />
    </Suspense>
  );
}

