import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://creavibe.com"

  // Static routes
  const staticRoutes = ["", "/features", "/pricing", "/contact", "/api", "/login", "/signup", "/privacy", "/terms"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    }),
  )

  // You could also fetch dynamic routes from your database
  // For example, blog posts or other dynamic content
  // const dynamicRoutes = await fetchDynamicRoutes()

  return [...staticRoutes]
}
