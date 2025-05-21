import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | CreaVibe",
  description: "Privacy policy and data protection information for CreaVibe users",
}

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Last updated: May 22, 2024</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to CreaVibe ("we," "our," or "us"). We respect your privacy and are committed to protecting your
            personal data. This privacy policy will inform you about how we look after your personal data when you visit
            our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2>2. Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you, including:</p>
          <ul>
            <li>
              <strong>Identity Data</strong>: includes first name, last name, username or similar identifier.
            </li>
            <li>
              <strong>Contact Data</strong>: includes email address and telephone numbers.
            </li>
            <li>
              <strong>Technical Data</strong>: includes internet protocol (IP) address, browser type and version, time
              zone setting and location, browser plug-in types and versions, operating system and platform, and other
              technology on the devices you use to access this website.
            </li>
            <li>
              <strong>Usage Data</strong>: includes information about how you use our website, products, and services.
            </li>
          </ul>

          <h2>3. How We Collect Your Data</h2>
          <p>We use different methods to collect data from and about you including through:</p>
          <ul>
            <li>
              <strong>Direct interactions</strong>: You may give us your Identity and Contact Data by filling in forms
              or by corresponding with us by post, phone, email, or otherwise.
            </li>
            <li>
              <strong>Automated technologies or interactions</strong>: As you interact with our website, we may
              automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this
              personal data by using cookies, server logs, and other similar technologies.
            </li>
          </ul>

          <h2>4. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data
            in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>
              Where it is necessary for our legitimate interests and your interests and fundamental rights do not
              override those interests.
            </li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2>5. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>6. Analytics</h2>
          <p>
            We use PostHog to help analyze how users use our site. PostHog uses cookies to collect information such as
            how often users visit our site, what pages they visit, and what other sites they used prior to coming to our
            site. We only use the information we get from PostHog to improve our website and services.
          </p>

          <h2>7. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally
            lost, used, or accessed in an unauthorized way, altered, or disclosed.
          </p>

          <h2>8. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for,
            including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>

          <h2>9. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data,
            including the right to:
          </p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>

          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:{" "}
            <a href="mailto:privacy@creavibe.com">privacy@creavibe.com</a>
          </p>

          <p className="mt-8">
            <Link href="/terms" className="text-primary hover:underline">
              View our Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
