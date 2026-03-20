'use client'
import { ThemeProviderProps } from "next-themes"
import { ThemeProvider as NextThemeProvider } from "next-themes"

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}

export default ThemeProvider