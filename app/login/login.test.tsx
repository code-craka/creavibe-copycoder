import { render, screen, fireEvent, waitFor } from "@/lib/test-utils"
import LoginPage from "./page"
import { createBrowserComponentClient } from "@/utils/supabase/browser-client"

// Add Jest DOM type extensions
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock the Supabase client
jest.mock("@/utils/supabase/browser-client", () => ({
  createBrowserComponentClient: jest.fn(),
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
    createBrowserComponentClient.mockReturnValue(mockSupabase)
  })

  it("renders the login form correctly", () => {
    render(<LoginPage searchParams={{}} />)

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
    render(<LoginPage searchParams={{}} />)

    // Fill in the email field
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Wait for the form submission to complete
    await waitFor(() => {
      const supabase = createBrowserComponentClient()
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "test@example.com",
        password: expect.any(String),
      })
    })
  })

  it("handles social sign in correctly", async () => {
    render(<LoginPage searchParams={{}} />)

    // Click the Google sign in button
    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }))

    // Wait for the OAuth sign in to be called
    await waitFor(() => {
      const supabase = createBrowserComponentClient()
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
    createBrowserComponentClient.mockReturnValue(mockSupabase)

    render(<LoginPage searchParams={{}} />)

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
