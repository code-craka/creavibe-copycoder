"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface ApiEndpoint {
  name: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  description: string
  authentication?: boolean
  parameters?: {
    name: string
    type: string
    required: boolean
    description: string
  }[]
  requestBody?: {
    type: string
    properties: {
      name: string
      type: string
      required: boolean
      description: string
    }[]
  }
  responses: {
    status: number
    description: string
    example: any
  }[]
}

interface ApiDocumentationProps {
  endpoints: ApiEndpoint[]
  baseUrl?: string
}

export function ApiDocumentation({ endpoints, baseUrl = "/api" }: ApiDocumentationProps) {
  const [activeEndpoint, setActiveEndpoint] = useState<ApiEndpoint | null>(endpoints[0] || null)
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(`${baseUrl}${path}`)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const methodColors = {
    GET: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    POST: "bg-green-500/10 text-green-500 border-green-500/20",
    PUT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    DELETE: "bg-red-500/10 text-red-500 border-red-500/20",
    PATCH: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>Select an endpoint to view its documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <div
                    key={`${endpoint.method}-${endpoint.path}`}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      activeEndpoint?.path === endpoint.path && activeEndpoint?.method === endpoint.method
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => setActiveEndpoint(endpoint)}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={methodColors[endpoint.method]}>
                        {endpoint.method}
                      </Badge>
                      <span className="text-sm font-medium">{endpoint.name}</span>
                    </div>
                    <div className="mt-2 text-xs font-mono text-muted-foreground">{endpoint.path}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {activeEndpoint ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{activeEndpoint.name}</CardTitle>
                  <CardDescription>{activeEndpoint.description}</CardDescription>
                </div>
                <Badge variant="outline" className={methodColors[activeEndpoint.method]}>
                  {activeEndpoint.method}
                </Badge>
              </div>
              <div className="flex items-center mt-2">
                <code className="text-sm bg-muted p-2 rounded font-mono flex-1">
                  {baseUrl}
                  {activeEndpoint.path}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyPath(activeEndpoint.path)}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy path</span>
                </Button>
                {copiedPath === activeEndpoint.path && (
                  <span className="text-xs text-muted-foreground ml-2">Copied!</span>
                )}
              </div>
              {activeEndpoint.authentication && (
                <Badge variant="outline" className="mt-2">
                  Requires Authentication
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="parameters">
                <TabsList className="mb-4">
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="request">Request Body</TabsTrigger>
                  <TabsTrigger value="responses">Responses</TabsTrigger>
                </TabsList>

                <TabsContent value="parameters">
                  {activeEndpoint.parameters && activeEndpoint.parameters.length > 0 ? (
                    <div className="border rounded-md">
                      <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50">
                        <div className="font-medium">Name</div>
                        <div className="font-medium">Type</div>
                        <div className="font-medium">Required</div>
                        <div className="font-medium">Description</div>
                      </div>
                      {activeEndpoint.parameters.map((param, index) => (
                        <div
                          key={param.name}
                          className={`grid grid-cols-4 gap-4 p-3 ${
                            index < activeEndpoint.parameters!.length - 1 ? "border-b" : ""
                          }`}
                        >
                          <div className="font-mono text-sm">{param.name}</div>
                          <div className="text-sm">{param.type}</div>
                          <div>
                            {param.required ? (
                              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                Required
                              </Badge>
                            ) : (
                              <Badge variant="outline">Optional</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{param.description}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No parameters required</div>
                  )}
                </TabsContent>

                <TabsContent value="request">
                  {activeEndpoint.requestBody ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Content Type</h4>
                        <Badge variant="outline">{activeEndpoint.requestBody.type}</Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Properties</h4>
                        <div className="border rounded-md">
                          <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50">
                            <div className="font-medium">Name</div>
                            <div className="font-medium">Type</div>
                            <div className="font-medium">Required</div>
                            <div className="font-medium">Description</div>
                          </div>
                          {activeEndpoint.requestBody.properties.map((prop, index) => (
                            <div
                              key={prop.name}
                              className={`grid grid-cols-4 gap-4 p-3 ${
                                index < activeEndpoint.requestBody!.properties.length - 1 ? "border-b" : ""
                              }`}
                            >
                              <div className="font-mono text-sm">{prop.name}</div>
                              <div className="text-sm">{prop.type}</div>
                              <div>
                                {prop.required ? (
                                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                    Required
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Optional</Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">{prop.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No request body required</div>
                  )}
                </TabsContent>

                <TabsContent value="responses">
                  <Accordion type="single" collapsible className="w-full">
                    {activeEndpoint.responses.map((response) => (
                      <AccordionItem key={response.status} value={response.status.toString()}>
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <Badge
                              variant="outline"
                              className={
                                response.status >= 200 && response.status < 300
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : response.status >= 400
                                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              }
                            >
                              {response.status}
                            </Badge>
                            <span className="ml-2 text-sm">{response.description}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">
                            {JSON.stringify(response.example, null, 2)}
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[500px]">
              <p className="text-muted-foreground">Select an endpoint to view its documentation</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
