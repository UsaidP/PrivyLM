'use client';

import { useParams } from 'next/navigation';
import { NotebookTopbar } from '@/components/notebook/NotebookTopbar';
import { SourcesPanel } from '@/components/notebook/SourcesPanel';
import { ChatPanelWithSessions } from '@/components/notebook/ChatPanelWithSessions';
import { StudioPanel } from '@/components/notebook/StudioPanel';
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
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      <NotebookTopbar notebook={notebook} />
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden',
      }}>
        <SourcesPanel notebookId={notebookId} />
        <ChatPanelWithSessions
          notebookId={notebookId}
          onSendMessage={(text, sourceIds) => sendMessage(text, sourceIds)}
        />
        <StudioPanel
          notebookId={notebookId}
          notebook={notebook}
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
}