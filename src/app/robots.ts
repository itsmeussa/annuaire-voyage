import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/_next/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/"],
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/"],
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
      },
    ],
    sitemap: "https://www.travelagencies.world/sitemap.xml",
    host: "https://www.travelagencies.world",
  };
}
