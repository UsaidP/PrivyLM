"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeSwitcherProps {
  value: string
  onChange: (value: string) => void
}

export function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    onChange(newTheme)
  }

  if (!mounted) {
    return (
      <div style={{ display: "flex", gap: "8px" }}>
        {["light", "dark", "system"].map((mode) => (
          <button
            key={mode}
            type="button"
            disabled
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "not-allowed",
              textTransform: "capitalize",
              opacity: 0.5,
            }}
          >
            {mode}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {["light", "dark", "system"].map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => handleThemeChange(mode)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            background: value === mode ? "var(--accent)" : "var(--bg-surface)",
            border: `1px solid ${value === mode ? "var(--accent)" : "var(--border-default)"}`,
            color: value === mode ? "var(--primary-foreground)" : "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            textTransform: "capitalize" as const,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (value !== mode) {
              e.currentTarget.style.background = "var(--bg-surface-hover)"
            }
          }}
          onMouseLeave={(e) => {
            if (value !== mode) {
              e.currentTarget.style.background = "var(--bg-surface)"
            }
          }}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}
