"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

/**
 * Analytics Component
 * Tracks page views and initializes analytics services
 */
export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize PostHog if it hasn't been initialized yet
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        capture_pageview: false, // We'll handle this manually
        persistence: "localStorage",
        autocapture: true,
      });
    }
  }, []);

  // Track page views
  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      
      // Track page view in PostHog
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
