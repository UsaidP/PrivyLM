'use client';

import { useState } from 'react';
import { FileText, LayoutList, HelpCircle, Clock, Loader2 } from 'lucide-react';

interface StudioSidebarProps {
  notebookId: string;
  onGenerate: (prompt: string) => void;
}

const OUTPUTS = [
  {
    id: 'summary',
    icon: FileText,
    title: 'Summary',
    desc: 'Concise summary of all selected sources',
    prompt: 'Generate a comprehensive summary of all selected sources. Focus on the most important information and key takeaways.',
  },
  {
    id: 'briefing',
    icon: LayoutList,
    title: 'Briefing doc',
    desc: 'Structured briefing with key points and insights',
    prompt: 'Create a structured briefing document. Include: Executive Summary, Key Findings, Analysis, and Recommendations based on the sources.',
  },
  {
    id: 'faq',
    icon: HelpCircle,
    title: 'FAQ',
    desc: 'Common questions and answers from sources',
    prompt: 'Generate a list of frequently asked questions based on the content. Include 5-8 relevant questions with detailed answers.',
  },
  {
    id: 'timeline',
    icon: Clock,
    title: 'Timeline',
    desc: 'Extract chronological events and dates',
    prompt: 'Extract and organize all chronological events, dates, and milestones mentioned in the sources. Present as a structured timeline.',
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 600,
      color: '#888888',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

export function StudioSidebar({ notebookId, onGenerate }: StudioSidebarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleGenerate = (id: string, prompt: string) => {
    setActiveId(id);
    onGenerate(prompt);
    setTimeout(() => setActiveId(null), 1000);
  };

  return (
    <div style={{
      width: 300,
      flexShrink: 0,
      background: '#393E46',
      borderLeft: '1px solid #4A4F5A',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
    }}>
      <div style={{
        padding: '14px 14px 10px',
        borderBottom: '1px solid #4A4F5A',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '10px 14px',
          borderRadius: 8,
          background: '#4A4F5A',
          border: '1px solid #4A4F5A',
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#EEEEEE',
          }}>
            Studio
          </span>
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 14,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionLabel>Generate</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {OUTPUTS.map(out => {
              const isActive = activeId === out.id;
              return (
                <button
                  key={out.id}
                  type="button"
                  onClick={() => handleGenerate(out.id, out.prompt)}
                  disabled={isActive}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${isActive ? '#00ADB5' : '#4A4F5A'}`,
                    background: isActive ? 'rgba(0,173,181,0.2)' : '#4A4F5A',
                    cursor: isActive ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    opacity: isActive ? 0.8 : 1,
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#EEEEEE';
                      e.currentTarget.style.background = '#393E46';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#4A4F5A';
                      e.currentTarget.style.background = '#4A4F5A';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4,
                  }}>
                    {isActive ? (
                      <Loader2 size={14} color="#00ADB5" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <out.icon size={14} color="#888888" />
                    )}
                    <span style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: isActive ? '#00ADB5' : '#EEEEEE',
                    }}>
                      {isActive ? 'Generating...' : out.title}
                    </span>
                  </div>
                  {!isActive && (
                    <p style={{
                      fontSize: 11.5,
                      color: '#888888',
                      lineHeight: 1.5,
                      margin: 0,
                    }}>
                      {out.desc}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
