import { Metadata } from "next";
import { Suspense } from "react";
import CustomerTemplesContent from "@/components/layouts/customerLayout/temples/CustomerTemplesContent";

export default function CustomerTemplesPage() {
  return (
    <Suspense fallback={null}>
      <CustomerTemplesContent />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "Temples | 1Pooja",
  description: "Explore sacred temples and divine shrines on 1Pooja.",
};
