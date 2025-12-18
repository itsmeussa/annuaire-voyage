import { MetadataRoute } from "next";
import { getAllAgencies, getUniqueCities, getUniqueCountries } from "@/lib/agencies";

export default function sitemap(): MetadataRoute.Sitemap {
  const agencies = getAllAgencies();
  const cities = getUniqueCities();
  const countries = getUniqueCountries();
  const baseUrl = "https://www.travelagencies.world";

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
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/top-destinations-2025`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/morocco-travel-guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
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

  // Country filter pages for SEO
  const countryPages: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // City filter pages for SEO (top 50 cities)
  const cityPages: MetadataRoute.Sitemap = cities.slice(0, 50).map((city) => ({
    url: `${baseUrl}/agencies?city=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  // Dynamic agency pages - prioritize by rating
  const agencyPages: MetadataRoute.Sitemap = agencies.map((agency) => {
    // Calculate priority based on rating and reviews
    let priority = 0.6;
    if (agency.totalScore && agency.totalScore >= 4.5) {
      priority = 0.85;
    } else if (agency.totalScore && agency.totalScore >= 4.0) {
      priority = 0.75;
    } else if (agency.totalScore && agency.totalScore >= 3.5) {
      priority = 0.7;
    }
    // Boost featured agencies
    if (agency.featured) {
      priority = Math.min(priority + 0.1, 0.9);
    }

    return {
      url: `${baseUrl}/agencies/${agency.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  return [...staticPages, ...countryPages, ...cityPages, ...agencyPages];
}
