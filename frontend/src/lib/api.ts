import { API_BASE, USER_ID } from './constants'
import type { Message } from '../types'

export async function fetchHistory(sessionId: string, limit = 40): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/history/${USER_ID}/${sessionId}?limit=${limit}`)
  if (!res.ok) return []
  const data = await res.json()
  return (data.messages ?? [])
    .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m: any) => ({ role: m.role, content: m.content }))
}