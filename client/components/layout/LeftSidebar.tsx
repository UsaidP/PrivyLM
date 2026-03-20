"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, FileText, Loader2, CheckCircle, XCircle, Trash2, Settings, LogOut, BookOpen } from "lucide-react"
import { useDocuments, useDocumentMutations } from "@/hooks/useDocuments"
import { useSourceSelection } from "@/hooks/useSourceSelection"
import { useClerk, useUser } from "@clerk/nextjs"
import { toast } from "sonner"

function formatBytes(b: number) {
  if (!b) return ""
  if (b > 1048576) return (b / 1048576).toFixed(1) + " MB"
  return (b / 1024).toFixed(0) + " KB"
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; color: string; bg: string }> = {
    INDEXED: { label: "Ready", color: "var(--success)", bg: "var(--success-muted)" },
    PROCESSING: { label: "Processing", color: "var(--warning)", bg: "var(--bg-elevated)" },
    PENDING: { label: "Pending", color: "var(--text-tertiary)", bg: "var(--bg-elevated)" },
    FAILED: { label: "Failed", color: "var(--error)", bg: "rgba(248,113,113,0.1)" },
  }
  const c = cfg[status] ?? cfg.PENDING

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 6px",
      borderRadius: 4,
      background: c.bg,
      fontSize: 10,
      fontWeight: 600,
      color: c.color,
      textTransform: "uppercase",
    }}>
      {status === "PROCESSING" && <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />}
      {status === "INDEXED" && <CheckCircle size={10} />}
      {status === "FAILED" && <XCircle size={10} />}
      {c.label}
    </div>
  )
}

