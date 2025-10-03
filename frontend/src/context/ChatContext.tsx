import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactElement } from "react"
import type { Character, Message } from "../types"
import { fetchCharacterChatHistory } from "../lib/api"
import { useChatSocket } from "@/hooks/useChatSocket"
import { useCharactersContext } from "./CharactersContext"
import { AI_MODEL_KEY } from "@/lib/constants"

type ChatContextType = {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  sendMessage: (content: string) => void
  connected: boolean
  hasNonLoading: boolean
  selected: Character | null
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)
type IChatContextProviderProps = {
  children: ReactElement[] | ReactElement
}
export function ChatContextProvider({ children }: IChatContextProviderProps) {
  const { selected } = useCharactersContext()
  const [messages, setMessages] = useState<Message[]>([])

  // load history whenever selection changes
  useEffect(() => {
    if (!selected) return
    let cancelled = false

    const load = async () => {
      const history = await fetchCharacterChatHistory(selected.id, 40)
      if (!cancelled) setMessages(history)
    }
    load()
    return () => { cancelled = true }
  }, [selected?.id])

  const onAssistant = useCallback((text: string) => {
    setMessages(prev => {
      const cleaned = prev.filter(m => m.role !== "loading")
      return [...cleaned, { role: "assistant", content: text }]
    })
  }, [])

  const { send, connected } = useChatSocket(selected?.id ?? "", onAssistant)

  const sendMessage = useCallback(
    (content: string) => {
      if (!selected || !content.trim()) return
      setMessages(prev => [
        ...prev,
        { role: "user", content },
        { role: "loading", content: `${selected.name} is thinking...` }
      ])
      send({
        input: content,
        character: selected.name,
        universe: selected.universe,
        ai_model: localStorage.getItem(AI_MODEL_KEY) || "llama"
      })
    },
    [selected, send]
  )

  const hasNonLoading = useMemo(() => messages.some(m => m.role !== "loading"), [messages])

  return (
    <ChatContext.Provider
      value={{ messages, setMessages, sendMessage, connected, hasNonLoading, selected }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}
