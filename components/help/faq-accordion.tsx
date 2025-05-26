"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { faqData } from "@/data/faq"

export function FaqAccordion() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter FAQ items based on search query
  const filteredFaqs = faqData
    .filter((category) => {
      // Check if category title matches
      const categoryMatches = category.title.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter questions within the category
      const filteredQuestions = category.questions.filter(
        (question) =>
          question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          question.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      // Include category if either the title matches or it has matching questions
      return categoryMatches || filteredQuestions.length > 0
    })
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (question) =>
          searchQuery === "" ||
          question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          question.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search FAQs..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No FAQs found matching your search.</p>
        </div>
      ) : (
        filteredFaqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <h3 className="text-xl font-semibold">{category.title}</h3>

            {category.questions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-muted-foreground text-sm">No questions found in this category.</p>
            )}
          </div>
        ))
      )}
    </div>
  )
}
