"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormInputProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  className?: string
  error?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  helpText?: string
  autoComplete?: string
}

export function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  className,
  error,
  value,
  onChange,
  onBlur,
  helpText,
  autoComplete,
}: FormInputProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (onBlur) onBlur()
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        className={cn(error && "border-destructive")}
        autoComplete={autoComplete}
        required={required}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p id={`${id}-help`} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  )
}
