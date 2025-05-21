"use client"

import { useState, type InputHTMLAttributes, forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  description?: string
  showPasswordToggle?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, description, className, id, showPasswordToggle, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-")
    const descriptionId = description ? `${inputId}-description` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    // Determine the input type based on the showPassword state
    const inputType = type === "password" && showPassword ? "text" : type

    return (
      <div className={cn("space-y-2", className)}>
        <div className="space-y-1">
          <Label htmlFor={inputId}>{label}</Label>
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className="relative">
          <Input
            id={inputId}
            type={inputType}
            aria-invalid={!!error}
            aria-describedby={cn(descriptionId, errorId)}
            ref={ref}
            {...props}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive",
              showPasswordToggle && "pr-10",
              props.className,
            )}
          />
          {showPasswordToggle && type === "password" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormInput.displayName = "FormInput"
