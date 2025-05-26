import type React from "react"
import nodemailer from "nodemailer"
import { render } from "@react-email/render"

// Configure email transport
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.EMAIL_SERVER_SECURE === "true",
})

interface SendEmailOptions {
  to: string
  subject: string
  react: React.ReactNode
  from?: string
}

/**
 * Sends an email using the configured transport
 */
export async function sendEmail({
  to,
  subject,
  react,
  from = process.env.EMAIL_FROM || "noreply@creavibe.pro",
}: SendEmailOptions) {
  try {
    const html = render(react)

    const result = await transport.sendMail({
      from,
      to,
      subject,
      html,
    })

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : String(error)}`)
  }
}
