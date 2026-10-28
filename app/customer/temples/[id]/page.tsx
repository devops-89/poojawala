import { Metadata } from "next";
import { Suspense } from "react";
import CustomerTempleDetailsContent from "@/components/layouts/customerLayout/temples/CustomerTempleDetailsContent";
import { getTempleByIdAPI } from "@/api/templeControllers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let templeTitle = "Temple Details | 1Pooja";
  let templeDesc =
    "Explore sacred temple details, history, legends, and book authenticated Vedic rituals and poojas on 1Pooja.";

  try {
    const res = await getTempleByIdAPI(id);
    let data = res?.data;
    if (data && data.data) data = data.data;

    if (data) {
      if (data.metaTitle && data.metaTitle.trim()) {
        templeTitle = data.metaTitle.trim();
      } else if (data.name) {
        templeTitle = `${data.name} | 1Pooja`;
      }
      if (data.metaDescription && data.metaDescription.trim()) {
        templeDesc = data.metaDescription.trim();
      } else if (data.description || data.about || data.history) {
        templeDesc = String(data.description || data.about || data.history)
          .replace(/<[^>]*>?/gm, "")
          .slice(0, 160);
      }
    }
  } catch (err) {}

  return {
    title: templeTitle,
    description: templeDesc,
  };
}

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
