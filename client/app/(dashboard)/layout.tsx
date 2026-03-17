'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import {
  FileText,
  Settings,
  Home,
  Plus,
  ChevronRight,
  LogOut
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: '20px 16px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text-primary)',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FileText size={18} color="#fff" />
            </div>
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '-0.3px',
            }}>
              PDF Research
            </span>
          </Link>
        </div>

        {/* New Notebook Button */}
        <div style={{ padding: '16px' }}>
          <button style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-strong)',
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
            <Plus size={16} />
            New Notebook
          </button>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: '0 12px',
          overflowY: 'auto',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '8px 12px',
            marginBottom: '4px',
          }}>
            Notebooks
          </div>

          {/* Sample notebook items - replace with dynamic data */}
          <Link
            href="/notebooks/1"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: pathname.includes('/notebooks/1') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: pathname.includes('/notebooks/1') ? 'var(--bg-surface)' : 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '2px',
              transition: 'all 0.12s',
            }}
          >
            <FileText size={16} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Research Papers
            </span>
            <ChevronRight size={14} style={{ opacity: 0.5 }} />
          </Link>

          <Link
            href="/notebooks/2"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: pathname.includes('/notebooks/2') ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: pathname.includes('/notebooks/2') ? 'var(--bg-surface)' : 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '2px',
              transition: 'all 0.12s',
            }}
          >
            <FileText size={16} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Project Docs
            </span>
            <ChevronRight size={14} style={{ opacity: 0.5 }} />
          </Link>
        </nav>

        {/* Settings Link */}
        <div style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <Link
            href="/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: pathname === '/settings' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: pathname === '/settings' ? 'var(--bg-surface)' : 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.12s',
            }}
          >
            <Settings size={16} />
            Settings
          </Link>
        </div>

        {/* User Profile Section */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface)',
        }}>
          {isLoaded && user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                    }
                  }
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user.fullName || user.primaryEmailAddress?.emailAddress}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--bg-elevated)',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  height: '14px',
                  width: '100px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '4px',
                  marginBottom: '4px',
                }} />
                <div style={{
                  height: '11px',
                  width: '140px',
                  background: 'var(--bg-elevated)',
                  borderRadius: '4px',
                }} />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {children}
      </main>
    </div>
  );
}