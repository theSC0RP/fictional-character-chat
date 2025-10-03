import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Character, Message } from '../types'
import { fetchCharacterChatHistory } from '../lib/api'
import { useChatSocket } from './useChatSocket'

export function useChat(selected: Character) {
  const [messages, setMessages] = useState<Message[]>([])

  // load history whenever selection changes
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const history = await fetchCharacterChatHistory(selected.id, 40)
      if (!cancelled) setMessages(history)
    }
    load()
    return () => { cancelled = true }
  }, [selected.id])

  const onAssistant = useCallback((text: string) => {
    setMessages(prev => {
      const cleaned = prev.filter(m => m.role !== 'loading')
      return [...cleaned, { role: 'assistant', content: text }]
    })
  }, [])

  const { send, connected } = useChatSocket(selected.id, onAssistant)

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return
    setMessages(prev => ([...prev, { role: 'user', content }, { role: 'loading', content: `${selected.name} is thinking...` }]))
    send({ input: content, character: selected.name, universe: selected.universe, ai_model: localStorage.getItem("ai_model") || "llama" })
  }, [selected.name, selected.universe, send])

  const hasNonLoading = useMemo(() => messages.some(m => m.role !== 'loading'), [messages])

  return { messages, setMessages, sendMessage, connected, hasNonLoading }
}