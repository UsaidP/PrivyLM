"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import LogoImage from "../ui/logo-image"

interface DashboardHeaderProps {
  notebookName?: string
}

export function DashboardHeader({ notebookName }: DashboardHeaderProps) {
  const { user } = useUser()
  const { signOut } = useClerk()
  const params = useParams()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getInitials = () => {
    if (!user) return "U"
    return (
      user.firstName?.[0] ||
      user.emailAddresses[0]?.emailAddress?.[0] ||
      "U"
    ).toUpperCase()
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid var(--border-default)",
        background: "var(--bg-primary)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Logo + Notebook Name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flex: 1,
        }}
      >
        <Link
          href="/notebooks"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <LogoImage size={32} />
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "-0.4px",
              color: "var(--text-primary)",
            }}
          >
            Privy<span style={{ color: "var(--accent)" }}>LM</span>
          </span>
        </Link>

        {/* Notebook Name Divider */}
        {notebookName && (
          <>
            <div
              style={{
                width: 1,
                height: 20,
                background: "var(--border-default)",
              }}
            />
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--text-secondary)",
                maxWidth: 200,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {notebookName}
            </span>
          </>
        )}
      </div>

      {/* Right: User Menu Only */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowUserMenu((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-surface-hover)"
              e.currentTarget.style.borderColor = "var(--border-default)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.borderColor = "var(--border-subtle)"
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--primary-foreground)",
              }}
            >
              {getInitials()}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-primary)",
                maxWidth: 120,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.fullName || "User"}
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowUserMenu(false)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Escape" ||
                    e.key === "Enter" ||
                    e.key === " "
                  ) {
                    e.preventDefault()
                    setShowUserMenu(false)
                  }
                }}
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: 200,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 10,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  zIndex: 100,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {user?.fullName || "User"}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginTop: 2,
                    }}
                  >
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => (window.location.href = "/settings")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-surface-hover)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                  }}
                >
                  <Settings size={14} />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await signOut()
                    window.location.href = "/sign-in"
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    color: "var(--destructive)",
                    fontSize: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bg-surface-hover)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                  }}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
