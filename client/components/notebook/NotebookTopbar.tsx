'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Settings } from 'lucide-react';
import type { Notebook } from '@/hooks/useNotebooks';

interface NotebookTopbarProps {
  notebook: Notebook | undefined;
}

export function NotebookTopbar({ notebook }: NotebookTopbarProps) {
  const router = useRouter();

  return (
    <div style={{
      height: 52,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 0 0 16px',
      gap: 0,
    }}>
      {/* Back button */}
      <button
        onClick={() => router.push('/notebooks')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          borderRadius: 8,
          border: 'none',
          background: 'transparent',
          color: 'var(--text-tertiary)',
          fontSize: 13,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--bg-surface-hover)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-tertiary)';
        }}
      >
        <ArrowLeft size={16} />
        <span>Notebooks</span>
      </button>

      <div style={{
        width: 1,
        height: 24,
        background: 'var(--border-default)',
        margin: '0 4px',
      }} />

      {/* Title */}
      <div style={{ flex: 1, padding: '0 12px' }}>
        <div style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}>
          {notebook?.title ?? '...'}
        </div>
        <div style={{
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          {notebook?._count?.documents ?? 0} sources · Groq RAG enabled
        </div>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 16px',
      }}>
        <button
          title="Share"
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-surface-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-tertiary)';
          }}
        >
          <Share2 size={16} />
        </button>
        <button
          title="Settings"
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-surface-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-tertiary)';
          }}
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
