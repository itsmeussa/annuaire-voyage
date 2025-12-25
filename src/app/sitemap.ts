import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const baseUrl = 'https://www.travelagencies.world'

  // Fetch all approved agencies
  const { data: agencies } = await supabase
    .from('agencies')
    .select('slug, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic agency pages
  const agencyPages: MetadataRoute.Sitemap = (agencies || []).map((agency) => ({
    url: `${baseUrl}/agencies/${agency.slug}`,
    lastModified: new Date(agency.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Get unique countries and cities for filter pages
  const { data: locations } = await supabase
    .from('agencies')
    .select('country_normalized, city_normalized')
    .eq('status', 'approved')

  const countries = [...new Set(locations?.map(l => l.country_normalized) || [])]
  const cities = [...new Set(locations?.map(l => l.city_normalized) || [])]

  const locationPages: MetadataRoute.Sitemap = [
    ...countries.map(country => ({
      url: `${baseUrl}/agencies/country/${country}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...cities.slice(0, 100).map(city => ({ // Limit to top 100 cities to avoid huge sitemap
      url: `${baseUrl}/agencies/country/${city.split(',')[1]?.trim() || 'city'}/city/${city}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  return [...staticPages, ...agencyPages, ...locationPages]
}
