interface SubscriptionUpdatedEmailProps {
  customerName: string
  oldPlanName: string
  newPlanName: string
  amount: string
  currency: string
  interval: string
  effectiveDate: string
  isUpgrade: boolean
}

export function SubscriptionUpdatedEmail({
  customerName,
  oldPlanName,
  newPlanName,
  amount,
  currency,
  interval,
  effectiveDate,
  isUpgrade,
}: SubscriptionUpdatedEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
        <h1 style={{ color: "#333", fontSize: "24px" }}>
          {isUpgrade ? "Thank You for Upgrading!" : "Your Subscription Has Changed"}
        </h1>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>Hi {customerName},</p>

        <p style={{ color: "#666", fontSize: "16px", lineHeight: "1.5" }}>
          {isUpgrade
            ? `Thank you for upgrading from ${oldPlanName} to ${newPlanName}. You now have access to additional features and benefits.`
            : `Your subscription has been changed from ${oldPlanName} to ${newPlanName}.`}
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
          <h2 style={{ color: "#333", fontSize: "18px", marginTop: "0" }}>Updated Subscription Details</h2>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>New Plan:</strong> {newPlanName}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Previous Plan:</strong> {oldPlanName}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>New Amount:</strong> {amount} {currency}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Billing Cycle:</strong> {interval}
          </p>
          <p style={{ margin: "5px 0", fontSize: "14px" }}>
            <strong>Effective Date:</strong> {effectiveDate}
          </p>
        </div>

        {isUpgrade && (
          <div
            style={{
              backgroundColor: "#f0f7ff",
              padding: "15px",
              borderRadius: "5px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ color: "#0070f3", fontSize: "18px", marginTop: "0" }}>What's New in {newPlanName}</h2>
            <ul style={{ color: "#333", fontSize: "14px", paddingLeft: "20px" }}>
              <li>Increased API rate limits</li>
              <li>More storage space</li>
              <li>Additional projects</li>
              <li>Priority support</li>
            </ul>
          </div>
        )}

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
