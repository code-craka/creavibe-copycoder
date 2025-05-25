"use client";

import React from "react";
import Script from "next/script";

/**
 * OrganizationLD Component
 * Provides JSON-LD structured data for the organization
 * This helps search engines understand the organization behind the website
 */
export function OrganizationLD() {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CreaVibe",
    "url": "https://creavibe.com",
    "logo": "https://creavibe.com/logo.png",
    "description": "AI-Powered Content Creation Platform",
    "sameAs": [
      "https://twitter.com/creavibe",
      "https://linkedin.com/company/creavibe",
      "https://github.com/creavibe"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-555-5555",
      "contactType": "customer service",
      "email": "support@creavibe.com",
      "availableLanguage": "English"
    }
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
    />
  );
}
