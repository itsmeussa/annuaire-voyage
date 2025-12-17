import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TravelAgencies.World - Find the Best Travel Agencies Worldwide",
    template: "%s | TravelAgencies.World",
  },
  description:
    "Discover and compare top-rated travel agencies around the world. Find trusted partners for your next adventure with verified reviews, ratings, and direct contact information.",
  keywords: [
    "travel agencies",
    "tour operators",
    "travel directory",
    "vacation planning",
    "tour packages",
    "travel agents",
    "Morocco travel",
    "worldwide travel agencies",
    "best travel agencies",
    "travel agency reviews",
  ],
  authors: [{ name: "Orious Strategy", url: "https://oriousstrategy.com" }],
  creator: "Orious Strategy",
  publisher: "Orious Strategy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://travelagencies.world"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TravelAgencies.World - Find the Best Travel Agencies Worldwide",
    description:
      "Discover and compare top-rated travel agencies around the world. Find trusted partners for your next adventure.",
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
      "Discover and compare top-rated travel agencies around the world.",
    images: ["/og-image.jpg"],
    creator: "@oriousstrategy",
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
    google: "your-google-verification-code",
  },
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
