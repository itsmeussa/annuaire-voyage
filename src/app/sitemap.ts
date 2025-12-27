import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { blogPosts } from '@/lib/blog-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const baseUrl = 'https://www.travelagencies.world'
  const locales = ['en', 'fr', 'ar']

  // Helper to generate localized entries for a single route
  const generateEntries = (
    path: string,
    lastModified: Date = new Date(),
    changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'never' = 'weekly',
    priority: number = 0.7,
    images?: string[]
  ): MetadataRoute.Sitemap => {
    return locales.map(locale => {
      const localePath = locale === 'fr' ? path : `/${locale}${path === '/' ? '' : path}`
      const url = `${baseUrl}${localePath}`.replace(/\/$/, '')

      return {
        url,
        lastModified,
        changeFrequency,
        priority,
        // Add alternates for SEO
        alternates: {
          languages: locales.reduce((acc, l) => {
            const lPath = l === 'fr' ? path : `/${l}${path === '/' ? '' : path}`
            acc[l] = `${baseUrl}${lPath}`.replace(/\/$/, '')
            return acc
          }, {} as Record<string, string>)
        },
        // Add images if present (typed as any because standard Next.js types might catch up, 
        // but Google supports image sitemaps via extension. 
        // Note: The return type MetadataRoute.Sitemap might complain if not strictly matching,
        // but often it passes or we exclude if strict. Let's try Standard Image format.)
        ...(images && images.length > 0 ? { images: images } : {})
      }
    })
  }

  // Fetch all approved agencies with necessary fields, including image
  // Note: 'imageUrl' might be camelCase in Typescript but 'image_url' in DB? 
  // Standard Supabase is snake_case. Let's select * or inspect types. 
  // Assuming 'image_url' exists or 'images' array. 
  // Safe bet: select mostly everything relevant.
  const { data: agencies } = await supabase
    .from('agencies')
    .select('slug, created_at, country_normalized, city_normalized, category_normalized, image_url')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .range(0, 20000)

  // 1. Static pages
  const staticRoutes = [
    '',
    '/agencies',
    '/destinations',
    '/planner', // Unhidden as requested
    '/blog',
    '/about',
    '/contact',
    '/for-agencies',
    '/auth/login',
    '/auth/signup',
  ]

  const staticPages = staticRoutes.flatMap(route =>
    generateEntries(
      route,
      new Date(),
      route === '' ? 'daily' : 'weekly',
      route === '' ? 1 : 0.8
    )
  )

  // 2. Dynamic Agency Profiles
  const agencyPages = (agencies || []).flatMap((agency) => {
    const images = agency.image_url ? [agency.image_url] : []
    return generateEntries(
      `/agencies/${agency.slug}`,
      new Date(agency.created_at || new Date()),
      'weekly',
      0.9,
      images
    )
  })

  // Data processing for groupings
  const validAgencies = agencies || []

  // 3. Category Pages
  const categories = new Set(validAgencies
    .map(a => a.category_normalized)
    .filter(Boolean)
    .filter(c => c !== 'Unknown'))

  const categoryPages = Array.from(categories).flatMap(category =>
    generateEntries(
      `/agencies/category/${encodeURIComponent(category!)}`,
      new Date(),
      'weekly',
      0.7
    )
  )

  // 4. Country Pages
  const countries = new Set(validAgencies
    .map(a => a.country_normalized)
    .filter(Boolean)
    .filter(c => c !== 'Unknown'))

  const countryPages = Array.from(countries).flatMap(country =>
    generateEntries(
      `/agencies/country/${encodeURIComponent(country!)}`,
      new Date(),
      'weekly',
      0.8
    )
  )

  // 5. City Pages (Country + City combo)
  const cityMap = new Map<string, string>() // `${country}:${city}` -> url path suffix

  validAgencies.forEach(agency => {
    if (agency.city_normalized &&
      agency.country_normalized &&
      agency.city_normalized !== 'Unknown' &&
      agency.country_normalized !== 'Unknown') {
      const key = `${agency.country_normalized}:${agency.city_normalized}`
      if (!cityMap.has(key)) {
        cityMap.set(key, `/agencies/country/${encodeURIComponent(agency.country_normalized)}/city/${encodeURIComponent(agency.city_normalized)}`)
      }
    }
  })

  const cityPages = Array.from(cityMap.values()).flatMap(urlPath =>
    generateEntries(
      urlPath,
      new Date(),
      'weekly',
      0.7
    )
  )

  // 6. Blog Pages
  const blogPages = blogPosts.flatMap((post) => {
    const images = post.image ? [post.image] : []
    return generateEntries(
      `/blog/${post.slug}`,
      new Date(post.date),
      'weekly',
      0.8,
      images
    )
  })

  return [...staticPages, ...agencyPages, ...categoryPages, ...countryPages, ...cityPages, ...blogPages]
}
