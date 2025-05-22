// Function to calculate relative luminance
function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Function to calculate contrast ratio
export function getContrastRatio(foreground: [number, number, number], background: [number, number, number]): number {
  const foregroundLuminance = getLuminance(foreground)
  const backgroundLuminance = getLuminance(background)

  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

// Function to check if contrast meets WCAG standards
export function meetsWCAGStandards(
  foreground: [number, number, number],
  background: [number, number, number],
  level: "AA" | "AAA" = "AA",
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(foreground, background)

  if (level === "AA") {
    return isLargeText ? ratio >= 3 : ratio >= 4.5
  } else {
    return isLargeText ? ratio >= 4.5 : ratio >= 7
  }
}

// Function to convert hex color to RGB
export function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : null
}

// Function to suggest accessible colors
export function suggestAccessibleColor(
  color: [number, number, number],
  background: [number, number, number],
  level: "AA" | "AAA" = "AA",
  isLargeText = false,
): [number, number, number] {
  // If the contrast is already sufficient, return the original color
  if (meetsWCAGStandards(color, background, level, isLargeText)) {
    return color
  }

  // Otherwise, adjust the color to meet the standards
  const targetRatio = level === "AA" ? (isLargeText ? 3 : 4.5) : isLargeText ? 4.5 : 7

  // Determine if we should lighten or darken the color
  const backgroundLuminance = getLuminance(background)
  const shouldLighten = backgroundLuminance < 0.5

  let adjustedColor = [...color] as [number, number, number]
  let ratio = getContrastRatio(adjustedColor, background)

  // Adjust the color until it meets the target ratio
  const step = shouldLighten ? 5 : -5

  while (ratio < targetRatio) {
    adjustedColor = adjustedColor.map((c) => {
      const newC = c + step
      return Math.min(255, Math.max(0, newC))
    }) as [number, number, number]

    ratio = getContrastRatio(adjustedColor, background)

    // Break if we've reached the limits of the color space
    if (
      (shouldLighten && adjustedColor.every((c) => c >= 250)) ||
      (!shouldLighten && adjustedColor.every((c) => c <= 5))
    ) {
      break
    }
  }

  return adjustedColor
}
