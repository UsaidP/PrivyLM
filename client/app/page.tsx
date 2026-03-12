'use client'
import { useState } from 'react';
import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      background: 'var(--bg-primary)',
    }}>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 'var(--sidebar-width)' : '0px',
        minWidth: sidebarOpen ? 'var(--sidebar-width)' : '0px',
        height: '100vh',
        borderRight: sidebarOpen ? '1px solid var(--border-subtle)' : 'none',
        overflow: 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
      }}>
        <FileUploadComponent />
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
          style={{
            position: 'absolute',
            top: '14px',
            left: '16px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? (
              <>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
        <ChatComponent />
      </main>
    </div>
  );
}
