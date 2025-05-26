interface SubscriptionCreatedEmailProps {
  customerName: string
  planName: string
  amount: string
  currency: string
  interval: string
  startDate: string
}

export function SubscriptionCreatedEmail({
  customerName,
  planName,
  amount,
  currency,
  interval,
  startDate,
}: SubscriptionCreatedEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
        <h1 style={{ color: "#333", fontSize: "24px" }}>Welcome to {planName}!</h1>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>Hi {customerName},</p>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
          Thank you for subscribing to our {planName} plan. Your subscription is now active, and you have access to all
          the features included in your plan.
        </p>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "5px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333", fontSize: "18px", marginTop: "0" }}>Subscription Details</h2>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Plan:</strong> {planName}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Amount:</strong> {amount} {currency}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Billing Cycle:</strong> {interval}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Start Date:</strong> {startDate}
          </p>
        </div>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
          You can manage your subscription at any time by visiting your{" "}
          <a href="https://creavibe.pro/billing" style={{ color: "#0070f3", textDecoration: "none" }}>
            billing page
          </a>
          .
        </p>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
          If you have any questions or need assistance, please don't hesitate to contact our support team.
        </p>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5", marginTop: "30px" }}>
          Best regards,
          <br />
          The Creavibe Team
        </p>
      </div>

      <div style={{ textAlign: "center", padding: "20px", color: "#999", fontSize: "12px" }}>
        <p>© {new Date().getFullYear()} Creavibe. All rights reserved.</p>
        <p>
          <a href="https://creavibe.pro/privacy" style={{ color: "#999", textDecoration: "none" }}>
            Privacy Policy
          </a>{" "}
          |
          <a href="https://creavibe.pro/terms" style={{ color: "#999", textDecoration: "none", marginLeft: "5px" }}>
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  )
}
