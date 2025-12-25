import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find 2670+ Travel Agencies Worldwide | Compare & Book Tour Operators",
  description:
    "Search 2670+ verified travel agencies worldwide. Best agencies for CAN 2025 Morocco, France (800+), USA (500+), Canada (200+). Filter by country, city, rating. Real Google reviews & direct contact. 100% Free directory.",
  keywords: [
    "travel agencies directory",
    "find travel agency",
    "tour operators",
    "travel agents near me",
    "best travel agencies 2025",
    "compare travel agencies",
    "verified travel agencies",
    "travel agency reviews",
    "CAN 2025 travel agencies",
    "Morocco travel agencies",
    "Casablanca travel agency",
    "Marrakech travel agency",
    "France travel agencies",
    "Paris travel agency",
    "USA travel agencies",
    "New York travel agency",
    "Canada travel agencies",
    "Toronto travel agency",
    "agence de voyage",
    "worldwide tour operators",
    "book travel agent",
    "vacation packages",
  ],
  openGraph: {
    title: "2670+ Travel Agencies Worldwide | Find & Compare | CAN 2025 Morocco",
    description:
      "Search 2670+ verified travel agencies. Morocco CAN 2025, France, USA, Canada & more. Filter by location, rating. Real reviews and direct contact.",
    url: "https://www.travelagencies.world/agencies",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TravelAgencies.World - Find Travel Agencies Worldwide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2670+ Travel Agencies Worldwide | Free Directory",
    description:
      "Search 2670+ verified travel agencies. Morocco, France, USA, Canada. Filter by location, rating, specialty.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/agencies",
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
};

export default function AgenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
