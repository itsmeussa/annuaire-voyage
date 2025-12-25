import { Agency } from "@/types";
import { supabase } from "@/lib/supabase";
import { COUNTRIES } from "@/lib/countries";

function mapDbToAgency(dbRecord: any): Agency {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    slug: dbRecord.slug,
    totalScore: dbRecord.total_score,
    reviewsCount: dbRecord.reviews_count,
    street: dbRecord.street,
    city: dbRecord.city,
    cityNormalized: dbRecord.city_normalized || "Unknown",
    state: dbRecord.state,
    countryCode: dbRecord.country_code,
    country: dbRecord.country_normalized || "Unknown",
    website: dbRecord.website,
    phone: dbRecord.phone,
    categoryName: dbRecord.category_name,
    category: dbRecord.category_normalized || "Travel Agency",
    url: dbRecord.url,
    description: dbRecord.description || "",
    featured: dbRecord.featured || false,
    location: (dbRecord.latitude && dbRecord.longitude) ? {
      lat: dbRecord.latitude,
      lng: dbRecord.longitude
    } : null
  };
}

export async function getAgencies(supabaseClient?: any): Promise<Agency[]> {
  const client = supabaseClient || supabase;
  const { data, error } = await client
    .from('agencies')
    .select('*');

  if (error) {
    console.error('Error fetching agencies:', error);
    return [];
  }

  return (data || []).map(mapDbToAgency);
}

export const getAllAgencies = getAgencies;

export async function getFeaturedAgencies(limit: number = 6, supabaseClient?: any): Promise<Agency[]> {
  const client = supabaseClient || supabase;
  const { data, error } = await client
    .from('agencies')
    .select('*')
    .order('featured', { ascending: false })
    .order('reviews_count', { ascending: false, nullsFirst: false })
    .order('total_score', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured agencies:', error);
    return [];
  }

  return (data || []).map(mapDbToAgency);
}

export async function getAgencyBySlug(slug: string, supabaseClient?: any): Promise<Agency | undefined> {
  const client = supabaseClient || supabase;
  const { data, error } = await client
    .from('agencies')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return undefined;
  }

  return mapDbToAgency(data);
}

export async function getUniqueCities(country?: string): Promise<string[]> {
  let query = supabase
    .from('agencies')
    .select('city_normalized')
    .not('city_normalized', 'is', null)
    .neq('city_normalized', 'Unknown');

  if (country) {
    const countryMapping = COUNTRIES.find(c => c.name === country || c.code === country);
    if (countryMapping) {
      query = query.or(`country_normalized.eq."${countryMapping.name}",country_normalized.eq."${countryMapping.code}",country_code.eq."${countryMapping.code}"`);
    } else {
      query = query.eq('country_normalized', country);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }

  const cities = (data || []).map((a: any) => a.city_normalized).filter(Boolean);
  return Array.from(new Set(cities)).sort();
}

export async function getUniqueCountries(): Promise<string[]> {
  const { data, error } = await supabase
    .from('agencies')
    .select('country_normalized, country_code');

  if (error) {
    return [];
  }

  const countries = (data || []).map((a: any) => {
    const rawValue = a.country_normalized || a.country_code;
    if (!rawValue || rawValue === "Unknown") return null;

    // Map code to name if possible
    const found = COUNTRIES.find(c => c.code === rawValue || c.name === rawValue);
    return found ? found.name : rawValue;
  }).filter(Boolean);

  return Array.from(new Set(countries)).sort() as string[];
}

export async function getUniqueCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('agencies')
    .select('category_normalized')
    .not('category_normalized', 'is', null)
    .neq('category_normalized', 'Unknown');

  if (error) {
    return [];
  }

  const categories = (data || []).map((a: any) => a.category_normalized).filter(Boolean);
  return Array.from(new Set(categories)).sort();
}

export async function filterAgencies(
  query: string = "",
  city: string = "",
  country: string = "",
  rating: number = 0,
  category: string = "",
  websiteFilter: 'all' | 'with' | 'without' = 'all',
  page: number = 1,
  limit: number = 20,
  supabaseClient?: any
): Promise<{ agencies: Agency[], total: number }> {
  // Converted to separate params, added pagination to avoid fetching all

  const client = supabaseClient || supabase;
  let dbQuery = client.from('agencies').select('*', { count: 'exact' });

  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,city_normalized.ilike.%${query}%,category_normalized.ilike.%${query}%`);
  }

  if (city) {
    dbQuery = dbQuery.eq('city_normalized', city);
  }

  if (country) {
    // If we have a full name, we might need to search by code too
    const countryMapping = COUNTRIES.find(c => c.name === country || c.code === country);
    if (countryMapping) {
      dbQuery = dbQuery.or(`country_normalized.eq."${countryMapping.name}",country_normalized.eq."${countryMapping.code}",country_code.eq."${countryMapping.code}"`);
    } else {
      dbQuery = dbQuery.eq('country_normalized', country);
    }
  }

  if (rating > 0) {
    dbQuery = dbQuery.gte('total_score', rating);
  }

  if (category) {
    dbQuery = dbQuery.eq('category_normalized', category);
  }

  if (websiteFilter === 'with') {
    dbQuery = dbQuery.not('website', 'is', null).neq('website', '');
  } else if (websiteFilter === 'without') {
    dbQuery = dbQuery.or('website.is.null,website.eq.""');
  }

  // Sort
  dbQuery = dbQuery
    .order('featured', { ascending: false })
    .order('total_score', { ascending: false, nullsFirst: false })
    .order('reviews_count', { ascending: false, nullsFirst: false })
    .range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await dbQuery;

  if (error) {
    console.error('Error filtering agencies:', error);
    return { agencies: [], total: 0 };
  }

  return { agencies: (data || []).map(mapDbToAgency), total: count || 0 };
}
