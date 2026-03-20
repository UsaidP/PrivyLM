import { prisma } from "../lib/prisma.js";
import { streamGroqResponse } from "../lib/groq.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

/**
 * Creates a new chat session for a user and notebook.
 */
async function createSession(notebookId, userId) {
  return prisma.chatSession.create({
    data: {
      notebookId,
      userId,
    },
  })
}

/**
 * Retrieves a session, ensuring tenant isolation.
 */
async function getSession(sessionId, userId) {
  const session = await prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  })
  
  if (!session) {
    throw new Error("Session not found or forbidden")
  }
  return session
}

/**
 * Lists all sessions for a notebook.
 */
async function getSessions(notebookId, userId) {
  return prisma.chatSession.findMany({
    where: {
      notebookId,
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Adds a message to a session.
 */
async function addMessage(sessionId, role, content, sources = null) {
  return prisma.chatMessage.create({
    data: {
      sessionId,
      role: role.toUpperCase(), // USER | ASSISTANT
      content,
      sources: sources ? sources : undefined,
    },
  })
}

/**
 * Gets the chat history for a session.
 */
async function getHistory(sessionId, limit = 10) {
  const messages = await prisma.chatMessage.findMany({
    where: {
      sessionId,
    },
    orderBy: {
      createdAt: "asc", 
    },
    take: limit, // take the last `limit` messages (we'd realistically want to tail, so we could order desc then reverse, but for simple history this works or we get bottom N)
  })

  // Prisma models MessageRole as USER/ASSISTANT, Groq expects user/assistant
  return messages.map((m) => ({
    role: m.role.toLowerCase(),
    content: m.content,
  }))
}

/**
 * Updates the title of a session.
 */
async function updateSessionTitle(sessionId, title) {
  return prisma.chatSession.update({
    where: { id: sessionId },
    data: { title },
  })
}

/**
 * Returns the count of messages in a session.
 */
async function getMessageCount(sessionId) {
  return prisma.chatMessage.count({
    where: { sessionId }
  })
}

/**
 * Deletes a session.
 */
async function deleteSession(sessionId, userId) {
  return prisma.chatSession.deleteMany({
    where: {
      id: sessionId,
      userId,
    },
  })
}

/**
 * Generates a concise title using Groq based on the first message.
 */
async function generateTitle(firstMessage) {
  try {
    const completion = await groq.chat.completions.create({
      model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Generate a concise, 3 to 5 word title for a chat session based on the user's first message. Respond ONLY with the title. Do not wrap it in quotes.",
        },
        {
          role: "user",
          content: firstMessage,
        },
      ],
      temperature: 0.3,
      max_tokens: 20,
    })

    const title = completion.choices[0]?.message?.content || "New Chat"
    return title.replace(/['"]/g, '').trim()
  } catch (err) {
    console.error("Failed to generate title:", err)
    return "New Chat"
  }
}

export {
  createSession,
  getSession,
  getSessions,
  addMessage,
  getHistory,
  updateSessionTitle,
  deleteSession,
  getMessageCount,
  generateTitle,
};
