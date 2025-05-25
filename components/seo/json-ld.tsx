interface OrganizationLDProps {
  name?: string
  url?: string
  logo?: string
  sameAs?: string[]
}

interface WebsiteLDProps {
  name?: string
  url?: string
  description?: string
}

export function OrganizationLD({
  name = "CreaVibe",
  url = "https://creavibe.com",
  logo = "https://creavibe.com/logo.png",
  sameAs = ["https://twitter.com/creavibe", "https://linkedin.com/company/creavibe"],
}: OrganizationLDProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    sameAs,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function WebsiteLD({
  name = "CreaVibe",
  url = "https://creavibe.com",
  description = "AI-Powered Content Creation Platform",
}: WebsiteLDProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://creavibe.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
