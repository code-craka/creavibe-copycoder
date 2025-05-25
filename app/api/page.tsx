import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Terminal, CheckCircle } from "lucide-react"

export default function ApiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  CreaVibe API Documentation
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Integrate AI-powered content generation directly into your applications
                </p>
              </div>
              <ul className="grid gap-2 py-4">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>RESTful endpoints</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>AI content generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Simple integration</span>
                </li>
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/signup">Get API Key</Link>
                </Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center rounded-xl bg-muted p-4">
              <pre className="overflow-x-auto text-sm">
                <code className="language-bash">
                  {`curl -X POST https://api.creavibe.com/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Write a blog post about AI content creation",
    "max_tokens": 500,
    "temperature": 0.7
  }'`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Follow these simple steps to integrate our API into your application
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <span>1</span>
                </div>
                <CardTitle>Obtain API Key</CardTitle>
                <CardDescription>Sign up for an account and generate your API key</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                  <code className="language-bash">
                    {`# Your API key will look like this
YOUR_API_KEY=crv_sk_12345abcdef67890ghijklmn`}
                  </code>
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <span>2</span>
                </div>
                <CardTitle>Make Authenticated Request</CardTitle>
                <CardDescription>Send requests to our endpoints with your API key</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                  <code className="language-javascript">
                    {`// Example using fetch
const response = await fetch(
  'https://api.creavibe.com/v1/generate',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: 'Write a blog post about...',
      max_tokens: 500
    })
  }
);`}
                  </code>
                </pre>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <span>3</span>
                </div>
                <CardTitle>Receive AI-Generated Content</CardTitle>
                <CardDescription>Process the response in your application</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                  <code className="language-javascript">
                    {`// Example response
{
  "id": "gen_123456789",
  "content": "AI-powered content creation has...",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 500,
    "total_tokens": 510
  }
}`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">API Endpoints</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Explore our key API endpoints for different content types
              </p>
            </div>
          </div>
          <div className="mt-12">
            <Tabs defaultValue="blog" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                <TabsTrigger value="blog">Blog Generation</TabsTrigger>
                <TabsTrigger value="image">Image Creation</TabsTrigger>
                <TabsTrigger value="video">Video Scripts</TabsTrigger>
                <TabsTrigger value="webbook">WebBooks</TabsTrigger>
              </TabsList>
              <TabsContent value="blog" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Blog Generation API</CardTitle>
                    <CardDescription>
                      <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                        POST https://api.creavibe.com/v1/generate/blog
                      </code>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Required Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">topic</code>
                            <span className="text-sm">The main topic or title for the blog post</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">length</code>
                            <span className="text-sm">Desired length in words (short, medium, long)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Optional Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">tone</code>
                            <span className="text-sm">Tone of the content (professional, casual, etc.)</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">keywords</code>
                            <span className="text-sm">Array of keywords to include</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Example Response</h4>
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                          <code className="language-json">
                            {`{
  "id": "blog_123456789",
  "content": {
    "title": "The Future of AI Content Creation",
    "body": "AI-powered content creation has revolutionized...",
    "sections": [
      { "heading": "Introduction", "content": "..." },
      { "heading": "Key Benefits", "content": "..." }
    ]
  },
  "meta": {
    "word_count": 750,
    "reading_time": "3 min"
  }
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Try It</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="image" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Creation API</CardTitle>
                    <CardDescription>
                      <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                        POST https://api.creavibe.com/v1/generate/image
                      </code>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Required Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">prompt</code>
                            <span className="text-sm">Detailed description of the image to generate</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Optional Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">size</code>
                            <span className="text-sm">Image dimensions (512x512, 1024x1024, etc.)</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">style</code>
                            <span className="text-sm">Visual style (realistic, cartoon, abstract, etc.)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Example Response</h4>
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                          <code className="language-json">
                            {`{
  "id": "img_123456789",
  "url": "https://api.creavibe.com/images/img_123456789.png",
  "prompt": "A futuristic city with flying cars",
  "width": 1024,
  "height": 1024,
  "format": "png"
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Try It</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="video" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Scripts API</CardTitle>
                    <CardDescription>
                      <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                        POST https://api.creavibe.com/v1/generate/video-script
                      </code>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Required Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">topic</code>
                            <span className="text-sm">Main topic or title for the video</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">duration</code>
                            <span className="text-sm">Approximate video length in minutes</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Optional Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">format</code>
                            <span className="text-sm">Script format (tutorial, explainer, interview, etc.)</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">audience</code>
                            <span className="text-sm">Target audience (beginners, experts, etc.)</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Example Response</h4>
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                          <code className="language-json">
                            {`{
  "id": "script_123456789",
  "title": "How to Use AI for Content Creation",
  "estimated_duration": "5 minutes",
  "script": {
    "intro": "Hello and welcome to this video about...",
    "sections": [
      {
        "title": "What is AI Content Creation",
        "content": "...",
        "visual_notes": "Show examples of AI-generated content"
      },
      {
        "title": "Benefits and Use Cases",
        "content": "...",
        "visual_notes": "Display statistics and case studies"
      }
    ],
    "outro": "Thanks for watching! Don't forget to subscribe..."
  }
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Try It</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="webbook" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>WebBooks API</CardTitle>
                    <CardDescription>
                      <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded">
                        POST https://api.creavibe.com/v1/webbooks
                      </code>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Required Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">title</code>
                            <span className="text-sm">Title of the WebBook</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">content</code>
                            <span className="text-sm">Array of content sections or content IDs</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Optional Parameters</h4>
                        <ul className="mt-2 grid gap-2">
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">theme</code>
                            <span className="text-sm">Visual theme for the WebBook</span>
                          </li>
                          <li className="flex items-start">
                            <code className="text-sm font-mono bg-muted px-1 py-0.5 rounded mr-2">custom_domain</code>
                            <span className="text-sm">Custom domain for publishing</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Example Response</h4>
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                          <code className="language-json">
                            {`{
  "id": "wb_123456789",
  "title": "Complete Guide to AI Content Creation",
  "url": "https://creavibe.com/webbooks/wb_123456789",
  "custom_url": "https://your-domain.com/ai-guide",
  "sections": [
    { "id": "sec_1", "title": "Introduction", "type": "text" },
    { "id": "sec_2", "title": "Getting Started", "type": "text" },
    { "id": "sec_3", "title": "Advanced Techniques", "type": "text" }
  ],
  "created_at": "2023-05-15T10:30:00Z",
  "status": "published"
}`}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Try It</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to Integrate AI Content Creation?
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed">
                  Get started with our API today and transform your content workflow
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">Get API Access</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/docs">View Full Documentation</Link>
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80">
                Free tier includes 1,000 API calls per month. See our pricing page for rate limits and additional tiers.
              </p>
            </div>
            <div className="relative flex items-center justify-center rounded-xl bg-primary-foreground/10 p-4">
              <Terminal className="h-24 w-24 text-primary-foreground/50" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
