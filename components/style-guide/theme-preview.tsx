"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

interface ThemePreviewProps {
  className?: string
}

export function ThemePreview({ className = "" }: ThemePreviewProps): JSX.Element {
  const { theme, setTheme } = useTheme()
  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null)

  const handleMouseEnter = (side: "left" | "right"): void => {
    setHoverSide(side)
    if (side === "left") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  const handleMouseLeave = (): void => {
    setHoverSide(null)
  }

  return (
    <div className={`grid grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <div
        className={`p-6 bg-surface transition-all duration-300 ${hoverSide === "right" ? "opacity-50" : "opacity-100"}`}
        onMouseEnter={() => handleMouseEnter("left")}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Light Mode</h3>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Buttons</h4>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Card</h4>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content and information displayed here.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Typography</h4>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Heading 1</h1>
              <h2 className="text-xl font-bold">Heading 2</h2>
              <p className="text-base">Regular paragraph text</p>
              <p className="text-sm text-muted-foreground">Muted text for less emphasis</p>
              <a href="#" className="text-primary hover:underline">
                Link text
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`p-6 bg-surface dark transition-all duration-300 ${
          hoverSide === "left" ? "opacity-50" : "opacity-100"
        }`}
        onMouseEnter={() => handleMouseEnter("right")}
        onMouseLeave={handleMouseLeave}
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Dark Mode</h3>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Buttons</h4>
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Card</h4>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content and information displayed here.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Typography</h4>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Heading 1</h1>
              <h2 className="text-xl font-bold">Heading 2</h2>
              <p className="text-base">Regular paragraph text</p>
              <p className="text-sm text-muted-foreground">Muted text for less emphasis</p>
              <a href="#" className="text-primary hover:underline">
                Link text
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
