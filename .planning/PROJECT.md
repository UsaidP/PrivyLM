# PDF RAG Research Assistant

## What This Is

PDF RAG (Retrieval-Augmented Generation) research assistant — a NotebookLM-style app where users upload PDFs, which are chunked/embedded into a vector store, then queried via an LLM-powered chat interface. Multi-tenant with per-user, per-notebook data isolation.

## Core Value

Enable users to interact with their PDF documents through natural language questions, getting AI-powered answers with citations from the source documents.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User authentication via Clerk
- [ ] PDF upload and storage in Appwrite
- [ ] Document processing pipeline (text extraction, chunking, embedding)
- [ ] Vector storage in Qdrant with tenant isolation
- [ ] Chat interface with LLM (Groq) and streaming responses
- [ ] Document-based Q&A with source citations
- [ ] Notebook organization (multiple PDFs per notebook)
- [ ] UI with 3-column layout (sources, chat, studio/tools)
- [ ] Local development with Docker Compose (Postgres, Qdrant, Valkey/Redis)

### Out of Scope

- [ ] Multi-language support — initial focus on English documents
- [ ] Advanced document formats (beyond PDF) — scope limited to PDF files
- [ ] Real-time collaboration — single-user editing per notebook
- [ ] Offline mode — requires internet for LLM and vector services

## Context

- Technical environment: Next.js 16 (TypeScript, React 19), Express 5 (JavaScript ES modules), Docker Compose
- Prior work: Based on PDF RAG concept with vector stores and LLM integration
- User research: Targeting researchers, students, professionals who need to extract information from PDF collections
- Known issues: Initial UI layout needs refinement to match wireframe specifications, embedding service setup required

## Constraints

- **[Tech stack]**: Next.js 16, Express 5, TypeScript/JavaScript — Team expertise and ecosystem fit
- **[Timeline]**: MVP development — Focus on core functionality first
- **[Budget]**: Open-source and managed services (Appwrite, Qdrant, Groq) — Cost-effective scaling
- **[Dependencies]**: External services for vector storage (Qdrant), LLM (Groq), file storage (Appwrite) — Reliability tradeoff for development speed

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use Clerk for authentication | Ready-made solution with Next.js integration | ✓ Good |
| Use Valkey/Redis for BullMQ queue | Performance and familiarity | ✓ Good |
| Use Qdrant for vector storage | Purpose-built for vector search, good performance | ✓ Good |
| Use Groq for LLM inference | Fast inference Llama 3.3 70B model | ✓ Good |
| Implement 3-column UI layout | Matches wireframe and user expectations for research workflow | ⚠️ Revisit (needs implementation) |

---
Last updated: Mar 23 2026 after initializing GSD project structure