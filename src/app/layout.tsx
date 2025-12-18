import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TravelAgencies.World - Find the Best Travel Agencies Worldwide | Directory of 1600+ Agencies",
    template: "%s | TravelAgencies.World",
  },
  description:
    "Discover and compare 1600+ top-rated travel agencies worldwide. Find trusted tour operators in Morocco, France, Spain & more. Verified reviews, ratings, phone numbers & direct contact. Book your perfect vacation today!",
  keywords: [
    "travel agencies",
    "travel agency directory",
    "tour operators",
    "travel agents near me",
    "best travel agencies",
    "travel agency reviews",
    "Morocco travel agencies",
    "Marrakech travel agency",
    "Casablanca tour operator",
    "Paris travel agency",
    "vacation planning",
    "tour packages",
    "holiday booking",
    "travel agent finder",
    "trusted travel agencies",
    "verified travel agents",
    "worldwide travel agencies",
    "book travel agency",
    "cheap travel agencies",
    "luxury travel agencies",
    "adventure travel agencies",
    "honeymoon travel agencies",
    "family travel agencies",
    "desert tours Morocco",
    "Sahara desert tours",
    "agence de voyage",
    "agencia de viajes",
  ],
  authors: [{ name: "Orious Strategy", url: "https://orioustrategy.com" }],
  creator: "Orious Strategy",
  publisher: "TravelAgencies.World",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://travelagencies.world"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "/",
      "fr": "/",
    },
  },
  openGraph: {
    title: "TravelAgencies.World - Find the Best Travel Agencies Worldwide",
    description:
      "Discover and compare 1600+ top-rated travel agencies around the world. Find trusted partners for your next adventure with verified reviews, ratings, and direct contact information.",
    url: "https://travelagencies.world",
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
    title: "TravelAgencies.World - Find the Best Travel Agencies Worldwide",
    description:
      "Discover and compare 1600+ top-rated travel agencies around the world.",
    images: ["/og-image.jpg"],
    creator: "@orioustrategy",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "1a4eec5ba3b943a9",
  },
  category: "travel",
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
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
