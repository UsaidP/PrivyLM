'use client';

import React, { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

interface UploadFile {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const generateId = (): string => Math.random().toString(36).substring(2, 10);

// ─── Component ────────────────────────────────────────────────────────────────
const FileUploadComponent: React.FC = () => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback((id: string, file: File) => {
    const formData = new FormData();
    formData.append('pdf', file);

    axios.post('http://localhost:8000/upload/pdf', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setFiles(prev =>
            prev.map(f =>
              f.id === id ? { ...f, progress: percent } : f
            )
          );
        }
      },
    })
      .then(() => {
        setFiles(prev =>
          prev.map(f =>
            f.id === id ? { ...f, progress: 100, status: 'success' } : f
          )
        );
      })
      .catch(() => {
        setFiles(prev =>
          prev.map(f =>
            f.id === id ? { ...f, status: 'error', error: 'Upload failed' } : f
          )
        );
      });
  }, []);

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f => {
      if (f.type !== 'application/pdf') return false;
      if (f.size > 50 * 1024 * 1024) return false;
      return true;
    });

    const newItems: UploadFile[] = valid.map(file => ({
      id: generateId(),
      file,
      status: 'uploading',
      progress: 0,
    }));

    setFiles(prev => [...prev, ...newItems]);
    newItems.forEach(item => uploadFile(item.id, item.file));
  }, [uploadFile]);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const removeFile = (id: string) =>
    setFiles(prev => prev.filter(f => f.id !== id));

  const pendingCount = files.filter(f => f.status === 'uploading').length;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.2px',
          }}>
            Sources
          </span>
          {files.length > 0 && (
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              background: 'var(--bg-surface)',
              padding: '1px 7px',
              borderRadius: '10px',
            }}>
              {files.length}
            </span>
          )}
        </div>
      </div>

      {/* Add Source Button */}
      <div style={{ padding: '12px 16px 4px' }}>
        <button
          onClick={() => inputRef.current?.click()}
          id="add-source-btn"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 0',
            border: '1px dashed var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            background: isDragging ? 'var(--accent-muted)' : 'transparent',
            color: isDragging ? 'var(--accent-hover)' : 'var(--text-tertiary)',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontFamily: 'inherit',
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add source
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={onInputChange}
          style={{ display: 'none' }}
          id="pdf-file-input"
        />
      </div>

      {/* File List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        {files.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '32px 16px',
            textAlign: 'center',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.5 }}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 500, color: 'var(--text-tertiary)' }}>
              No sources yet
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Upload PDFs to build your knowledge base
            </p>
          </div>
        ) : (
          files.map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                cursor: 'default',
                transition: 'background 0.12s ease',
                position: 'relative',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* File Icon */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>

              {/* Name & Meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                }}>
                  {item.file.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {formatBytes(item.file.size)}
                  </span>
                  {item.status === 'uploading' && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: 'var(--warning)',
                      background: 'var(--warning-muted)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}>
                      {item.progress}%
                    </span>
                  )}
                  {item.status === 'success' && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: 'var(--success)',
                      background: 'var(--success-muted)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}>
                      Ready
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: 'var(--error)',
                      padding: '1px 6px',
                    }}>
                      Error
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                {item.status === 'uploading' && (
                  <div style={{
                    marginTop: '4px',
                    height: '2px',
                    borderRadius: '1px',
                    background: 'var(--border-subtle)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      borderRadius: '1px',
                      background: 'var(--accent)',
                      width: `${item.progress}%`,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                )}
              </div>

              {/* Remove */}
              {item.status !== 'uploading' && (
                <button
                  onClick={() => removeFile(item.id)}
                  aria-label="Remove"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    opacity: 0.5,
                    transition: 'opacity 0.12s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>


    </div>
  );
};

export default FileUploadComponent;