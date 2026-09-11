import Navbar from "@/components/widgets/Navbar";
import Footer from "@/components/widgets/Footer";
import ThemeRegistry from "@/theme/ThemeRegistry";
import GlobalSnackbar from "@/components/widgets/GlobalSnackbar";
import GlobalLoader from "@/components/widgets/GlobalLoader";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Poojawala | Book Verified Purohits & Pujas Online",
  description: "Your trusted platform for discovering verified Purohits, booking online or temple pujas, and astrology consultations.",
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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} min-h-screen flex flex-col bg-[#FFFDF9] text-[#2D2926] antialiased selection:bg-[#FF7F3F] selection:text-[#FFFDF9] overflow-x-hidden`}>
        <ThemeRegistry>
          <Navbar />
          <main className="flex-grow flex flex-col overflow-x-hidden w-full relative">
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