function SourceItem({
  doc, selected, onToggle, onDelete
}: {
  doc: any
  selected: boolean
  onToggle: () => void
  onDelete?: (e: React.MouseEvent) => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 9,
        padding: "9px 10px",
        borderRadius: 8,
        marginBottom: 5,
        cursor: doc.status === "INDEXED" ? "pointer" : "default",
        border: `1px solid ${selected ? "var(--border-strong)" : "transparent"}`,
        background: selected ? "var(--bg-elevated)" : "transparent",
        transition: "all 0.12s",
        position: "relative",
      }}
    >
      {doc.status === "INDEXED" && (
        <div style={{
          width: 16, height: 16,
          borderRadius: 4,
          border: selected ? "none" : "1.5px solid var(--border-strong)",
          background: selected ? "var(--accent)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}>
          {selected && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--text-primary)" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      )}

      <div style={{
        width: 30, height: 30,
        borderRadius: 7,
        background: "var(--bg-elevated)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <FileText size={14} color="var(--text-secondary)" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12.5,
          fontWeight: 500,
          color: "var(--text-primary)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: 2,
        }}>
          {doc.name}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>
          {doc.pageCount ? `${doc.pageCount}p · ` : ""}
          {doc.chunkCount ? `${doc.chunkCount} chunks · ` : ""}
          {formatBytes(doc.sizeBytes)}
        </div>
        <StatusBadge status={doc.status} />

        {doc.status === "PROCESSING" && (
          <div style={{
            height: 2,
            background: "var(--bg-secondary)",
            borderRadius: 1,
            marginTop: 5,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: "60%",
              background: "var(--accent)",
              borderRadius: 1,
              animation: "shimmer 1.5s ease infinite",
            }} />
          </div>
        )}
      </div>

      {showDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete?.(e) }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            borderRadius: 4,
            border: "none",
            background: "rgba(248,113,113,0.1)",
            color: "var(--error)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.12s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(248,113,113,0.1)";
          }}
          title="Delete document"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

function UserProfile() {
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const [showMenu, setShowMenu] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
  }

  const getInitials = () => {
    if (!user) return 'U'
    return (user.firstName || user.emailAddresses[0]?.emailAddress?.[0] || 'U').toUpperCase()
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          borderRadius: 8,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          width: "100%",
          transition: "all 0.12s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#4A4F5A"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent"
        }}
      >
        <div style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          border: "1.5px solid #4A4F5A",
          background: "#00ADB5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 600,
          color: "#222831",
          flexShrink: 0,
        }}>
          {getInitials()}
        </div>
        <div style={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
          <div style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#EEEEEE",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {user?.fullName || 'User'}
          </div>
          <div style={{
            fontSize: 10,
            color: "#888888",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>
      </button>

      {showMenu && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
            }}
            onClick={() => setShowMenu(false)}
          />
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            minWidth: 180,
            background: '#393E46',
            border: '1px solid #4A4F5A',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 100,
            overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                fontSize: 12,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4A4F5A'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function LeftSidebar({ notebookId }: { notebookId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { data: documents, isLoading } = useDocuments(notebookId)
  const { uploadDocument, deleteDocument } = useDocumentMutations(notebookId)
  const { selectedIds, toggle } = useSourceSelection()

  async function handleFiles(files: FileList) {
    const pdf = Array.from(files).find(f => f.type === "application/pdf")
    if (!pdf) { toast.error("Only PDF files are supported"); return }
    if (pdf.size > 50 * 1024 * 1024) { toast.error("File must be under 50MB"); return }
    try {
      await uploadDocument({ file: pdf })
      toast.success("Upload started — processing...")
    } catch {
      toast.error("Upload failed. Try again.")
    }
  }

  async function handleDelete(docId: string, docName: string) {
    if (!confirm(`Delete "${docName}"? This will remove the document and its vectors.`)) {
      return;
    }
    try {
      await deleteDocument(docId)
      toast.success(`Deleted "${docName}"`)
    } catch {
      toast.error(`Failed to delete "${docName}"`)
    }
  }

  return (
    <div style={{
      width: 260,
      flexShrink: 0,
      background: "#393E46",
      borderRight: "1px solid #4A4F5A",
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Link
            href="/notebooks"
            style={{
              padding: "16px",
              borderBottom: "1px solid #4A4F5A",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4A4F5A"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <div style={{
              width: 28, height: 28,
              borderRadius: 7,
              background: "#00ADB5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <BookOpen size={15} color="#222831" />
            </div>
            <span style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#EEEEEE",
              letterSpacing: -0.3,
            }}>
              Notebooks
            </span>
          </Link>

          <div style={{
            padding: "12px 14px",
            borderBottom: "1px solid #4A4F5A",
            flexShrink: 0,
          }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                padding: "9px 14px",
                borderRadius: 8,
                border: "1px solid #4A4F5A",
                background: "#4A4F5A",
                color: "#B0B0B0",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.12s",
              }}
            >
              <Plus size={14} />
              Add sources
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={e => e.target.files && handleFiles(e.target.files)}
            />
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px 0" }}>
            {(documents?.length ?? 0) > 0 && (
              <div style={{
                fontSize: 10,
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                padding: "2px 4px 8px",
              }}>
                Sources ({documents!.length})
              </div>
            )}

            {isLoading && [1, 2].map(i => (
              <div key={i} style={{
                height: 58,
                borderRadius: 8,
                marginBottom: 6,
                background: "var(--bg-elevated)",
                opacity: 0.5,
              }} />
            ))}

            {!isLoading && documents?.length === 0 && (
              <div style={{ textAlign: "center", padding: "28px 16px" }}>
                <div style={{
                  width: 38, height: 38,
                  borderRadius: 10,
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                }}>
                  <FileText size={17} color="var(--text-tertiary)" />
                </div>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)", lineHeight: 1.6, margin: 0 }}>
                  Upload a PDF to get started
                </p>
              </div>
            )}

            {!isLoading && documents?.map(doc => (
              <SourceItem
                key={doc.id}
                doc={doc}
                selected={selectedIds.has(doc.id)}
                onToggle={() => toggle(doc.id)}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDelete(doc.id, doc.name);
                }}
              />
            ))}

            {(documents?.length ?? 0) > 0 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault()
                  setIsDragging(false)
                  e.dataTransfer.files && handleFiles(e.dataTransfer.files)
                }}
                style={{
                  margin: "8px 0 12px",
                  border: `1.5px dashed ${isDragging ? "var(--accent)" : "var(--border-subtle)"}`,
                  borderRadius: 8,
                  padding: "11px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: isDragging ? "var(--bg-elevated)" : "transparent",
                  transition: "all 0.12s",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  Drop PDF or{" "}
                  <span style={{ color: "var(--text-secondary)" }}>browse</span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ flexShrink: 0, borderTop: "1px solid #4A4F5A" }}>
          <button
            type="button"
            onClick={() => window.location.href = '/settings'}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              border: "none",
              background: "transparent",
              color: "#B0B0B0",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.12s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4A4F5A"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent"
            }}
          >
            <Settings size={15} />
            Settings
          </button>

          <UserProfile />
        </div>
      </div>
    </div>
  )
}
