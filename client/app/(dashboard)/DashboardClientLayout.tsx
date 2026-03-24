"use client"

import { usePathname } from "next/navigation"
import { DashboardHeader } from "@/components/layout/DashboardHeader"

interface DashboardClientLayoutProps {
  children: React.ReactNode
  notebooks?: any[]
}

export function DashboardClientLayout({ children }: DashboardClientLayoutProps) {
  const pathname = usePathname()

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Main Content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <DashboardHeader />
        {children}
      </main>
    </div>
  )
}
