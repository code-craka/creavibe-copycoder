import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                AI Content Creation Plans for Every Scale
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Access to blog, image, and video generators with flexible pricing options for individual creators to
                enterprise teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <Tabs defaultValue="monthly" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual (Save 20%)</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="monthly">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Starter</CardTitle>
                    <CardDescription>For individual creators and small projects</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$9</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>10,000 AI tokens per month</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>3 WebBooks</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Basic content templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Email support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>1 user</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/signup?plan=starter">Choose Starter</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col border-primary">
                  <CardHeader>
                    <div className="px-4 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-fit mb-2">
                      MOST POPULAR
                    </div>
                    <CardTitle>Professional</CardTitle>
                    <CardDescription>For professional creators and small teams</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$29</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>50,000 AI tokens per month</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>10 WebBooks</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Advanced content templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Priority email support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>3 team members</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>API access</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom domains</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/signup?plan=professional">Choose Professional</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For agencies and large teams with custom needs</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">Custom</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom AI token allocation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Unlimited WebBooks</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom content templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Dedicated support manager</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Unlimited team members</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Advanced API access</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom integrations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>SSO authentication</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="annual">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Starter</CardTitle>
                    <CardDescription>For individual creators and small projects</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$7</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Billed annually ($84)</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>10,000 AI tokens per month</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>3 WebBooks</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Basic content templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Email support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>1 user</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/signup?plan=starter-annual">Choose Starter</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col border-primary">
                  <CardHeader>
                    <div className="px-4 py-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-fit mb-2">
                      MOST POPULAR
                    </div>
                    <CardTitle>Professional</CardTitle>
                    <CardDescription>For professional creators and small teams</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">$23</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Billed annually ($276)</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>50,000 AI tokens per month</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>10 WebBooks</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Advanced content templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Priority email support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>3 team members</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>API access</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom domains</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/signup?plan=professional-annual">Choose Professional</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For agencies and large teams with custom needs</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">Custom</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom AI token allocation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Unlimited WebBooks</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom content templates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Dedicated support manager</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Unlimited team members</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Advanced API access</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>Custom integrations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        <span>SSO authentication</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/contact">Contact Sales</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <span className="text-sm text-muted-foreground">Secure payment via Stripe</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find answers to common questions about our pricing and plans
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl mt-12">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does billing work?</AccordionTrigger>
                <AccordionContent>
                  We offer both monthly and annual billing cycles. Monthly plans are billed at the beginning of each
                  month, while annual plans are billed once per year with a 20% discount. You can upgrade or downgrade
                  your plan at any time, and we'll prorate the difference.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I upgrade or downgrade my plan?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time from your account settings. When upgrading,
                  you'll be charged the prorated difference for the remainder of your billing cycle. When downgrading,
                  the new rate will apply at the start of your next billing cycle.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What happens if I exceed my usage limits?</AccordionTrigger>
                <AccordionContent>
                  If you exceed your monthly AI token allocation, you'll have the option to purchase additional tokens
                  or upgrade to a higher plan. We'll notify you when you reach 80% of your limit so you can plan
                  accordingly. Your account will never be automatically charged for overages without your consent.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Do I own the content created with CreaVibe?</AccordionTrigger>
                <AccordionContent>
                  Yes, you retain full ownership of all content created using our platform. You can use the content for
                  commercial purposes, and we make no claims to ownership or copyright of the generated content.
                  However, we recommend reviewing and editing AI-generated content before publishing to ensure accuracy
                  and quality.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is my payment information secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we use Stripe for payment processing, which is PCI-DSS compliant and employs industry-standard
                  security measures. We never store your full credit card details on our servers. All payment
                  information is encrypted and securely transmitted.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Creating with AI Today</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                14-day money-back guarantee. Get instant access to our AI content generators.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Choose Plan</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
