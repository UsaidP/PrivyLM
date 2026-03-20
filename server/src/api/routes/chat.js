import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  createSession,
  getSession,
  getSessions,
  addMessage,
  getHistory,
  updateSessionTitle,
  deleteSession,
  getMessageCount,
  generateTitle,
} from "../../services/chatSessionService.js";
import { chat } from "../../services/ragService.js";

const router = Router();

/**
 * Helper: Get or create internal user from Clerk user ID
 */
const getOrCreateUser = async (clerkUserId) => {
  let user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: { id: true }
  });

  if (!user) {
    console.log(`[Auth] Auto-creating user for Clerk ID: ${clerkUserId}`);
    user = await prisma.user.create({
      data: {
        clerkUserId,
        email: `${clerkUserId}@placeholder.local`,
        name: null,
      },
      select: { id: true }
    });
    console.log(`[Auth] Created user: ${user.id}`);
  }

  return user;
};

/**
 * POST /api/chat/:notebookId/message
 * Central RAG chat endpoint -> SSE stream
 */
router.post("/:notebookId/message", asyncHandler(async (req, res) => {
  const { notebookId } = req.params;
  const { message, sessionId, selectedSourceIds } = req.body;
  const clerkUserId = req.userId;

  // 1. Validate
  if (!message?.trim()) {
    return res.status(400).json({ error: "Message required" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message too long" });
  }

  // 2. Get internal user ID
  const user = await getOrCreateUser(clerkUserId);

  // 3. Tenant check
  const notebook = await prisma.notebook.findFirst({
    where: { id: notebookId, userId: user.id },
  });
  if (!notebook) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // 4. Check indexed documents exist
  const indexedDoc = await prisma.document.findFirst({
    where: { notebookId, status: "INDEXED" },
  });
  if (!indexedDoc) {
    return res.status(400).json({
      error: "No indexed documents. Upload and wait for processing.",
    });
  }

  // 5. Get/create session
  const session = sessionId
    ? await getSession(sessionId, user.id)
    : await createSession(notebookId, user.id);

  // 6. Persist user message
  await addMessage(session.id, "user", message, null);

  // 7. Get history
  const history = await getHistory(session.id, 10);

  // 8. Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Session-Id", session.id);
  res.flushHeaders();

  // 9. RAG pipeline
  const { fullResponse, sources } = await chat({
    message,
    notebookId,
    userId: user.id,
    sessionId: session.id,
    history,
    selectedSourceIds,
    res,
  });

  // 10. Persist assistant response
  await addMessage(session.id, "assistant", fullResponse, sources);

  // 11. Auto-generate title on first message
  const msgCount = await getMessageCount(session.id);
  if (msgCount === 2 && !session.title) {
    // 1 User + 1 Assistant = 2
    const title = await generateTitle(message);
    await updateSessionTitle(session.id, title);
  }

  res.end(); // Properly close the response when done
}));

/**
 * POST /api/chat/:notebookId/sessions
 * Create session manually
 */
router.post("/:notebookId/sessions", asyncHandler(async (req, res) => {
  const { notebookId } = req.params;
  const clerkUserId = req.userId;

  const user = await getOrCreateUser(clerkUserId);

  const notebook = await prisma.notebook.findFirst({
    where: { id: notebookId, userId: user.id },
  });
  if (!notebook) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const session = await createSession(notebookId, user.id);
  return res.json(session);
}));

/**
 * GET /api/chat/:notebookId/sessions
 * List sessions
 */
router.get("/:notebookId/sessions", asyncHandler(async (req, res) => {
  const { notebookId } = req.params;
  const clerkUserId = req.userId;

  const user = await getOrCreateUser(clerkUserId);

  const sessions = await getSessions(notebookId, user.id);
  return res.json(sessions);
}));

/**
 * GET /api/chat/sessions/:sessionId
 * Get session with its message history
 */
router.get("/sessions/:sessionId", asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const clerkUserId = req.userId;

  const user = await getOrCreateUser(clerkUserId);

  const session = await getSession(sessionId, user.id);
  const messages = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" }
  });

  return res.json({ session, messages });
}));

/**
 * DELETE /api/chat/sessions/:sessionId
 * Delete session entirely
 */
router.delete("/sessions/:sessionId", asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const clerkUserId = req.userId;

  const user = await getOrCreateUser(clerkUserId);

  await deleteSession(sessionId, user.id);
  return res.json({ success: true });
}));

export default router;
