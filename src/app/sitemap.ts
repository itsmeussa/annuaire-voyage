import { MetadataRoute } from "next";
import { getAllAgencies, getUniqueCities, getUniqueCountries, getUniqueCategories } from "@/lib/agencies";

// Blog posts data for sitemap (keep in sync with /blog/page.tsx)
const blogPosts = [
  { slug: "how-to-choose-travel-agency", date: "2024-12-15" },
  { slug: "top-destinations-2025", date: "2024-12-10" },
  { slug: "morocco-travel-guide", date: "2024-12-05" },
  { slug: "budget-travel-tips", date: "2024-12-01" },
  { slug: "group-travel-benefits", date: "2024-11-28" },
  { slug: "travel-insurance-guide", date: "2024-11-25" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const agencies = getAllAgencies();
  const cities = getUniqueCities();
  const countries = getUniqueCountries();
  const categories = getUniqueCategories();
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

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Country filter pages for SEO
  const countryPages: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // City filter pages for SEO (top 150 cities for better coverage)
  const cityPages: MetadataRoute.Sitemap = cities.slice(0, 150).map((city) => ({
    url: `${baseUrl}/agencies?city=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Category filter pages for SEO
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/agencies?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  // Rating filter pages for SEO
  const ratingPages: MetadataRoute.Sitemap = [5, 4, 3].map((rating) => ({
    url: `${baseUrl}/agencies?rating=${rating}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  // Website filter pages for SEO
  const websiteFilterPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/agencies?website=with`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/agencies?website=without`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    },
  ];

  // Country + City combination pages for top countries
  const topCountries = ["Morocco", "United States", "Canada", "France", "United Kingdom", "Spain", "Germany", "Italy", "Australia", "Netherlands", "United Arab Emirates"];
  const countryCityPages: MetadataRoute.Sitemap = [];
  
  topCountries.forEach((country) => {
    // Get top 15 cities for each top country
    const countryCities = agencies
      .filter((a) => a.country === country)
      .map((a) => a.cityNormalized)
      .filter((city, index, self) => city && self.indexOf(city) === index)
      .slice(0, 15);
    
    countryCities.forEach((city) => {
      countryCityPages.push({
        url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      });
    });
  });

  // Country + Category combination pages for top countries
  const countryCategory: MetadataRoute.Sitemap = [];
  topCountries.forEach((country) => {
    categories.slice(0, 5).forEach((category) => {
      countryCategory.push({
        url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}&category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    });
  });

  // Dynamic agency pages - prioritize by rating and reviews
  const agencyPages: MetadataRoute.Sitemap = agencies.map((agency) => {
    // Calculate priority based on rating, reviews, and featured status
    let priority = 0.6;
    const reviewCount = agency.reviewsCount || 0;
    
    if (agency.totalScore && agency.totalScore >= 4.5) {
      priority = 0.85;
    } else if (agency.totalScore && agency.totalScore >= 4.0) {
      priority = 0.75;
    } else if (agency.totalScore && agency.totalScore >= 3.5) {
      priority = 0.7;
    }
    
    // Boost agencies with many reviews
    if (reviewCount >= 1000) {
      priority = Math.min(priority + 0.1, 0.95);
    } else if (reviewCount >= 100) {
      priority = Math.min(priority + 0.05, 0.9);
    }
    
    // Boost featured agencies
    if (agency.featured) {
      priority = Math.min(priority + 0.1, 0.95);
    }

    return {
      url: `${baseUrl}/agencies/${agency.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  return [
    ...staticPages,
    ...blogPages,
    ...countryPages,
    ...cityPages,
    ...categoryPages,
    ...ratingPages,
    ...websiteFilterPages,
    ...countryCityPages,
    ...countryCategory,
    ...agencyPages,
  ];
}
