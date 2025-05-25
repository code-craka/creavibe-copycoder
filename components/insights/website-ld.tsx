"use client";

import React from "react";
import Script from "next/script";

/**
 * WebsiteLD Component
 * Provides JSON-LD structured data for the website
 * This helps search engines understand the website structure and content
 */
export function WebsiteLD() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CreaVibe",
    "url": "https://creavibe.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://creavibe.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "AI-Powered Content Creation Platform for creators and businesses",
    "publisher": {
      "@type": "Organization",
      "name": "CreaVibe",
      "logo": {
        "@type": "ImageObject",
        "url": "https://creavibe.com/logo.png"
      }
    }
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />
  );
}
