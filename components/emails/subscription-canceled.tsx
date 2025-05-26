interface SubscriptionCanceledEmailProps {
  customerName: string
  planName: string
  endDate: string
}

export function SubscriptionCanceledEmail({ customerName, planName, endDate }: SubscriptionCanceledEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
        <h1 style={{ color: "#333", fontSize: "24px" }}>Your Subscription Has Been Canceled</h1>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>Hi {customerName},</p>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
          We're sorry to see you go. Your {planName} subscription has been canceled as requested.
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
          <h2 style={{ color: "#333", fontSize: "18px", marginTop: "0" }}>Cancellation Details</h2>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Plan:</strong> {planName}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Access Until:</strong> {endDate}
          </p>
        </div>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
          You will continue to have access to {planName} features until {endDate}. After this date, your account will be
          downgraded to the Free plan.
        </p>

        <div
          style={{
            backgroundColor: "#fff3f3",
            padding: "15px",
            borderRadius: "5px",
            marginTop: "20px",
            marginBottom: "20px",
            borderLeft: "4px solid #ff4d4f",
          }}
        >
          <h2 style={{ color: "#d32f2f", fontSize: "18px", marginTop: "0" }}>We'd Love Your Feedback</h2>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
            We're constantly working to improve our service. Could you take a moment to let us know why you decided to
            cancel?
          </p>
          <p style={{ marginTop: "15px" }}>
            <a
              href="https://creavibe.pro/feedback?type=cancellation"
              style={{
                backgroundColor: "#d32f2f",
                color: "white",
                padding: "8px 15px",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Share Your Feedback
            </a>
          </p>
        </div>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
          If you change your mind, you can reactivate your subscription at any time before {endDate} by visiting your{" "}
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
