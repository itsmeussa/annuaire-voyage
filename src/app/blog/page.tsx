import { Metadata } from "next";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "Travel Blog | CAN 2025 Morocco Guide, Tips & Destination Advice",
  description:
    "Expert travel guides, CAN 2025 Morocco predictions, destination advice & travel tips. Plan your Africa Cup of Nations 2025 trip. Morocco travel guides, hotel tips, and match schedules.",
  keywords: [
    "CAN 2025 blog",
    "CAN 2025 Morocco guide",
    "Africa Cup of Nations 2025",
    "Morocco travel tips",
    "travel blog",
    "destination guides",
    "AFCON 2025",
    "Morocco travel guide",
    "Casablanca travel",
    "Marrakech travel",
    "travel advice",
    "best travel agencies",
  ],
  openGraph: {
    title: "Travel Blog | CAN 2025 Morocco Guide & Travel Tips",
    description: "CAN 2025 predictions, Morocco travel guides, match schedules & destination tips. Expert advice for Africa Cup of Nations 2025.",
    url: "https://www.travelagencies.world/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAN 2025 Morocco Travel Blog & Guide",
    description: "Expert CAN 2025 predictions, Morocco travel tips & destination guides.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return <BlogContent />;
}

