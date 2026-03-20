'use client';

import { useParams } from 'next/navigation';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { ChatColumn } from '@/components/chat/ChatColumn';
import { StudioSidebar } from '@/components/studio/StudioSidebar';
import { useNotebook } from '@/hooks/useNotebooks';
import { useChat } from '@/hooks/useChat';
import { useSourceSelection } from '@/hooks/useSourceSelection';

export default function NotebookPage() {
  const params = useParams();
  const notebookId = params.notebookId as string;
  const { data: notebook } = useNotebook(notebookId);
  const { sendMessage } = useChat(notebookId);
  const { selectedIds } = useSourceSelection();

  const handleGenerate = (prompt: string) => {
    sendMessage(prompt, Array.from(selectedIds));
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr 300px',
      height: '100vh',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      <LeftSidebar notebookId={notebookId} />
      <ChatColumn notebookId={notebookId} notebookName={notebook?.title} />
      <StudioSidebar
        notebookId={notebookId}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
