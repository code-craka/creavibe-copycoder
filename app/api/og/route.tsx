import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Get title from query params or use default
    const title = searchParams.get("title") || "CreaVibe"
    const description = searchParams.get("description") || "AI-Powered Content Creation Platform"

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#222831",
          color: "#DFD0B8",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="#DFD0B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M2 17L12 22L22 17" stroke="#DFD0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#DFD0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 style={{ fontSize: 60, margin: "0 0 0 20px", fontWeight: "bold" }}>CreaVibe</h1>
        </div>
        <h2 style={{ fontSize: 40, textAlign: "center", margin: "0 0 20px 0" }}>{title}</h2>
        <p style={{ fontSize: 24, textAlign: "center", margin: 0 }}>{description}</p>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.error(e)
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
