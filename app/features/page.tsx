import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Book, LayoutGrid, Key, MessageSquare, Code } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import type { Metadata } from "next"

// Force static generation for this page
export const dynamic = "force-static"
export const revalidate = 3600 // Revalidate every hour

export const metadata: Metadata = {
  title: "Features - AI-Powered Content Creation Tools",
  description:
    "Discover the powerful features that make CreaVibe the ultimate platform for content creators and developers.",
  openGraph: {
    title: "CreaVibe Features - AI-Powered Content Creation Tools",
    description:
      "Discover the powerful features that make CreaVibe the ultimate platform for content creators and developers.",
    images: [
      {
        url: "/api/og?title=CreaVibe%20Features",
        width: 1200,
        height: 630,
        alt: "CreaVibe Features",
      },
    ],
  },
}

export default function FeaturesPage() {
  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    AI-Powered Content Creation Features
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Discover the powerful features that make CreaVibe the ultimate platform for content creators and
                    developers.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">Try It Free</Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <Image
                  src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1920&auto=format&fit=crop"
                  alt="AI content creation features showing a person using a computer with creative visualizations"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Core Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore the powerful tools that make CreaVibe the ultimate content creation platform
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Zap className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>AI Content Generation</CardTitle>
                  <CardDescription>Create high-quality content with advanced AI models</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Blog posts, articles, and marketing copy</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Customizable tone, style, and length</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>SEO optimization and keyword targeting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Multiple language support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Book className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>WebBooks</CardTitle>
                  <CardDescription>Publish and share your content in beautiful, interactive formats</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Responsive, customizable layouts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Custom domains and branding</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Interactive elements and media embedding</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Analytics and engagement tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <LayoutGrid className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>Organize and track all your content projects efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Kanban boards and task management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Team collaboration and role management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Progress tracking and deadlines</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Content calendar and scheduling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Key className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>API Tokens</CardTitle>
                  <CardDescription>Integrate our AI content generation into your own applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>RESTful endpoints for all content types</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Secure authentication and token management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Rate limiting and usage controls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Comprehensive API documentation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Feedback System</CardTitle>
                  <CardDescription>Collect and manage feedback on your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Inline comments and annotations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Version history and change tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Approval workflows and status tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Client feedback collection</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Code className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Developer-Ready</CardTitle>
                  <CardDescription>Built with developers in mind, offering extensive customization</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Webhooks for event-driven integrations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Custom integrations with third-party services</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>Extensive documentation and code examples</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                      <span>SDK support for popular languages</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how our features work together to streamline your content creation workflow
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span>1</span>
                  </div>
                  <h3 className="text-xl font-bold">Generate Content Using AI Tools</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Start by using our AI content generation tools to create high-quality blog posts, articles, marketing
                  copy, and more. Customize the tone, style, and length to match your specific needs.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1920&auto=format&fit=crop"
                  alt="Person using AI content generation tools on a laptop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl order-4 md:order-3">
                <Image
                  src="https://images.unsplash.com/photo-1517292987719-0369a794ec0f?q=80&w=1920&auto=format&fit=crop"
                  alt="Project Organization"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4 order-3 md:order-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span>2</span>
                  </div>
                  <h3 className="text-xl font-bold">Organize in Projects and Create WebBooks</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Organize your content into projects and create beautiful WebBooks for publishing. Customize layouts,
                  add interactive elements, and apply your branding for a professional presentation.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span>3</span>
                  </div>
                  <h3 className="text-xl font-bold">Manage via API Tokens and Track Analytics</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Integrate our content generation capabilities into your own applications using API tokens. Track
                  usage, monitor performance, and analyze engagement with comprehensive analytics.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop"
                  alt="API Management"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl order-8 md:order-7">
                <Image
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=1920&auto=format&fit=crop"
                  alt="Feedback Collection"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4 order-7 md:order-8">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span>4</span>
                  </div>
                  <h3 className="text-xl font-bold">Gather Feedback and Iterate</h3>
                </div>
                <p className="text-muted-foreground pl-14">
                  Collect feedback from team members and clients using our built-in feedback system. Track changes,
                  manage versions, and iterate on your content to achieve the best results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Your Content Creation?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers powerful AI tools, seamless integrations, and developer-friendly APIs to
                  streamline your workflow.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Try Content Generation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/api">View API Documentation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
