"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
  isExternal?: boolean
}

interface NavbarProps {
  logo: React.ReactNode
  items: NavItem[]
  rightElements?: React.ReactNode
  className?: string
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl"
}

export function Navbar({ logo, items, rightElements, className, mobileBreakpoint = "md" }: NavbarProps): JSX.Element {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const breakpointClasses = {
    sm: "sm:flex",
    md: "md:flex",
    lg: "lg:flex",
    xl: "xl:flex",
    "2xl": "2xl:flex",
  }

  return (
    <header className={cn("border-b", className)}>
      <div className="flex h-16 items-center px-4 container mx-auto max-w-7xl">
        {logo}

        {/* Desktop Navigation */}
        <nav className={cn("hidden ml-8 space-x-4", breakpointClasses[mobileBreakpoint])}>
          {items.map((item) => {
            const isActive = pathname === item.href
            return item.isExternal ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                )}
              >
                <span className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="flex items-center">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(`${mobileBreakpoint}:hidden ml-auto mr-2`)}
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Right Elements (e.g., theme toggle, auth buttons) */}
        <div className={cn("hidden ml-auto items-center space-x-4", breakpointClasses[mobileBreakpoint])}>
          {rightElements}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={cn(`${mobileBreakpoint}:hidden px-4 py-4 border-t`)}>
          <nav className="flex flex-col space-y-4">
            {items.map((item) => {
              const isActive = pathname === item.href
              return item.isExternal ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </span>
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                  )}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center">
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </span>
                </Link>
              )
            })}
            <div className="pt-4 flex flex-col space-y-4">{rightElements}</div>
          </nav>
        </div>
      )}
    </header>
  )
}
