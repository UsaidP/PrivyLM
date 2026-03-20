import React, { useEffect, useState } from 'react';
import { useApiClient } from '@/lib/api';

interface Session {
  id: string;
  title: string | null;
  updatedAt: string;
}

interface SessionSidebarProps {
  notebookId: string;
  activeSessionId?: string;
  onSelect: (sessionId?: string) => void;
  onNew: () => void;
  onDelete?: (sessionId: string) => void;
}

export const SessionSidebar = ({ notebookId, activeSessionId, onSelect, onNew, onDelete }: SessionSidebarProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const api = useApiClient();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get(`/api/chat/${notebookId}/sessions`);
        setSessions(res.data);
      } catch (err) {
        console.error("Failed to fetch sessions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [notebookId, activeSessionId, api]); // re-fetch when active session changes (e.g. title updated)

  return (
    <div style={{
      width: '260px',
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--bg-secondary)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      height: '100%',
    }}>
      <div style={{ padding: '16px' }}>
        <button
          onClick={onNew}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)', border: '1px dashed var(--border-default)',
            color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', fontWeight: 500, transition: 'all 0.15s'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
          Recent Sessions
        </div>
        
        {loading ? (
          <div style={{ padding: '8px 4px', fontSize: '12px', color: 'var(--text-muted)' }}>Loading...</div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '8px 4px', fontSize: '12px', color: 'var(--text-muted)' }}>No previous chats.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSelect(session.id)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(10px)',
                  background: activeSessionId === session.id ? 'var(--accent-muted)' : 'transparent',
                  color: activeSessionId === session.id ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                  userSelect: 'none'
                }}
              >
                <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '10px' }}>
                  {session.title || "New Chat"}
                </div>
                {onDelete && activeSessionId === session.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                    title="Delete Chat"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
