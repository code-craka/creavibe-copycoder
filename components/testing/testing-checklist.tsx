"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Download, Clipboard, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

interface ChecklistSection {
  id: string
  title: string
  items: ChecklistItem[]
}

export function TestingChecklist() {
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      id: "browser-compatibility",
      title: "Browser Compatibility",
      items: [
        { id: "chrome", label: "Chrome (latest)", checked: false },
        { id: "safari", label: "Safari (latest)", checked: false },
        { id: "firefox", label: "Firefox (latest)", checked: false },
        { id: "edge", label: "Edge (latest)", checked: false },
        { id: "ios-safari", label: "iOS Safari", checked: false },
        { id: "android-chrome", label: "Android Chrome", checked: false },
      ],
    },
    {
      id: "form-validation",
      title: "Form Validation",
      items: [
        { id: "empty-fields", label: "Empty required fields show appropriate errors", checked: false },
        { id: "invalid-email", label: "Invalid email format shows error message", checked: false },
        { id: "password-requirements", label: "Password requirements are enforced and errors shown", checked: false },
        { id: "max-length", label: "Max length validation works correctly", checked: false },
        { id: "min-length", label: "Min length validation works correctly", checked: false },
        { id: "special-characters", label: "Special characters are handled properly", checked: false },
        { id: "form-submission", label: "Form cannot be submitted with validation errors", checked: false },
        { id: "error-focus", label: "Focus moves to first field with error after submission attempt", checked: false },
      ],
    },
    {
      id: "theme-switching",
      title: "Theme Switching",
      items: [
        { id: "light-mode", label: "Light mode displays correctly", checked: false },
        { id: "dark-mode", label: "Dark mode displays correctly", checked: false },
        { id: "system-preference", label: "System preference setting works correctly", checked: false },
        { id: "theme-persistence", label: "Theme preference persists between sessions", checked: false },
        { id: "theme-transition", label: "Transition between themes is smooth", checked: false },
        { id: "theme-components", label: "All components render correctly in both themes", checked: false },
      ],
    },
    {
      id: "authentication-flow",
      title: "Authentication Flow",
      items: [
        { id: "signup", label: "Sign up with email works correctly", checked: false },
        { id: "login", label: "Login with email/password works correctly", checked: false },
        { id: "logout", label: "Logout functionality works correctly", checked: false },
        { id: "password-reset", label: "Password reset flow works correctly", checked: false },
        { id: "oauth-google", label: "Google OAuth integration works correctly", checked: false },
        { id: "oauth-github", label: "GitHub OAuth integration works correctly", checked: false },
        { id: "magic-link", label: "Magic link authentication works correctly", checked: false },
        { id: "session-expiry", label: "Session expiry and renewal works correctly", checked: false },
        { id: "protected-routes", label: "Protected routes redirect unauthenticated users", checked: false },
        { id: "auth-persistence", label: "Authentication state persists between page refreshes", checked: false },
      ],
    },
    {
      id: "responsive-layout",
      title: "Responsive Layout",
      items: [
        { id: "mobile-320px", label: "Mobile (320px) layout displays correctly", checked: false },
        { id: "mobile-375px", label: "Mobile (375px) layout displays correctly", checked: false },
        { id: "mobile-425px", label: "Mobile (425px) layout displays correctly", checked: false },
        { id: "tablet-768px", label: "Tablet (768px) layout displays correctly", checked: false },
        { id: "laptop-1024px", label: "Laptop (1024px) layout displays correctly", checked: false },
        { id: "desktop-1440px", label: "Desktop (1440px) layout displays correctly", checked: false },
        { id: "large-1920px", label: "Large Desktop (1920px) layout displays correctly", checked: false },
        { id: "navigation-mobile", label: "Mobile navigation menu works correctly", checked: false },
        { id: "touch-targets", label: "Touch targets are appropriately sized on mobile", checked: false },
        { id: "image-scaling", label: "Images scale appropriately across screen sizes", checked: false },
        { id: "text-readability", label: "Text remains readable at all screen sizes", checked: false },
      ],
    },
  ])

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "browser-compatibility": true,
    "form-validation": true,
    "theme-switching": true,
    "authentication-flow": true,
    "responsive-layout": true,
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const toggleItem = (sectionId: string, itemId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, checked: !item.checked }
              }
              return item
            }),
          }
        }
        return section
      }),
    )
  }

  const resetChecklist = () => {
    setSections((prevSections) =>
      prevSections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({ ...item, checked: false })),
      })),
    )
  }

  const calculateProgress = () => {
    const totalItems = sections.reduce((total, section) => total + section.items.length, 0)
    const checkedItems = sections.reduce(
      (total, section) => total + section.items.filter((item) => item.checked).length,
      0,
    )
    return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0
  }

  const calculateSectionProgress = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    if (!section) return 0

    const totalItems = section.items.length
    const checkedItems = section.items.filter((item) => item.checked).length
    return totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0
  }

  const exportToMarkdown = () => {
    let markdown = "# QA Testing Checklist\n\n"

    sections.forEach((section) => {
      markdown += `## ${section.title}\n\n`

      section.items.forEach((item) => {
        markdown += `- [${item.checked ? "x" : " "}] ${item.label}\n`
      })

      markdown += "\n"
    })

    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "testing-checklist.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    let markdown = "# QA Testing Checklist\n\n"

    sections.forEach((section) => {
      markdown += `## ${section.title}\n\n`

      section.items.forEach((item) => {
        markdown += `- [${item.checked ? "x" : " "}] ${item.label}\n`
      })

      markdown += "\n"
    })

    navigator.clipboard
      .writeText(markdown)
      .then(() => {
        alert("Checklist copied to clipboard!")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const progress = calculateProgress()

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">QA Testing Checklist</CardTitle>
            <CardDescription>Track your testing progress across different areas</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Clipboard className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={exportToMarkdown}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={resetChecklist}>
              Reset
            </Button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section) => (
          <Collapsible
            key={section.id}
            open={expandedSections[section.id]}
            onOpenChange={() => toggleSection(section.id)}
            className="border rounded-md"
          >
            <div className="flex items-center justify-between p-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={calculateSectionProgress(section.id)} className="h-1.5 w-24" />
                    <span className="text-xs text-muted-foreground">
                      {section.items.filter((item) => item.checked).length}/{section.items.length} completed
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant={calculateSectionProgress(section.id) === 100 ? "success" : "outline"}>
                {calculateSectionProgress(section.id)}%
              </Badge>
            </div>
            <CollapsibleContent>
              <div className="p-4 pt-0 grid gap-3">
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`${section.id}-${item.id}`}
                      checked={item.checked}
                      onCheckedChange={() => toggleItem(section.id, item.id)}
                    />
                    <label
                      htmlFor={`${section.id}-${item.id}`}
                      className={`text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        item.checked ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {sections.reduce((total, section) => total + section.items.filter((item) => item.checked).length, 0)} of{" "}
          {sections.reduce((total, section) => total + section.items.length, 0)} tasks completed
        </div>
        {progress === 100 && (
          <div className="flex items-center text-green-500">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">All tests passed!</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
