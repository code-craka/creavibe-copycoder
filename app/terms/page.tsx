import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | CreaVibe",
  description: "Terms and conditions for using the CreaVibe platform",
}

export default function TermsPage(): JSX.Element {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Last updated: May 22, 2024</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to CreaVibe. These Terms of Service ("Terms") govern your use of our website, products, and services
            ("Services"). By using our Services, you agree to these Terms. If you disagree with any part of the terms,
            you may not access the Services.
          </p>

          <h2>2. Use of Services</h2>
          <p>
            Our Services are intended for users who are at least 18 years old. By using our Services, you represent and
            warrant that you are at least 18 years old and that your use of the Services does not violate any applicable
            law or regulation.
          </p>

          <h2>3. Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and up-to-date information. You are
            responsible for safeguarding the password that you use to access the Services and for any activities or
            actions under your password.
          </p>

          <h2>4. Content</h2>
          <p>
            Our Services allow you to create, upload, publish, send, receive, and store content. You retain all rights
            to your content, but you grant us a license to use, copy, modify, distribute, and display the content in
            connection with operating and providing our Services.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The Services and their original content (excluding content provided by users), features, and functionality
            are and will remain the exclusive property of CreaVibe and its licensors. The Services are protected by
            copyright, trademark, and other laws.
          </p>

          <h2>6. Prohibited Uses</h2>
          <p>You agree not to use the Services:</p>
          <ul>
            <li>In any way that violates any applicable law or regulation.</li>
            <li>To transmit any material that is defamatory, obscene, or offensive.</li>
            <li>
              To impersonate or attempt to impersonate CreaVibe, a CreaVibe employee, another user, or any other person
              or entity.
            </li>
            <li>
              To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services.
            </li>
          </ul>

          <h2>7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall CreaVibe, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to
            or use of or inability to access or use the Services.
          </p>

          <h2>9. Changes</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:{" "}
            <a href="mailto:terms@creavibe.com">terms@creavibe.com</a>
          </p>

          <p className="mt-8">
            <Link href="/privacy" className="text-primary hover:underline">
              View our Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
