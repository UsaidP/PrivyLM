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
  session: ChatSession
  messages: ChatMessage[]
}

async function fetchSessions(
  notebookId: string,
  token: string | null
): Promise<ChatSession[]> {
  const res = await axios.get(
    `${API_BASE_URL}/api/chat/${notebookId}/sessions`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  )
  return res.data
}

async function fetchSession(
  sessionId: string,
  token: string | null
): Promise<SessionWithMessages> {
  const res = await axios.get(
    `${API_BASE_URL}/api/chat/sessions/${sessionId}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  )
  return res.data
}

async function createSession(
  notebookId: string,
  token: string | null
): Promise<ChatSession> {
  const res = await axios.post(
    `${API_BASE_URL}/api/chat/${notebookId}/sessions`,
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  )
  return res.data
}

async function deleteSession(
  sessionId: string,
  token: string | null
): Promise<void> {
  await axios.delete(`${API_BASE_URL}/api/chat/sessions/${sessionId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
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

export function useSession(sessionId: string | null) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      const token = await getToken()
      return fetchSession(sessionId!, token)
    },
    enabled: !!sessionId,
    staleTime: 60_000,
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
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", notebookId] })
    },
  })

  const remove = useMutation({
    mutationFn: async (sessionId: string) => {
      const token = await getToken()
      await deleteSession(sessionId, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", notebookId] })
    },
  })

  return {
    createSession: create.mutateAsync,
    deleteSession: remove.mutateAsync,
    isCreating: create.isPending,
    isDeleting: remove.isPending,
  }
}
