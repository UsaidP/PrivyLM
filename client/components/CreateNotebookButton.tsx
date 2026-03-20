'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, CopyIcon, LinkIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useApiClient } from '@/lib/api';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

export function CreateNotebookButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const api = useApiClient();

  async function handleCreate() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setLoading(true);
    try {
      const response = await api.post('/api/notebooks', { title: trimmedName });

      const newNotebookId = response.data?.data?.id;
      toast.success('Notebook created successfully');

      setName('');
      setOpen(false);

      // Refresh the current notebooks list and navigate to the new one
      router.refresh();
      if (newNotebookId) {
        router.push(`/notebooks/${newNotebookId}`);
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('Failed to create notebook', {
        description: error.response?.data?.error || error.message || 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          background: 'var(--accent)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          transition: 'background 0.15s',
        }}
      >
        <Plus size={18} />
        New Notebook
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
          <DialogHeader>
            <DialogTitle>Create notebook</DialogTitle>
            <DialogDescription style={{ color: 'var(--text-tertiary)' }}>
              Start an isolated workspace for a set of related documents.
            </DialogDescription>
          </DialogHeader>

          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            <input
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-default)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              placeholder="e.g. Research Papers 2026"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              disabled={loading}
              autoFocus
            />
          </div>

          <DialogFooter style={{ marginTop: '16px' }}>
            <button
              onClick={() => setOpen(false)}
              disabled={loading}
              style={{
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                cursor: (!name.trim() || loading) ? 'not-allowed' : 'pointer',
                opacity: (!name.trim() || loading) ? 0.5 : 1,
                fontWeight: 600,
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
