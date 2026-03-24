"use client"
import {
  ThemeProvider as NextThemeProvider,
  ThemeProviderProps,
} from "next-themes"

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
      {...props}
    >
      {children}
    </NextThemeProvider>
  )
}

export default ThemeProvider
