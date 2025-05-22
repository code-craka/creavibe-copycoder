import { render, screen, fireEvent, waitFor } from "@/lib/test-utils"
import LoginPage from "./page"
import { createClient } from "@/lib/supabase/client"

// Mock the Supabase client
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}))

describe("Login Page", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Mock Supabase auth methods
    const mockSupabase = {
      auth: {
        signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
        signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
      },
    }

    // @ts-ignore - we're mocking the return value
    createClient.mockReturnValue(mockSupabase)
  })

  it("renders the login form correctly", () => {
    render(<LoginPage />)

    // Check for form elements
    expect(screen.getByRole("heading", { name: /sign in to creavibe/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()

    // Check for social login buttons
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /continue with github/i })).toBeInTheDocument()

    // Check for sign up link
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument()
  })

  it("handles email sign in correctly", async () => {
    render(<LoginPage />)

    // Fill in the email field
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Wait for the form submission to complete
    await waitFor(() => {
      const supabase = createClient()
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: expect.any(String),
      })
    })
  })

  it("handles social sign in correctly", async () => {
    render(<LoginPage />)

    // Click the Google sign in button
    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }))

    // Wait for the OAuth sign in to be called
    await waitFor(() => {
      const supabase = createClient()
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: expect.any(Object),
      })
    })
  })

  it("shows an error message when sign in fails", async () => {
    // Mock a failed sign in
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          error: { message: "Invalid login credentials" },
        }),
      },
    }

    // @ts-ignore - we're mocking the return value
    createClient.mockReturnValue(mockSupabase)

    render(<LoginPage />)

    // Fill in the email field
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument()
    })
  })
})
