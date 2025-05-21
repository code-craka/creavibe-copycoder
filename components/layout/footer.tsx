"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GithubIcon, TwitterIcon, InstagramIcon } from "lucide-react"

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
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <GithubIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Product</h3>
            <ul className="space-y-2" aria-label="Product links">
              <li>
                <Link
                  href="/features"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-2" aria-label="Company links">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-4">Subscribe</h3>
            <p className="text-muted-foreground mb-4">Stay updated with the latest features and releases.</p>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" type="email" aria-label="Email address" required />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} CreaVibe. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-muted-foreground text-sm hover:text-foreground focus:outline-none focus:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground text-sm hover:text-foreground focus:outline-none focus:underline"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-muted-foreground text-sm hover:text-foreground focus:outline-none focus:underline"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
