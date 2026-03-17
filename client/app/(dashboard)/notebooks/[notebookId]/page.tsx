'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const ChatComponent = dynamic(() => import('@/app/components/chat'), { ssr: false });
const FileUploadComponent = dynamic(() => import('@/app/components/file-upload'), { ssr: false });

export default function NotebookPage() {
  const params = useParams();
  const notebookId = params.notebookId as string;

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Left Panel - File Upload */}
      <div style={{
        width: '320px',
        borderRight: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <FileUploadComponent />
      </div>

      {/* Right Panel - Chat */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
      }}>
        <ChatComponent />
      </div>
    </div>
  );
}