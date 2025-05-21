import type { Metadata } from "next"
import { Section } from "@/components/ui/section"

export const metadata: Metadata = {
  title: "Privacy Policy | CreaVibe",
  description: "Privacy policy and data protection information for CreaVibe users",
}

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <Section paddingY="md" containerSize="md">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Last updated: May 22, 2024</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to CreaVibe\
