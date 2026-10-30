

import { Suspense } from "react";
import Script from "next/script";
import { DM_Sans, Outfit } from "next/font/google";
import Navbar from "@/components/widgets/Navbar";
import Footer from "@/components/widgets/Footer";
import ThemeRegistry from "@/theme/ThemeRegistry";
import GlobalSnackbar from "@/components/widgets/GlobalSnackbar";
import GlobalLoader from "@/components/widgets/GlobalLoader";
import ScrollToTop from "@/components/widgets/ScrollToTop";
import GlobalModalScrollLock from "@/components/widgets/GlobalModalScrollLock";
import GlobalDropdownScrollClose from "@/components/widgets/GlobalDropdownScrollClose";
import type { Metadata } from "next";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  
});

export const metadata: Metadata = {
  metadataBase: new URL("https://1pooja.com"),
  title: "Book Experienced Pandits & Purohits online or offline | 1pooja",
  description:
    "Book experienced Pandits & Purohits online or offline with 1pooja for authentic religious services and a seamless spiritual experience",
  verification: {
    google: [
      "-gaSrqYc7JoMx1PzVFmk4HZ6BXPHLPUp5pMOHNmLRrQ",
      "2bNVtobphfS7u5Cr_thQgNKR-jmCrrTRBuIpAiauIDw",
    ],
  },
  alternates: {
    canonical: "https://1pooja.com/",
  },
  openGraph: {
    title: "Book Experienced Pandits & Purohits online or offline | 1pooja",
    siteName: "1pooja",
    url: "https://1pooja.com/",
    description:
      "Book experienced Pandits & Purohits online or offline with 1pooja for authentic religious services and a seamless spiritual experience",
    type: "website",
    images: [
      {
        url: "https://1pooja.com/images/logo.webp",
        width: 800,
        height: 600,
        alt: "1pooja",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@1pooja",
    title: "Book Experienced Pandits & Purohits online or offline | 1pooja",
    description:
      "Book experienced Pandits & Purohits online or offline with 1pooja for authentic religious services and a seamless spiritual experience",
    images: ["https://1pooja.com/images/logo.webp"],
  },
  icons: {
    icon: "/1PoojalogoFavicon.png",
    shortcut: "/1PoojalogoFavicon.png",
    apple: "/1PoojalogoFavicon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF6200",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/1PoojalogoFavicon.png" />
        <link rel="shortcut icon" href="/1PoojalogoFavicon.png" />
        <link rel="apple-touch-icon" href="/1PoojalogoFavicon.png" />

        <meta name="google-site-verification" content="-gaSrqYc7JoMx1PzVFmk4HZ6BXPHLPUp5pMOHNmLRrQ" />
        <meta name="google-site-verification" content="2bNVtobphfS7u5Cr_thQgNKR-jmCrrTRBuIpAiauIDw" />

        {/* OG Tags */}
        <meta property="og:title" content="Book Experienced Pandits & Purohits online or offline | 1pooja" />
        <meta property="og:site_name" content="1pooja" />
        <meta property="og:url" content="https://1pooja.com/" />
        <meta
          property="og:description"
          content="Book experienced Pandits & Purohits online or offline with 1pooja for authentic religious services and a seamless spiritual experience"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://1pooja.com/images/logo.webp" />

        {/* X (Twitter) Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@1pooja" />
        <meta name="twitter:title" content="Book Experienced Pandits & Purohits online or offline | 1pooja" />
        <meta
          name="twitter:description"
          content="Book experienced Pandits & Purohits online or offline with 1pooja for authentic religious services and a seamless spiritual experience"
        />
        <meta name="twitter:image" content="https://1pooja.com/images/logo.webp" />

        {/* Org. Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "1pooja",
              alternateName: "1pooja",
              url: "https://1pooja.com/",
              logo: "https://1pooja.com/images/logo.webp",
              sameAs: [
                "https://www.facebook.com/1pooja/",
                "https://x.com/1pooja",
                "https://www.instagram.com/1pooja",
                "https://www.linkedin.com/company/1pooja",
              ],
            }),
          }}
        />

        {/* Performance hints for PageSpeed Insights */}

        <link
          rel="preload"
          as="image"
          href="/images/homeHero-mobile.webp"
          type="image/webp"
          media="(max-width: 599px)"
          // @ts-ignore
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/homeHero.webp"
          type="image/webp"
          media="(min-width: 600px)"
          // @ts-ignore
          fetchPriority="high"
        />
      </head>
      <body suppressHydrationWarning className={`${dmSans.variable} ${outfit.variable} min-h-screen flex flex-col bg-[#FFFDF9] text-[#2D2926] antialiased selection:bg-[#FF7F3F] selection:text-[#FFFDF9]`}>
        {/* Google Tag Manager with lazyOnload strategy to prevent blocking main thread */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                function loadGtmScript() {
                  var f = document.getElementsByTagName('script')[0],
                      j = document.createElement('script');
                  j.async = true;
                  j.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-WNHPFBJ2';
                  if (f && f.parentNode) {
                    f.parentNode.insertBefore(j, f);
                  } else {
                    document.head.appendChild(j);
                  }
                }
                if (window.__gtmLoaded) return;
                ['scroll', 'touchstart', 'click', 'keydown'].forEach(function(e) {
                  window.addEventListener(e, function() {
                    if (window.__gtmLoaded) return;
                    window.__gtmLoaded = true;
                    loadGtmScript();
                  }, { once: true, passive: true });
                });
                setTimeout(function() {
                  if (!window.__gtmLoaded) {
                    window.__gtmLoaded = true;
                    loadGtmScript();
                  }
                }, 6000);
              })();
            `,
          }}
        />
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
          <GlobalModalScrollLock />
          <GlobalDropdownScrollClose />
          <Suspense fallback={<div style={{ height: "79px", width: "100%", background: "#fff", borderBottom: "1px solid #eee", position: "sticky", top: 0, zIndex: 1100 }} />}>
            <Navbar />
          </Suspense>
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
