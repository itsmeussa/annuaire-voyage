import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse 1600+ Travel Agencies Worldwide | Find Tour Operators",
  description:
    "Search and compare travel agencies from Morocco, France, Spain and 50+ countries. Filter by city, rating, and specialty. Find verified tour operators with real reviews. Contact agencies directly.",
  keywords: [
    "travel agency directory",
    "find travel agency",
    "tour operators list",
    "travel agents near me",
    "compare travel agencies",
    "Morocco travel agencies",
    "Marrakech tour operators",
    "Paris travel agents",
    "best rated travel agencies",
    "verified travel agencies",
  ],
  openGraph: {
    title: "Browse 1600+ Travel Agencies Worldwide | TravelAgencies.World",
    description:
      "Search and compare travel agencies from 50+ countries. Filter by city, rating, and specialty. Find your perfect travel partner.",
    url: "https://travelagencies.world/agencies",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Travel Agency Directory - TravelAgencies.World",
      },
    ],
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
