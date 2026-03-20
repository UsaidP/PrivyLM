import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { useSourceSelection } from '../../hooks/useSourceSelection';
import { AlertCircle, RefreshCcw, Loader2, Info } from 'lucide-react';
import { useApiClient } from '@/lib/api';

interface ChatWindowProps {
  notebookId: string;
  sessionId?: string;
  hasIndexedDocuments: boolean;
}

const EmptyChat = ({ onPromptClick }: { onPromptClick: (text: string) => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '48px 32px', textAlign: 'center', gap: '24px' }}>
    <div>
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
        Ask anything about your documents
      </h2>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-tertiary)', maxWidth: '360px', lineHeight: 1.5 }}>
        Start chatting to explore the contents of the PDFs you uploaded to this notebook.
      </p>
    </div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <button onClick={() => onPromptClick("Summarize the key points.")} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-default)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', transition: 'all 0.15s' }}>Summarize key points</button>
      <button onClick={() => onPromptClick("What are the main arguments?")} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--border-default)', background: 'var(--bg-surface)', cursor: 'pointer', fontSize: '13px', color: 'var(--text-secondary)', transition: 'all 0.15s' }}>Main arguments</button>
    </div>
  </div>
);

export const ChatWindow = ({ notebookId, sessionId, hasIndexedDocuments }: ChatWindowProps) => {
  const { messages, isStreaming, error, sendMessage, retry, stopStreaming, setMessages } = useChat(notebookId, sessionId);
  const { selectedIds } = useSourceSelection();
  const api = useApiClient();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    // If a sessionId is provided, fetch history
    if (sessionId) {
      setLoadingHistory(true);
      api.get(`/api/chat/sessions/${sessionId}`)
        .then(res => {
          setMessages(res.data.messages || []);
        })
        .catch(err => {
          console.error("Failed to load session history", err);
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    } else {
      setMessages([]); // clean slate
    }
  }, [sessionId, notebookId, setMessages, api]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = () => {
    const content = input.trim();
    if (!content) return;
    setInput('');
    sendMessage(content, Array.from(selectedIds));
  };

  const handleRetry = () => {
    retry(Array.from(selectedIds));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, background: 'var(--bg-primary)', position: 'relative' }}>
      {/* SSE Connection Status */}
      {isStreaming && (
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'var(--bg-surface)', borderRadius: '100px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Streaming</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div style={{ padding: '12px 24px', background: 'rgba(248, 113, 113, 0.1)', borderBottom: '1px solid rgba(248, 113, 113, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={16} color="var(--destructive)" />
          <span style={{ flex: 1, fontSize: '13px', color: 'var(--text-primary)' }}>{error}</span>
          <button 
            onClick={handleRetry}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            <RefreshCcw size={12} />
            Retry
          </button>
        </div>
      )}

      {/* No Indexed Documents Warning */}
      {!hasIndexedDocuments && (
        <div style={{ padding: '12px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Info size={16} color="var(--accent)" />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            No documents indexed yet. Upload a PDF in the Sources panel to start chatting.
          </span>
        </div>
      )}

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        {loadingHistory ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
            <Loader2 size={24} className="animate-spin" color="var(--text-muted)" />
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading conversation history...</div>
          </div>
        ) : messages.length === 0 ? (
          <EmptyChat onPromptClick={(text) => { setInput(text); }} />
        ) : (
          <MessageList messages={messages} />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '0 32px 24px' }}>
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isStreaming={isStreaming}
          onStop={stopStreaming}
          disabled={!hasIndexedDocuments}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1); }
          100% { opacity: 0.4; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
};
