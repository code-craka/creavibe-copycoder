export type ThemeColors = {
  primary: string
  background: string
  surface: string
  accent: string
  text: string
  secondaryBg: string
  border: string
  mutedText?: string
}

export const lightTheme: ThemeColors = {
  primary: "#393E46",
  background: "#DFD0B8",
  surface: "#F8F6F2",
  accent: "#948979",
  text: "#222831",
  secondaryBg: "#F3F1ED",
  border: "#E1DFD6",
}

export const darkTheme: ThemeColors = {
  primary: "#DFD0B8",
  background: "#222831",
  surface: "#2E343D",
  accent: "#C8BFA9",
  text: "#F3F1ED",
  secondaryBg: "#2E343D",
  border: "#3E434A",
  mutedText: "#B3A78D",
}

export const getThemeColor = (colorName: keyof ThemeColors, mode: "light" | "dark" = "light"): string => {
  return mode === "light" ? lightTheme[colorName] : darkTheme[colorName]
}
