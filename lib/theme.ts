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

// CSS variable values (without the var() wrapper)
export const lightThemeVars = {
  "--background": "34 29 24 / 0.05", // #DFD0B8 with opacity
  "--foreground": "34 40 49", // #222831
  "--card": "248 246 242", // #F8F6F2
  "--card-foreground": "34 40 49", // #222831
  "--popover": "248 246 242", // #F8F6F2
  "--popover-foreground": "34 40 49", // #222831
  "--primary": "57 62 70", // #393E46
  "--primary-foreground": "248 246 242", // #F8F6F2
  "--secondary": "243 241 237", // #F3F1ED
  "--secondary-foreground": "34 40 49", // #222831
  "--muted": "243 241 237", // #F3F1ED
  "--muted-foreground": "148 137 121", // #948979
  "--accent": "148 137 121", // #948979
  "--accent-foreground": "248 246 242", // #F8F6F2
  "--destructive": "239 68 68", // #EF4444
  "--destructive-foreground": "248 246 242", // #F8F6F2
  "--border": "225 223 214", // #E1DFD6
  "--input": "225 223 214", // #E1DFD6
  "--ring": "57 62 70", // #393E46
  "--surface": "248 246 242", // #F8F6F2
}

export const darkThemeVars = {
  "--background": "34 40 49", // #222831
  "--foreground": "243 241 237", // #F3F1ED
  "--card": "46 52 61", // #2E343D
  "--card-foreground": "243 241 237", // #F3F1ED
  "--popover": "46 52 61", // #2E343D
  "--popover-foreground": "243 241 237", // #F3F1ED
  "--primary": "223 208 184", // #DFD0B8
  "--primary-foreground": "34 40 49", // #222831
  "--secondary": "46 52 61", // #2E343D
  "--secondary-foreground": "243 241 237", // #F3F1ED
  "--muted": "46 52 61", // #2E343D
  "--muted-foreground": "179 167 141", // #B3A78D
  "--accent": "200 191 169", // #C8BFA9
  "--accent-foreground": "34 40 49", // #222831
  "--destructive": "127 29 29", // #7F1D1D
  "--destructive-foreground": "243 241 237", // #F3F1ED
  "--border": "62 67 74", // #3E434A
  "--input": "62 67 74", // #3E434A
  "--ring": "223 208 184", // #DFD0B8
  "--surface": "46 52 61", // #2E343D
}
