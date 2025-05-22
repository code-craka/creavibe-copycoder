"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle, Info } from "lucide-react"

// This component is for development use only
export function AccessibilityAudit() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runAudit = async () => {
    setLoading(true)
    setError(null)

    try {
      // We're using the axe-core library for accessibility auditing
      const axe = await import("axe-core")

      // Run the audit on the current page
      const results = await axe.default.run(document)
      setResults(results)
    } catch (err) {
      setError("Failed to run accessibility audit. Make sure axe-core is installed.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== "development") {
      setError("Accessibility audit is only available in development mode")
    }
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Accessibility Audit</span>
          {results && results.violations.length === 0 && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              No Issues
            </Badge>
          )}
          {results && results.violations.length > 0 && (
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
              {results.violations.length} Issues
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Run an accessibility audit on the current page to identify potential issues</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!results && !error && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              Click the "Run Audit" button to check this page for accessibility issues
            </AlertDescription>
          </Alert>
        )}

        {results && (
          <Tabs defaultValue="violations">
            <TabsList className="mb-4">
              <TabsTrigger value="violations">Violations ({results.violations.length})</TabsTrigger>
              <TabsTrigger value="passes">Passes ({results.passes.length})</TabsTrigger>
              <TabsTrigger value="incomplete">Incomplete ({results.incomplete.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="violations">
              {results.violations.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle>No violations found</AlertTitle>
                  <AlertDescription>
                    This page has no automatically detectable accessibility violations
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[400px]">
                  {results.violations.map((violation: any, index: number) => (
                    <div key={index} className="mb-4 p-4 border rounded-md">
                      <h3 className="font-medium text-lg">{violation.help}</h3>
                      <p className="text-muted-foreground mb-2">{violation.description}</p>
                      <div className="flex gap-2 mb-2">
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          {violation.impact}
                        </Badge>
                        <Badge variant="outline">{violation.tags.join(", ")}</Badge>
                      </div>
                      <p className="text-sm font-medium mt-2">Affected elements:</p>
                      <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                        {violation.nodes.map((node: any) => node.html).join("\n")}
                      </pre>
                      <a
                        href={violation.helpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                      >
                        Learn more
                      </a>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="passes">
              <ScrollArea className="h-[400px]">
                {results.passes.map((pass: any, index: number) => (
                  <div key={index} className="mb-4 p-4 border rounded-md">
                    <h3 className="font-medium">{pass.help}</h3>
                    <p className="text-muted-foreground text-sm">{pass.description}</p>
                    <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-500 border-green-500/20">
                      {pass.id}
                    </Badge>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="incomplete">
              <ScrollArea className="h-[400px]">
                {results.incomplete.map((incomplete: any, index: number) => (
                  <div key={index} className="mb-4 p-4 border rounded-md">
                    <h3 className="font-medium">{incomplete.help}</h3>
                    <p className="text-muted-foreground text-sm">{incomplete.description}</p>
                    <Badge variant="outline" className="mt-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                      Needs review
                    </Badge>
                    <p className="text-sm mt-2">This check requires manual verification.</p>
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={runAudit} disabled={loading}>
          {loading ? "Running..." : "Run Audit"}
        </Button>
      </CardFooter>
    </Card>
  )
}
