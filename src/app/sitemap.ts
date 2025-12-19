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

  // Static pages with high priority
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

  // ALL country filter pages for SEO - every country gets indexed
  const countryPages: MetadataRoute.Sitemap = countries.map((country) => {
    // Boost priority for countries with more agencies
    const agencyCount = agencies.filter(a => a.country === country).length;
    let priority = 0.8;
    if (agencyCount >= 500) priority = 0.9;
    else if (agencyCount >= 100) priority = 0.85;
    
    return {
      url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority,
    };
  });

  // ALL cities - every city gets indexed for local SEO
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => {
    const agencyCount = agencies.filter(a => a.cityNormalized === city).length;
    let priority = 0.7;
    if (agencyCount >= 50) priority = 0.85;
    else if (agencyCount >= 20) priority = 0.8;
    else if (agencyCount >= 5) priority = 0.75;
    
    return {
      url: `${baseUrl}/agencies?city=${encodeURIComponent(city)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority,
    };
  });

  // ALL category filter pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/agencies?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Rating filter pages
  const ratingPages: MetadataRoute.Sitemap = [5, 4.5, 4, 3.5, 3].map((rating) => ({
    url: `${baseUrl}/agencies?rating=${rating}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  // Website filter pages
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

  // Country + City combinations for ALL countries (not just top ones)
  const countryCityPages: MetadataRoute.Sitemap = [];
  
  countries.forEach((country) => {
    // Get all unique cities for this country
    const countryCities = agencies
      .filter((a) => a.country === country)
      .map((a) => a.cityNormalized)
      .filter((city, index, self) => city && city !== "Unknown" && self.indexOf(city) === index);
    
    // Add all city combinations for countries with many agencies
    const maxCities = agencies.filter(a => a.country === country).length >= 100 ? 50 : 30;
    
    countryCities.slice(0, maxCities).forEach((city) => {
      countryCityPages.push({
        url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      });
    });
  });

  // Country + Category combinations for ALL countries
  const countryCategory: MetadataRoute.Sitemap = [];
  countries.forEach((country) => {
    // Get categories that exist in this country
    const countryCategories = agencies
      .filter((a) => a.country === country)
      .map((a) => a.category)
      .filter((cat, index, self) => cat && self.indexOf(cat) === index);
    
    countryCategories.forEach((category) => {
      countryCategory.push({
        url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}&category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    });
  });

  // City + Category combinations for top cities
  const cityCategoryPages: MetadataRoute.Sitemap = [];
  const topCities = cities
    .map(city => ({ city, count: agencies.filter(a => a.cityNormalized === city).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 100)
    .map(c => c.city);
  
  topCities.forEach((city) => {
    const cityCategories = agencies
      .filter((a) => a.cityNormalized === city)
      .map((a) => a.category)
      .filter((cat, index, self) => cat && self.indexOf(cat) === index);
    
    cityCategories.forEach((category) => {
      cityCategoryPages.push({
        url: `${baseUrl}/agencies?city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    });
  });

  // Country + Rating combinations for popular searches
  const countryRatingPages: MetadataRoute.Sitemap = [];
  countries.forEach((country) => {
    [5, 4].forEach((rating) => {
      const hasAgencies = agencies.some(a => a.country === country && (a.totalScore || 0) >= rating);
      if (hasAgencies) {
        countryRatingPages.push({
          url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}&rating=${rating}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      }
    });
  });

  // City + Rating combinations for popular cities
  const cityRatingPages: MetadataRoute.Sitemap = [];
  topCities.slice(0, 50).forEach((city) => {
    [5, 4].forEach((rating) => {
      const hasAgencies = agencies.some(a => a.cityNormalized === city && (a.totalScore || 0) >= rating);
      if (hasAgencies) {
        cityRatingPages.push({
          url: `${baseUrl}/agencies?city=${encodeURIComponent(city)}&rating=${rating}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.65,
        });
      }
    });
  });

  // Featured agencies filter
  const featuredPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/agencies?featured=true`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.85,
    },
  ];

  // Dynamic agency pages - ALL agencies get indexed with smart priority
  const agencyPages: MetadataRoute.Sitemap = agencies.map((agency) => {
    // Calculate priority based on rating, reviews, and featured status
    let priority = 0.6;
    const reviewCount = agency.reviewsCount || 0;
    
    // Base priority from rating
    if (agency.totalScore && agency.totalScore >= 4.8) {
      priority = 0.9;
    } else if (agency.totalScore && agency.totalScore >= 4.5) {
      priority = 0.85;
    } else if (agency.totalScore && agency.totalScore >= 4.0) {
      priority = 0.75;
    } else if (agency.totalScore && agency.totalScore >= 3.5) {
      priority = 0.7;
    } else if (agency.totalScore && agency.totalScore >= 3.0) {
      priority = 0.65;
    }
    
    // Boost agencies with many reviews
    if (reviewCount >= 1000) {
      priority = Math.min(priority + 0.1, 0.95);
    } else if (reviewCount >= 500) {
      priority = Math.min(priority + 0.08, 0.93);
    } else if (reviewCount >= 100) {
      priority = Math.min(priority + 0.05, 0.9);
    } else if (reviewCount >= 50) {
      priority = Math.min(priority + 0.03, 0.88);
    }
    
    // Boost featured agencies
    if (agency.featured) {
      priority = Math.min(priority + 0.1, 0.98);
    }
    
    // Boost agencies with websites
    if (agency.website) {
      priority = Math.min(priority + 0.02, 0.98);
    }

    return {
      url: `${baseUrl}/agencies/${agency.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  // Search query pages for common travel-related terms
  const searchQueries = [
    "best travel agency",
    "cheap flights",
    "tour packages",
    "vacation deals",
    "honeymoon packages",
    "group tours",
    "luxury travel",
    "budget travel",
    "adventure tours",
    "family vacation",
    "business travel",
    "cruise packages",
    "safari tours",
    "desert tours",
    "mountain trekking",
    "beach vacation",
    "cultural tours",
    "religious tours",
    "medical tourism",
    "visa services",
  ];

  const searchPages: MetadataRoute.Sitemap = searchQueries.map((query) => ({
    url: `${baseUrl}/agencies?q=${encodeURIComponent(query)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Combine all sitemaps
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
    ...cityCategoryPages,
    ...countryRatingPages,
    ...cityRatingPages,
    ...featuredPages,
    ...searchPages,
    ...agencyPages,
  ];
}
