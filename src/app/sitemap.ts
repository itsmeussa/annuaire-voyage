import { MetadataRoute } from "next";
import { getAllAgencies, getUniqueCities, getUniqueCountries, getUniqueCategories } from "@/lib/agencies";

// Helper to escape XML special characters in URLs
function escapeXmlUrl(url: string): string {
  return url.replace(/&/g, '&amp;');
}

// Blog posts data for sitemap
const blogPosts = [
  // CAN 2025 Blog Posts - High Priority for Moroccan SEO
  { slug: "can-2025-predictions-maroc-favori", date: "2025-01-15" },
  { slug: "can-2025-qui-va-gagner-pronostics", date: "2025-01-14" },
  { slug: "can-2025-maroc-parcours-mondial", date: "2025-01-13" },
  { slug: "can-2025-calendrier-matchs-maroc", date: "2025-01-12" },
  { slug: "can-2025-voyage-maroc-supporters", date: "2025-01-11" },
  { slug: "can-2025-stades-maroc-villes-hotes", date: "2025-01-10" },
  // Original Blog Posts
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
  const today = new Date();

  // ========================================
  // 1. STATIC PAGES (Highest Priority)
  // ========================================
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: today,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: today,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: today,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: today,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ========================================
  // 2. BLOG POSTS
  // ========================================
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: post.slug.includes("can-2025") ? "weekly" as const : "monthly" as const,
    priority: post.slug.includes("can-2025") ? 0.85 : 0.7,
  }));

  // ========================================
  // 3. COUNTRY PAGES (SEO Landing Pages)
  // ========================================
  const countryPages: MetadataRoute.Sitemap = countries.map((country) => {
    const agencyCount = agencies.filter(a => a.country === country).length;
    let priority = 0.9;
    if (agencyCount >= 500) priority = 0.95;
    else if (agencyCount >= 100) priority = 0.92;
    else if (agencyCount >= 50) priority = 0.88;
    
    return {
      url: `${baseUrl}/agencies/country/${encodeURIComponent(country)}`,
      lastModified: today,
      changeFrequency: "daily" as const,
      priority,
    };
  });

  // ========================================
  // 4. CITY PAGES (Local SEO - High Value)
  // ========================================
  const cityPages: MetadataRoute.Sitemap = [];
  const countryCityMap = new Map<string, string[]>();
  
  agencies.forEach(agency => {
    if (agency.country && agency.cityNormalized) {
      if (!countryCityMap.has(agency.country)) {
        countryCityMap.set(agency.country, []);
      }
      const cityList = countryCityMap.get(agency.country)!;
      if (!cityList.includes(agency.cityNormalized)) {
        cityList.push(agency.cityNormalized);
      }
    }
  });

  countryCityMap.forEach((citiesList, country) => {
    citiesList.forEach(city => {
      const cityAgencies = agencies.filter(a => a.country === country && a.cityNormalized === city);
      let priority = 0.8;
      if (cityAgencies.length >= 100) priority = 0.9;
      else if (cityAgencies.length >= 50) priority = 0.88;
      else if (cityAgencies.length >= 20) priority = 0.85;
      else if (cityAgencies.length >= 10) priority = 0.82;

      cityPages.push({
        url: `${baseUrl}/agencies/country/${encodeURIComponent(country)}/city/${encodeURIComponent(city)}`,
        lastModified: today,
        changeFrequency: "daily" as const,
        priority,
      });
    });
  });

  // ========================================
  // 5. CATEGORY PAGES
  // ========================================
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => {
    const catAgencies = agencies.filter(a => a.category === category);
    let priority = 0.85;
    if (catAgencies.length >= 500) priority = 0.9;
    
    return {
      url: `${baseUrl}/agencies/category/${encodeURIComponent(category)}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  // ========================================
  // 6. FILTER COMBINATION PAGES (Query-based)
  // ========================================
  
  // Country filter URLs (for backwards compatibility with old links)
  const countryFilterPages: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${baseUrl}/agencies?country=${encodeURIComponent(country)}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  // City filter URLs  
  const cityFilterPages: MetadataRoute.Sitemap = cities.slice(0, 200).map((city) => ({
    url: `${baseUrl}/agencies?city=${encodeURIComponent(city)}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Category filter URLs
  const categoryFilterPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/agencies?category=${encodeURIComponent(category)}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Rating filter pages
  const ratingPages: MetadataRoute.Sitemap = [5, 4.5, 4, 3.5].map((rating) => ({
    url: `${baseUrl}/agencies?rating=${rating}`,
    lastModified: today,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Country + City combinations (top combinations)
  const countryCityComboPages: MetadataRoute.Sitemap = [];
  countryCityMap.forEach((citiesList, country) => {
    // Get top 20 cities per country by agency count
    const sortedCities = citiesList
      .map(city => ({
        city,
        count: agencies.filter(a => a.country === country && a.cityNormalized === city).length
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    sortedCities.forEach(({ city }) => {
      countryCityComboPages.push({
        url: escapeXmlUrl(`${baseUrl}/agencies?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}`),
        lastModified: today,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    });
  });

  // Country + Category combinations
  const countryCategoryPages: MetadataRoute.Sitemap = [];
  countries.forEach((country) => {
    const countryCategories = [...new Set(
      agencies.filter(a => a.country === country).map(a => a.category)
    )].filter(Boolean);
    
    countryCategories.forEach((category) => {
      countryCategoryPages.push({
        url: escapeXmlUrl(`${baseUrl}/agencies?country=${encodeURIComponent(country)}&category=${encodeURIComponent(category)}`),
        lastModified: today,
        changeFrequency: "weekly" as const,
        priority: 0.65,
      });
    });
  });

  // Country + Rating combinations
  const countryRatingPages: MetadataRoute.Sitemap = [];
  countries.slice(0, 15).forEach((country) => {
    [5, 4].forEach((rating) => {
      countryRatingPages.push({
        url: escapeXmlUrl(`${baseUrl}/agencies?country=${encodeURIComponent(country)}&rating=${rating}`),
        lastModified: today,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    });
  });

  // ========================================
  // 7. AGENCY DETAIL PAGES (All Agencies)
  // ========================================
  const agencyPages: MetadataRoute.Sitemap = agencies.map((agency) => {
    // Calculate priority based on engagement metrics
    let priority = 0.6;
    const reviewCount = agency.reviewsCount || 0;
    const score = agency.totalScore || 0;
    
    // Rating-based priority
    if (score >= 4.8) priority = 0.85;
    else if (score >= 4.5) priority = 0.8;
    else if (score >= 4.0) priority = 0.75;
    else if (score >= 3.5) priority = 0.7;
    else if (score >= 3.0) priority = 0.65;
    
    // Review count boost
    if (reviewCount >= 1000) priority = Math.min(priority + 0.1, 0.95);
    else if (reviewCount >= 500) priority = Math.min(priority + 0.08, 0.93);
    else if (reviewCount >= 100) priority = Math.min(priority + 0.05, 0.9);
    else if (reviewCount >= 50) priority = Math.min(priority + 0.03, 0.88);
    
    // Website presence boost
    if (agency.website) priority = Math.min(priority + 0.02, 0.95);

    return {
      url: `${baseUrl}/agencies/${agency.slug}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority,
    };
  });

  // ========================================
  // 8. POPULAR SEARCH QUERIES
  // ========================================
  const searchQueries = [
    "best travel agency", "cheap flights", "tour packages", "vacation deals",
    "honeymoon packages", "group tours", "luxury travel", "budget travel",
    "adventure tours", "family vacation", "business travel", "cruise packages",
    "safari tours", "desert tours", "beach vacation", "cultural tours",
  ];

  const searchPages: MetadataRoute.Sitemap = searchQueries.map((query) => ({
    url: `${baseUrl}/agencies?q=${encodeURIComponent(query)}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // ========================================
  // COMBINE ALL SITEMAPS (Ordered by Priority)
  // ========================================
  return [
    ...staticPages,           // Priority: 1.0 - 0.3
    ...countryPages,          // Priority: 0.95 - 0.85
    ...categoryPages,         // Priority: 0.9 - 0.85
    ...cityPages,             // Priority: 0.9 - 0.8
    ...blogPages,             // Priority: 0.7
    ...countryFilterPages,    // Priority: 0.75
    ...cityFilterPages,       // Priority: 0.7
    ...categoryFilterPages,   // Priority: 0.7
    ...ratingPages,           // Priority: 0.7
    ...countryCityComboPages, // Priority: 0.7
    ...countryCategoryPages,  // Priority: 0.65
    ...countryRatingPages,    // Priority: 0.6
    ...agencyPages,           // Priority: 0.95 - 0.6
    ...searchPages,           // Priority: 0.5
  ];
}
