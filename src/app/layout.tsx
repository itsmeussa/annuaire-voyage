import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TravelAgencies.World - 2800+ Verified Travel Agencies Worldwide",
    template: "%s | TravelAgencies.World",
  },
  description:
    "Find and compare 2800+ verified travel agencies worldwide. Browse top-rated agencies in USA, Morocco, Canada, UK, Spain, France & more. Real Google reviews, ratings & direct contact info.",
  keywords: [
    "travel agencies",
    "tour operators",
    "travel directory",
    "vacation planning",
    "tour packages",
    "travel agents",
    "Morocco travel agencies",
    "USA travel agents",
    "Canada tour operators",
    "worldwide travel agencies",
    "best travel agencies",
    "travel agency reviews",
    "New York travel agency",
    "Toronto travel agency",
    "Casablanca travel agency",
    "travel agency near me",
    "book travel agent",
    "top rated travel agencies",
  ],
  authors: [{ name: "Orious Strategy", url: "https://orioustrategy.com" }],
  creator: "Orious Strategy",
  publisher: "Orious Strategy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.travelagencies.world"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TravelAgencies.World - 2800+ Verified Travel Agencies Worldwide",
    description:
      "Find and compare 2800+ verified travel agencies in USA, Morocco, Canada, UK & more. Real reviews, ratings & direct contact info.",
    url: "https://www.travelagencies.world",
    siteName: "TravelAgencies.World",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TravelAgencies.World - World Travel Agency Directory",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelAgencies.World - 2800+ Verified Travel Agencies",
    description:
      "Find verified travel agencies in USA, Morocco, Canada & worldwide. Compare reviews, ratings & book directly.",
    images: ["/og-image.jpg"],
    creator: "@orioustrategy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "1a4eec5ba3b943a9",
  },
};

// Organization and Website Schema for SEO
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TravelAgencies.World",
  url: "https://www.travelagencies.world",
  logo: "https://www.travelagencies.world/logo.png",
  description: "Directory of 2800+ verified travel agencies worldwide with Google reviews and ratings",
  foundingDate: "2024",
  sameAs: [
    "https://www.instagram.com/travelagenciesworld",
    "https://www.linkedin.com/company/travelagenciesworld"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+33-7-45-07-56-68",
    contactType: "customer service",
    availableLanguage: ["English", "French", "Arabic"]
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TravelAgencies.World",
  url: "https://www.travelagencies.world",
  description: "Find and compare the best travel agencies worldwide",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.travelagencies.world/agencies?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
