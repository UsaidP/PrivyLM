'use client';

import Link from 'next/link';
import { FileText, Clock } from 'lucide-react';
import { DeleteNotebookButton } from '@/components/DeleteNotebookButton';

interface NotebookCardProps {
  id: string;
  title: string;
  description: string | null;
  updatedAt: Date;
  documentCount: number;
}

export function NotebookCard({ id, title, description, updatedAt, documentCount }: NotebookCardProps) {
  return (
    <Link
      href={`/notebooks/${id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        textDecoration: 'none',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--text-secondary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: 0 }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <FileText size={20} color="var(--text-secondary)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: '0 0 2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              paddingRight: '24px',
            }}>
              {title}
            </h3>
            {description && (
              <p style={{
                fontSize: '13px',
                color: 'var(--text-tertiary)',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {description}
              </p>
            )}
          </div>
        </div>

        <div style={{ flexShrink: 0, position: 'relative', zIndex: 10 }}>
          <DeleteNotebookButton notebookId={id} notebookName={title} />
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginTop: 'auto',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          <FileText size={14} />
          {documentCount} docs
        </span>
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          <Clock size={14} />
          {new Date(updatedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' })}
        </span>
      </div>
    </Link>
  );
}
