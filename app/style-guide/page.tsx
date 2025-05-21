import type { Metadata } from "next"
import { ThemePreview } from "@/components/style-guide/theme-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { lightTheme, darkTheme } from "@/lib/theme"

export const metadata: Metadata = {
  title: "Style Guide | CreaVibe",
  description: "Design system and component library for CreaVibe platform",
}

export default function StyleGuidePage(): JSX.Element {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">CreaVibe Style Guide</h1>
          <p className="text-xl text-muted-foreground">
            Design system and component library for consistent user experiences
          </p>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Theme Preview</h2>
          <p className="mb-6 text-muted-foreground">
            Hover over each side to preview the theme. The theme will automatically switch to match the side you're
            hovering over.
          </p>
          <ThemePreview className="mb-8" />
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Color System</h2>
          <Tabs defaultValue="light">
            <TabsList className="mb-6">
              <TabsTrigger value="light">Light Mode</TabsTrigger>
              <TabsTrigger value="dark">Dark Mode</TabsTrigger>
            </TabsList>
            <TabsContent value="light">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(lightTheme).map(([name, color]) => (
                  <Card key={name}>
                    <div className="h-24 rounded-t-lg" style={{ backgroundColor: color }} aria-hidden="true"></div>
                    <CardContent className="pt-4">
                      <h3 className="font-medium capitalize">{name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{color}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="dark">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(darkTheme).map(([name, color]) => (
                  <Card key={name}>
                    <div className="h-24 rounded-t-lg" style={{ backgroundColor: color }} aria-hidden="true"></div>
                    <CardContent className="pt-4">
                      <h3 className="font-medium capitalize">{name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{color}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Typography</h2>
          <Card>
            <CardHeader>
              <CardTitle>Text Styles</CardTitle>
              <CardDescription>Typography scale and text styles used throughout the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-1">Heading 1</h1>
                <p className="text-sm text-muted-foreground font-mono">text-4xl font-bold</p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">Heading 2</h2>
                <p className="text-sm text-muted-foreground font-mono">text-3xl font-bold</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1">Heading 3</h3>
                <p className="text-sm text-muted-foreground font-mono">text-2xl font-bold</p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Heading 4</h4>
                <p className="text-sm text-muted-foreground font-mono">text-xl font-bold</p>
              </div>
              <div>
                <p className="text-base mb-1">
                  Body text - The quick brown fox jumps over the lazy dog. This paragraph contains standard body text
                  used for most content.
                </p>
                <p className="text-sm text-muted-foreground font-mono">text-base</p>
              </div>
              <div>
                <p className="text-sm mb-1">
                  Small text - The quick brown fox jumps over the lazy dog. This paragraph uses smaller text for
                  secondary information.
                </p>
                <p className="text-sm text-muted-foreground font-mono">text-sm</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">
                  Muted text - The quick brown fox jumps over the lazy dog. This paragraph uses muted text for less
                  emphasis.
                </p>
                <p className="text-sm text-muted-foreground font-mono">text-muted-foreground</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Button variants for different actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Primary</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button>Default</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Secondary</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary">Default</Button>
                    <Button variant="secondary" disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Outline</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline">Default</Button>
                    <Button variant="outline" disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Ghost</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost">Default</Button>
                    <Button variant="ghost" disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Destructive</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="destructive">Default</Button>
                    <Button variant="destructive" disabled>
                      Disabled
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Sizes</h4>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Button size="sm">Small</Button>
                    <Button>Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Badge variants for different states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Default</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Badge</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Secondary</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Badge</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Outline</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Badge</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Destructive</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="destructive">Badge</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Accessibility Guidelines</h2>
          <Card>
            <CardHeader>
              <CardTitle>WCAG Compliance</CardTitle>
              <CardDescription>Ensuring our platform is accessible to all users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Color Contrast</h4>
                <p>All text meets WCAG AA standards for contrast ratio (4.5:1 for normal text, 3:1 for large text).</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Keyboard Navigation</h4>
                <p>
                  All interactive elements are accessible via keyboard, with visible focus states and logical tab order.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Screen Readers</h4>
                <p>
                  Proper ARIA attributes and semantic HTML ensure screen reader compatibility throughout the
                  application.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Responsive Design</h4>
                <p>
                  All components adapt to different screen sizes and maintain usability on mobile and desktop devices.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
