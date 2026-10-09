if (typeof window !== "undefined" && typeof (Array.prototype as any).toSorted !== "function") {
  (Array.prototype as any).toSorted = function (compareFn?: (a: any, b: any) => number) {
    return Array.from(this).sort(compareFn);
  };
}

import Navbar from "@/components/widgets/Navbar";
import Footer from "@/components/widgets/Footer";
import ThemeRegistry from "@/theme/ThemeRegistry";
import GlobalSnackbar from "@/components/widgets/GlobalSnackbar";
import GlobalLoader from "@/components/widgets/GlobalLoader";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poojawala | Book Verified Purohits & Pujas Online",
  description: "Your trusted platform for discovering verified Purohits, booking online or temple pujas, and astrology consultations.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.webp", type: "image/webp", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.webp",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2D2926] antialiased selection:bg-[#FF7F3F] selection:text-[#FFFDF9]">
        <ThemeRegistry>
          <Navbar />
          <main className="flex-grow flex flex-col w-full relative">
            {children}
          </main>
          <Footer />
          <GlobalSnackbar />
          <GlobalLoader />
        </ThemeRegistry>
      </body>
    </html>
  );
}
