'use client';

import Link from 'next/link';

const DOCS = [
  { name: 'Q3_Research_Report_2024.pdf', pages: '147 pages', chunks: '2,841 chunks', progress: 85 },
  { name: 'Clinical_Trial_Phase2.pdf', pages: '89 pages', chunks: '1,640 chunks', progress: 60 },
  { name: 'Competitive_Analysis.pdf', pages: 'Indexing...', chunks: '34%', progress: 34, active: true },
];

const FEATURES = [
  { num: '01', title: 'Semantic RAG engine', desc: 'Vector search across all your documents with source citations, relevance scoring, and multi-hop reasoning chains.' },
  { num: '02', title: 'Per-user isolation', desc: 'Clerk-verified JWT on every request. All Qdrant queries filtered by userId — cryptographically enforced tenant separation.' },
  { num: '03', title: 'Zero-retention storage', desc: 'Files stored in private Appwrite buckets. Pre-signed URLs expire in 15 minutes. No public access, no data mining.' },
  { num: '04', title: 'Source citations', desc: 'Every AI answer links to exact page numbers and passages. Verify claims in one click, no hallucination blind spots.' },
  { num: '05', title: 'Async processing', desc: 'BullMQ workers handle PDF ingestion in the background. Real-time SSE progress — no page refreshes, no timeouts.' },
  { num: '06', title: 'Notebook workspaces', desc: 'Organise sources into isolated notebooks. Each notebook has its own vector scope, chat history, and access controls.' },
];

const ARCH_CARDS = [
  { layer: 'Auth layer', name: 'Clerk + JWT', desc: 'Every API call verified. userId extracted and scoped before any data access.', tag: '@clerk/nextjs' },
  { layer: 'Storage layer', name: 'Appwrite Storage', desc: 'Private buckets per user. Files served only via expiring pre-signed URLs.', tag: 'node-appwrite' },
  { layer: 'Vector layer', name: 'Qdrant + Neon', desc: 'All vector searches filtered by userId payload. PostgreSQL metadata with row-level security.', tag: 'qdrant-client' },
  { layer: 'Queue layer', name: 'BullMQ + Redis', desc: 'PDF processing decoupled from API. Upstash Redis for serverless-compatible queuing.', tag: 'bullmq' },
];

const PIPELINE_STEPS = [
  { num: '01', name: 'Upload PDF' },
  { num: '02', name: 'Appwrite store' },
  { num: '03', name: 'BullMQ queue' },
  { num: '04', name: 'Chunk + embed' },
  { num: '05', name: 'Qdrant upsert' },
  { num: '06', name: 'Ready to query' },
];

const TRUST_FEATURES = [
  { title: 'End-to-end encryption', desc: 'All files encrypted at rest (AES-256) and in transit (TLS 1.3). Keys never leave your environment.' },
  { title: 'SOC 2 Type II certified', desc: 'Annual third-party audits covering security, availability, and confidentiality trust service criteria.' },
  { title: 'GDPR & HIPAA ready', desc: 'Data residency controls, right-to-erasure workflows, and BAA available for healthcare customers.' },
  { title: 'No training on your data', desc: 'Your documents are never used to train or fine-tune any model. Your IP stays yours, period.' },
];

const PLANS = [
  {
    name: 'Starter',
    price: '0',
    period: '/mo',
    desc: 'For individuals exploring private AI research.',
    featured: false,
    features: ['3 notebooks', '50 MB storage', '500 queries / month', 'Basic source citations', 'Community support'],
    cta: 'Get started free',
    ctaStyle: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '29',
    period: '/mo',
    desc: 'For researchers and teams who need full control.',
    featured: true,
    features: ['Unlimited notebooks', '10 GB storage', 'Unlimited queries', 'Advanced citations + export', 'Priority support', 'API access'],
    cta: 'Start 14-day trial',
    ctaStyle: 'white' as const,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For organisations with compliance and scale requirements.',
    featured: false,
    features: ['SSO + SAML', 'Unlimited storage', 'Self-hosted option', 'HIPAA / BAA available', 'SLA + dedicated support', 'Custom model fine-tuning'],
    cta: 'Talk to sales ↗',
    ctaStyle: 'outline' as const,
  },
];

const CITATIONS = ['Clinical_Trial · p.23', 'Clinical_Trial · p.31', 'Research_Report · p.8'];

