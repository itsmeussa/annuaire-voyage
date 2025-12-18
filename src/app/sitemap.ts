import { MetadataRoute } from "next";
import { getAllAgencies, getUniqueCountries, getUniqueCities } from "@/lib/agencies";

export default function sitemap(): MetadataRoute.Sitemap {
  const agencies = getAllAgencies();
  const countries = getUniqueCountries();
  const cities = getUniqueCities();
  const baseUrl = "https://travelagencies.world";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/how-to-choose-travel-agency`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/top-destinations-2025`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/morocco-travel-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic agency pages - higher priority for agencies with reviews
  const agencyPages: MetadataRoute.Sitemap = agencies.map((agency) => ({
    url: `${baseUrl}/agencies/${agency.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: agency.totalScore && agency.totalScore >= 4.5 ? 0.85 : agency.totalScore ? 0.75 : 0.65,
  }));

  return [...staticPages, ...agencyPages];
}
