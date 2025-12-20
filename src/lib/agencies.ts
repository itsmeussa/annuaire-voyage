import { Agency } from "@/types";
import { slugify, getCountryName, getCityName } from "@/lib/utils";
import { getCityCoordinates } from "@/lib/cityCoordinates";

// Import all agency data files
import data1 from "@/data/agencies-processed.json";

// Cache for agencies to avoid reprocessing
let cachedAgencies: Agency[] | null = null;

// Category mapping from Arabic to English
const categoryMap: Record<string, string> = {
  "مكتب سفريات": "Travel Agency",
  "وكالة سياحية": "Tourism Agency",
  "وكالة عمل جولات في المعالم السياحية": "Tour Operator",
  "شركة سياحية لتنظيم رحلات غوص السكوبا": "Adventure Tours",
  "وكالة تسويق": "Marketing Agency",
  "Agence de voyages": "Travel Agency",
  "Agence de visites touristiques": "Tour Operator",
};

function normalizeCategory(category: string | null): string {
  if (!category) return "Travel Agency";
  return categoryMap[category] || category;
}

// Generate descriptions based on agency data
function generateDescription(agency: Partial<Agency>): string {
  const descriptions = [
    `${agency.title} is a ${agency.category?.toLowerCase() || "travel agency"} located in ${agency.cityNormalized}, ${agency.country}. With ${agency.reviewsCount || "many"} reviews and ${agency.totalScore ? `a rating of ${agency.totalScore}/5` : "excellent service"}, we specialize in creating unforgettable travel experiences.`,
    `Discover the world with ${agency.title}, your trusted ${agency.category?.toLowerCase() || "travel partner"} in ${agency.cityNormalized}. We offer personalized travel planning, tour packages, and exceptional customer service.`,
    `Welcome to ${agency.title}! As a leading ${agency.category?.toLowerCase() || "travel agency"} in ${agency.country}, we're dedicated to making your travel dreams come true. ${agency.reviewsCount ? `Trusted by ${agency.reviewsCount}+ satisfied customers.` : ""}`,
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

export function getAllAgencies(): Agency[] {
  // Return cached agencies if available
  if (cachedAgencies) {
    return cachedAgencies;
  }

  const rawData = data1 as Array<{
    title: string;
    totalScore: number | null;
    reviewsCount: number | null;
    street: string | null;
    city: string | null;
    state: string | null;
    countryCode: string | null;
    website?: string | null;
    phone: string | null;
    categoryName: string | null;
    url: string;
  }>;

  const agencies: Agency[] = rawData
    .filter((item) => item.title && item.title.length > 0)
    .map((item, index) => {
      const cityNormalized = getCityName(item.city);
      const country = getCountryName(item.countryCode);
      const category = normalizeCategory(item.categoryName);
      const slug = slugify(item.title) || `agency-${index}`;
      
      const agency: Partial<Agency> = {
        id: `agency-${index}`,
        title: item.title,
        slug,
        totalScore: item.totalScore,
        reviewsCount: item.reviewsCount,
        street: item.street,
        city: item.city,
        cityNormalized,
        state: item.state,
        countryCode: item.countryCode,
        country,
        website: item.website || null,
        phone: item.phone,
        categoryName: item.categoryName,
        category,
        url: item.url,
        featured: (item.totalScore || 0) >= 4.8 && (item.reviewsCount || 0) >= 50,
        location: (() => {
          const coords = getCityCoordinates(cityNormalized, item.countryCode);
          if (coords) {
            // Add small random offset to prevent markers stacking
            const offset = () => (Math.random() - 0.5) * 0.02;
            return { lat: coords[0] + offset(), lng: coords[1] + offset() };
          }
          return null;
        })(),
      };

      return {
        ...agency,
        description: generateDescription(agency),
      } as Agency;
    });

  // Filter Moroccan agencies: keep only top 5 by rating and reviews
  const moroccanAgencies = agencies
    .filter((a) => a.countryCode === "MA")
    .sort((a, b) => {
      // Sort by score first, then by reviews count
      const scoreDiff = (b.totalScore || 0) - (a.totalScore || 0);
      if (scoreDiff !== 0) return scoreDiff;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    })
    .slice(0, 5);

  const moroccanAgencyIds = new Set(moroccanAgencies.map((a) => a.id));

  // Keep non-Moroccan agencies + top 5 Moroccan agencies
  const filteredAgencies = agencies.filter(
    (a) => a.countryCode !== "MA" || moroccanAgencyIds.has(a.id)
  );

  // Cache the result
  cachedAgencies = filteredAgencies;
  return filteredAgencies;
}

// Helper function to check if text contains Arabic characters
function containsArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
}

export function getFeaturedAgencies(limit: number = 6): Agency[] {
  return getAllAgencies()
    .filter((a) => a.featured && !containsArabic(a.title) && (a.reviewsCount || 0) >= 1000)
    .sort((a, b) => {
      // Sort by reviews count first (most famous), then by score
      const reviewsDiff = (b.reviewsCount || 0) - (a.reviewsCount || 0);
      if (reviewsDiff !== 0) return reviewsDiff;
      return (b.totalScore || 0) - (a.totalScore || 0);
    })
    .slice(0, limit);
}

export function getAgencyBySlug(slug: string): Agency | undefined {
  return getAllAgencies().find((a) => a.slug === slug);
}

export function getUniqueCities(): string[] {
  const cities = getAllAgencies()
    .map((a) => a.cityNormalized)
    .filter((city) => city && city !== "Unknown");
  return Array.from(new Set(cities)).sort();
}

export function getUniqueCountries(): string[] {
  const countries = getAllAgencies()
    .map((a) => a.country)
    .filter((country) => country && country !== "Unknown");
  return Array.from(new Set(countries)).sort();
}

export function getUniqueCategories(): string[] {
  const categories = getAllAgencies().map((a) => a.category);
  return Array.from(new Set(categories)).sort();
}

export function filterAgencies(
  query: string = "",
  city: string = "",
  country: string = "",
  rating: number = 0,
  category: string = "",
  websiteFilter: 'all' | 'with' | 'without' = 'all'
): Agency[] {
  let agencies = getAllAgencies();

  if (query) {
    const searchTerm = query.toLowerCase();
    agencies = agencies.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm) ||
        a.cityNormalized.toLowerCase().includes(searchTerm) ||
        a.category.toLowerCase().includes(searchTerm)
    );
  }

  if (city) {
    agencies = agencies.filter((a) => a.cityNormalized === city);
  }

  if (country) {
    agencies = agencies.filter((a) => a.country === country);
  }

  if (rating > 0) {
    agencies = agencies.filter((a) => (a.totalScore || 0) >= rating);
  }

  if (category) {
    agencies = agencies.filter((a) => a.category === category);
  }

  if (websiteFilter === 'with') {
    agencies = agencies.filter((a) => a.website && a.website.length > 0);
  } else if (websiteFilter === 'without') {
    agencies = agencies.filter((a) => !a.website || a.website.length === 0);
  }

  return agencies.sort((a, b) => {
    // Sort by featured first, then by rating, then by reviews
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if ((b.totalScore || 0) !== (a.totalScore || 0)) {
      return (b.totalScore || 0) - (a.totalScore || 0);
    }
    return (b.reviewsCount || 0) - (a.reviewsCount || 0);
  });
}