// ── Reusable style tokens ─────────────────────────────────────────────────
const token = {
  ink: '#0a0a0f',
  ink2: '#2a2a35',
  ink3: '#5a5a70',
  ink4: '#9898a8',
  paper: '#f8f7f4',
  paper2: '#f0efe9',
  border: 'rgba(10,10,15,0.1)',
  teal: '#0d6e5a',
  teal2: '#1a9e80',
  tealBg: 'rgba(13,110,90,0.05)',
  tealBorder: 'rgba(13,110,90,0.2)',
  gold: '#c9a84c',
};

// ── Sub-components ────────────────────────────────────────────────────────

function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: token.ink,
      borderRadius: size * 0.19,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 18 18" fill="none">
        <path d="M3 3h5v5H3zM10 3h5v5h-5zM3 10h5v5H3zM10 10h5v5h-5z" fill="white" opacity="0.9" />
        <rect x="4" y="4" width="3" height="3" fill="white" opacity="0.3" />
      </svg>
    </div>
  );
}

function SourceBar({ progress, active }: { progress: number; active?: boolean }) {
  return (
    <div style={{ width: 40, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ height: '100%', borderRadius: 99, background: active ? token.gold : token.teal2, width: `${progress}%` }} />
    </div>
  );
}

function FeatureIcon({ icon }: { icon: number }) {
  const icons = [
    <svg key="1" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: token.teal }}><path d="M9 2l2 5h5l-4 3 1.5 5L9 12.5 4.5 15 6 10 2 7h5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>,
    <svg key="2" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: token.teal }}><path d="M9 2a5 5 0 100 10A5 5 0 009 2zM4 14c0-1.7 2.2-3 5-3s5 1.3 5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
    <svg key="3" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: token.teal }}><rect x="3" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M6 5V4a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" /></svg>,
    <svg key="4" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: token.teal }}><path d="M3 9l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    <svg key="5" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: token.teal }}><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.3" /><path d="M9 6v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>,
    <svg key="6" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: token.teal }}><rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" /><path d="M2 7h14" stroke="currentColor" strokeWidth="1.3" /><path d="M6 3v4M12 3v4" stroke="currentColor" strokeWidth="1.3" /></svg>,
  ];
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      border: `1px solid ${token.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 16, background: token.paper2,
    }}>
      {icons[icon]}
    </div>
  );
}

function TrustIcon({ icon }: { icon: number }) {
  const icons = [
    <svg key="1" width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" /><path d="M5 5V4a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.2" /></svg>,
    <svg key="2" width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5L2 4v4c0 3 2.5 5.5 5.5 6 3-0.5 5.5-3 5.5-6V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
    <svg key="3" width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2" /><path d="M7.5 4.5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>,
    <svg key="4" width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 3h9v9H3zM6 6h3v3H6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>,
  ];
  return (
    <div style={{ width: 32, height: 32, borderRadius: 8, background: token.paper2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ color: token.teal }}>{icons[icon]}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: token.paper,
      color: token.ink,
      fontFamily: "'Syne', 'Inter', system-ui, sans-serif",
      overflowX: 'hidden',
      scrollBehavior: "smooth"

    }}>

      {/* Grain */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px', borderBottom: `1px solid ${token.border}`,
        position: 'sticky', top: 0, background: 'rgba(248,247,244,0.92)',
        backdropFilter: 'blur(12px)', zIndex: 50,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark size={32} />
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.4px', color: token.ink }}>
            Privy<span style={{ color: token.teal2 }}>LM</span>
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['#features', '#architecture', '#security', '#pricing'].map((href, i) => (
            <Link key={href} href={href} style={{ fontSize: 13, fontWeight: 500, color: token.ink3, textDecoration: 'none' }}>
              {['Product', 'Architecture', 'Security', 'Pricing'][i]}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/sign-in" style={{
            fontSize: 13, fontWeight: 500, color: token.ink, background: 'none',
            border: `1px solid ${token.border}`, padding: '8px 18px', borderRadius: 6, textDecoration: 'none',
          }}>
            Sign in
          </Link>
          <Link href="/sign-up" style={{
            fontSize: 13, fontWeight: 600, color: '#fff', background: token.ink,
            padding: '9px 20px', borderRadius: 6, textDecoration: 'none',
          }}>
            Get started →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        padding: '100px 48px 80px', maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 420px', gap: 80, alignItems: 'start',
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: 11, letterSpacing: '1.5px',
            color: token.teal2, textTransform: 'uppercase', marginBottom: 28,
            border: `1px solid ${token.tealBorder}`, padding: '5px 12px',
            borderRadius: 99, background: token.tealBg,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: token.teal2, display: 'inline-block' }} />
            Private AI Research Platform
          </div>

          <h1 style={{ fontSize: 64, lineHeight: 1.05, letterSpacing: '-1px', color: token.ink, marginBottom: 28, fontWeight: 400 }}>
            Your documents.<br />
            <em style={{ color: token.teal2, fontStyle: 'italic' }}>Your intelligence.</em><br />
            <span style={{ position: 'relative', display: 'inline-block' }}>
              Zero exposure.
              <span style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', height: 2, background: token.gold }} />
            </span>
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: token.ink3, maxWidth: 480, marginBottom: 40 }}>
            An enterprise-grade AI notebook that keeps your research, documents, and insights strictly private — no training on your data, no third-party access, no compromises.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/sign-up" style={{
              fontSize: 14, fontWeight: 600, padding: '13px 28px', borderRadius: 8,
              background: token.ink, color: '#fff', textDecoration: 'none',
            }}>
              Start free trial →
            </Link>
            <Link href="/notebooks/demo" style={{
              fontSize: 14, fontWeight: 600, padding: '13px 28px', borderRadius: 8,
              background: 'none', color: token.ink, border: `1px solid ${token.border}`, textDecoration: 'none',
            }}>
              Try demo ↗
            </Link>
          </div>

          <p style={{ fontFamily: 'monospace', fontSize: 11, color: token.ink4, marginTop: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1a3 3 0 000 6 3 3 0 000-6zM2 9.5C2 8.1 3.8 7 6 7s4 1.1 4 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            No credit card · SOC 2 Type II · GDPR compliant
          </p>
        </div>

        {/* Right — preview card */}
        <div style={{ background: token.ink, borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(26,158,128,0.15) 0%, transparent 60%)' }} />

          {/* Card header */}
          <div style={{ position: 'relative', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '1px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
              Active notebook
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, color: token.teal2 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: token.teal2, display: 'inline-block' }} />
              3 sources indexed
            </span>
          </div>

          {/* Source list */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {DOCS.map((doc) => (
              <div key={doc.name} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2h7l3 3v7H2z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinejoin="round" />
                    <path d="M9 2v3h3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                    {doc.name}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                    {doc.pages} · {doc.chunks}
                  </div>
                </div>
                <SourceBar progress={doc.progress} active={doc.active} />
              </div>
            ))}
          </div>

          {/* Chat preview */}
          <div style={{ position: 'relative', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 10, fontStyle: 'italic' }}>
              &ldquo;What were the primary endpoints in phase 2?&rdquo;
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, marginBottom: 12 }}>
              The primary endpoints focused on{' '}
              <strong style={{ color: token.teal2, fontWeight: 500 }}>reduction in biomarker levels</strong>
              {' '}at week 12, with secondary endpoints tracking quality-of-life scores.
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CITATIONS.map((chip) => (
                <span key={chip} style={{
                  fontFamily: 'monospace', fontSize: 9,
                  background: 'rgba(26,158,128,0.15)', color: token.teal2,
                  border: '1px solid rgba(26,158,128,0.2)',
                  padding: '3px 8px', borderRadius: 4, letterSpacing: '0.5px',
                }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: token.border, margin: '0 48px' }} />

      {/* ── Features ── */}
      <section id="features" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '2px', color: token.ink4, textTransform: 'uppercase', marginBottom: 16 }}>
          Core capabilities
        </div>
        <h2 style={{ fontSize: 42, lineHeight: 1.1, color: token.ink, marginBottom: 16, fontWeight: 400 }}>
          Built for serious <em style={{ color: token.teal2, fontStyle: 'italic' }}>research</em>
        </h2>
        <p style={{ fontSize: 15, color: token.ink3, lineHeight: 1.7, maxWidth: 520, marginBottom: 56 }}>
          Every feature is designed around one principle: your data never leaves your control.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1, background: token.border,
          border: `1px solid ${token.border}`, borderRadius: 16, overflow: 'hidden',
        }}>
          {FEATURES.map((feat, idx) => (
            <div key={feat.num} style={{ background: token.paper, padding: 32 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: token.ink4, marginBottom: 20, letterSpacing: '1px' }}>
                {feat.num} / 06
              </div>
              <FeatureIcon icon={idx} />
              <div style={{ fontSize: 15, fontWeight: 600, color: token.ink, marginBottom: 8, letterSpacing: '-0.2px' }}>
                {feat.title}
              </div>
              <div style={{ fontSize: 13, color: token.ink3, lineHeight: 1.65 }}>
                {feat.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture ── */}
      <section id="architecture" style={{ background: token.ink, margin: 0, padding: '80px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>
            Architecture
          </div>
          <h2 style={{ fontSize: 42, lineHeight: 1.1, color: '#fff', marginBottom: 16, fontWeight: 400 }}>
            How <em style={{ color: token.teal2, fontStyle: 'italic' }}>PrivyLM</em> works
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 520, marginBottom: 56 }}>
            A hardened, multi-tenant stack — every layer enforces isolation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {ARCH_CARDS.map((card) => (
              <div key={card.name} style={{
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20,
                background: 'rgba(255,255,255,0.03)', transition: 'all 0.2s',
              }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: token.teal2, marginBottom: 12 }}>
                  {card.layer}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
                  {card.name}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  {card.desc}
                </div>
                <span style={{
                  display: 'inline-block', marginTop: 10, fontFamily: 'monospace', fontSize: 9,
                  background: 'rgba(26,158,128,0.1)', color: token.teal2,
                  border: '1px solid rgba(26,158,128,0.15)', padding: '2px 8px', borderRadius: 4,
                }}>
                  {card.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Pipeline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 40, overflowX: 'auto', paddingBottom: 4 }}>
            {PIPELINE_STEPS.map((step, idx) => (
              <div key={step.num} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', textAlign: 'center', minWidth: 100 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
                    {step.num}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                    {step.name}
                  </div>
                </div>
                {idx < PIPELINE_STEPS.length - 1 && (
                  <span style={{ padding: '0 8px', color: 'rgba(255,255,255,0.2)', fontSize: 18, flexShrink: 0 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust & Compliance ── */}
      <section id="security" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '2px', color: token.ink4, textTransform: 'uppercase', marginBottom: 16 }}>
            Trust & compliance
          </div>
          <h2 style={{ fontSize: 42, lineHeight: 1.1, color: token.ink, marginBottom: 16, fontWeight: 400 }}>
            Security that <em style={{ color: token.teal2, fontStyle: 'italic' }}>doesn&apos;t</em> get in the way
          </h2>

          <div style={{ marginBottom: 32, marginTop: 32 }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, color: token.ink, lineHeight: 1, marginBottom: 6, fontWeight: 400 }}>
              100<span style={{ fontSize: 32, color: token.teal2 }}>%</span>
            </div>
            <div style={{ fontSize: 14, color: token.ink3 }}>of queries scoped to authenticated user — always</div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 56, color: token.ink, lineHeight: 1, marginBottom: 6, fontWeight: 400 }}>
              0<span style={{ fontSize: 32, color: token.teal2 }}>ms</span>
            </div>
            <div style={{ fontSize: 14, color: token.ink3 }}>cross-tenant data leakage — enforced at vector DB level</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {TRUST_FEATURES.map((feat, idx) => (
            <div key={feat.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 16, border: `1px solid ${token.border}`, borderRadius: 10, background: token.paper }}>
              <TrustIcon icon={idx} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: token.ink, marginBottom: 3 }}>{feat.title}</div>
                <div style={{ fontSize: 12, color: token.ink3, lineHeight: 1.5 }}>{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: token.border, margin: '0 48px' }} />

      {/* ── Pricing ── */}
      <section id="pricing" style={{ padding: '80px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '2px', color: token.ink4, textTransform: 'uppercase', marginBottom: 16 }}>
          Pricing
        </div>
        <h2 style={{ fontSize: 42, lineHeight: 1.1, color: token.ink, marginBottom: 16, fontWeight: 400 }}>
          Simple, transparent <em style={{ color: token.teal2, fontStyle: 'italic' }}>pricing</em>
        </h2>
        <p style={{ fontSize: 15, color: token.ink3, lineHeight: 1.7, maxWidth: 520, marginBottom: 56 }}>
          Start free, scale as you grow. No usage surprises, no hidden fees.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              border: `1px solid ${token.border}`, borderRadius: 16, padding: 28,
              background: plan.featured ? token.ink : token.paper,
              transition: 'all 0.2s', position: 'relative',
            }}>
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                  fontFamily: 'monospace', fontSize: 9, letterSpacing: '1px', textTransform: 'uppercase',
                  background: token.gold, color: token.ink, padding: '3px 12px', borderRadius: 99,
                }}>
                  Most popular
                </div>
              )}
              <div style={{
                fontSize: 13, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
                marginBottom: 8, color: plan.featured ? 'rgba(255,255,255,0.5)' : token.ink3,
              }}>
                {plan.name}
              </div>
              <div style={{
                fontFamily: 'Instrument Serif, serif', fontSize: plan.price === 'Custom' ? 32 : 44,
                color: plan.featured ? '#fff' : token.ink, lineHeight: 1, marginBottom: 6, fontWeight: 400, paddingTop: plan.price === 'Custom' ? 6 : 0,
              }}>
                {plan.price !== 'Custom' && <sup style={{ fontSize: 20, fontFamily: 'Syne, sans-serif', verticalAlign: 'super' }}>$</sup>}
                {plan.price}
                {plan.period && <sub style={{ fontSize: 14, fontFamily: 'Syne, sans-serif', color: plan.featured ? 'rgba(255,255,255,0.3)' : token.ink4, fontWeight: 400 }}>{plan.period}</sub>}
              </div>
              <div style={{
                fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.45)' : token.ink3,
                marginBottom: 24, lineHeight: 1.5,
              }}>
                {plan.desc}
              </div>
              <div style={{
                height: 1, background: plan.featured ? 'rgba(255,255,255,0.08)' : token.border,
                marginBottom: 20,
              }} />
              <ul style={{
                listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10,
                marginBottom: 28, padding: 0,
              }}>
                {plan.features.map((f) => (
                  <li key={f} style={{
                    fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.6)' : token.ink3,
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: 'rgba(13,110,90,0.12)', border: '1px solid rgba(13,110,90,0.25)',
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="#0d6e5a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.name === 'Enterprise' ? '#' : '/sign-up'} style={{
                width: '100%', display: 'block', textAlign: 'center',
                fontSize: 13, fontWeight: 600, padding: 11, borderRadius: 8,
                textDecoration: 'none', letterSpacing: '0.2px',
                background: plan.ctaStyle === 'white' ? '#fff' : 'none',
                color: plan.ctaStyle === 'white' ? token.ink : plan.featured ? 'rgba(255,255,255,0.7)' : token.ink,
                border: plan.ctaStyle === 'white' ? 'none' : `1px solid ${plan.featured ? 'rgba(255,255,255,0.15)' : token.border}`,
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        margin: 0, padding: '80px 48px',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1f1a 100%)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(26,158,128,0.12) 0%, transparent 60%)' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 16 }}>
            Get started
          </div>
          <h2 style={{ fontSize: 48, color: '#fff', lineHeight: 1.1, marginBottom: 20, fontWeight: 400 }}>
            Research smarter.<br />
            <em style={{ color: token.teal2, fontStyle: 'italic' }}>Stay private.</em>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 36 }}>
            Join researchers who trust PrivyLM to keep their most sensitive work secure and searchable.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
            <Link href="/sign-up" style={{
              fontSize: 14, fontWeight: 600, padding: '13px 28px', borderRadius: 8,
              background: '#fff', color: token.ink, textDecoration: 'none',
            }}>
              Start for free →
            </Link>
            <Link href="/notebooks/demo" style={{
              fontSize: 14, fontWeight: 600, padding: '13px 28px', borderRadius: 8,
              background: 'none', color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.15)', textDecoration: 'none',
            }}>
              Try demo ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '40px 48px', borderTop: `1px solid ${token.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LogoMark size={24} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: token.ink4 }}>
            © 2025 PrivyLM · Built with Next.js, Express, Qdrant, Appwrite
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Security', 'Status'].map((label) => (
            <Link key={label} href="#" style={{ fontSize: 12, color: token.ink4, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          nav { padding: 16px 24px !important; }
          section { padding: 60px 24px !important; }
          h1 { font-size: 40px !important; }
          h2 { font-size: 32px !important; }
        }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 1fr 420px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="repeat(4, 1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
        * { box-sizing: border-box; }
        a:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}