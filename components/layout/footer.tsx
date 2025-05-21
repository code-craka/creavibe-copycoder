"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TwitterIcon } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="font-bold text-xl flex items-center" aria-label="CreaVibe Home">
              <span className="text-primary">Crea</span>Vibe
            </Link>
            <p className="text-muted-foreground">
              AI-powered content creation platform for modern creators and developers.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <TwitterIcon className="h-5 w-5" />
              </Button>
              \
