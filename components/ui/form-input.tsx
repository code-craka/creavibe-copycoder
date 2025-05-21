"use client"

import { useState, type InputHTMLAttributes } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  error?: string
  description?: string
}

export function FormInput({ label, id, error, description, required, ...props }: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        {isFocused && required && <span className="text-xs text-muted-foreground">Required</span>}
      </div>
      <Input
        id={id}
        name={id}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : description ? `${id}-description` : undefined}
        required={required}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : description ? (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
