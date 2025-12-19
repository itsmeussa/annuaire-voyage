import { Metadata } from "next";
import BlogContent from "./BlogContent";

export const metadata: Metadata = {
  title: "Travel Guide & Blog - Tips, Destinations & Travel Advice",
  description:
    "Explore our travel guide with expert tips, destination guides, and travel advice to help you plan your perfect trip.",
};

export default function BlogPage() {
  return <BlogContent />;
}

