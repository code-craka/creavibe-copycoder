import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface FooterLink {
  label: string
  href: string
  isExternal?: boolean
}

export interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo: React.ReactNode
  columns: FooterColumn[]
  bottomLinks?: FooterLink[]
  copyrightText: string
  className?: string
}

export function Footer({ logo, columns, bottomLinks, copyrightText, className }: FooterProps): JSX.Element {
  const currentYear = new Date().getFullYear()
  const formattedCopyright = copyrightText.replace(/\{year\}/g, currentYear.toString())

  return (
    <footer className={cn("bg-background border-t", className)} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {logo}
            <p className="text-muted-foreground">
              CreaVibe is an AI-powered content creation platform for modern creators and developers.
            </p>
          </div>
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="font-medium text-lg mb-4">{column.title}</h3>
              <ul className="space-y-2" aria-label={`${column.title} links`}>
                {column.links.map((link) =>
                  link.isExternal ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground focus:outline-none focus:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">{formattedCopyright}</p>
          {bottomLinks && bottomLinks.length > 0 && (
            <div className="flex space-x-4 mt-4 md:mt-0">
              {bottomLinks.map((link) =>
                link.isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-foreground focus:outline-none focus:underline"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground text-sm hover:text-foreground focus:outline-none focus:underline"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
