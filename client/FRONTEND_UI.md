# 🎨 FRONTEND_UI.md — NotebookLM-Style Interface

> **Stack**: Next.js 16 · Tailwind CSS · shadcn/ui · Framer Motion · TanStack Query  
> **Theme**: Dark · Custom 5-stop palette · NotebookLM-inspired  
> **Version**: 2.0 · March 2026

---

## Table of Contents

1. [Design System](#1-design-system)
2. [App Structure](#2-app-structure)
3. [Dashboard View](#3-dashboard-view)
4. [Notebook View — 3-Panel Layout](#4-notebook-view--3-panel-layout)
5. [Component Reference](#5-component-reference)
6. [Hooks](#6-hooks)
7. [API Integration](#7-api-integration)
8. [State Management](#8-state-management)
9. [Pages & Routing](#9-pages--routing)
10. [Required Packages](#10-required-packages)
11. [Environment Variables](#11-environment-variables)
12. [File Structure](#12-file-structure)
13. [LLM Integration Layer](#13-llm-integration-layer)
14. [Production Checklist](#14-production-checklist)

---

## 1. Design System

### Color Palette (5-Stop Custom)

```css
:root {
  /* Brand palette */
  --c1: #bfc3c4;   /* Primary text */
  --c2: #a7a7aa;   /* Secondary text */
  --c3: #8e9095;   /* Muted text, icons */
  --c4: #6f7176;   /* Accent, buttons, active states */
  --c5: #4e5155;   /* Subtle text, borders */

  /* Backgrounds (dark) */
  --bg:  #18191c;  /* Base background */
  --bg2: #1f2023;  /* Sidebar, panels, cards */
  --bg3: #252628;  /* Hover states, input fields */
  --bg4: #2c2d30;  /* Elevated surfaces */
  --bg5: #333437;  /* Highest elevation */

  /* Borders */
  --bd:  #35363a;  /* Default border */
  --bd2: #424347;  /* Emphasized border */
  --bd3: #525459;  /* Strong border, focus rings */

  /* Text */
  --wh:  #e8eaeb;  /* Headings, titles */
  --wh2: #d0d3d5;  /* Subheadings */
}
```

### Tailwind Config Extension

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        nb: {
          c1: '#bfc3c4', c2: '#a7a7aa', c3: '#8e9095',
          c4: '#6f7176', c5: '#4e5155',
          bg: '#18191c', bg2: '#1f2023', bg3: '#252628',
          bg4: '#2c2d30', bg5: '#333437',
          bd: '#35363a', bd2: '#424347', bd3: '#525459',
          wh: '#e8eaeb',
        }
      },
      borderRadius: {
        nb: '8px', 'nb-lg': '12px', 'nb-xl': '14px'
      }
    }
  }
}
```

### Typography

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg);
  color: var(--c1);
}

code, pre { font-family: 'JetBrains Mono', monospace; }
```

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 26px | 600 | `--wh` |
| Section heading | 18px | 600 | `--wh` |
| Card title | 14px | 600 | `--wh` |
| Body text | 13px | 400 | `--c1` |
| Meta/label | 12px | 500 | `--c3` |
| Hint/timestamp | 11px | 400 | `--c5` |
| Section label | 11px | 600 | `--c4` (uppercase) |

### Component Tokens

```css
/* Reusable component classes */

/* Cards */
.card {
  background: var(--bg2);
  border: 1px solid var(--bd);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.15s;
}
.card:hover { border-color: var(--bd2); }

/* Buttons */
.btn-primary {
  background: var(--c4);
  color: var(--bg);
  border: 1px solid var(--c4);
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 500;
  transition: all 0.12s;
}
.btn-primary:hover { background: var(--c3); border-color: var(--c3); }

.btn-ghost {
  background: var(--bg3);
  color: var(--c2);
  border: 1px solid var(--bd2);
  border-radius: 7px;
  padding: 7px 14px;
  font-size: 12.5px;
  font-weight: 500;
  transition: all 0.12s;
}
.btn-ghost:hover { background: var(--bg4); color: var(--c1); }

/* Inputs */
.input-base {
  background: var(--bg3);
  border: 1px solid var(--bd2);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: var(--c1);
  outline: none;
  transition: border-color 0.15s;
}
.input-base:focus { border-color: var(--bd3); }
.input-base::placeholder { color: var(--c5); }

/* Status badges */
.badge-ready     { background: var(--bg4); color: var(--c2); border: 1px solid var(--bd2); }
.badge-processing{ background: var(--bg4); color: var(--c3); border: 1px solid var(--bd); }
.badge-failed    { background: var(--bg4); color: #c0634e;   border: 1px solid #5a3030; }
```

---

## 2. App Structure

```
app/
├── (marketing)/
│   └── page.tsx                    # Landing page (public)
├── (auth)/
│   ├── sign-in/[[...sign-in]]/     # Clerk sign-in
│   └── sign-up/[[...sign-up]]/     # Clerk sign-up
└── (dashboard)/
    ├── layout.tsx                  # Root dashboard layout (auth guard)
    ├── page.tsx                    # → redirect to /notebooks
    ├── notebooks/
    │   ├── page.tsx                # Dashboard home — notebook grid
    │   └── [notebookId]/
    │       ├── layout.tsx          # Notebook shell (topbar)
    │       └── page.tsx            # 3-panel notebook view
    └── settings/
        └── page.tsx                # User settings
```

### Layout Hierarchy

```
RootLayout (Clerk provider, QueryClient, Toaster)
└── DashboardLayout (auth guard)
    ├── /notebooks          → NotebooksPage
    └── /notebooks/[id]     → NotebookPage (3-panel)
```

---

## 3. Dashboard View

### `app/(dashboard)/notebooks/page.tsx`

```tsx
export default function NotebooksPage() {
  const { data: notebooks, isLoading } = useNotebooks()
  const { createNotebook } = useNotebookMutations()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Top navigation */}
      <DashboardNav />

      <div className="max-w-6xl mx-auto px-10 py-10">
        {/* Welcome header */}
        <div className="mb-9">
          <h1 style={{ fontSize: 26, fontWeight: 600, color: 'var(--wh)', letterSpacing: -0.5 }}>
            Good afternoon, Usaid
          </h1>
          <p style={{ fontSize: 14, color: 'var(--c4)', marginTop: 5 }}>
            Your AI research workspace — upload documents, ask questions, get answers.
          </p>
        </div>

        {/* Notebooks section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>My Notebooks</SectionLabel>
            <CreateNotebookButton />
          </div>
          {isLoading ? (
            <NotebookGridSkeleton />
          ) : (
            <NotebookGrid notebooks={notebooks ?? []} />
          )}
        </section>

        {/* Recent sources */}
        <section>
          <div className="mb-4">
            <SectionLabel>Recent Sources</SectionLabel>
          </div>
          <RecentSourcesList />
        </section>
      </div>
    </div>
  )
}
```

### `DashboardNav` — `components/layout/DashboardNav.tsx`

```tsx
export function DashboardNav() {
  return (
    <nav style={{
      height: 56, background: 'var(--bg2)',
      borderBottom: '1px solid var(--bd)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16
    }}>
      <Logo />
      <div style={{ flex: 1 }} />
      <SearchBar placeholder="Search notebooks..." />
      <UserAvatar />
    </nav>
  )
}
```

### `NotebookGrid` — `components/notebook/NotebookGrid.tsx`

```tsx
export function NotebookGrid({ notebooks }: { notebooks: Notebook[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
      gap: 14
    }}>
      {notebooks.map(nb => (
        <NotebookCard key={nb.id} notebook={nb} />
      ))}
      <NewNotebookCard />
    </div>
  )
}
```

### `NotebookCard` — `components/notebook/NotebookCard.tsx`

```tsx
export function NotebookCard({ notebook }: { notebook: Notebook }) {
  const router = useRouter()

  return (
    <div
      className="card cursor-pointer group relative overflow-hidden"
      onClick={() => router.push(`/notebooks/${notebook.id}`)}
    >
      {/* Top accent bar — visible on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] opacity-0
                      group-hover:opacity-100 transition-opacity
                      bg-gradient-to-r from-nb-c5 to-nb-c4" />

      <div className="nb-card-icon mb-3">
        <BookOpen className="w-[18px] h-[18px]" style={{ fill: 'var(--c3)' }} />
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--wh)' }}
          className="truncate mb-1">
        {notebook.name}
      </h3>
      <p style={{ fontSize: 12, color: 'var(--c4)' }} className="mb-3">
        {notebook.description}
      </p>

      <div className="flex items-center justify-between pt-3"
           style={{ borderTop: '1px solid var(--bd)' }}>
        <span style={{ fontSize: 11, color: 'var(--c5)' }}>
          {notebook._count.documents} sources · {notebook._count.sessions} chats
        </span>
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
                    style={{ color: 'var(--c5)' }} />
      </div>
    </div>
  )
}
```

### `RecentSourcesList` — `components/notebook/RecentSourcesList.tsx`

```tsx
export function RecentSourcesList() {
  const { data: documents } = useRecentDocuments()

  return (
    <div className="flex flex-col gap-1.5">
      {documents?.map(doc => (
        <RecentSourceRow key={doc.id} document={doc} />
      ))}
    </div>
  )
}

function RecentSourceRow({ document: doc }) {
  const router = useRouter()

  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all"
      style={{ background: 'var(--bg2)', border: '1px solid var(--bd)' }}
      onClick={() => router.push(`/notebooks/${doc.notebookId}`)}
    >
      <div className="src-file-icon">
        <FileText className="w-3.5 h-3.5" style={{ fill: 'var(--c4)' }} />
      </div>
      <span className="flex-1 text-[13px] font-medium truncate"
            style={{ color: 'var(--c1)' }}>
        {doc.name}
      </span>
      <span style={{ fontSize: 12, color: 'var(--c4)' }}>{doc.notebook.name}</span>
      <StatusBadge status={doc.status} />
      <span style={{ fontSize: 11, color: 'var(--c5)' }}>{doc.timeAgo}</span>
    </div>
  )
}
```

### `CreateNotebookButton` — `components/notebook/CreateNotebookButton.tsx`

```tsx
export function CreateNotebookButton() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const { createNotebook, isPending } = useNotebookMutations()
  const router = useRouter()

  async function handleCreate() {
    if (!name.trim()) return
    const nb = await createNotebook({ name: name.trim(), description: desc.trim() })
    setOpen(false)
    router.push(`/notebooks/${nb.id}`)
  }

  return (
    <>
      <button className="btn-primary flex items-center gap-1.5"
              onClick={() => setOpen(true)}>
        <Plus className="w-3.5 h-3.5" />
        New notebook
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ background: 'var(--bg2)', border: '1px solid var(--bd2)', borderRadius: 14 }}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 16, fontWeight: 600, color: 'var(--wh)' }}>
              Create new notebook
            </DialogTitle>
            <DialogDescription style={{ fontSize: 13, color: 'var(--c4)' }}>
              Notebooks are workspaces where you upload sources and chat with AI.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-[12px] font-medium" style={{ color: 'var(--c3)' }}>Name</label>
              <input
                className="input-base w-full mt-1.5"
                placeholder="e.g. Research Papers 2026"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
            <div>
              <label className="text-[12px] font-medium" style={{ color: 'var(--c3)' }}>
                Description <span style={{ color: 'var(--c5)' }}>(optional)</span>
              </label>
              <textarea
                className="input-base w-full mt-1.5 resize-none h-[72px]"
                placeholder="What will you research in this notebook?"
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-5">
            <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
            <button
              className="btn-primary"
              onClick={handleCreate}
              disabled={!name.trim() || isPending}
            >
              {isPending ? <Spinner /> : 'Create notebook'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

---

## 4. Notebook View — 3-Panel Layout

### `app/(dashboard)/notebooks/[notebookId]/page.tsx`

```tsx
export default function NotebookPage({ params }: { params: { notebookId: string } }) {
  const { notebookId } = params
  const { data: notebook } = useNotebook(notebookId)
  const [studioTab, setStudioTab] = useState<'studio' | 'notes' | 'overview'>('studio')

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NotebookTopbar notebook={notebook} />
      <div className="flex flex-1 overflow-hidden">
        <SourcesPanel notebookId={notebookId} />
        <ChatPanel notebookId={notebookId} />
        <StudioPanel
          notebookId={notebookId}
          notebook={notebook}
          activeTab={studioTab}
          onTabChange={setStudioTab}
        />
      </div>
    </div>
  )
}
```

### `NotebookTopbar` — `components/notebook/NotebookTopbar.tsx`

```tsx
export function NotebookTopbar({ notebook }: { notebook: Notebook | undefined }) {
  const router = useRouter()

  return (
    <div style={{
      height: 52, background: 'var(--bg2)',
      borderBottom: '1px solid var(--bd)',
      display: 'flex', alignItems: 'center',
      padding: '0 0 0 16px', gap: 0
    }}>
      {/* Back button */}
      <button
        onClick={() => router.push('/notebooks')}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all"
        style={{ color: 'var(--c4)', background: 'none', border: 'none' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span style={{ fontSize: 13 }}>Notebooks</span>
      </button>

      <div style={{ width: 1, height: 24, background: 'var(--bd)', margin: '0 4px' }} />

      {/* Title */}
      <div className="flex-1 px-3">
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--wh)' }}>
          {notebook?.name ?? '...'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--c5)' }}>
          {notebook?._count.documents} sources · Groq RAG enabled
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4">
        <IconButton icon={Share2} title="Share" />
        <IconButton icon={Settings} title="Settings" />
      </div>
    </div>
  )
}
```

---

## 5. Component Reference

### Panel A — Sources (`components/notebook/SourcesPanel.tsx`)

**Width**: 268px fixed  
**Purpose**: List all uploaded PDFs with checkbox selection for RAG context

```tsx
export function SourcesPanel({ notebookId }: { notebookId: string }) {
  const { data: documents, isLoading } = useDocuments(notebookId)
  const { selectedIds, toggle, toggleAll } = useSourceSelection()
  const { uploadDocument } = useDocumentMutations(notebookId)

  return (
    <div style={{
      width: 268, flexShrink: 0,
      background: 'var(--bg2)',
      borderRight: '1px solid var(--bd)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <PanelHeader title="Sources">
        <button className="ph-btn" onClick={() => fileInputRef.current?.click()}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </PanelHeader>

      {/* Source list */}
      <div className="flex-1 overflow-y-auto p-2.5">
        {isLoading ? (
          <SourceListSkeleton />
        ) : documents?.length === 0 ? (
          <SourcesEmptyState />
        ) : (
          documents?.map(doc => (
            <SourceItem
              key={doc.id}
              document={doc}
              selected={selectedIds.has(doc.id)}
              onToggle={() => toggle(doc.id)}
            />
          ))
        )}
      </div>

      {/* Upload zone */}
      <SourceUploadMini onUpload={uploadDocument} />
    </div>
  )
}
```

#### `SourceItem` sub-component

```tsx
function SourceItem({ document: doc, selected, onToggle }) {
  return (
    <div
      className={`flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer
                  transition-all border mb-1 ${selected ? 'active' : ''}`}
      style={{
        background: selected ? 'var(--bg3)' : 'transparent',
        borderColor: selected ? 'var(--bd2)' : 'transparent'
      }}
      onClick={onToggle}
    >
      {/* Checkbox */}
      <Checkbox checked={selected} />

      {/* File icon */}
      <div className="src-file-icon">
        <FileText className="w-3.5 h-3.5" style={{ fill: 'var(--c4)' }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-medium truncate" style={{ color: 'var(--c1)' }}>
          {doc.name}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: 'var(--c5)' }}>
          {doc.status === 'INDEXED'
            ? `${doc.pageCount}p · ${doc.chunkCount} chunks · ${formatBytes(doc.sizeBytes)}`
            : doc.status === 'PROCESSING' ? 'Processing...' : formatBytes(doc.sizeBytes)
          }
        </div>
        {doc.status === 'PROCESSING' && (
          <ProcessingProgressBar documentId={doc.id} />
        )}
      </div>
    </div>
  )
}
```

---

### Panel B — Chat (`components/notebook/ChatPanel.tsx`)

**Purpose**: Main RAG chat interface with SSE streaming

```tsx
export function ChatPanel({ notebookId }: { notebookId: string }) {
  const { selectedIds } = useSourceSelection()
  const {
    messages, isStreaming, error,
    currentSessionId, sendMessage, stopStreaming
  } = useChat(notebookId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-5">
        {messages.length === 0 ? (
          <ChatEmptyState onChipClick={sendMessage} />
        ) : (
          <div className="max-w-[680px] mx-auto px-5 flex flex-col gap-[18px]">
            {messages.map(msg =>
              msg.role === 'user'
                ? <UserMessage key={msg.id} message={msg} />
                : <AssistantMessage key={msg.id} message={msg} />
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && <ErrorBanner message={error} />}

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        sourceCount={selectedIds.size}
        notebookId={notebookId}
      />
    </div>
  )
}
```

#### `ChatEmptyState`

```tsx
const SUGGESTIONS = [
  'Summarize all sources',
  'What are the key findings?',
  'Compare the documents',
  'List the main conclusions',
  'What methodology was used?',
  'Create a study guide',
]

function ChatEmptyState({ onChipClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 p-10 text-center">
      <div className="ces-icon">
        <MessageSquare className="w-6 h-6" style={{ fill: 'var(--c4)' }} />
      </div>
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--wh)', letterSpacing: -0.3 }}>
          Ask your sources anything
        </h2>
        <p style={{ fontSize: 13, color: 'var(--c4)', marginTop: 6, maxWidth: 340, lineHeight: 1.6 }}>
          Powered by Groq llama-3.3-70b · Embeddings via nomic-embed · Qdrant vector search
        </p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-[460px]">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            className="ces-chip"
            onClick={() => onChipClick(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
```

#### `UserMessage`

```tsx
function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex gap-2.5 flex-row-reverse items-start">
      <div className="cm-av hu">U</div>
      <div className="max-w-[82%]">
        <div className="cm-bubble"
             style={{
               background: 'var(--bg3)',
               border: '1px solid var(--bd2)',
               borderRadius: '12px 3px 12px 12px'
             }}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
```

#### `AssistantMessage`

```tsx
function AssistantMessage({ message }: { message: Message }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)

  return (
    <div className="flex gap-2.5 items-start">
      <div className="cm-av ai">
        <Bot className="w-3.5 h-3.5" style={{ fill: 'var(--c3)' }} />
      </div>
      <div className="max-w-[82%] flex flex-col gap-2">
        {/* Bubble */}
        <div className="cm-bubble"
             style={{
               background: 'var(--bg2)',
               border: '1px solid var(--bd)',
               borderRadius: '3px 12px 12px 12px'
             }}>
          {message.isStreaming && !message.content
            ? <ThinkingDots />
            : <MarkdownRenderer content={message.content} />
          }
        </div>

        {/* Source citations */}
        {message.sources && message.sources.length > 0 && (
          <div>
            <button
              className="cm-src-toggle"
              onClick={() => setSourcesOpen(!sourcesOpen)}
            >
              <BookOpen className="w-3 h-3" />
              {message.sources.length} sources cited {sourcesOpen ? '▸' : '▾'}
            </button>
            {sourcesOpen && (
              <div className="flex flex-col gap-1.5 mt-1">
                {message.sources.map((src, i) => (
                  <SourceCitationCard key={i} source={src} index={i + 1} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

#### `SourceCitationCard`

```tsx
function SourceCitationCard({ source, index }) {
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--bd)',
      borderRadius: 7, padding: '8px 10px'
    }}>
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--c2)' }}>
          [{index}] {source.documentName} · p.{source.page}
        </span>
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 100,
          background: 'var(--bg4)', color: 'var(--c3)',
          border: '1px solid var(--bd)'
        }}>
          {Math.round(source.score * 100)}%
        </span>
      </div>
      <p style={{ fontSize: 11.5, color: 'var(--c4)', lineHeight: 1.6 }}>
        "{source.text.slice(0, 200)}..."
      </p>
    </div>
  )
}
```

#### `ChatInput`

```tsx
export function ChatInput({ onSend, onStop, isStreaming, sourceCount, notebookId }) {
  const [value, setValue] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)
  const { data: docs } = useDocuments(notebookId)
  const hasIndexed = docs?.some(d => d.status === 'INDEXED')

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'
  }, [value])

  return (
    <div className="px-5 py-3.5 flex-shrink-0"
         style={{ borderTop: '1px solid var(--bd)', background: 'var(--bg2)' }}>
      <div className="max-w-[680px] mx-auto">
        <div className="flex items-end gap-2.5 p-2.5 rounded-[10px] transition-all"
             style={{
               background: 'var(--bg3)',
               border: '1px solid var(--bd2)'
             }}>
          <textarea
            ref={taRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (value.trim() && !isStreaming) { onSend(value); setValue('') }
              }
            }}
            placeholder={
              !hasIndexed
                ? 'Upload and process a document first...'
                : 'Ask anything about your sources...'
            }
            disabled={!hasIndexed}
            rows={1}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 13, color: 'var(--c1)', resize: 'none', maxHeight: 110, lineHeight: 1.6
            }}
          />
          {isStreaming ? (
            <button onClick={onStop} className="stop-btn">
              <Square className="w-3.5 h-3.5" style={{ fill: '#c0634e' }} />
            </button>
          ) : (
            <button
              onClick={() => { if (value.trim()) { onSend(value); setValue('') } }}
              disabled={!value.trim() || !hasIndexed}
              className="chat-send"
            >
              <Send className="w-3.5 h-3.5" style={{ fill: 'var(--bg)' }} />
            </button>
          )}
        </div>
        <p style={{ fontSize: 11, color: 'var(--c5)', textAlign: 'center', marginTop: 8 }}>
          Groq · llama-3.3-70b-versatile · RAG via Qdrant (1024d) · {sourceCount} sources selected
        </p>
      </div>
    </div>
  )
}
```

---

### Panel C — Studio (`components/notebook/StudioPanel.tsx`)

**Width**: 280px fixed  
**Tabs**: Studio | Notes | Overview

```tsx
export function StudioPanel({ notebookId, notebook, activeTab, onTabChange }) {
  return (
    <div style={{
      width: 280, flexShrink: 0,
      background: 'var(--bg2)',
      borderLeft: '1px solid var(--bd)',
      display: 'flex', flexDirection: 'column'
    }}>
      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: '1px solid var(--bd)' }}>
        {(['studio', 'notes', 'overview'] as const).map(tab => (
          <button
            key={tab}
            className="studio-tab"
            style={{
              flex: 1, padding: '12px 10px',
              fontSize: 12, fontWeight: 500,
              color: activeTab === tab ? 'var(--c1)' : 'var(--c4)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--c3)' : 'transparent'}`,
              textTransform: 'capitalize', background: 'none', border: 'none', cursor: 'pointer'
            }}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-3.5">
        {activeTab === 'studio'   && <StudioTab notebookId={notebookId} />}
        {activeTab === 'notes'    && <NotesTab notebookId={notebookId} />}
        {activeTab === 'overview' && <OverviewTab notebook={notebook} />}
      </div>
    </div>
  )
}
```

#### `StudioTab` — Generate outputs

```tsx
const OUTPUTS = [
  {
    id: 'summary', icon: FileText, title: 'Summary',
    desc: 'Concise summary of all selected sources',
    prompt: 'Generate a comprehensive summary of all selected sources'
  },
  {
    id: 'briefing', icon: LayoutList, title: 'Briefing doc',
    desc: 'Structured briefing with key points and insights',
    prompt: 'Create a structured briefing document with key insights'
  },
  {
    id: 'faq', icon: HelpCircle, title: 'FAQ',
    desc: 'Common questions and answers from sources',
    prompt: 'Generate frequently asked questions from the sources'
  },
  {
    id: 'timeline', icon: Clock, title: 'Timeline',
    desc: 'Extract chronological events and dates',
    prompt: 'Extract and organize all chronological events and dates'
  },
]

function StudioTab({ notebookId }) {
  const { sendMessage } = useChat(notebookId)

  return (
    <div className="space-y-4">
      <SectionLabel>Generate</SectionLabel>
      <div className="space-y-2">
        {OUTPUTS.map(out => (
          <div
            key={out.id}
            className="output-card cursor-pointer"
            onClick={() => sendMessage(out.prompt)}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <out.icon className="w-3.5 h-3.5" style={{ fill: 'var(--c4)' }} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--c1)' }}>
                {out.title}
              </span>
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--c4)', lineHeight: 1.5 }}>
              {out.desc}
            </p>
          </div>
        ))}
      </div>

      <SectionLabel className="mt-5">Key Topics</SectionLabel>
      <KeyTopics notebookId={notebookId} />
    </div>
  )
}
```

#### `NotesTab`

```tsx
function NotesTab({ notebookId }) {
  const [text, setText] = useState('')
  const { notes, addNote } = useNotes(notebookId)

  return (
    <div className="space-y-4">
      <SectionLabel>My Notes</SectionLabel>
      <textarea
        className="note-box w-full"
        placeholder="Add a note... (Ctrl+Enter to save)"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && e.ctrlKey) {
            addNote(text); setText('')
          }
        }}
        rows={4}
      />
      <button
        className="btn-ghost w-full justify-center text-[12px]"
        onClick={() => { addNote(text); setText('') }}
      >
        Save note
      </button>
      <div className="space-y-2 mt-2">
        {notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}
```

#### `OverviewTab`

```tsx
function OverviewTab({ notebook }) {
  const stats = [
    { label: 'Total sources', value: notebook?._count.documents ?? 0 },
    { label: 'Vector chunks', value: notebook?.totalChunks ?? 0 },
    { label: 'Embedding dim', value: '1024d' },
    { label: 'LLM', value: 'llama-3.3-70b' },
    { label: 'Vector DB', value: 'Qdrant' },
    { label: 'Embeddings', value: 'nomic-embed' },
  ]

  return (
    <div className="space-y-4">
      <SectionLabel>Overview</SectionLabel>
      <MindMap notebook={notebook} />

      <SectionLabel className="mt-5">Stack Info</SectionLabel>
      <div className="space-y-2">
        {stats.map(s => (
          <div key={s.label} className="flex justify-between text-[12px] px-2.5 py-2
                                        rounded-lg" style={{ background: 'var(--bg3)', border: '1px solid var(--bd)' }}>
            <span style={{ color: 'var(--c4)' }}>{s.label}</span>
            <span style={{ color: 'var(--c1)', fontWeight: 600 }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 6. Hooks

### `useNotebooks` — `hooks/useNotebooks.ts`

```typescript
export function useNotebooks() {
  return useQuery({
    queryKey: ['notebooks'],
    queryFn: () => api.get<Notebook[]>('/notebooks').then(r => r.data),
    staleTime: 30_000,
  })
}

export function useNotebook(id: string) {
  return useQuery({
    queryKey: ['notebooks', id],
    queryFn: () => api.get<Notebook>(`/notebooks/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useNotebookMutations() {
  const qc = useQueryClient()

  const create = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api.post<Notebook>('/notebooks', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notebooks'] }),
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/notebooks/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notebooks'] }),
  })

  return {
    createNotebook: create.mutateAsync,
    deleteNotebook: remove.mutateAsync,
    isPending: create.isPending,
  }
}
```

### `useDocuments` — `hooks/useDocuments.ts`

```typescript
export function useDocuments(notebookId: string) {
  return useQuery({
    queryKey: ['documents', notebookId],
    queryFn: () =>
      api.get<Document[]>(`/documents?notebookId=${notebookId}`).then(r => r.data),
    // Auto-poll while any doc is processing
    refetchInterval: data => {
      const hasPending = data?.some(d => ['PENDING', 'PROCESSING'].includes(d.status))
      return hasPending ? 3000 : false
    },
  })
}

export function useDocumentMutations(notebookId: string) {
  const qc = useQueryClient()

  async function uploadDocument(file: File, onProgress?: (p: number) => void) {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('notebookId', notebookId)

    await api.post('/documents/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => onProgress?.(Math.round((e.loaded * 100) / (e.total ?? 1))),
    })
    qc.invalidateQueries({ queryKey: ['documents', notebookId] })
  }

  async function deleteDocument(documentId: string) {
    await api.delete(`/documents/${documentId}`)
    qc.invalidateQueries({ queryKey: ['documents', notebookId] })
  }

  return { uploadDocument, deleteDocument }
}
```

### `useChat` — `hooks/useChat.ts`

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  isStreaming?: boolean
}

export function useChat(notebookId: string, initialSessionId?: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(initialSessionId ?? null)
  const abortRef = useRef<AbortController | null>(null)
  const { selectedIds } = useSourceSelection()

  // Load session history on mount / session change
  useEffect(() => {
    if (!sessionId) { setMessages([]); return }
    api.get(`/chat/sessions/${sessionId}`)
      .then(r => setMessages(r.data.messages ?? []))
      .catch(() => setMessages([]))
  }, [sessionId])

  async function sendMessage(content: string) {
    if (!content.trim() || isStreaming) return
    setError(null)

    const userMsgId = crypto.randomUUID()
    const asstMsgId = crypto.randomUUID()

    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content },
      { id: asstMsgId, role: 'assistant', content: '', isStreaming: true },
    ])
    setIsStreaming(true)
    abortRef.current = new AbortController()

    try {
      const res = await fetch(`/api/chat/${notebookId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId,
          selectedSourceIds: [...selectedIds],
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Request failed')
      }

      // Capture session ID from header
      const newSid = res.headers.get('X-Session-Id')
      if (newSid && !sessionId) setSessionId(newSid)

      // Parse SSE stream (with buffer for split chunks)
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'token') {
              setMessages(prev => prev.map(m =>
                m.id === asstMsgId ? { ...m, content: m.content + data.content } : m
              ))
            }
            if (data.type === 'sources') {
              setMessages(prev => prev.map(m =>
                m.id === asstMsgId ? { ...m, sources: data.sources } : m
              ))
            }
            if (data.type === 'error') {
              setError(data.message)
              setMessages(prev => prev.filter(m => m.id !== asstMsgId))
            }
          } catch { /* skip malformed lines */ }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message ?? 'Something went wrong.')
        setMessages(prev => prev.filter(m => m.id !== asstMsgId))
      }
    } finally {
      setMessages(prev => prev.map(m =>
        m.id === asstMsgId ? { ...m, isStreaming: false } : m
      ))
      setIsStreaming(false)
    }
  }

  function stopStreaming() {
    abortRef.current?.abort()
    setIsStreaming(false)
  }

  return {
    messages, isStreaming, error, sessionId,
    sendMessage, stopStreaming,
    clearError: () => setError(null),
  }
}
```

### `useSourceSelection` — `hooks/useSourceSelection.ts`

```typescript
// Zustand store for cross-component source selection
interface SourceSelectionStore {
  selectedIds: Set<string>
  toggle: (id: string) => void
  selectAll: (ids: string[]) => void
  clear: () => void
}

export const useSourceSelection = create<SourceSelectionStore>(set => ({
  selectedIds: new Set(),
  toggle: id => set(s => {
    const next = new Set(s.selectedIds)
    if (next.has(id)) next.delete(id); else next.add(id)
    return { selectedIds: next }
  }),
  selectAll: ids => set({ selectedIds: new Set(ids) }),
  clear: () => set({ selectedIds: new Set() }),
}))
```

---

## 7. API Integration

### `lib/api.ts`

```typescript
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  timeout: 30_000,
})

// Attach Clerk JWT on every request
api.interceptors.request.use(async config => {
  if (typeof window !== 'undefined') {
    const token = await window.Clerk?.session?.getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global error handler
api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.error ?? 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)
```

### Next.js API Proxy — `app/api/[...proxy]/route.ts`

```typescript
// Proxy all /api/* requests to Express server
// This avoids CORS issues and keeps the auth token handling clean

export async function POST(req: Request, { params }: { params: { proxy: string[] } }) {
  const path = params.proxy.join('/')
  const body = await req.text()
  const headers = Object.fromEntries(req.headers)

  const res = await fetch(`${process.env.API_URL}/api/${path}`, {
    method: 'POST',
    headers,
    body,
  })

  // For SSE endpoints, stream the response directly
  if (res.headers.get('content-type')?.includes('text/event-stream')) {
    return new Response(res.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Session-Id': res.headers.get('X-Session-Id') ?? '',
      }
    })
  }

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
```

---

## 8. State Management

### Zustand Stores

```typescript
// store/notebookStore.ts
interface NotebookStore {
  activeNotebookId: string | null
  setActive: (id: string | null) => void
}
export const useNotebookStore = create<NotebookStore>(set => ({
  activeNotebookId: null,
  setActive: id => set({ activeNotebookId: id }),
}))

// store/chatStore.ts
interface ChatStore {
  activeSessionId: string | null
  setSession: (id: string | null) => void
  studioTab: 'studio' | 'notes' | 'overview'
  setStudioTab: (tab: 'studio' | 'notes' | 'overview') => void
}
export const useChatStore = create<ChatStore>(set => ({
  activeSessionId: null,
  setSession: id => set({ activeSessionId: id }),
  studioTab: 'studio',
  setStudioTab: tab => set({ studioTab: tab }),
}))
```

### TanStack Query Config

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: err => toast.error(err instanceof Error ? err.message : 'Something went wrong'),
    },
  },
})
```

---

## 9. Pages & Routing

### Route Map

| Route | Component | Auth | Description |
|-------|-----------|------|-------------|
| `/` | `LandingPage` | Public | Marketing page |
| `/sign-in` | Clerk | Public | Sign in |
| `/sign-up` | Clerk | Public | Sign up |
| `/notebooks` | `NotebooksPage` | Required | Dashboard home |
| `/notebooks/[id]` | `NotebookPage` | Required | 3-panel notebook |
| `/settings` | `SettingsPage` | Required | User settings |

### Auth Guard — `app/(dashboard)/layout.tsx`

```tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster theme="dark" position="bottom-right" />
    </QueryClientProvider>
  )
}
```

---

## 10. Required Packages

```bash
# Core
npm install next@latest react react-dom typescript

# Auth
npm install @clerk/nextjs

# State & data
npm install @tanstack/react-query zustand

# UI
npm install tailwindcss @tailwindcss/typography
npx shadcn@latest init
npx shadcn@latest add dialog tooltip dropdown-menu

# Chat rendering
npm install react-markdown rehype-highlight remark-gfm highlight.js

# HTTP
npm install axios

# Toasts
npm install sonner

# Icons
npm install lucide-react

# Utilities
npm install clsx tailwind-merge
npm install -D @types/uuid
```

### `tailwind.config.ts` (complete)

```typescript
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nb: {
          c1:'#bfc3c4',c2:'#a7a7aa',c3:'#8e9095',
          c4:'#6f7176',c5:'#4e5155',
          bg:'#18191c',bg2:'#1f2023',bg3:'#252628',
          bg4:'#2c2d30',bg5:'#333437',
          bd:'#35363a',bd2:'#424347',bd3:'#525459',
          wh:'#e8eaeb',
        }
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#bfc3c4',
            '--tw-prose-headings': '#e8eaeb',
            '--tw-prose-code': '#a7a7aa',
            '--tw-prose-pre-bg': '#252628',
          }
        }
      }
    }
  },
  plugins: [typography],
} satisfies Config
```

---

## 11. Environment Variables

```bash
# .env.local

# App
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_URL=http://localhost:3001          # Server-side proxy

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/notebooks
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/notebooks
```

---

## 12. File Structure

```
client/
├── app/
│   ├── globals.css                        # CSS variables + base styles
│   ├── layout.tsx                         # Root layout (fonts, providers)
│   ├── (marketing)/
│   │   └── page.tsx                       # Landing page
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                     # Auth guard + QueryClient
│   │   ├── page.tsx                       # → redirect /notebooks
│   │   ├── notebooks/
│   │   │   ├── page.tsx                   # Dashboard home
│   │   │   └── [notebookId]/
│   │   │       ├── layout.tsx             # Notebook topbar shell
│   │   │       └── page.tsx               # 3-panel notebook view
│   │   └── settings/page.tsx
│   └── api/
│       └── [...proxy]/route.ts            # Next.js → Express proxy
│
├── components/
│   ├── layout/
│   │   ├── DashboardNav.tsx
│   │   └── Logo.tsx
│   ├── notebook/
│   │   ├── NotebookGrid.tsx
│   │   ├── NotebookCard.tsx
│   │   ├── CreateNotebookButton.tsx
│   │   ├── NotebookTopbar.tsx
│   │   ├── RecentSourcesList.tsx
│   │   ├── SourcesPanel.tsx               # Left panel
│   │   ├── SourceItem.tsx
│   │   ├── SourceUploadMini.tsx
│   │   ├── ChatPanel.tsx                  # Center panel
│   │   ├── ChatEmptyState.tsx
│   │   ├── UserMessage.tsx
│   │   ├── AssistantMessage.tsx
│   │   ├── SourceCitationCard.tsx
│   │   ├── ChatInput.tsx
│   │   ├── StudioPanel.tsx                # Right panel
│   │   ├── StudioTab.tsx
│   │   ├── NotesTab.tsx
│   │   ├── OverviewTab.tsx
│   │   ├── MindMap.tsx
│   │   └── KeyTopics.tsx
│   └── ui/
│       ├── MarkdownRenderer.tsx
│       ├── StatusBadge.tsx
│       ├── ThinkingDots.tsx
│       ├── Spinner.tsx
│       ├── Skeleton.tsx
│       ├── SectionLabel.tsx
│       ├── PanelHeader.tsx
│       └── IconButton.tsx
│
├── hooks/
│   ├── useNotebooks.ts
│   ├── useDocuments.ts
│   ├── useChat.ts
│   ├── useSessions.ts
│   ├── useSourceSelection.ts
│   └── useNotes.ts
│
├── lib/
│   ├── api.ts                             # Axios instance + interceptors
│   ├── queryClient.ts
│   └── utils.ts                           # cn, formatBytes, formatDate
│
└── store/
    ├── notebookStore.ts
    └── chatStore.ts
```

---

## 13. LLM Integration Layer

### How the frontend connects to Groq + Qdrant

```
User types message
        │
ChatInput.tsx → sendMessage(content)
        │
useChat.ts → POST /api/chat/:notebookId/message
        │     body: { message, sessionId, selectedSourceIds }
        │
Next.js proxy → Express /api/chat/:notebookId/message
        │
ragService.js:
  1. embedText(message)          → Colab ngrok (nomic-embed, 1024d)
  2. searchVectors(collection)   → Qdrant (filtered by selectedSourceIds)
  3. buildPrompt(chunks, history)→ System + Context + History + User
  4. streamGroqResponse(messages)→ Groq API (llama-3.3-70b-versatile)
  5. SSE: token → sources → done
        │
useChat.ts reads SSE stream:
  data: {"type":"token","content":"..."} → append to message bubble
  data: {"type":"sources","sources":[]}  → attach citations
  data: {"type":"done"}                  → setIsStreaming(false)
        │
AssistantMessage.tsx renders:
  MarkdownRenderer  → prose content
  SourceCitationCard → expandable source cards with scores
```

### SSE Event Types

```typescript
// All events sent from Express → Next.js proxy → useChat hook

type SSEEvent =
  | { type: 'token';   content: string }
  | { type: 'sources'; sources: Source[] }
  | { type: 'done' }
  | { type: 'error';   message: string }

interface Source {
  documentId:   string
  documentName: string
  page:         number | null
  score:        number       // 0.0 → 1.0 (Qdrant cosine similarity)
  text:         string       // first 200 chars of chunk
}
```

### Studio → Chat Integration

```typescript
// StudioTab clicks → auto-fill + send chat message

const GENERATE_PROMPTS = {
  summary:  'Generate a comprehensive summary of all selected sources',
  briefing: 'Create a structured briefing document with key insights and action items',
  faq:      'Generate the top 10 frequently asked questions with detailed answers',
  timeline: 'Extract and organize all chronological events and dates mentioned',
}

function handleGenerate(type: keyof typeof GENERATE_PROMPTS) {
  sendMessage(GENERATE_PROMPTS[type])
  onTabChange('studio')  // keep studio tab visible while chat streams
}
```

---

## 14. Production Checklist

### Design Quality
- [ ] Color palette applied consistently (5-stop custom palette)
- [ ] Dark theme across all pages and modals
- [ ] Hover and focus states on all interactive elements
- [ ] Smooth transitions (`transition: all 0.12–0.15s`)
- [ ] Top accent bar on notebook cards on hover
- [ ] Skeleton loaders on all async data
- [ ] Empty states with helpful CTAs on all lists

### Dashboard
- [ ] Notebook grid with `auto-fill` responsive columns
- [ ] Recent sources list across all notebooks
- [ ] Create notebook modal with name + description
- [ ] Notebook cards show doc count, chat count, description
- [ ] New notebook card with dashed border

### Notebook View
- [ ] Sources panel with checkboxes (toggles RAG context)
- [ ] Upload zone in sources panel (drag + click)
- [ ] Processing progress bar per document
- [ ] Auto-poll documents until all INDEXED
- [ ] Topbar with back navigation and notebook title
- [ ] Share + Settings icon buttons in topbar

### Chat
- [ ] Messages stream token-by-token via SSE
- [ ] Thinking dots animation while waiting
- [ ] Source citation cards expandable per message
- [ ] Score percentage displayed per citation
- [ ] Stop generation button during streaming
- [ ] Suggestion chips on empty state
- [ ] Auto-scroll to latest message
- [ ] Textarea auto-resizes up to 110px
- [ ] Disabled state when no indexed docs
- [ ] LLM info shown in input hint

### Studio Panel
- [ ] Summary / Briefing / FAQ / Timeline generation buttons
- [ ] Each button auto-fills and sends correct prompt
- [ ] Key topics rendered as tags
- [ ] Notes tab with save + list
- [ ] Overview tab with mind map + stack stats
- [ ] Stats show: chunks, dims, LLM, vector DB

### Error Handling
- [ ] Error banner below messages area
- [ ] Toast on upload failure
- [ ] Toast on notebook creation failure
- [ ] Graceful SSE error events shown in chat
- [ ] Retry button on failed documents

### Performance
- [ ] RSC for all data-fetching pages
- [ ] Optimistic updates on mutations
- [ ] `staleTime: 60s` on notebook/document queries
- [ ] `refetchInterval` only while docs processing
- [ ] SSE buffer handles split TCP chunks correctly

### Mobile
- [ ] Sources panel collapses on < 768px
- [ ] Studio panel collapses on < 1024px
- [ ] Chat panel fills full width on mobile
- [ ] Touch-friendly tap targets (min 44px)
