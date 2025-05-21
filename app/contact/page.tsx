import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MessageSquare, Phone, MapPin, ArrowRight } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Contact Us</h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Need help or want to partner with us? We're here to help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Technical Support</CardTitle>
                <CardDescription>Get help with your account or technical issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Our support team is available Monday through Friday, 9am-5pm ET.
                </p>
                <p className="font-medium">support@creavibe.com</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="https://help.creavibe.com">Visit Help Center</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Phone className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Business Inquiries</CardTitle>
                <CardDescription>For partnerships, enterprise plans, and sales</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Interested in enterprise solutions or partnerships? Let's talk.
                </p>
                <p className="font-medium">sales@creavibe.com</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="#contact-form">Schedule a Call</Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Feedback</CardTitle>
                <CardDescription>Share your thoughts and suggestions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  We love hearing from our users. Your feedback helps us improve.
                </p>
                <p className="font-medium">feedback@creavibe.com</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="https://feedback.creavibe.com">Submit Feedback</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8" id="contact-form">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">Fill out the form and we'll get back to you as soon as possible.</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Please provide details about your inquiry..." rows={5} />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg overflow-hidden h-64 md:h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142047342144!2d-122.08400908361592!3d37.38990797983208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDIzJzIzLjciTiAxMjLCsDA0JzU5LjgiVw!5e0!3m2!1sen!2sus!4v1620841112162!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="CreaVibe Office Location"
                ></iframe>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Our Locations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">San Francisco</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">
                      123 Market Street
                      <br />
                      San Francisco, CA 94105
                      <br />
                      United States
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">London</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-7">
                      456 Oxford Street
                      <br />
                      London, W1C 1AP
                      <br />
                      United Kingdom
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Need Immediate Assistance?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our live chat is the fastest way to get help from our support team.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" asChild>
                <Link href="#" className="flex items-center">
                  Start Live Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://feedback.creavibe.com">Submit Feedback</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
