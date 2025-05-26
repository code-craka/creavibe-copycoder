import { TestingChecklist } from "@/components/testing/testing-checklist"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QA Testing Checklist",
  description: "A comprehensive checklist for quality assurance testing",
}

export default function TestingChecklistPage() {
  return (
    <div className="container py-10">
      <TestingChecklist />
    </div>
  )
}
