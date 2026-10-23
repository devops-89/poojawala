import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'Book Experienced Purohits For online or offline Pooja | 1Pooja',
  description:
    'Book a purohit for Satyanarayan pooja, Durga pooja and other sacred ceremonies. Explore online or offline booking with 1Pooja',
  keywords: [
    'book a purohit online',
    'purohit for durga pooja',
    'book purohit for new home pooja',
    'purohit for Satyanarayan pooja',
  ],
  alternates: {
    canonical: '/purohits',
  },
  openGraph: {
    title: 'Book Experienced Purohits For online or offline Pooja | 1Pooja',
    description:
      'Book a purohit for Satyanarayan pooja, Durga pooja and other sacred ceremonies. Explore online or offline booking with 1Pooja',
    url: '/purohits',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book Experienced Purohits For online or offline Pooja | 1Pooja',
    description:
      'Book a purohit for Satyanarayan pooja, Durga pooja and other sacred ceremonies. Explore online or offline booking with 1Pooja',
  },
};

export default function PurohitsPage() {
  redirect("/services");
}
