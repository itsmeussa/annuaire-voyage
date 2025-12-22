import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import PromoBanner from "@/components/ui/PromoBanner";
import PromoPopup from "@/components/ui/PromoPopup";
import ChatBot from "@/components/ui/ChatBot";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TravelAgencies.World - 2670+ Verified Travel Agencies Worldwide | CAN 2025 Morocco",
    template: "%s | TravelAgencies.World",
  },
  description:
    "Find and compare 2670+ verified travel agencies worldwide. Best Morocco travel agencies for CAN 2025 Africa Cup of Nations. Top-rated agencies in Casablanca, Marrakech, Rabat, France, USA, Canada & UK. Real Google reviews & direct contact.",
  keywords: [
    "travel agencies",
    "tour operators",
    "travel directory",
    "CAN 2025",
    "Africa Cup of Nations 2025",
    "Morocco travel agencies",
    "AFCON 2025 travel",
    "Casablanca travel agency",
    "Marrakech travel agency",
    "Rabat travel agency",
    "agence de voyage Maroc",
    "agence voyage Casablanca",
    "voyage CAN 2025",
    "Morocco tour operators",
    "best travel agencies 2025",
    "USA travel agents",
    "Canada tour operators",
    "France travel agencies",
    "worldwide travel agencies",
    "travel agency reviews",
    "New York travel agency",
    "Toronto travel agency",
    "travel agency near me",
    "book travel agent",
    "top rated travel agencies",
    "vacation planning 2025",
    "tour packages Morocco",
    "football travel packages",
    "sports travel agency",
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
  icons: {
    icon: "/travellogos/travel logo icon.png",
    shortcut: "/travellogos/travel logo icon.png",
    apple: "/travellogos/travel logo icon.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TravelAgencies.World - 2670+ Travel Agencies | CAN 2025 Morocco Travel",
    description:
      "Find verified travel agencies for CAN 2025 Africa Cup of Nations in Morocco. Compare 2670+ agencies in Casablanca, Marrakech, Rabat, France, USA & worldwide. Real reviews & direct contact.",
    url: "https://www.travelagencies.world",
    siteName: "TravelAgencies.World",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TravelAgencies.World - Best Travel Agencies for CAN 2025 Morocco",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TravelAgencies.World - CAN 2025 Morocco Travel Agencies",
    description:
      "Find the best travel agencies for Africa Cup of Nations 2025 in Morocco. 2670+ verified agencies in Casablanca, Marrakech & worldwide. Book now!",
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
  logo: "https://www.travelagencies.world/travellogos/travelagencies-text-blue-white-nbackground.png",
  description: "Free directory of 2670+ verified travel agencies worldwide. Best agencies for CAN 2025 Africa Cup of Nations in Morocco.",
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
  description: "Find and compare the best travel agencies worldwide for CAN 2025 Africa Cup of Nations in Morocco",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.travelagencies.world/agencies?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// CAN 2025 Event Schema for trending SEO
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: "Africa Cup of Nations 2025 (CAN 2025)",
  description: "The 35th edition of the Africa Cup of Nations hosted by Morocco. Find the best travel agencies to plan your trip.",
  startDate: "2025-12-21",
  endDate: "2026-01-18",
  location: {
    "@type": "Country",
    name: "Morocco",
    address: {
      "@type": "PostalAddress",
      addressCountry: "MA"
    }
  },
  organizer: {
    "@type": "Organization",
    name: "Confederation of African Football (CAF)"
  },
  offers: {
    "@type": "AggregateOffer",
    description: "Travel packages and agency services for CAN 2025",
    url: "https://www.travelagencies.world/agencies/country/Morocco"
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
        <link rel="icon" href="/travellogos/square-blue-no-background.png" type="image/png" />
        <link rel="apple-touch-icon" href="/travellogos/square-blue-white-background.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      </head>
      <body className={poppins.className}>
        <div className="flex flex-col min-h-screen">
          <PromoBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ScrollToTop />
        <ChatBot />
        {/* <PromoPopup /> */}
      </body>
    </html>
  );
}
