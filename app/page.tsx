import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, ArrowRightIcon, Zap, Book, LayoutGrid, Key, MessageSquare, Code } from "lucide-react"
import { StructuredData } from "@/components/structured-data"

export default function Home() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CreaVibe",
    url: "https://creavibe.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://creavibe.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    description: "AI-powered content creation platform for modern creators and developers",
    publisher: {
      "@type": "Organization",
      name: "CreaVibe",
      logo: {
        "@type": "ImageObject",
        url: "https://creavibe.com/logo.png",
      },
    },
  }

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    AI-Powered Content Creation Platform
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Create stunning content with our AI tools, publish with WebBooks, and manage your projects
                    efficiently.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild data-analytics-event="cta-get-started-clicked">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild data-analytics-event="cta-learn-more-clicked">
                    <Link href="/features">
                      Learn More <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl lg:aspect-square">
                <Image
                  src="https://images.unsplash.com/photo-1655720828018-edd2daec9349?q=80&w=1920&auto=format&fit=crop"
                  alt="Person using AI content creation tools on a laptop with visualizations of AI-generated content"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50" aria-labelledby="features-heading">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 id="features-heading" className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to create, publish, and manage AI-generated content
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardHeader>
                  <Zap className="h-6 w-6 mb-2 text-primary" aria-hidden="true" />
                  <CardTitle>AI Content Generation</CardTitle>
                  <CardDescription>
                    Create blog posts, articles, and marketing copy with advanced AI models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2" aria-label="AI Content Generation features">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Multiple content types</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Customizable tone and style</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>SEO optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Book className="h-6 w-6 mb-2 text-primary" aria-hidden="true" />
                  <CardTitle>WebBooks</CardTitle>
                  <CardDescription>
                    Publish and share your content in beautiful, interactive web formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2" aria-label="WebBooks features">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Responsive layouts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Custom domains</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Analytics integration</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <LayoutGrid className="h-6 w-6 mb-2 text-primary" aria-hidden="true" />
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>Organize and track all your content projects in one place</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2" aria-label="Project Management features">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Kanban boards</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Team collaboration</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Progress tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Key className="h-6 w-6 mb-2 text-primary" aria-hidden="true" />
                  <CardTitle>API Tokens</CardTitle>
                  <CardDescription>Integrate our AI content generation into your own applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2" aria-label="API Tokens features">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>RESTful endpoints</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Secure authentication</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Rate limiting controls</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-6 w-6 mb-2 text-primary" aria-hidden="true" />
                  <CardTitle>Feedback System</CardTitle>
                  <CardDescription>
                    Collect and manage feedback on your content from team members and clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2" aria-label="Feedback System features">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Inline comments</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Version history</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Approval workflows</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Code className="h-6 w-6 mb-2 text-primary" aria-hidden="true" />
                  <CardTitle>Developer-Ready</CardTitle>
                  <CardDescription>
                    Built with developers in mind, offering extensive customization options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2" aria-label="Developer features">
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Webhooks</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Custom integrations</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                      <span>Extensive documentation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32" aria-labelledby="how-it-works-heading">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 id="how-it-works-heading" className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A simple workflow to create and publish your AI-generated content
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  aria-hidden="true"
                >
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold">Generate Content</h3>
                <p className="text-muted-foreground">
                  Use our AI tools to create high-quality content for your specific needs
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  aria-hidden="true"
                >
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold">Organize Projects</h3>
                <p className="text-muted-foreground">Keep your content organized in projects and create WebBooks</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  aria-hidden="true"
                >
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold">Manage Access</h3>
                <p className="text-muted-foreground">Control access with API tokens and track analytics</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  aria-hidden="true"
                >
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-xl font-bold">Gather Feedback</h3>
                <p className="text-muted-foreground">Collect feedback and iterate on your content</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
          aria-labelledby="cta-heading"
        >
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 id="cta-heading" className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Creating with AI Today
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators and businesses using CreaVibe to power their content
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild data-analytics-event="cta-get-started-free-clicked">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-analytics-event="cta-contact-sales-clicked">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
