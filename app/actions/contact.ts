"use server"

import { z } from "zod"
import { Resend } from "resend"
import { rateLimit } from "@/lib/rate-limit"
import { env } from "@/lib/env"

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export async function sendContactForm(formData: ContactFormData) {
  try {
    // Validate form data
    const validatedData = contactFormSchema.parse(formData)

    // Apply rate limiting (5 submissions per hour per IP)
    const identifier = formData.email // Use email as identifier
    const {
      success: rateLimitSuccess,
      limit,
      remaining,
      reset,
    } = await rateLimit({
      identifier,
      limit: 5,
      timeframe: 60 * 60, // 1 hour in seconds
    })

    if (!rateLimitSuccess) {
      return {
        success: false,
        message: `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes.`,
        remaining,
        reset,
      }
    }

    // Initialize Resend
    const resend = new Resend(env.RESEND_API_KEY)

    // Send email to support team
    await resend.emails.send({
      from: "support@creavibe.com",
      to: "support@creavibe.com",
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
    })

    // Send confirmation email to user
    await resend.emails.send({
      from: "support@creavibe.com",
      to: validatedData.email,
      subject: "We've received your message - CreaVibe Support",
      html: `
        <h2>Thank you for contacting CreaVibe Support</h2>
        <p>Hello ${validatedData.name},</p>
        <p>We've received your message and will get back to you as soon as possible. For your records, here's a copy of your message:</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
        <p>If you have any additional information to add, please reply to this email.</p>
        <p>Best regards,<br>The CreaVibe Support Team</p>
      `,
    })

    return {
      success: true,
      message: "Your message has been sent successfully.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Invalid form data. Please check your inputs and try again.",
      }
    }

    return {
      success: false,
      message: "Failed to send your message. Please try again later.",
    }
  }
}
