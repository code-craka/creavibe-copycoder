import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, AlertCircle, Check, X } from "lucide-react"
import { lightTheme, darkTheme } from "@/lib/theme"

export const metadata: Metadata = {
  title: "Design System | CreaVibe",
  description: "CreaVibe design system and component library",
}

export default function DesignSystemPage() {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">CreaVibe Design System</h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive guide to our design system and component library
          </p>
        </div>

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
          <h2 className="text-2xl font-bold mb-6">Buttons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different button styles for various actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Sizes</h3>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">States</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>Default</Button>
                  <Button disabled>Disabled</Button>
                  <Button className="cursor-wait">Loading</Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">With Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>
                    <Check className="mr-2 h-4 w-4" /> Accept
                  </Button>
                  <Button variant="destructive">
                    <X className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Form Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Text Inputs</CardTitle>
                <CardDescription>Text input fields for collecting user data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-input">Default Input</Label>
                  <Input id="default-input" placeholder="Enter text here" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled-input">Disabled Input</Label>
                  <Input id="disabled-input" placeholder="Disabled input" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="error-input">Input with Error</Label>
                  <Input id="error-input" placeholder="Error state" className="border-destructive" />
                  <p className="text-sm text-destructive">This field is required</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="textarea-input">Textarea</Label>
                  <Textarea id="textarea-input" placeholder="Enter longer text here" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selection Controls</CardTitle>
                <CardDescription>Controls for selecting options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Checkboxes</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms">Accept terms and conditions</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="newsletter" defaultChecked />
                      <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="disabled-checkbox" disabled />
                      <Label htmlFor="disabled-checkbox" className="text-muted-foreground">
                        Disabled option
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Radio Buttons</h3>
                  <RadioGroup defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Option One</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Option Two</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" disabled />
                      <Label htmlFor="option-three" className="text-muted-foreground">
                        Option Three (Disabled)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Switch</h3>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Airplane Mode</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Select</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>A simple card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the main content area of the card where you can place text and other elements.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>A card with a footer for actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card includes a footer section for buttons or other actions.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>

            <Card>
              <img
                src="/abstract-geometric-flow.png"
                alt="Abstract design"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardHeader>
                <CardTitle>Card with Image</CardTitle>
                <CardDescription>A card with an image at the top</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Cards can include images to make them more visually appealing.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Alerts and Notifications</h2>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>This is an informational alert for general notifications.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>This is an error alert for critical issues that need attention.</AlertDescription>
            </Alert>
            <Alert className="border-primary">
              <Check className="h-4 w-4 text-primary" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>This is a success alert for confirming completed actions.</AlertDescription>
            </Alert>
            <Alert className="border-yellow-500">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>This is a warning alert for potential issues that need attention.</AlertDescription>
            </Alert>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Navigation</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Breadcrumbs</CardTitle>
              <CardDescription>Navigation aid to show the current page's location</CardDescription>
            </CardHeader>
            <CardContent>
              <nav aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Home
                    </a>
                  </li>
                  <li className="text-muted-foreground">/</li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Products
                    </a>
                  </li>
                  <li className="text-muted-foreground">/</li>
                  <li>
                    <a href="#" className="font-medium text-foreground" aria-current="page">
                      Product Details
                    </a>
                  </li>
                </ol>
              </nav>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
              <CardDescription>Switch between different views</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tab1">
                <TabsList className="mb-4">
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <p>Content for Tab 1</p>
                </TabsContent>
                <TabsContent value="tab2">
                  <p>Content for Tab 2</p>
                </TabsContent>
                <TabsContent value="tab3">
                  <p>Content for Tab 3</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagination</CardTitle>
              <CardDescription>Navigate through multiple pages of content</CardDescription>
            </CardHeader>
            <CardContent>
              <nav aria-label="Pagination" className="flex justify-center">
                <ul className="flex items-center space-x-1">
                  <li>
                    <Button variant="outline" size="icon" disabled>
                      <span className="sr-only">Previous page</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                  </li>
                  <li>
                    <span className="px-2">...</span>
                  </li>
                  <li>
                    <Button variant="outline" size="sm">
                      8
                    </Button>
                  </li>
                  <li>
                    <Button variant="outline" size="icon">
                      <span className="sr-only">Next page</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  </li>
                </ul>
              </nav>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Data Display</h2>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Small status descriptors for UI elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Accordion</CardTitle>
              <CardDescription>Vertically stacked sections that can be expanded/collapsed</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern and is fully keyboard navigable.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that match the other components' aesthetic.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It's animated by default, but you can disable it if you prefer.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table</CardTitle>
              <CardDescription>Display tabular data in rows and columns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of recent invoices</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>INV001</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Paid
                      </Badge>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV002</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      >
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>PayPal</TableCell>
                    <TableCell className="text-right">$150.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>INV003</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Overdue
                      </Badge>
                    </TableCell>
                    <TableCell>Bank Transfer</TableCell>
                    <TableCell className="text-right">$350.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Interactive Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Slider</CardTitle>
                <CardDescription>Select a value from a range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Default Slider</h3>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3">Range Slider</h3>
                    <Slider defaultValue={[25, 75]} max={100} step={1} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tooltip</CardTitle>
                <CardDescription>Display additional information on hover</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover Me</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a tooltip that provides additional information</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Theme Toggle</h2>
          <Card>
            <CardHeader>
              <CardTitle>Theme Switcher</CardTitle>
              <CardDescription>Toggle between light and dark mode</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ThemeToggle />
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Accessibility Features</h2>
          <Card>
            <CardHeader>
              <CardTitle>WCAG Compliance</CardTitle>
              <CardDescription>Ensuring our design system is accessible to all users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Skip to Content</h3>
                <p className="mb-2">
                  A skip link is provided at the beginning of each page to allow keyboard users to bypass navigation and
                  go directly to the main content. Try pressing Tab when the page first loads to see it.
                </p>
                <div className="p-4 border rounded-md">
                  <code className="text-sm">
                    {`<a href="#main-content" className="sr-only focus:not-sr-only ...">Skip to content</a>`}
                  </code>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-2">ARIA Attributes</h3>
                <p className="mb-2">
                  All interactive components include appropriate ARIA attributes to ensure they are properly announced
                  by screen readers.
                </p>
                <div className="p-4 border rounded-md">
                  <code className="text-sm">{`<Button aria-label="Close dialog">Close</Button>`}</code>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-2">Keyboard Navigation</h3>
                <p className="mb-2">
                  All interactive elements are accessible via keyboard, with visible focus states and logical tab order.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button>Tab through me</Button>
                  <Button variant="outline">And then me</Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-2">Color Contrast</h3>
                <p className="mb-2">
                  All text meets WCAG AA standards for contrast ratio (4.5:1 for normal text, 3:1 for large text).
                </p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-4 bg-primary text-primary-foreground rounded-md">
                    Primary button text (Passes AA)
                  </div>
                  <div className="p-4 bg-muted text-muted-foreground rounded-md">
                    Muted text on muted background (Passes AA)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">GDPR Compliance</h2>
          <Card>
            <CardHeader>
              <CardTitle>Cookie Consent</CardTitle>
              <CardDescription>Managing user consent for cookies and tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Our cookie consent banner appears on first visit and allows users to manage their consent preferences.
                Analytics and tracking are only enabled after explicit user consent.
              </p>
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Cookie Consent</h4>
                    <p className="text-sm text-muted-foreground">
                      We use cookies to enhance your browsing experience and analyze our traffic.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Decline
                    </Button>
                    <Button size="sm">Accept All</Button>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="text-lg font-medium mb-2">Form Consent</h3>
                <p className="mb-2">
                  All forms that collect user data include a clear consent checkbox and a link to the privacy policy.
                </p>
                <div className="p-4 border rounded-md">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-example">Email</Label>
                      <Input id="email-example" type="email" placeholder="name@example.com" />
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox id="gdpr-consent-example" />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="gdpr-consent-example"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <a href="/terms" className="text-primary underline-offset-4 hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="text-primary underline-offset-4 hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>
                    <Button>Subscribe</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
