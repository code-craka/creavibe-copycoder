"use client"

import Head from "next/head"
import { useRouter } from "next/router"

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  type?: string
  date?: string
  updatedAt?: string
}

export default function MetaTags({
  title = "CreaVibe - AI-Powered Content Creation Platform",
  description = "Create AI-powered content with WebBooks and project management capabilities",
  image = "/images/og-image.jpg",
  type = "website",
  date,
  updatedAt,
}: MetaTagsProps) {
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://creavibe.com"
  const url = `${baseUrl}${router.asPath}`
  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Article specific tags */}
      {date && <meta property="article:published_time" content={date} />}
      {updatedAt && <meta property="article:modified_time" content={updatedAt} />}
      <meta property="og:site_name" content="CreaVibe" />
    </Head>
  )
}
