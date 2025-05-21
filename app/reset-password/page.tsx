import ResetPasswordClientPage from "./ResetPasswordClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Set New Password | CreaVibe",
  description: "Set a new password for your CreaVibe account",
}

export default function ResetPasswordPage(): JSX.Element {
  return <ResetPasswordClientPage />
}
