# GSD Quick Reference — PDF RAG Project

## Current Status

**Phase:** 4 COMPLETE ✅  
**Status:** Production Ready  
**Next:** Phase 5 (Advanced Features) — Not started

---

## Available GSD Commands

### Project Management

```bash
# Check current progress
/gsd-progress

# View project stats
/gsd-stats

# Add a new todo/idea
/gsd-add-todo "Add hybrid search feature"

# List all todos
/gsd-check-todos
```

### Phase Management

```bash
# Add a new phase
/gsd-add-phase "Phase 5: Advanced Features"

# Plan a specific phase
/gsd-plan-phase 5

# Execute/build a phase
/gsd-execute-phase 5

# Run all remaining phases autonomously
/gsd-autonomous
```

### Research & Planning

```bash
# Research a topic before planning
/gsd-research-phase "Hybrid search algorithms for RAG"

# Discuss assumptions and approach
/gsd-discuss-phase "Should we use hybrid search or re-ranking?"

# Map the existing codebase
/gsd-map-codebase
```

### Execution

```bash
# Quick task (self-contained, <1 hour)
/gsd-quick "Add rate limiting to chat endpoint"

# Complex task (needs planning)
/gsd-add-phase "Implement document annotations"

# Debug an issue
/gsd-debug "Chat history fails to load when server is offline"

# Review/verify work
/gsd-verify-work "Verify Phase 4 UI improvements"
```

### Milestones

```bash
# Complete current milestone
/gsd-complete-milestone

# Start new milestone
/gsd-new-milestone "Phase 5: Advanced Features"

# Audit milestone progress
/gsd-audit-milestone
```

### Session Management

```bash
# Resume work from last session
/gsd-resume-work

# Pause current work
/gsd-pause-work

# End session with summary
/gsd-session-report
```

---

## Common Workflows

### Starting New Work

1. **Check current state:**
   ```
   /gsd-progress
   ```

2. **Add/plan phase:**
   ```
   /gsd-add-phase "Phase 5: Advanced Features"
   ```

3. **Execute phase:**
   ```
   /gsd-execute-phase 5
   ```

### Fixing Bugs

1. **Debug the issue:**
   ```
   /gsd-debug "Chat history fails to load"
   ```

2. **Implement fix:**
   ```
   /gsd-quick "Fix chat history error handling"
   ```

3. **Verify the fix:**
   ```
   /gsd-verify-work "Verify chat history fix"
   ```

### Adding Features

**Small feature (<1 hour):**
```
/gsd-quick "Add copy button to chat messages"
```

**Large feature (needs planning):**
```
/gsd-add-phase "Implement document annotations"
/gsd-plan-phase 5
/gsd-execute-phase 5
```

### Research & Discovery

```
/gsd-research-phase "Best practices for RAG systems"
/gsd-discuss-phase "Should we use hybrid search?"
/gsd-plan-phase 5
```

---

## Project Conventions

### Branch Naming (if using git)

```
gsd/phase-{number}-{slug}
# Example: gsd/phase-5-advanced-features
```

### Commit Messages

```
[GSD Phase 5] Add hybrid search feature

- Implemented BM25 keyword search
- Combined with vector search using RRF
- Added configuration for weighting

Fixes: #123
```

### Phase Structure

Each phase in `.planning/phases/`:
```
phase-5-advanced-features/
├── PLAN.md          # Detailed plan
├── ASSUMPTIONS.md   # Documented assumptions
├── RESEARCH.md      # Research findings
├── BUILD.md         # Build log
└── VERIFICATION.md  # Verification checklist
```

---

## Tips for Success

### ✅ Do

- Use `/gsd-progress` to check current state before starting
- Add todos for ideas that come up during work
- Use `/gsd-debug` for systematic bug investigation
- Run `/gsd-verify-work` before marking phases complete
- Document decisions in `ASSUMPTIONS.md`

### ❌ Don't

- Skip the planning phase for complex features
- Work on multiple phases simultaneously
- Ignore verification steps
- Forget to update STATUS.md after completing work

---

## Getting Help

```bash
# List all available commands
/gsd-help

# Get help on specific command
/gsd-help /gsd-add-phase

# Check project health
/gsd-health

# Diagnose issues
/gsd-diagnose-issues
```

---

## Current Project Context

**What's Working:**
- ✅ Authentication (Clerk)
- ✅ Notebook management
- ✅ PDF upload & processing
- ✅ RAG chat with streaming
- ✅ Source citations
- ✅ Studio tools
- ✅ Theme switching
- ✅ Responsive design

**Known Issues:**
- ⚠️ Chat history error when server offline (graceful fallback added)

**Next Up:**
- Phase 5: Advanced Features (TBD)
  - Hybrid search
  - Document annotations
  - Analytics dashboard

---

**Last Updated:** March 23, 2026  
**Project:** PDF RAG Research Assistant  
**Status:** Production Ready ✅
