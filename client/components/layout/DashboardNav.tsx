'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export function DashboardNav() {
  return (
    <nav style={{
      height: 56,
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
    }}>
      {/* Logo */}
      <Link href="/notebooks" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        textDecoration: 'none',
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" strokeWidth="2.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <span style={{
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '-0.3px',
        }}>
          NotebookLM
        </span>
      </Link>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User Avatar */}
      <UserButton
        appearance={{
          elements: {
            avatarBox: {
              width: 32,
              height: 32,
            },
          },
        }}
      />
    </nav>
  );
}
