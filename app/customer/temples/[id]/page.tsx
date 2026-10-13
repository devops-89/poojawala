import { Metadata } from "next";
import { Suspense } from "react";
import CustomerTempleDetailsContent from "@/components/layouts/customerLayout/temples/CustomerTempleDetailsContent";

export default async function CustomerTemplesDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={null}>
      <CustomerTempleDetailsContent templeId={resolvedParams.id} />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: "Temple Details | Poojawala",
  description:
    "Explore sacred temple details, history, legends, and book authenticated Vedic rituals and poojas on Poojawala.",
};
