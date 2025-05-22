"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ComponentDocumentationProps {
  title: string
  description: string
  component: React.ReactNode
  code: string
  props?: {
    name: string
    type: string
    defaultValue?: string
    required?: boolean
    description: string
  }[]
  usage?: {
    title: string
    description: string
    code: string
    component: React.ReactNode
  }[]
}

export function ComponentDocumentation({
  title,
  description,
  component,
  code,
  props = [],
  usage = [],
}: ComponentDocumentationProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            {activeTab === "code" && (
              <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                {copied ? "Copied!" : "Copy"}
                <Copy className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <CardContent className="p-6">
            <TabsContent value="preview" className="mt-0">
              <div className="flex items-center justify-center p-6 border rounded-md">{component}</div>
            </TabsContent>
            <TabsContent value="code" className="mt-0">
              <ScrollArea className="h-[300px] w-full rounded-md border">
                <pre className="p-4 text-sm font-mono">
                  <code>{code}</code>
                </pre>
              </ScrollArea>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {props.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Props</CardTitle>
            <CardDescription>The properties that can be passed to this component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50">
                <div className="font-medium">Name</div>
                <div className="font-medium">Type</div>
                <div className="font-medium">Default</div>
                <div className="font-medium">Description</div>
              </div>
              {props.map((prop, index) => (
                <div
                  key={prop.name}
                  className={`grid grid-cols-4 gap-4 p-3 ${index < props.length - 1 ? "border-b" : ""}`}
                >
                  <div className="font-mono text-sm flex items-center">
                    {prop.name}
                    {prop.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  <div className="text-sm font-mono">{prop.type}</div>
                  <div className="text-sm font-mono text-muted-foreground">{prop.defaultValue || "-"}</div>
                  <div className="text-sm text-muted-foreground">{prop.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {usage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>Different ways to use this component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {usage.map((example, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{example.title}</h3>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                  </div>

                  <Tabs defaultValue="preview">
                    <div className="flex items-center justify-between mb-2">
                      <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                      </TabsList>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(example.code)
                        }}
                      >
                        Copy
                        <Copy className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="border rounded-md">
                      <TabsContent value="preview" className="p-6 flex items-center justify-center">
                        {example.component}
                      </TabsContent>
                      <TabsContent value="code">
                        <ScrollArea className="h-[200px]">
                          <pre className="p-4 text-sm font-mono">
                            <code>{example.code}</code>
                          </pre>
                        </ScrollArea>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
