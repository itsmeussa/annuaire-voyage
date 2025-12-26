import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const baseUrl = 'https://www.travelagencies.world'

  // Fetch all approved agencies with necessary fields
  const { data: agencies } = await supabase
    .from('agencies')
    .select('slug, created_at, country_normalized, city_normalized, category_normalized')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  // 1. Static pages
  const staticRoutes = [
    '',
    '/agencies',
    '/destinations',
    // '/planner', // Hidden for now
    '/blog',
    '/about',
    '/contact',
    '/for-agencies',
    '/auth/login',
    '/auth/signup',
  ]

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  // 2. Dynamic Agency Profiles
  const agencyPages: MetadataRoute.Sitemap = (agencies || []).map((agency) => ({
    url: `${baseUrl}/agencies/${agency.slug}`,
    lastModified: new Date(agency.created_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Data processing for groupings
  const validAgencies = agencies || []

  // 3. Category Pages
  const categories = new Set(validAgencies
    .map(a => a.category_normalized)
    .filter(Boolean)
    .filter(c => c !== 'Unknown'))

  const categoryPages: MetadataRoute.Sitemap = Array.from(categories).map(category => ({
    url: `${baseUrl}/agencies/category/${encodeURIComponent(category!)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // 4. Country Pages
  const countries = new Set(validAgencies
    .map(a => a.country_normalized)
    .filter(Boolean)
    .filter(c => c !== 'Unknown'))

  const countryPages: MetadataRoute.Sitemap = Array.from(countries).map(country => ({
    url: `${baseUrl}/agencies/country/${encodeURIComponent(country!)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 5. City Pages (Country + City combo)
  // We need to map cities to their countries to build the correct URL: /agencies/country/[country]/city/[city]
  const cityMap = new Map<string, string>() // `${country}:${city}` -> url path

  validAgencies.forEach(agency => {
    if (agency.city_normalized &&
      agency.country_normalized &&
      agency.city_normalized !== 'Unknown' &&
      agency.country_normalized !== 'Unknown') {
      const key = `${agency.country_normalized}:${agency.city_normalized}`
      if (!cityMap.has(key)) {
        cityMap.set(key, `${baseUrl}/agencies/country/${encodeURIComponent(agency.country_normalized)}/city/${encodeURIComponent(agency.city_normalized)}`)
      }
    }
  })

  const cityPages: MetadataRoute.Sitemap = Array.from(cityMap.values()).map(url => ({
    url: url,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...agencyPages, ...categoryPages, ...countryPages, ...cityPages]
}
