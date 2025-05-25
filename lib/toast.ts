import { toast as sonnerToast, type ExternalToast, type Action } from "sonner"

type ToastType = "success" | "error" | "info" | "warning"

interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }
  cancel?: {
    label: string
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  }
}

export function toast(
  title: string,
  { description, duration = 5000, action, cancel }: ToastOptions = {},
  type: ToastType = "info",
) {
  const options: ExternalToast = {
    description,
    duration,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        } as Action
      : undefined,
    cancel: cancel
      ? {
          label: cancel.label,
          onClick: cancel.onClick || ((e) => { /* Default no-op function */ }),
        } as Action
      : undefined,
  }

  switch (type) {
    case "success":
      return sonnerToast.success(title, options)
    case "error":
      return sonnerToast.error(title, options)
    case "warning":
      return sonnerToast.warning(title, options)
    case "info":
    default:
      return sonnerToast.info(title, options)
  }
}

export function successToast(title: string, options: ToastOptions = {}) {
  return toast(title, options, "success")
}

export function errorToast(title: string, options: ToastOptions = {}) {
  return toast(title, options, "error")
}

export function warningToast(title: string, options: ToastOptions = {}) {
  return toast(title, options, "warning")
}

export function infoToast(title: string, options: ToastOptions = {}) {
  return toast(title, options, "info")
}
