/**
 * Design System Tokens
 * Centralized design tokens for consistent UI across the application
 * Following UI/UX Pro Max guidelines for accessibility, consistency, and polish
 */

// ─── Spacing Scale (8pt grid system) ──────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
} as const

// ─── Typography Scale ─────────────────────────────────────────────────────────
export const typography = {
  // Font sizes (px)
  fontSize: {
    xs: 10,
    sm: 11,
    md: 12,
    lg: 13,
    xl: 14,
    "2xl": 15,
    "3xl": 16,
    "4xl": 18,
    "5xl": 20,
    "6xl": 24,
    "7xl": 32,
  },
  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  // Letter spacing
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.05em",
  },
} as const

// ─── Border Radius Scale ──────────────────────────────────────────────────────
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  "2xl": 12,
  "3xl": 16,
  full: 9999,
} as const

// ─── Shadow System (elevation levels) ─────────────────────────────────────────
export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 6px rgba(0,0,0,0.07)",
  lg: "0 10px 15px rgba(0,0,0,0.1)",
  xl: "0 20px 25px rgba(0,0,0,0.12)",
  "2xl": "0 25px 50px rgba(0,0,0,0.15)",
  inner: "inset 0 2px 4px rgba(0,0,0,0.06)",
} as const

// ─── Animation Timing ─────────────────────────────────────────────────────────
export const animation = {
  // Durations (ms)
  duration: {
    instant: 75,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 400,
  },
  // Easing functions
  easing: {
    easeOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    easeIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
    easeInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const

// ─── Touch Targets (Accessibility) ────────────────────────────────────────────
export const touchTarget = {
  min: 44, // Minimum touch target size (Apple HIG)
  comfortable: 48, // Material Design recommendation
} as const

// ─── Z-Index Scale ────────────────────────────────────────────────────────────
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const

// ─── Breakpoints (Responsive) ─────────────────────────────────────────────────
export const breakpoints = {
  sm: 640, // Mobile landscape
  md: 768, // Tablet
  lg: 1024, // Desktop
  xl: 1280, // Large desktop
  "2xl": 1536, // Extra large desktop
} as const

// ─── Common Styles ────────────────────────────────────────────────────────────

/**
 * Base button style with all interaction states
 */
export const buttonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.sm,
  borderRadius: borderRadius.lg,
  fontWeight: typography.fontWeight.medium,
  fontSize: typography.fontSize.xl,
  lineHeight: typography.lineHeight.normal,
  transition: `all ${animation.duration.fast}ms ${animation.easing.easeOut}`,
  cursor: "pointer",
  border: "none",
  outline: "none",
  WebkitTapHighlightColor: "transparent",
} as const

/**
 * Input base style
 */
export const inputBase = {
  width: "100%",
  padding: `${spacing.md}px ${spacing.lg}px`,
  borderRadius: borderRadius.lg,
  border: `1px solid var(--border-default)`,
  background: "var(--bg-surface)",
  color: "var(--text-primary)",
  fontSize: typography.fontSize.xl,
  lineHeight: typography.lineHeight.normal,
  transition: `all ${animation.duration.fast}ms ${animation.easing.easeOut}`,
  outline: "none",
} as const

/**
 * Card base style
 */
export const cardBase = {
  background: "var(--bg-surface)",
  border: `1px solid var(--border-default)`,
  borderRadius: borderRadius.xl,
  boxShadow: shadows.sm,
  padding: spacing["2xl"],
  transition: `all ${animation.duration.normal}ms ${animation.easing.easeOut}`,
} as const

/**
 * Scrollbar styles (Webkit)
 */
export const scrollbarStyles = {
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "rgba(122, 158, 126, 0.2)",
    borderRadius: borderRadius.full,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "rgba(122, 158, 126, 0.35)",
  },
} as const

/**
 * Focus ring style (accessibility)
 */
export const focusRing = {
  "&:focus-visible": {
    outline: `2px solid var(--ring)`,
    outlineOffset: 2,
  },
} as const

/**
 * Truncate text with ellipsis
 */
export const truncate = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const

/**
 * Line clamp (multi-line truncation)
 */
export const lineClamp = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}) as const

// ─── Component Presets ────────────────────────────────────────────────────────

/**
 * Primary button variant
 */
export const primaryButton = {
  ...buttonBase,
  background: "var(--accent)",
  color: "var(--primary-foreground)",
  "&:hover": {
    background: "var(--accent-hover)",
    transform: "translateY(-1px)",
    boxShadow: shadows.md,
  },
  "&:active": {
    transform: "translateY(0)",
  },
  ...focusRing,
} as const

/**
 * Secondary button variant
 */
export const secondaryButton = {
  ...buttonBase,
  background: "transparent",
  color: "var(--text-primary)",
  border: `1px solid var(--border-default)`,
  "&:hover": {
    background: "var(--bg-surface-hover)",
    borderColor: "var(--border-strong)",
  },
  ...focusRing,
} as const

/**
 * Ghost button variant
 */
export const ghostButton = {
  ...buttonBase,
  background: "transparent",
  color: "var(--text-secondary)",
  padding: `${spacing.sm}px ${spacing.md}px`,
  "&:hover": {
    background: "var(--bg-surface-hover)",
    color: "var(--text-primary)",
  },
  ...focusRing,
} as const

/**
 * Badge style
 */
export const badge = {
  display: "inline-flex",
  alignItems: "center",
  gap: spacing.xs,
  padding: `${spacing.xs}px ${spacing.sm}px`,
  borderRadius: borderRadius.full,
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semibold,
  textTransform: "uppercase" as const,
  letterSpacing: typography.letterSpacing.wider,
} as const

/**
 * Status badge variants
 */
export const statusBadges = {
  success: {
    ...badge,
    background: "var(--success-muted)",
    color: "var(--success)",
  },
  warning: {
    ...badge,
    background: "var(--warning-muted)",
    color: "var(--warning)",
  },
  error: {
    ...badge,
    background: "var(--bg-destructive)",
    color: "var(--destructive)",
  },
  info: {
    ...badge,
    background: "var(--accent-muted)",
    color: "var(--accent)",
  },
  neutral: {
    ...badge,
    background: "var(--bg-elevated)",
    color: "var(--text-muted)",
  },
} as const
