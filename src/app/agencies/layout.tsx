import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse All Travel Agencies - Find & Compare Tour Operators Worldwide",
  description:
    "Search and compare 1600+ verified travel agencies worldwide. Filter by country, city, rating, and specialty. Read real reviews, check ratings, and contact agencies directly. Free to use.",
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
    "worldwide tour operators",
  ],
  openGraph: {
    title: "Browse All Travel Agencies - Find & Compare Worldwide",
    description:
      "Search 1600+ verified travel agencies. Filter by location, rating, specialty. Real reviews and direct contact.",
    url: "https://travelagencies.world/agencies",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Travel Agencies Worldwide",
    description:
      "Search and compare verified travel agencies. Filter by location, rating, specialty.",
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
