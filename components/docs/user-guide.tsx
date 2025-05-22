"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface GuideSection {
  id: string
  title: string
  content: React.ReactNode
  subsections?: {
    id: string
    title: string
    content: React.ReactNode
  }[]
}

interface UserGuideProps {
  title: string
  sections: GuideSection[]
}

export function UserGuide({ title, sections }: UserGuideProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "")
  const [activeSubsection, setActiveSubsection] = useState<string | null>(sections[0]?.subsections?.[0]?.id || null)

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    const section = sections.find((s) => s.id === sectionId)
    if (section?.subsections?.length) {
      setActiveSubsection(section.subsections[0].id)
    } else {
      setActiveSubsection(null)
    }
  }

  const currentSection = sections.find((s) => s.id === activeSection)
  const currentSubsection = currentSection?.subsections?.find((s) => s.id === activeSubsection)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-1">
                {sections.map((section) => (
                  <div key={section.id} className="space-y-1">
                    <Button
                      variant={activeSection === section.id ? "secondary" : "ghost"}
                      className="w-full justify-start font-medium"
                      onClick={() => handleSectionClick(section.id)}
                    >
                      {section.title}
                    </Button>

                    {activeSection === section.id && section.subsections && (
                      <div className="ml-4 space-y-1">
                        {section.subsections.map((subsection) => (
                          <Button
                            key={subsection.id}
                            variant={activeSubsection === subsection.id ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-sm"
                            onClick={() => setActiveSubsection(subsection.id)}
                          >
                            <ChevronRight className="mr-1 h-4 w-4" />
                            {subsection.title}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3">
        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="prose dark:prose-invert max-w-none">
                {currentSubsection ? (
                  <>
                    <h1>
                      {currentSection?.title} - {currentSubsection.title}
                    </h1>
                    {currentSubsection.content}
                  </>
                ) : (
                  <>
                    <h1>{currentSection?.title}</h1>
                    {currentSection?.content}
                  </>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
