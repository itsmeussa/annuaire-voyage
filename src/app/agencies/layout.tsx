import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse 3800+ Travel Agencies - Find & Compare Tour Operators Worldwide",
  description:
    "Search and compare 3800+ verified travel agencies worldwide. Filter by country, city, rating, and specialty. France (800+), USA (500+), Canada (200+). Real reviews, direct contact. Free directory.",
  keywords: [
    "travel agencies directory",
    "find travel agency",
    "tour operators",
    "travel agents near me",
    "best travel agencies",
    "compare travel agencies",
    "verified travel agencies",
    "travel agency reviews",
    "Morocco travel agencies",
    "France travel agencies",
    "USA travel agencies",
    "Canada travel agencies",
    "Casablanca travel agency",
    "Paris travel agency",
    "worldwide tour operators",
  ],
  openGraph: {
    title: "Browse 3800+ Travel Agencies - Find & Compare Worldwide",
    description:
      "Search 3800+ verified travel agencies. France, USA, Canada & more. Filter by location, rating. Real reviews and direct contact.",
    url: "https://travelagencies.world/agencies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse 3800+ Travel Agencies Worldwide",
    description:
      "Search and compare 3800+ verified travel agencies. France, USA, Canada. Filter by location, rating, specialty.",
  },
  alternates: {
    canonical: "/agencies",
  },
};

export default function AgenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
