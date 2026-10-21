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
import ScrollToTop from "@/components/widgets/ScrollToTop";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://1pooja.com"),
  title: "Book Experienced Pandits & Purohits online or offline | 1Pooja",
  description:
    "Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience",
  alternates: {
    canonical: "https://1pooja.com/",
  },
  verification: {
    google: "2bNVtobphfS7u5Cr_thQgNKR-jmCrrTRBuIpAiauIDw",
  },
  openGraph: {
    title: "Book Experienced Pandits & Purohits online or offline | 1Pooja",
    siteName: "1Pooja",
    url: "https://1pooja.com/",
    description:
      "Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience",
    type: "website",
    images: [
      {
        url: "https://1pooja.com/images/1Poojalogo.webp",
        width: 800,
        height: 600,
        alt: "1Pooja",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@1poojaofc",
    title: "Book Experienced Pandits & Purohits online or offline | 1Pooja",
    description:
      "Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience",
    images: ["https://1pooja.com/images/1Poojalogo.webp"],
  },
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
  width: "device-width",
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
      <head>
        {/* Google Tag Manager - As high as possible */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WNHPFBJ2');`,
          }}
        />
        {/* End Google Tag Manager */}

        <meta name="google-site-verification" content="2bNVtobphfS7u5Cr_thQgNKR-jmCrrTRBuIpAiauIDw" />
        <link rel="canonical" href="https://1pooja.com/" />

        {/* OG Tags */}
        <meta property="og:title" content="Book Experienced Pandits & Purohits online or offline | 1Pooja" />
        <meta property="og:site_name" content="1Pooja" />
        <meta property="og:url" content="https://1pooja.com/" />
        <meta
          property="og:description"
          content="Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://1pooja.com/images/1Poojalogo.webp" />

        {/* X (Twitter) Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@1poojaofc" />
        <meta name="twitter:title" content="Book Experienced Pandits & Purohits online or offline | 1Pooja" />
        <meta
          name="twitter:description"
          content="Book experienced Pandits & Purohits online or offline with 1Pooja for authentic religious services and a seamless spiritual experience"
        />
        <meta name="twitter:image" content="https://1pooja.com/images/1Poojalogo.webp" />

        {/* Org. Schema Markup */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "1Pooja",
              alternateName: "1Pooja",
              url: "https://1pooja.com/",
              logo: "https://1pooja.com/images/1Poojalogo.webp",
              sameAs: [
                "https://www.facebook.com/1poojaofc/",
                "https://x.com/1poojaofc",
                "https://www.instagram.com/1poojaofc",
                "https://www.youtube.com/@1poojaofc",
                "https://www.linkedin.com/company/1pooja",
              ],
            }),
          }}
        />

        {/* Performance hints for PageSpeed Insights */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/images/home/hero/heroSectionHome.webp"
          type="image/webp"
          // @ts-ignore
          fetchPriority="high"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#2D2926] antialiased selection:bg-[#FF7F3F] selection:text-[#FFFDF9]">
        {/* Google Tag Manager (noscript) immediately after opening <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WNHPFBJ2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ThemeRegistry>
          <ScrollToTop />
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
