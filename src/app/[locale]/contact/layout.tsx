import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | TravelAgencies.World - Get Help & Support",
  description:
    "Contact TravelAgencies.World for help finding travel agencies, listing your agency, or partnership inquiries. WhatsApp: +33 7 45 07 56 68. Email: contact@travelagencies.world. CAN 2025 Morocco travel support.",
  keywords: [
    "contact travel agencies world",
    "travel agency support",
    "list my travel agency",
    "travel agency partnership",
    "CAN 2025 travel help",
    "Morocco travel inquiry",
    "add travel agency",
  ],
  openGraph: {
    title: "Contact TravelAgencies.World | Support & Inquiries",
    description: "Contact us for travel agency listings, partnerships, or help finding the perfect agency. WhatsApp & email support available.",
    url: "https://www.travelagencies.world/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact TravelAgencies.World",
    description: "Get help finding travel agencies or list your own. WhatsApp & email support.",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
