import ForgotPasswordClientPage from "./ForgotPasswordClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | CreaVibe",
  description: "Reset your CreaVibe account password",
}

export default function ForgotPasswordPage(): JSX.Element {
  return <ForgotPasswordClientPage />
}
