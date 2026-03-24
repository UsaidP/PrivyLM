"use client"

import { useAuth } from "@clerk/nextjs"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ChatSession {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: string
  content: string
  sources: any | null
  createdAt: string
}

export interface SessionWithMessages {
  messages: ChatMessage[]
}

// Fetch chat history for a notebook
async function fetchHistory(
  notebookId: string,
  token: string | null
): Promise<ChatMessage[]> {
  const res = await axios.get(
    `${API_BASE_URL}/api/chat/${notebookId}/history`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  )
  return res.data.messages
}

// Post a message to a notebook chat
async function postMessage(
  notebookId: string,
  token: string | null,
  message: string
): Promise<ChatMessage> {
  const res = await axios.post(
    `${API_BASE_URL}/api/chat/${notebookId}/message`,
    { message },
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  )
  return res.data
}

// Clear chat history for a notebook
async function clearHistory(
  notebookId: string,
  token: string | null
): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/chat/${notebookId}/history`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// Create a new session (by posting first message)
async function createSession(
  notebookId: string,
  token: string | null
): Promise<ChatSession> {
  // For now, session is auto-created on first message
  // Return a placeholder that will be updated
  return {
    id: "new",
    title: "New Chat",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Delete a session (clear history)
async function deleteSession(
  notebookId: string,
  sessionId: string,
  token: string | null
): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/chat/${notebookId}/history`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// Fetch sessions for a notebook
async function fetchSessions(
  notebookId: string,
  token: string | null
): Promise<ChatSession[]> {
  // For now, return empty array as we use single session per notebook
  return []
}

export function useSessions(notebookId: string) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ["sessions", notebookId],
    queryFn: async () => {
      const token = await getToken()
      return fetchSessions(notebookId, token)
    },
    enabled: !!notebookId,
    staleTime: 30_000,
  })
}

export function useSessionMutations(notebookId: string) {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  const create = useMutation({
    mutationFn: async () => {
      const token = await getToken()
      return createSession(notebookId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", notebookId] })
    },
  })

  const del = useMutation({
    mutationFn: async (sessionId: string) => {
      const token = await getToken()
      await deleteSession(notebookId, sessionId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", notebookId] })
    },
  })

  const post = useMutation({
    mutationFn: async (message: string) => {
      const token = await getToken()
      return postMessage(notebookId, token, message)
    },
  })

  const clear = useMutation({
    mutationFn: async () => {
      const token = await getToken()
      await clearHistory(notebookId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", notebookId] })
    },
  })

  return {
    createSession: create.mutateAsync,
    deleteSession: del.mutateAsync,
    postMessage: post.mutateAsync,
    clearHistory: clear.mutateAsync,
    isCreating: create.isPending,
    isPosting: post.isPending,
    isClearing: clear.isPending,
  }
}
